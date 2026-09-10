import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateEstimateReference } from "@/lib/estimate-domain";
import { requireRole } from "@/lib/roles";

const EstimateCreateSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),
  customerId: z.string().min(1).optional(),
  serviceId: z.string().min(1, "Service ID is required"),
  serviceName: z.string().min(1, "Service name is required"),
  categoryId: z.enum(["cleaning", "pest", "gardening", "removals"]),

  specifications: z.object({
    propertySize: z.string().optional(),
    hoursCount: z.number().optional(),
    selectedTierId: z.string().optional(),
    selectedAddOnNames: z.array(z.string()).optional(),
    isWeekend: z.boolean().optional(),
    isNightEmergency: z.boolean().optional(),
    notes: z.string().optional(),
  }),

  subtotalPounds: z.number().min(0),
  addOnsPounds: z.number().min(0).default(0),
  surchargesPounds: z.number().min(0).default(0),
  totalPounds: z.number().min(0),
  breakdown: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  const authenticatedUser = await requireRole(req, "admin");
  if (!authenticatedUser) {
    return NextResponse.json({ error: "Unauthorized: Admin auth required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = EstimateCreateSchema.parse(body);

    const reference = generateEstimateReference();
    const accessToken = randomBytes(32).toString("base64url");
    const serverNow = FieldValue.serverTimestamp();

    // 14 days expiry window
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 14);

    const estimateData = {
      id: reference,
      reference,
      accessToken,
      ...(parsed.customerId ? { customerId: parsed.customerId } : {}),
      customerName: parsed.customerName,
      customerEmail: parsed.customerEmail.toLowerCase().trim(),
      customerPhone: parsed.customerPhone || null,

      serviceId: parsed.serviceId,
      serviceName: parsed.serviceName,
      categoryId: parsed.categoryId,

      specifications: parsed.specifications,

      subtotalPence: Math.round(parsed.subtotalPounds * 100),
      addOnsPence: Math.round(parsed.addOnsPounds * 100),
      surchargesPence: Math.round(parsed.surchargesPounds * 100),
      totalPence: Math.round(parsed.totalPounds * 100),
      breakdown: parsed.breakdown,

      status: "sent",
      validUntil: validUntilDate.toISOString(),

      createdAt: serverNow,
      updatedAt: serverNow,
    };

    await db.collection("estimates").doc(reference).create(estimateData);

    return NextResponse.json({
      success: true,
      estimate: estimateData,
      shareableUrl: `/quote/${reference}#token=${encodeURIComponent(accessToken)}`,
      message: `Formal estimate ${reference} created successfully. Valid for 14 days.`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Estimate creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
