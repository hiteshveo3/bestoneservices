import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import { requireRole } from "@/lib/roles";
import { isValidStatusTransition, poundsToPence } from "@/lib/booking-domain";
import { type BookingStatus, type PriceChangeReason } from "@/types/booking";

const adminUpdateSchema = z.object({
  action: z.enum(["update_status", "adjust_price", "update_schedule", "add_internal_note"]),
  expectedVersion: z.number().min(1).optional(), // Mandatory for material booking mutations originating from Admin UI

  // Status update params
  status: z.enum(["new", "awaiting_confirmation", "confirmed", "scheduled", "in_progress", "completed", "cancelled"]).optional(),
  statusReason: z.string().max(500).optional(),

  // Price adjustment params
  newPricePounds: z.number().min(0).optional(),
  priceChangeReason: z.enum([
    "additional_time",
    "reduced_time",
    "additional_work",
    "customer_requested_extras",
    "scope_differed_from_booking",
    "discount_goodwill",
    "correction",
    "other"
  ]).optional(),
  priceChangeDetails: z.string().max(500).optional(),

  // Scheduling update params
  confirmedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  confirmedTimeSlot: z.enum(["morning", "afternoon", "evening"]).optional(),
  confirmedTimeExact: z.string().max(50).optional(),

  // Internal Note
  internalNote: z.string().max(2000).optional(),
});

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  const actor = await requireRole(request, "admin");
  if (!actor) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await context.params;
  const db = getFirebaseDb();
  const docRef = db.collection("bookings").doc(id);
  const snap = await docRef.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "BOOKING_NOT_FOUND" }, { status: 404 });
  }

  const booking = { id: snap.id, ...snap.data() };

  // Fetch events timeline and internal notes
  const eventsSnap = await docRef.collection("events").orderBy("createdAt", "desc").limit(50).get();
  const events = eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const notesSnap = await docRef.collection("internalNotes").orderBy("createdAt", "desc").limit(50).get();
  const internalNotes = notesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return NextResponse.json({
    booking,
    events,
    internalNotes,
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  const actor = await requireRole(request, "admin");
  if (!actor) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await context.params;
  const db = getFirebaseDb();
  const docRef = db.collection("bookings").doc(id);

  const parsed = adminUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_UPDATE_PAYLOAD", issues: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const serverNow = FieldValue.serverTimestamp();

  // Enforce mandatory concurrency version for material actions
  if (payload.action !== "add_internal_note" && !payload.expectedVersion) {
    return NextResponse.json({
      error: "MISSING_CONCURRENCY_VERSION",
      message: "expectedVersion is required for material booking edits.",
    }, { status: 400 });
  }

  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      if (!snap.exists) {
        throw new Error("BOOKING_NOT_FOUND");
      }

      const currentBooking = snap.data() || {};
      const currentVersion = currentBooking.version || 1;

      // ATOMIC TRANSACTIONAL CONCURRENCY PRECONDITION CHECK
      if (payload.expectedVersion && currentVersion !== payload.expectedVersion) {
        throw new Error("CONCURRENCY_CONFLICT");
      }

      const reference = currentBooking.reference || id;
      const nextVersion = currentVersion + 1;

      if (payload.action === "update_status") {
        if (!payload.status) throw new Error("MISSING_STATUS");

        const currentStatus = (currentBooking.status || "new") as BookingStatus;
        const targetStatus = payload.status as BookingStatus;

        const check = isValidStatusTransition(currentStatus, targetStatus);
        if (!check.isValid) {
          throw new Error(`INVALID_STATUS_TRANSITION: ${check.error}`);
        }

        const updates: Record<string, unknown> = {
          status: targetStatus,
          version: nextVersion,
          updatedAt: serverNow,
        };
        if (targetStatus === "completed") updates.completedAt = serverNow;
        if (payload.statusReason) updates.statusReason = payload.statusReason;

        tx.update(docRef, updates);

        // Timeline Event
        const eventRef = docRef.collection("events").doc();
        tx.set(eventRef, {
          id: eventRef.id,
          bookingId: id,
          type: "status_changed",
          fromStatus: currentStatus,
          toStatus: targetStatus,
          actorUid: actor.uid,
          actorName: actor.email ? actor.email.split("@")[0] : "Admin",
          actorRole: "admin",
          visibility: "customer",
          summary: `Status updated to ${targetStatus.replace("_", " ").toUpperCase()}${payload.statusReason ? `: ${payload.statusReason}` : ""}`,
          createdAt: serverNow,
        });

        // Customer Notification
        if (currentBooking.customerId) {
          const notifRef = db.collection("notifications").doc();
          tx.set(notifRef, {
            id: notifRef.id,
            recipientId: currentBooking.customerId,
            recipientRole: "customer",
            title: `Booking Update (${reference})`,
            message: `Your booking status for ${currentBooking.serviceNameSnapshot || "service"} is now ${targetStatus.replace("_", " ").toUpperCase()}.`,
            actionUrl: "/account/bookings",
            createdAt: serverNow,
          });
        }

        return { status: targetStatus, version: nextVersion };
      }

      if (payload.action === "adjust_price") {
        if (payload.newPricePounds === undefined || !payload.priceChangeReason) {
          throw new Error("MISSING_PRICE_ADJUSTMENT_FIELDS");
        }

        if (payload.priceChangeReason === "other" && (!payload.priceChangeDetails || payload.priceChangeDetails.trim().length < 3)) {
          throw new Error("REASON_DETAILS_REQUIRED_FOR_OTHER");
        }

        const oldPence = currentBooking.pricing?.confirmedPence || currentBooking.pricing?.estimateMinPence || 0;
        const newPence = poundsToPence(payload.newPricePounds);
        const isIncrease = newPence > oldPence;

        const priceRecord = {
          oldPence,
          newPence,
          reason: payload.priceChangeReason as PriceChangeReason,
          ...(payload.priceChangeDetails ? { reasonDetails: payload.priceChangeDetails } : {}),
          actorUid: actor.uid,
          actorName: actor.email ? actor.email.split("@")[0] : "Admin",
          actorRole: "admin",
          timestamp: new Date(),
        };

        const updatedPricing = {
          ...currentBooking.pricing,
          confirmedPence: isIncrease ? currentBooking.pricing?.confirmedPence : newPence,
          proposedAdjustmentPence: isIncrease ? newPence : undefined,
          adjustmentApprovalStatus: isIncrease ? "pending" : "approved",
          priceHistory: [...(currentBooking.pricing?.priceHistory || []), priceRecord],
        };

        tx.update(docRef, {
          pricing: updatedPricing,
          version: nextVersion,
          updatedAt: serverNow,
        });

        // Security Audit
        const auditRef = db.collection("auditLogs").doc();
        tx.set(auditRef, {
          id: auditRef.id,
          action: "BOOKING_PRICE_ADJUSTMENT",
          actorUid: actor.uid,
          actorEmail: actor.email,
          targetId: id,
          details: { reference, oldPence, newPence, reason: payload.priceChangeReason },
          timestamp: serverNow,
        });

        // Timeline Event
        const eventRef = docRef.collection("events").doc();
        tx.set(eventRef, {
          id: eventRef.id,
          bookingId: id,
          type: "pricing_adjusted",
          actorUid: actor.uid,
          actorName: actor.email ? actor.email.split("@")[0] : "Admin",
          actorRole: "admin",
          visibility: "customer",
          summary: `Price adjusted from £${(oldPence/100).toFixed(2)} to £${(newPence/100).toFixed(2)} (${payload.priceChangeReason.replaceAll("_", " ")})`,
          createdAt: serverNow,
        });

        // Customer Notification
        if (currentBooking.customerId) {
          const notifRef = db.collection("notifications").doc();
          tx.set(notifRef, {
            id: notifRef.id,
            recipientId: currentBooking.customerId,
            recipientRole: "customer",
            title: `Price Adjusted (${reference})`,
            message: `The price for your ${currentBooking.serviceNameSnapshot || "service"} booking has been updated to £${(newPence/100).toFixed(2)} (${payload.priceChangeReason.replaceAll("_", " ")}).`,
            actionUrl: "/account/bookings",
            createdAt: serverNow,
          });
        }

        return { confirmedPence: newPence, version: nextVersion };
      }

      if (payload.action === "update_schedule") {
        if (!payload.confirmedDate || !payload.confirmedTimeSlot) {
          throw new Error("MISSING_SCHEDULE_FIELDS");
        }

        const updatedSchedule = {
          ...currentBooking.scheduling,
          confirmedDate: payload.confirmedDate,
          confirmedTimeSlot: payload.confirmedTimeSlot,
          ...(payload.confirmedTimeExact ? { confirmedTimeExact: payload.confirmedTimeExact } : {}),
        };

        tx.update(docRef, {
          scheduling: updatedSchedule,
          version: nextVersion,
          updatedAt: serverNow,
        });

        // Timeline Event
        const eventRef = docRef.collection("events").doc();
        tx.set(eventRef, {
          id: eventRef.id,
          bookingId: id,
          type: "schedule_changed",
          actorUid: actor.uid,
          actorName: actor.email ? actor.email.split("@")[0] : "Admin",
          actorRole: "admin",
          visibility: "customer",
          summary: `Confirmed schedule set to ${payload.confirmedDate} (${payload.confirmedTimeSlot})`,
          createdAt: serverNow,
        });

        // Customer Notification
        if (currentBooking.customerId) {
          const notifRef = db.collection("notifications").doc();
          tx.set(notifRef, {
            id: notifRef.id,
            recipientId: currentBooking.customerId,
            recipientRole: "customer",
            title: `Schedule Confirmed (${reference})`,
            message: `Your booking appointment has been scheduled for ${payload.confirmedDate} (${payload.confirmedTimeSlot.toUpperCase()}).`,
            actionUrl: "/account/bookings",
            createdAt: serverNow,
          });
        }

        return { schedule: updatedSchedule, version: nextVersion };
      }

      if (payload.action === "add_internal_note") {
        if (!payload.internalNote || payload.internalNote.trim().length === 0) {
          throw new Error("EMPTY_NOTE");
        }

        const noteRef = docRef.collection("internalNotes").doc();
        tx.set(noteRef, {
          id: noteRef.id,
          bookingId: id,
          authorUid: actor.uid,
          authorName: actor.email ? actor.email.split("@")[0] : "Admin",
          note: payload.internalNote.trim(),
          createdAt: serverNow,
        });

        return { noteId: noteRef.id };
      }

      throw new Error("UNKNOWN_ACTION");
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "CONCURRENCY_CONFLICT") {
        return NextResponse.json({
          error: "CONCURRENCY_CONFLICT",
          message: "This booking document was updated by another administrator since you opened it. Please refresh your workspace.",
        }, { status: 409 });
      }
      if (err.message === "BOOKING_NOT_FOUND") {
        return NextResponse.json({ error: "BOOKING_NOT_FOUND" }, { status: 404 });
      }
      if (err.message.startsWith("INVALID_STATUS_TRANSITION")) {
        return NextResponse.json({ error: "INVALID_STATUS_TRANSITION", message: err.message }, { status: 400 });
      }
    }

    console.error("Error updating admin booking:", err);
    return NextResponse.json({ error: "UPDATE_BOOKING_FAILED" }, { status: 500 });
  }
}
