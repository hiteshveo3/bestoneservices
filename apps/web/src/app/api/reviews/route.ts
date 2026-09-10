import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateReviewId } from "@/lib/review-domain";
import { actorOwnsResource, requireAuthenticated } from "@/lib/roles";

const ReviewCreateSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  bookingReference: z.string().min(1, "Booking reference is required"),
  rating: z.number().min(1).max(5),
  reviewText: z.string().trim().min(5, "Review text must be at least 5 characters").max(2000),
});

export async function GET() {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  try {
    const snap = await db.collection("reviews")
      .where("status", "==", "published")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ reviews });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch published reviews";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
    const parsed = ReviewCreateSchema.parse(body);

    const reviewId = generateReviewId();
    const serverNow = FieldValue.serverTimestamp();

    // Verify booking exists
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
    if (bkData?.status !== "completed") {
      return NextResponse.json({ error: "Reviews are available after service completion" }, { status: 409 });
    }

    const existing = await db.collection("reviews")
      .where("bookingId", "==", parsed.bookingId)
      .where("customerId", "==", authenticatedUser.uid)
      .limit(1)
      .get();
    if (!existing.empty) {
      return NextResponse.json({ error: "A review already exists for this booking" }, { status: 409 });
    }

    const reviewData = {
      id: reviewId,
      bookingId: parsed.bookingId,
      bookingReference: parsed.bookingReference,
      customerId: authenticatedUser.uid,
      customerName: bkData?.customerSnapshot?.fullName || "Verified Customer",
      customerEmail: bkData?.customerSnapshot?.email || authenticatedUser.email || "",

      ...(bkData?.assignedStaffId
        ? { staffId: bkData.assignedStaffId, staffName: bkData.assignedStaffName || "Assigned professional" }
        : {}),
      serviceCategory: bkData?.categoryId,

      rating: parsed.rating,
      reviewText: parsed.reviewText.trim(),
      status: "pending_approval",

      createdAt: serverNow,
      updatedAt: serverNow,
    };

    const reviewRef = db.collection("reviews").doc(reviewId);
    const submissionRef = db.collection("reviewSubmissions").doc(parsed.bookingId);
    await db.runTransaction(async (tx) => {
      const submission = await tx.get(submissionRef);
      if (submission.exists) throw new Error("REVIEW_ALREADY_EXISTS");
      tx.create(reviewRef, reviewData);
      tx.create(submissionRef, {
        bookingId: parsed.bookingId,
        reviewId,
        customerId: authenticatedUser.uid,
        createdAt: serverNow,
      });
    });

    return NextResponse.json({
      success: true,
      review: reviewData,
      message: "Thank you for your rating & feedback!",
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    if (err instanceof Error && err.message === "REVIEW_ALREADY_EXISTS") {
      return NextResponse.json({ error: "A review already exists for this booking" }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Review submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
