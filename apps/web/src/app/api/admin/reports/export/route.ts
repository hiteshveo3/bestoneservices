import { NextResponse } from "next/server";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { generateCsvExport } from "@/lib/analytics-engine";
import { requireRole } from "@/lib/roles";

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

  const { searchParams } = new URL(req.url);
  const entity = (searchParams.get("entity") || "bookings") as "bookings" | "invoices" | "staff" | "reviews";

  try {
    const snap = await db.collection(entity).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const csvContent = generateCsvExport(entity, items);

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="bestone_${entity}_report.csv"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "CSV export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
