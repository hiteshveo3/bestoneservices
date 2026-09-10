import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireRole } from "@/lib/roles";

const ReviewStatusSchema = z.object({
  status: z.enum(["published", "flagged", "pending_approval"]),
});

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

  const adminUser = await requireRole(req, "admin");
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized: Admin auth required" }, { status: 401 });
  }

  const resolvedParams = await params;
  const reviewId = resolvedParams.id;

  try {
    const body = await req.json();
    const parsed = ReviewStatusSchema.parse(body);

    const docRef = db.collection("reviews").doc(reviewId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const serverNow = FieldValue.serverTimestamp();

    await docRef.update({
      status: parsed.status,
      updatedAt: serverNow,
    });

    return NextResponse.json({
      success: true,
      reviewId,
      status: parsed.status,
      message: `Review ${reviewId} status updated to ${parsed.status.toUpperCase()}.`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Review moderation update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
