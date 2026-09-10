import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireRole } from "@/lib/roles";

const GlobalPricingRulesSchema = z.object({
  weekendMultiplier: z.number().min(1, "Weekend multiplier must be at least 1.0"),
  nightEmergencySurchargePounds: z.number().min(0),
  minimumDomesticChargePounds: z.number().min(0),
  vatRatePercentage: z.number().min(0).max(100),
});

export async function GET(req: Request) {
  let db;
  const adminUser = await requireRole(req, "admin");
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized: Admin auth required" }, { status: 401 });
  }

  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  try {
    const docRef = db.collection("config").doc("pricing_engine");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({
        rules: {
          id: "pricing_engine",
          weekendMultiplier: 1.15,
          nightEmergencySurchargePence: 5000,
          minimumDomesticChargePence: 6000,
          vatRatePercentage: 20,
        },
      });
    }

    return NextResponse.json({ rules: { id: docSnap.id, ...docSnap.data() } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch pricing rules";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
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
    const body = await req.json();
    const parsed = GlobalPricingRulesSchema.parse(body);

    const docRef = db.collection("config").doc("pricing_engine");
    const serverNow = FieldValue.serverTimestamp();

    const rulesData = {
      weekendMultiplier: parsed.weekendMultiplier,
      nightEmergencySurchargePence: Math.round(parsed.nightEmergencySurchargePounds * 100),
      minimumDomesticChargePence: Math.round(parsed.minimumDomesticChargePounds * 100),
      vatRatePercentage: parsed.vatRatePercentage,
      updatedAt: serverNow,
      updatedByUid: adminUser.uid,
    };

    await docRef.set(rulesData, { merge: true });

    return NextResponse.json({
      success: true,
      rules: rulesData,
      message: "Global pricing engine surcharge rules updated successfully.",
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Failed to update pricing rules";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
