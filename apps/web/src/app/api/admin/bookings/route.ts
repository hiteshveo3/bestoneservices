import { NextResponse } from "next/server";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { requireRole } from "@/lib/roles";
export async function GET(request: Request) { const actor = await requireRole(request, "admin"); if (!actor) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }); const rows = await getFirebaseDb().collection("bookings").orderBy("createdAt", "desc").limit(100).get(); return NextResponse.json(rows.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); }
