import { NextResponse } from "next/server";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import { requireRole } from "@/lib/roles";

export async function GET(request: Request) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  const actor = await requireRole(request, "admin");
  if (!actor) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const limitCount = parseInt(searchParams.get("limit") || "50", 10);

    const db = getFirebaseDb();
    const colRef = db.collection("bookings");
    let query: FirebaseFirestore.Query = colRef;

    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }
    if (category && category !== "all") {
      query = query.where("categoryId", "==", category);
    }

    query = query.orderBy("createdAt", "desc").limit(limitCount);

    const snapshot = await query.get();
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ bookings, count: bookings.length });
  } catch (err) {
    console.error("Error fetching admin bookings:", err);
    return NextResponse.json({ error: "FETCH_BOOKINGS_FAILED" }, { status: 500 });
  }
}
