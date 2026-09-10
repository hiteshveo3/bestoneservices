import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getFirebaseAdminAuth, isFirebaseConfigured } from "@/lib/firebase-admin";

export async function requireSession(next: string, requiredRole?: "admin") {
  const cookieStore = await cookies();
  const session = cookieStore.get("bos_session")?.value;

  if (!session) {
    redirect(`/account/login/?next=${encodeURIComponent(next)}`);
  }

  let user: { uid: string; email?: string; role?: string } | null = null;

  if (!isFirebaseConfigured()) {
    redirect(`/account/login/?next=${encodeURIComponent(next)}&error=auth_unavailable`);
  }

  try {
    user = await getFirebaseAdminAuth().verifySessionCookie(session, true);
  } catch {
    redirect(`/account/login/?next=${encodeURIComponent(next)}&error=session_expired`);
  }

  if (requiredRole && user?.role !== requiredRole) {
    redirect("/account/dashboard/?access=denied");
  }

  return user;
}
