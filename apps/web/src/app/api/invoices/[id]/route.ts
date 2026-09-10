import { NextResponse } from "next/server";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { canAccessOwnedResource } from "@/lib/roles";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  const resolvedParams = await params;
  const invoiceId = resolvedParams.id;

  try {
    const docRef = db.collection("invoices").doc(invoiceId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Invoice document not found" }, { status: 404 });
    }

    const data = docSnap.data();
    if (!await canAccessOwnedResource(req, data)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ invoice: { id: docSnap.id, ...data } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
