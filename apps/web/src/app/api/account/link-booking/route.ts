import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getFirebaseAdminAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  if (!isFirebaseConfigured()) return NextResponse.json({ error: "AUTH_UNAVAILABLE" }, { status: 503 });
  const reference = String((await request.json().catch(() => ({}))).reference ?? "").trim().toUpperCase();
  if (!/^BOS-\d{4}-[A-Z0-9]{8}$/.test(reference)) return NextResponse.json({ error: "INVALID_REFERENCE" }, { status: 400 });
  const token = (await cookies()).get("bos_session")?.value;
  if (!token) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  try {
    const user = await getFirebaseAdminAuth().verifySessionCookie(token, true); if (!user.email) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    const db = getFirebaseDb(); const found = await db.collection("bookings").where("reference", "==", reference).limit(1).get();
    if (found.empty || String(found.docs[0].data().email ?? "").toLowerCase() !== user.email.toLowerCase()) return NextResponse.json({ error: "BOOKING_NOT_FOUND" }, { status: 404 });
    await found.docs[0].ref.set({ customerUid: user.uid, linkedAt: new Date(), updatedAt: new Date() }, { merge: true }); return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 }); }
}
