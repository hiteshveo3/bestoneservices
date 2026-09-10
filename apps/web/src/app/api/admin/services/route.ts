import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireRole } from "@/lib/roles";

const ServiceCreateSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters"),
  categoryId: z.enum(["cleaning", "pest", "gardening", "removals"]),
  shortDescription: z.string().min(5, "Short description is required"),
  badgeLabel: z.string().optional(),
  pricingType: z.enum(["flat_rate", "property_size_matrix", "hourly", "package_tiers"]),
  basePricePounds: z.number().min(0, "Base price cannot be negative"),
  
  propertySizeMatrix: z.object({
    studioPounds: z.number().min(0),
    oneBedPounds: z.number().min(0),
    twoBedPounds: z.number().min(0),
    threeBedPounds: z.number().min(0),
    fourBedPounds: z.number().min(0),
    fiveBedPlusPounds: z.number().optional(),
  }).optional(),

  hourlyRatePounds: z.number().optional(),
  minHours: z.number().optional(),
  
  features: z.array(z.string()).default([]),
  factorsAffectingPrice: z.array(z.string()).default([]),
  guaranteeText: z.string().optional(),
  minBookingChargePounds: z.number().optional(),
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
    const snap = await db.collection("services").orderBy("updatedAt", "desc").get();
    const services = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ services });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch services";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    const parsed = ServiceCreateSchema.parse(body);

    const slug = parsed.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const docId = `${parsed.categoryId}_${slug}`;
    const serverNow = FieldValue.serverTimestamp();

    const serviceData = {
      id: docId,
      name: parsed.name,
      slug,
      categoryId: parsed.categoryId,
      shortDescription: parsed.shortDescription,
      badgeLabel: parsed.badgeLabel || null,
      status: "draft", // Always created in draft state
      pricingType: parsed.pricingType,
      basePricePence: Math.round(parsed.basePricePounds * 100),

      ...(parsed.propertySizeMatrix ? {
        propertySizeMatrix: {
          studioPence: Math.round(parsed.propertySizeMatrix.studioPounds * 100),
          oneBedPence: Math.round(parsed.propertySizeMatrix.oneBedPounds * 100),
          twoBedPence: Math.round(parsed.propertySizeMatrix.twoBedPounds * 100),
          threeBedPence: Math.round(parsed.propertySizeMatrix.threeBedPounds * 100),
          fourBedPence: Math.round(parsed.propertySizeMatrix.fourBedPounds * 100),
          ...(parsed.propertySizeMatrix.fiveBedPlusPounds !== undefined ? {
            fiveBedPlusPence: Math.round(parsed.propertySizeMatrix.fiveBedPlusPounds * 100),
          } : {}),
        }
      } : {}),

      ...(parsed.hourlyRatePounds ? { hourlyRatePence: Math.round(parsed.hourlyRatePounds * 100) } : {}),
      ...(parsed.minHours ? { minHours: parsed.minHours } : {}),
      ...(parsed.minBookingChargePounds ? { minBookingChargePence: Math.round(parsed.minBookingChargePounds * 100) } : {}),

      features: parsed.features,
      factorsAffectingPrice: parsed.factorsAffectingPrice,
      guaranteeText: parsed.guaranteeText || null,
      addOns: [],

      version: 1,
      createdAt: serverNow,
      updatedAt: serverNow,
    };

    await db.collection("services").doc(docId).set(serviceData);

    return NextResponse.json({
      success: true,
      service: serviceData,
      message: `Draft service package '${parsed.name}' created successfully.`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Service creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
