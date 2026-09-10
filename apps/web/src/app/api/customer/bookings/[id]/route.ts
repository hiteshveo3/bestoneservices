import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { isRescheduleAllowed, isCancellationAllowed } from "@/lib/booking-domain";
import { actorOwnsResource, requireAuthenticated } from "@/lib/roles";

const CustomerRescheduleSchema = z.object({
  action: z.literal("reschedule"),
  requestedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  requestedTimeSlot: z.enum(["morning", "afternoon", "evening"]),
  rescheduleReason: z.string().max(500).optional(),
});

const CustomerCancelSchema = z.object({
  action: z.literal("cancel"),
  cancelReason: z.enum([
    "schedule_conflict",
    "found_alternative",
    "pricing_concern",
    "scope_changed",
    "other",
  ]),
  cancelDetails: z.string().max(1000).optional(),
});

const CustomerChangeRequestSchema = z.object({
  action: z.literal("change_request"),
  changeNotes: z.string().min(3, "Change request details must be at least 3 characters").max(2000),
});

const CustomerActionSchema = z.discriminatedUnion("action", [
  CustomerRescheduleSchema,
  CustomerCancelSchema,
  CustomerChangeRequestSchema,
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  const resolvedParams = await params;
  const bookingId = resolvedParams.id;

  const actor = await requireAuthenticated(req);
  if (!actor) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (actor.role !== "customer") {
    return NextResponse.json({ error: "Forbidden: Customer account required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = CustomerActionSchema.parse(body);

    const docRef = db.collection("bookings").doc(bookingId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Booking record not found" }, { status: 404 });
    }

    const bookingData = docSnap.data();
    if (!bookingData) {
      return NextResponse.json({ error: "Empty booking data" }, { status: 404 });
    }

    // Security Ownership Authorization Matrix
    if (!actorOwnsResource(actor, bookingData)) {
      return NextResponse.json({ error: "Forbidden: You do not own this booking" }, { status: 403 });
    }

    const serverNow = FieldValue.serverTimestamp();

    if (parsed.action === "reschedule") {
      const check = isRescheduleAllowed(bookingData.status);
      if (!check.allowed) {
        return NextResponse.json({ error: check.reason || "Reschedule not allowed" }, { status: 400 });
      }

      await docRef.update({
        "scheduling.requestedDate": parsed.requestedDate,
        "scheduling.requestedTimeSlot": parsed.requestedTimeSlot,
        status: "awaiting_confirmation",
        statusReason: parsed.rescheduleReason || "Customer requested schedule change",
        updatedAt: serverNow,
      });

      // Audit Timeline Event
      await docRef.collection("events").add({
        type: "schedule_changed",
        fromStatus: bookingData.status,
        toStatus: "awaiting_confirmation",
        actorUid: actor.uid,
        actorName: bookingData.customerSnapshot?.fullName || "Customer",
        actorRole: "customer",
        visibility: "customer",
        summary: `Customer requested reschedule to ${parsed.requestedDate} (${parsed.requestedTimeSlot.toUpperCase()})`,
        metadata: {
          requestedDate: parsed.requestedDate,
          requestedTimeSlot: parsed.requestedTimeSlot,
          reason: parsed.rescheduleReason || null,
        },
        createdAt: serverNow,
      });

      // Admin Notification Dispatch
      await db.collection("notifications").add({
        recipientId: "admin",
        title: "Customer Reschedule Request",
        body: `Booking ${bookingData.reference} requested new slot on ${parsed.requestedDate} (${parsed.requestedTimeSlot.toUpperCase()})`,
        link: `/admin/bookings/${bookingId}`,
        read: false,
        type: "booking_rescheduled",
        createdAt: serverNow,
      });

      return NextResponse.json({
        success: true,
        message: "Reschedule request submitted successfully and sent to admin for confirmation.",
      });
    }

    if (parsed.action === "cancel") {
      const check = isCancellationAllowed(bookingData.status);
      if (!check.allowed) {
        return NextResponse.json({ error: check.reason || "Cancellation not allowed" }, { status: 400 });
      }

      const previousStatus = bookingData.status;

      await docRef.update({
        status: "cancelled",
        statusReason: `Customer Cancelled: ${parsed.cancelReason.replace("_", " ")}`,
        cancelledBy: "customer",
        updatedAt: serverNow,
      });

      // Audit Timeline Event
      await docRef.collection("events").add({
        type: "cancelled",
        fromStatus: previousStatus,
        toStatus: "cancelled",
        actorUid: actor.uid,
        actorName: bookingData.customerSnapshot?.fullName || "Customer",
        actorRole: "customer",
        visibility: "customer",
        summary: `Booking cancelled by customer (${parsed.cancelReason.replace("_", " ")})`,
        metadata: {
          cancelReason: parsed.cancelReason,
          cancelDetails: parsed.cancelDetails || null,
        },
        createdAt: serverNow,
      });

      // Admin Notification Dispatch
      await db.collection("notifications").add({
        recipientId: "admin",
        title: "Booking Cancelled by Customer",
        body: `Booking ${bookingData.reference} was cancelled by the customer (${parsed.cancelReason.replace("_", " ")})`,
        link: `/admin/bookings/${bookingId}`,
        read: false,
        type: "booking_cancelled",
        createdAt: serverNow,
      });

      return NextResponse.json({
        success: true,
        message: "Booking cancellation recorded.",
      });
    }

    if (parsed.action === "change_request") {
      await docRef.collection("events").add({
        type: "details_updated",
        actorUid: actor.uid,
        actorName: bookingData.customerSnapshot?.fullName || "Customer",
        actorRole: "customer",
        visibility: "customer",
        summary: `Customer requested scope change: ${parsed.changeNotes}`,
        createdAt: serverNow,
      });

      await db.collection("notifications").add({
        recipientId: "admin",
        title: "Customer Scope Change Request",
        body: `Scope change requested for booking ${bookingData.reference}: ${parsed.changeNotes}`,
        link: `/admin/bookings/${bookingId}`,
        read: false,
        type: "booking_change_requested",
        createdAt: serverNow,
      });

      return NextResponse.json({
        success: true,
        message: "Scope change request logged and sent to operational team.",
      });
    }

    return NextResponse.json({ error: "Unhandled customer action" }, { status: 400 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload parameters", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Internal customer booking update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
