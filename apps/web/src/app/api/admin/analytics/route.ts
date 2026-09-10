import { NextResponse } from "next/server";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { calculateAnalyticsSummary } from "@/lib/analytics-engine";
import { requireRole } from "@/lib/roles";
import { type BookingItem } from "@/types/booking";
import { type InvoiceItem } from "@/types/invoice";
import { type StaffMemberItem } from "@/types/staff";
import { type ReviewItem } from "@/types/review";

export async function GET(req: Request) {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  const adminUser = await requireRole(req, "admin");
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized: Admin auth required" }, { status: 401 });
  }

  try {
    const [bookingsSnap, invoicesSnap, staffSnap, reviewsSnap] = await Promise.all([
      db.collection("bookings").get(),
      db.collection("invoices").get(),
      db.collection("staff").get(),
      db.collection("reviews").get(),
    ]);

    const bookings = bookingsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as BookingItem[];
    const invoices = invoicesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as InvoiceItem[];
    const staff = staffSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as StaffMemberItem[];
    const reviews = reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as ReviewItem[];

    const analytics = calculateAnalyticsSummary(bookings, invoices, staff, reviews);

    return NextResponse.json({ analytics });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Analytics calculation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
