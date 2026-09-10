import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { isEstimateExpired } from "@/lib/estimate-domain";
import { canAccessOwnedResource } from "@/lib/roles";

const EstimateStatusUpdateSchema = z.object({
  status: z.enum(["accepted", "declined"]),
});

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
  const estimateId = resolvedParams.id;

  try {
    const docRef = db.collection("estimates").doc(estimateId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Estimate quote not found" }, { status: 404 });
    }

    const data = docSnap.data();
    if (!await canAccessOwnedResource(req, data)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (data && data.status !== "converted_to_booking" && isEstimateExpired(data.validUntil)) {
      data.status = "expired";
    }

    return NextResponse.json({ estimate: { id: docSnap.id, ...data } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch estimate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
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
  const estimateId = resolvedParams.id;

  try {
    const body = await req.json();
    const parsed = EstimateStatusUpdateSchema.parse(body);

    const docRef = db.collection("estimates").doc(estimateId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Estimate quote not found" }, { status: 404 });
    }

    const currentData = docSnap.data();
    if (!await canAccessOwnedResource(req, currentData)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (currentData?.status === "converted_to_booking") {
      return NextResponse.json(
        { error: "Estimate is already converted to an active booking and cannot be changed." },
        { status: 400 }
      );
    }

    const serverNow = FieldValue.serverTimestamp();
    await docRef.update({
      status: parsed.status,
      updatedAt: serverNow,
    });

    return NextResponse.json({
      success: true,
      status: parsed.status,
      message: `Estimate quote ${parsed.status} successfully.`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Failed to update estimate status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
