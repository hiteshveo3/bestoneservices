import { NextResponse } from "next/server";
import { getFirebaseAdminAuth, isFirebaseConfigured } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  if (!isFirebaseConfigured()) return NextResponse.json({ error: "AUTH_UNAVAILABLE" }, { status: 503 });
  const { idToken } = await request.json();
  if (typeof idToken !== "string") return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });
  const session = await getFirebaseAdminAuth().createSessionCookie(idToken, { expiresIn: 60 * 60 * 24 * 5 * 1000 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set("bos_session", session, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 5, path: "/" });
  return response;
}
