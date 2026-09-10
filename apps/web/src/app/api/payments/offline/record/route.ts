import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { resolvePaymentStatus } from "@/lib/invoice-domain";
import { requireRole } from "@/lib/roles";

const OfflinePaymentRecordSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  paymentAmountPounds: z.number().min(0.01, "Payment amount must be greater than zero"),
  paymentMethod: z.enum(["bank_transfer", "cash_on_completion", "card_terminal"]),
  notes: z.string().optional(),
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
    const parsed = OfflinePaymentRecordSchema.parse(body);

    const invoiceRef = db.collection("invoices").doc(parsed.invoiceId);
    const invoiceSnap = await invoiceRef.get();

    if (!invoiceSnap.exists) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const invData = invoiceSnap.data();
    if (!invData) {
      return NextResponse.json({ error: "Empty invoice data" }, { status: 404 });
    }

    const additionalPaidPence = Math.round(parsed.paymentAmountPounds * 100);
    const newDepositPaidPence = (invData.depositPaidPence || 0) + additionalPaidPence;
    const totalPence = invData.totalPence || 0;

    const newBalanceDuePence = Math.max(totalPence - newDepositPaidPence, 0);
    const newPaymentStatus = resolvePaymentStatus(totalPence, newDepositPaidPence);

    const serverNow = FieldValue.serverTimestamp();

    const batch = db.batch();
    batch.update(invoiceRef, {
      depositPaidPence: newDepositPaidPence,
      balanceDuePence: newBalanceDuePence,
      paymentStatus: newPaymentStatus,
      paymentMethod: parsed.paymentMethod,
      ...(newPaymentStatus === "paid" ? { paidAt: serverNow } : {}),
      updatedAt: serverNow,
    });

    // Write Timeline Event to Booking if present
    if (invData.bookingId) {
      const bookingRef = db.collection("bookings").doc(invData.bookingId);
      const eventRef = bookingRef.collection("events").doc();
      batch.set(eventRef, {
        id: eventRef.id,
        bookingId: invData.bookingId,
        type: "updated",
        title: `Offline Payment Logged (£${parsed.paymentAmountPounds.toFixed(2)})`,
        description: `Logged £${parsed.paymentAmountPounds.toFixed(2)} payment via ${parsed.paymentMethod.replace(/_/g, " ").toUpperCase()}. New status: ${newPaymentStatus.toUpperCase()}`,
        actorType: "admin",
        actorId: adminUser.uid,
        visibility: "customer",
        createdAt: serverNow,
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      invoiceId: parsed.invoiceId,
      depositPaidPence: newDepositPaidPence,
      balanceDuePence: newBalanceDuePence,
      paymentStatus: newPaymentStatus,
      message: `Offline payment of £${parsed.paymentAmountPounds.toFixed(2)} recorded successfully. Invoice status: ${newPaymentStatus.toUpperCase()}`,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Payment recording failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
