import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { requireAuthenticated } from "@/lib/roles";

export async function POST(request: Request) {
  const actor = await requireAuthenticated(request);
  if (!actor || actor.role !== "customer" || !actor.email) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { reference?: unknown } | null;
  const reference = typeof body?.reference === "string" ? body.reference.trim().toUpperCase() : "";
  if (!/^BOS-\d{4}-(?:\d{6}|[A-F0-9]{20})$/.test(reference)) {
    return NextResponse.json({ error: "INVALID_REFERENCE" }, { status: 400 });
  }

  try {
    const db = getFirebaseDb();
    const found = await db.collection("bookings").where("reference", "==", reference).limit(1).get();
    if (found.empty) {
      return NextResponse.json({ error: "BOOKING_NOT_FOUND" }, { status: 404 });
    }

    const bookingRef = found.docs[0].ref;
    const outcome = await db.runTransaction(async (tx) => {
      const snapshot = await tx.get(bookingRef);
      if (!snapshot.exists) return "not_found" as const;

      const booking = snapshot.data();
      const bookingEmail = String(booking?.emailLower ?? booking?.customerSnapshot?.email ?? "")
        .trim()
        .toLowerCase();
      if (bookingEmail !== actor.email) return "not_found" as const;
      if (booking?.customerId && booking.customerId !== actor.uid) return "already_linked" as const;

      tx.set(bookingRef, {
        customerId: actor.uid,
        linkedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      return "linked" as const;
    });

    if (outcome === "not_found") {
      return NextResponse.json({ error: "BOOKING_NOT_FOUND" }, { status: 404 });
    }
    if (outcome === "already_linked") {
      return NextResponse.json({ error: "BOOKING_ALREADY_LINKED" }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "BOOKING_LINK_FAILED" }, { status: 503 });
  }
}
