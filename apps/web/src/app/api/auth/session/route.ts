import { NextResponse } from "next/server";
import { getFirebaseAdminAuth, isFirebaseConfigured } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return NextResponse.json({ error: "INVALID_ORIGIN" }, { status: 403 });
    }
    if (!isFirebaseConfigured()) {
      return NextResponse.json({ error: "AUTH_UNAVAILABLE" }, { status: 503 });
    }

    const { idToken } = await request.json();
    if (typeof idToken !== "string" || idToken.length < 20 || idToken.length > 20000) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 400 });
    }

    const auth = getFirebaseAdminAuth();
    await auth.verifyIdToken(idToken, true);
    const session = await auth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 5 * 1000,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("bos_session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 5,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
  }
}
