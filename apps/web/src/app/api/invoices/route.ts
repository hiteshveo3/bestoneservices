import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateInvoiceReference, calculateInvoiceTotals } from "@/lib/invoice-domain";
import { requireRole } from "@/lib/roles";

const InvoiceCreateSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  bookingReference: z.string().min(1, "Booking reference is required"),
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),
  customerId: z.string().optional(),

  subtotalPounds: z.number().min(0),
  depositPaidPounds: z.number().min(0).default(0),
  vatPercentage: z.number().min(0).max(100).default(20),

  lineItems: z.array(z.object({
    id: z.string(),
    description: z.string(),
    quantity: z.number().min(1),
    unitPricePounds: z.number().min(0),
  })).default([]),
});

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
    const parsed = InvoiceCreateSchema.parse(body);

    const reference = generateInvoiceReference();
    const accessToken = randomBytes(32).toString("base64url");
    const serverNow = FieldValue.serverTimestamp();

    const subtotalPence = Math.round(parsed.subtotalPounds * 100);
    const depositPaidPence = Math.round(parsed.depositPaidPounds * 100);

    const totals = calculateInvoiceTotals(subtotalPence, depositPaidPence, parsed.vatPercentage);

    const paymentStatus = depositPaidPence >= totals.totalPence
      ? "paid"
      : depositPaidPence > 0
      ? "partially_paid"
      : "unpaid";

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 days payment terms

    const invoiceData = {
      id: reference,
      reference,
      accessToken,
      bookingId: parsed.bookingId,
      bookingReference: parsed.bookingReference,

      ...(parsed.customerId ? { customerId: parsed.customerId } : {}),
      customerName: parsed.customerName,
      customerEmail: parsed.customerEmail.toLowerCase().trim(),
      customerPhone: parsed.customerPhone || null,

      lineItems: parsed.lineItems.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPricePence: Math.round(item.unitPricePounds * 100),
        totalPence: Math.round(item.quantity * item.unitPricePounds * 100),
      })),

      subtotalPence: totals.subtotalPence,
      vatPercentage: parsed.vatPercentage,
      vatPence: totals.vatPence,
      totalPence: totals.totalPence,

      depositPaidPence: totals.depositPaidPence,
      balanceDuePence: totals.balanceDuePence,

      paymentStatus,
      issuedAt: serverNow,
      dueDate: dueDate.toISOString(),

      createdAt: serverNow,
      updatedAt: serverNow,
    };

    await db.collection("invoices").doc(reference).create(invoiceData);

    return NextResponse.json({
      success: true,
      invoice: invoiceData,
      shareableUrl: `/invoice/${reference}#token=${encodeURIComponent(accessToken)}`,
      message: `Invoice ${reference} issued successfully for Booking ${parsed.bookingReference}.`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Invoice creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
