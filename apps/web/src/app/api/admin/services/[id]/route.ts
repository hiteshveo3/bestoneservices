import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireRole } from "@/lib/roles";

const ServiceAddOnSchema = z.object({
  id: z.string(),
  name: z.string(),
  pricePounds: z.number().min(0),
  description: z.string().optional(),
});

const ServiceUpdateDetailsSchema = z.object({
  action: z.literal("update_details"),
  name: z.string().optional(),
  shortDescription: z.string().optional(),
  badgeLabel: z.string().optional(),
  basePricePounds: z.number().min(0).optional(),
  
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
  
  features: z.array(z.string()).optional(),
  factorsAffectingPrice: z.array(z.string()).optional(),
  guaranteeText: z.string().optional(),
  addOns: z.array(ServiceAddOnSchema).optional(),
});

const ServiceStatusChangeSchema = z.object({
  action: z.enum(["publish", "unpublish", "archive"]),
});

const ServicePatchSchema = z.discriminatedUnion("action", [
  ServiceUpdateDetailsSchema,
  ServiceStatusChangeSchema,
]);

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

  const adminUser = await requireRole(req, "admin");
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized: Admin auth required" }, { status: 401 });
  }

  const resolvedParams = await params;
  const serviceId = resolvedParams.id;

  try {
    const docRef = db.collection("services").doc(serviceId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Service package not found" }, { status: 404 });
    }

    return NextResponse.json({ service: { id: docSnap.id, ...docSnap.data() } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch service detail";
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

  const adminUser = await requireRole(req, "admin");
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized: Admin auth required" }, { status: 401 });
  }

  const resolvedParams = await params;
  const serviceId = resolvedParams.id;

  try {
    const body = await req.json();
    const parsed = ServicePatchSchema.parse(body);

    const docRef = db.collection("services").doc(serviceId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Service package not found" }, { status: 404 });
    }

    const currentData = docSnap.data();
    if (!currentData) {
      return NextResponse.json({ error: "Empty service data" }, { status: 404 });
    }

    const serverNow = FieldValue.serverTimestamp();

    if (parsed.action === "publish") {
      const currentVersion = currentData.version || 1;
      await docRef.update({
        status: "published",
        version: currentVersion + 1,
        updatedAt: serverNow,
      });

      return NextResponse.json({
        success: true,
        message: `Service package published successfully (v${currentVersion + 1}). Live on booking wizard.`,
      });
    }

    if (parsed.action === "unpublish") {
      await docRef.update({
        status: "draft",
        updatedAt: serverNow,
      });

      return NextResponse.json({
        success: true,
        message: "Service package reverted to draft state.",
      });
    }

    if (parsed.action === "archive") {
      await docRef.update({
        status: "archived",
        updatedAt: serverNow,
      });

      return NextResponse.json({
        success: true,
        message: "Service package archived.",
      });
    }

    if (parsed.action === "update_details") {
      const updates: Record<string, unknown> = {
        updatedAt: serverNow,
      };

      if (parsed.name) updates.name = parsed.name;
      if (parsed.shortDescription) updates.shortDescription = parsed.shortDescription;
      if (parsed.badgeLabel !== undefined) updates.badgeLabel = parsed.badgeLabel || null;
      if (parsed.basePricePounds !== undefined) updates.basePricePence = Math.round(parsed.basePricePounds * 100);
      if (parsed.features) updates.features = parsed.features;
      if (parsed.factorsAffectingPrice) updates.factorsAffectingPrice = parsed.factorsAffectingPrice;
      if (parsed.guaranteeText !== undefined) updates.guaranteeText = parsed.guaranteeText || null;

      if (parsed.propertySizeMatrix) {
        updates.propertySizeMatrix = {
          studioPence: Math.round(parsed.propertySizeMatrix.studioPounds * 100),
          oneBedPence: Math.round(parsed.propertySizeMatrix.oneBedPounds * 100),
          twoBedPence: Math.round(parsed.propertySizeMatrix.twoBedPounds * 100),
          threeBedPence: Math.round(parsed.propertySizeMatrix.threeBedPounds * 100),
          fourBedPence: Math.round(parsed.propertySizeMatrix.fourBedPounds * 100),
          ...(parsed.propertySizeMatrix.fiveBedPlusPounds !== undefined ? {
            fiveBedPlusPence: Math.round(parsed.propertySizeMatrix.fiveBedPlusPounds * 100),
          } : {}),
        };
      }

      if (parsed.hourlyRatePounds !== undefined) updates.hourlyRatePence = Math.round(parsed.hourlyRatePounds * 100);
      if (parsed.minHours !== undefined) updates.minHours = parsed.minHours;

      if (parsed.addOns) {
        updates.addOns = parsed.addOns.map((item) => ({
          id: item.id,
          name: item.name,
          pricePence: Math.round(item.pricePounds * 100),
          description: item.description || null,
        }));
      }

      await docRef.update(updates);

      return NextResponse.json({
        success: true,
        message: "Service package specifications updated successfully.",
      });
    }

    return NextResponse.json({ error: "Unhandled action" }, { status: 400 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Service update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
