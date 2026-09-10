import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireRole } from "@/lib/roles";

const DisputeUpdateSchema = z.object({
  status: z.enum(["under_review", "re_clean_scheduled", "resolved", "rejected"]),
  resolutionNotes: z.string().optional(),
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
  const disputeId = resolvedParams.id;

  try {
    const body = await req.json();
    const parsed = DisputeUpdateSchema.parse(body);

    const disputeRef = db.collection("disputes").doc(disputeId);
    const disputeSnap = await disputeRef.get();

    if (!disputeSnap.exists) {
      return NextResponse.json({ error: "Dispute claim record not found" }, { status: 404 });
    }

    const dData = disputeSnap.data();
    if (!dData) {
      return NextResponse.json({ error: "Empty dispute data" }, { status: 404 });
    }

    const serverNow = FieldValue.serverTimestamp();
    const batch = db.batch();

    batch.update(disputeRef, {
      status: parsed.status,
      ...(parsed.resolutionNotes ? { resolutionNotes: parsed.resolutionNotes.trim() } : {}),
      updatedAt: serverNow,
    });

    // Write Timeline Event to Original Booking
    if (dData.bookingId) {
      const bookingRef = db.collection("bookings").doc(dData.bookingId);
      const eventRef = bookingRef.collection("events").doc();
      batch.set(eventRef, {
        id: eventRef.id,
        bookingId: dData.bookingId,
        type: "updated",
        title: `Guarantee Dispute Status Updated (${parsed.status.replace(/_/g, " ").toUpperCase()})`,
        description: parsed.resolutionNotes 
          ? `Resolution notes: ${parsed.resolutionNotes}` 
          : `Dispute claim updated to ${parsed.status.toUpperCase()}`,
        actorType: "admin",
        actorId: adminUser.uid,
        visibility: "customer",
        createdAt: serverNow,
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      disputeId,
      status: parsed.status,
      message: `Dispute ${disputeId} status updated to ${parsed.status.toUpperCase()}.`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Dispute resolution update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
