import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateBookingReference } from "@/lib/booking-reference";
import { normalizeUKPostcode } from "@/lib/booking-domain";
import { isEstimateExpired } from "@/lib/estimate-domain";
import { actorOwnsResource, getRequestActor, getResourceToken, resourceTokenMatches } from "@/lib/roles";

const EstimateConvertSchema = z.object({
  scheduledDate: z.string().min(1, "Scheduled appointment date is required"),
  scheduledTimeSlot: z.enum(["morning", "afternoon", "evening"]),
  addressLine1: z.string().min(3, "Address is required"),
  city: z.string().min(2).max(80).default("London"),
  postcode: z.string().min(3, "Postcode is required"),
  notes: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  const authenticatedUser = await getRequestActor(req);
  const suppliedToken = getResourceToken(req);
  const resolvedParams = await params;
  const estimateId = resolvedParams.id;

  try {
    const body = await req.json();
    const parsed = EstimateConvertSchema.parse(body);

    const estimateRef = db.collection("estimates").doc(estimateId);
    const result = await db.runTransaction(async (tx) => {
      const estimateSnap = await tx.get(estimateRef);
      if (!estimateSnap.exists) throw new Error("ESTIMATE_NOT_FOUND");

      const estData = estimateSnap.data();
      if (!estData) throw new Error("ESTIMATE_NOT_FOUND");
      if (!actorOwnsResource(authenticatedUser, estData) && !resourceTokenMatches(estData, suppliedToken)) {
        throw new Error("ESTIMATE_UNAUTHORIZED");
      }
      if (estData.status === "converted_to_booking") {
        return {
          alreadyConverted: true,
          bookingId: estData.convertedBookingId as string,
          bookingReference: estData.convertedBookingReference as string,
        };
      }
      if (isEstimateExpired(estData.validUntil)) throw new Error("ESTIMATE_EXPIRED");

      const bookingId = randomUUID();
      const bookingRefString = generateBookingReference();
      const serverNow = FieldValue.serverTimestamp();
      const normalizedPostcode = normalizeUKPostcode(parsed.postcode);
      const emailLower = String(estData.customerEmail).toLowerCase().trim();
      const customerUid = typeof estData.customerId === "string"
        ? estData.customerId
        : authenticatedUser?.role === "customer" && authenticatedUser.email === emailLower
          ? authenticatedUser.uid
          : null;
      const serviceAddress = {
        addressLine1: parsed.addressLine1,
        addressLine2: "",
        city: parsed.city,
        postcode: parsed.postcode.toUpperCase().trim(),
        normalizedPostcode,
        instructions: parsed.notes || "",
      };
      const bookingData = {
        id: bookingId,
        reference: bookingRefString,
        version: 1,
        customerId: customerUid,
        customerSnapshot: {
          fullName: estData.customerName,
          email: emailLower,
          phone: estData.customerPhone || "",
          serviceAddress,
        },
        emailLower,
        phoneNormalized: String(estData.customerPhone || "").replace(/[^\d+]/g, ""),
        postcodeNormalized: normalizedPostcode,
        categoryId: estData.categoryId,
        serviceId: estData.serviceId,
        serviceNameSnapshot: estData.serviceName,
        status: "new",
        serviceDetails: {
          ...estData.specifications,
          notes: parsed.notes || estData.specifications?.notes || "",
          estimateReference: estimateId,
        },
        address: serviceAddress,
        scheduling: {
          requestedDate: parsed.scheduledDate,
          requestedTimeSlot: parsed.scheduledTimeSlot,
          timezone: "Europe/London",
        },
        pricing: {
          estimateMinPence: estData.totalPence,
          estimateMaxPence: estData.totalPence,
          minimumChargeRule: "Formal estimate accepted",
        },
        financials: {
          currency: "GBP",
          estimateMinPence: estData.totalPence,
          estimateMaxPence: estData.totalPence,
          depositRequiredPence: Math.round(Number(estData.totalPence) * 0.25),
          depositPaidPence: 0,
          totalPricePence: estData.totalPence,
          paymentStatus: "unpaid",
        },
        source: "website",
        sourceDetail: "estimate_conversion",
        estimateReference: estimateId,
        createdAt: serverNow,
        updatedAt: serverNow,
      };

      const bookingRefDoc = db.collection("bookings").doc(bookingId);
      tx.create(bookingRefDoc, bookingData);
      tx.update(estimateRef, {
        status: "converted_to_booking",
        convertedBookingId: bookingId,
        convertedBookingReference: bookingRefString,
        convertedAt: serverNow,
        updatedAt: serverNow,
      });

      // Create Initial Booking Timeline Event
      const eventRef = bookingRefDoc.collection("events").doc();
      tx.create(eventRef, {
        id: eventRef.id,
        bookingId,
        type: "created",
        title: "Booking Created from Formal Quote",
        description: `Appointment booked directly from Quote ${estimateId}`,
        actorType: customerUid ? "customer" : "guest",
        actorId: customerUid,
        visibility: "customer",
        createdAt: serverNow,
      });

      // Create Admin Operational Notification
      const notifRef = db.collection("notifications").doc();
      tx.create(notifRef, {
        id: notifRef.id,
        recipientId: "admin",
        recipientRole: "admin",
        type: "booking_created",
        title: `Quote ${estimateId} Converted to Booking`,
        message: `${estData.customerName} converted Quote ${estimateId} into Booking ${bookingRefString}`,
        actionUrl: `/admin/bookings/${bookingId}`,
        read: false,
        createdAt: serverNow,
      });

      return { alreadyConverted: false, bookingId, bookingReference: bookingRefString };
    });

    return NextResponse.json({
      success: true,
      ...result,
      message: result.alreadyConverted
        ? `Estimate was already converted to booking ${result.bookingReference}.`
        : `Quote ${estimateId} successfully converted into active booking ${result.bookingReference}!`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    if (err instanceof Error && err.message === "ESTIMATE_NOT_FOUND") {
      return NextResponse.json({ error: "Estimate quote not found" }, { status: 404 });
    }
    if (err instanceof Error && err.message === "ESTIMATE_UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "ESTIMATE_EXPIRED") {
      return NextResponse.json({ error: "This estimate quote has expired. Please calculate a new instant quote." }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Estimate conversion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
