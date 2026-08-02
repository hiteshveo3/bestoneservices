import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";

export async function requireRole(request: Request, role: "admin" | "staff") {
  if (!isFirebaseConfigured()) return null;
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !getApps()[0]) return null;
  const decoded = await getAuth().verifyIdToken(token);
  if (decoded.role === "admin" || (role === "staff" && decoded.role === "staff")) return decoded;
  const user = await getFirebaseDb().collection("users").doc(decoded.uid).get();
  return user.data()?.role === "admin" || (role === "staff" && user.data()?.role === "staff") ? decoded : null;
}
