import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireRole } from "@/lib/roles";

const DispatchUpdateSchema = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
  staffName: z.string().min(1, "Staff name is required"),
  dispatchStatus: z.enum(["assigned", "dispatched", "on_site", "completed"]),
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
  const bookingId = resolvedParams.id;

  try {
    const body = await req.json();
    const parsed = DispatchUpdateSchema.parse(body);

    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking appointment not found" }, { status: 404 });
    }

    const serverNow = FieldValue.serverTimestamp();

    // Batch write: update booking + add timeline event
    const batch = db.batch();
    batch.update(bookingRef, {
      assignedStaffId: parsed.staffId,
      assignedStaffName: parsed.staffName,
      dispatchStatus: parsed.dispatchStatus,
      updatedAt: serverNow,
    });

    const eventRef = bookingRef.collection("events").doc();
    batch.set(eventRef, {
      id: eventRef.id,
      bookingId,
      type: "updated",
      title: `Field Team Assigned (${parsed.staffName})`,
      description: `Technician ${parsed.staffName} assigned to appointment. Dispatch status: ${parsed.dispatchStatus.toUpperCase()}`,
      actorType: "admin",
      actorId: adminUser.uid,
      visibility: "customer",
      createdAt: serverNow,
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      bookingId,
      assignedStaffId: parsed.staffId,
      assignedStaffName: parsed.staffName,
      dispatchStatus: parsed.dispatchStatus,
      message: `Staff member ${parsed.staffName} assigned to booking ${bookingId}.`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Dispatch assignment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
