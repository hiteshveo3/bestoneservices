import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getFirebaseAdminAuth, isFirebaseConfigured } from "@/lib/firebase-admin";

export async function requireSession(next: string, requiredRole?: "admin") {
  if (!isFirebaseConfigured()) redirect(`/account/login/?next=${encodeURIComponent(next)}`);
  const session = (await cookies()).get("bos_session")?.value;
  if (!session) redirect(`/account/login/?next=${encodeURIComponent(next)}`);
  try {
    const user = await getFirebaseAdminAuth().verifySessionCookie(session, true);
    if (requiredRole && user.role !== requiredRole) redirect("/account/dashboard/?access=denied");
    return user;
  } catch { redirect(`/account/login/?next=${encodeURIComponent(next)}`); }
}
