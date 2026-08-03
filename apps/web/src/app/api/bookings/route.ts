import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { bookingSchema, startingPrice } from "@/lib/booking";
import { sendBookingAcknowledgement } from "@/lib/email";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { getFirebaseAdminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  const parsed = bookingSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "INVALID_BOOKING", issues: parsed.error.flatten() }, { status: 400 });
  if (!isFirebaseConfigured()) return NextResponse.json({ error: "BOOKING_SERVICE_UNAVAILABLE" }, { status: 503 });
  const input = parsed.data; const db = getFirebaseDb(); const session = (await cookies()).get("bos_session")?.value; let customerUid: string | undefined;
  if (session) { try { const user = await getFirebaseAdminAuth().verifySessionCookie(session, true); if (user.email?.toLowerCase() === input.email.toLowerCase()) customerUid = user.uid; } catch {} }
  const idempotency = db.collection("bookingIdempotency").doc(input.idempotencyKey);
  const result = await db.runTransaction(async (tx) => { const existing = await tx.get(idempotency); if (existing.exists) return existing.data() as { reference: string; id: string }; const id = randomUUID(); const reference = `BOS-${new Date().getUTCFullYear()}-${id.slice(0, 8).toUpperCase()}`; const now = new Date(); const quote = startingPrice(input); const booking = { ...input, id, reference, status: "New", startingPrice: quote, currency: "GBP", finalPriceConfirmed: false, createdAt: now, updatedAt: now, source: customerUid ? "web-account" : "web-guest", ...(customerUid ? { customerUid } : {}) }; tx.set(db.collection("bookings").doc(id), booking); tx.set(db.collection("customers").doc(input.email.toLowerCase()), { email: input.email.toLowerCase(), fullName: input.fullName, ...(customerUid ? { customerUid } : {}), updatedAt: now }, { merge: true }); tx.set(db.collection("bookingEvents").doc(), { bookingId: id, type: "created", fromStatus: null, toStatus: "New", actor: customerUid ?? "guest", createdAt: now }); tx.set(idempotency, { id, reference, createdAt: now }); return { id, reference }; });
  await sendBookingAcknowledgement({ email: input.email, reference: result.reference });
  return NextResponse.json({ ...result, status: "New", startingPrice: startingPrice(input), message: "Your request is subject to confirmation." }, { status: 201 });
}
