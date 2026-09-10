import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateStaffId } from "@/lib/dispatch-domain";
import { requireRole } from "@/lib/roles";

const StaffCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone number is required"),
  role: z.enum(["lead_cleaner", "pest_technician", "gardener", "mover_driver"]),
  assignedCategory: z.enum(["cleaning", "pest", "gardening", "removals"]),
  dailyCapacityCount: z.number().min(1).max(10).default(3),
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
    const snap = await db.collection("staff").orderBy("updatedAt", "desc").get();
    const staff = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ staff });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch staff roster";
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
    const parsed = StaffCreateSchema.parse(body);

    const staffId = generateStaffId();
    const serverNow = FieldValue.serverTimestamp();

    const staffData = {
      id: staffId,
      name: parsed.name,
      email: parsed.email.toLowerCase().trim(),
      phone: parsed.phone,
      role: parsed.role,
      assignedCategory: parsed.assignedCategory,
      status: "active",
      dailyCapacityCount: parsed.dailyCapacityCount,
      createdAt: serverNow,
      updatedAt: serverNow,
    };

    await db.collection("staff").doc(staffId).set(staffData);

    return NextResponse.json({
      success: true,
      staff: staffData,
      message: `Staff member ${parsed.name} (${staffId}) registered successfully.`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Staff creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
