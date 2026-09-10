import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateDisputeId, isReCleanGuaranteeEligible } from "@/lib/review-domain";
import { actorOwnsResource, requireAuthenticated } from "@/lib/roles";

const DisputeCreateSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  bookingReference: z.string().min(1, "Booking reference is required"),
  disputeType: z.enum(["re_clean_guarantee_claim", "quality_issue", "pricing_dispute", "damage_claim"]),
  description: z.string().trim().min(10, "Please provide detailed description of the defect or issue").max(4000),
  photoUrls: z.array(z.string().url()).max(10).optional(),
});

export async function POST(req: Request) {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  const authenticatedUser = await requireAuthenticated(req);
  if (!authenticatedUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (authenticatedUser.role !== "customer") {
    return NextResponse.json({ error: "Customer account required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = DisputeCreateSchema.parse(body);

    const disputeId = generateDisputeId();
    const serverNow = FieldValue.serverTimestamp();

    const bookingRef = db.collection("bookings").doc(parsed.bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Associated booking not found" }, { status: 404 });
    }

    const bkData = bookingSnap.data();
    if (!actorOwnsResource(authenticatedUser, bkData)) {
      return NextResponse.json({ error: "Forbidden: You do not own this booking" }, { status: 403 });
    }
    if (bkData?.reference !== parsed.bookingReference) {
      return NextResponse.json({ error: "Booking reference mismatch" }, { status: 400 });
    }
    if (
      parsed.disputeType === "re_clean_guarantee_claim" &&
      (bkData?.status !== "completed" || !isReCleanGuaranteeEligible(bkData?.completedAt))
    ) {
      return NextResponse.json({ error: "The 48-hour re-clean guarantee window is not active" }, { status: 409 });
    }

    const disputeData = {
      id: disputeId,
      bookingId: parsed.bookingId,
      bookingReference: parsed.bookingReference,
      customerId: authenticatedUser.uid,
      customerName: bkData?.customerSnapshot?.fullName || "Customer",
      customerEmail: bkData?.customerSnapshot?.email || authenticatedUser.email || "",
      customerPhone: bkData?.customerSnapshot?.phone || null,

      disputeType: parsed.disputeType,
      description: parsed.description.trim(),
      photoUrls: parsed.photoUrls || [],

      status: "open",
      createdAt: serverNow,
      updatedAt: serverNow,
    };

    const batch = db.batch();
    const disputeRefDoc = db.collection("disputes").doc(disputeId);
    batch.create(disputeRefDoc, disputeData);

    // Create Timeline Event on Booking
    const eventRef = bookingRef.collection("events").doc();
    batch.set(eventRef, {
      id: eventRef.id,
      bookingId: parsed.bookingId,
      type: "updated",
      title: "48-Hour Re-Clean Guarantee Claim Submitted",
      description: `Customer submitted ${parsed.disputeType.replace(/_/g, " ").toUpperCase()} claim (${disputeId}). Currently under review.`,
      actorType: "customer",
      actorId: authenticatedUser.uid,
      visibility: "customer",
      createdAt: serverNow,
    });

    // Create Admin Operational Notification
    const notifRef = db.collection("notifications").doc();
    batch.set(notifRef, {
      id: notifRef.id,
      recipientId: "admin",
      type: "dispute_filed",
      title: `Guarantee Claim Filed (${parsed.bookingReference})`,
      message: `${disputeData.customerName} submitted a 48-Hour Re-Clean Claim (${disputeId}) for Booking ${parsed.bookingReference}.`,
      link: `/admin/disputes`,
      read: false,
      createdAt: serverNow,
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      dispute: disputeData,
      message: `Your claim ${disputeId} has been filed for review. Our Quality Control team will contact you with the next steps.`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Dispute claim submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
