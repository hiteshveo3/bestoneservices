import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import { calculateInvoicePaymentUpdate, verifyStripeWebhookSignature } from "@/lib/stripe-webhook";

type StripeCheckoutSession = {
  id?: unknown;
  payment_status?: unknown;
  currency?: unknown;
  amount_total?: unknown;
  metadata?: { invoiceId?: unknown } | null;
};

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !isFirebaseConfigured()) {
    return NextResponse.json({ error: "WEBHOOK_UNAVAILABLE" }, { status: 503 });
  }

  const payload = await request.text();
  if (!verifyStripeWebhookSignature(payload, request.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  let event: { id?: unknown; type?: unknown; data?: { object?: StripeCheckoutSession } };
  try {
    event = JSON.parse(payload) as typeof event;
  } catch {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data?.object;
  const eventId = typeof event.id === "string" ? event.id : null;
  const sessionId = typeof session?.id === "string" ? session.id : null;
  const invoiceId = typeof session?.metadata?.invoiceId === "string" ? session.metadata.invoiceId : null;
  const amountPence = Number(session?.amount_total);
  if (
    !eventId || !sessionId || !invoiceId || !Number.isSafeInteger(amountPence) || amountPence <= 0 ||
    session?.payment_status !== "paid" || session?.currency !== "gbp"
  ) {
    return NextResponse.json({ error: "INVALID_CHECKOUT_SESSION" }, { status: 400 });
  }

  try {
    const db = getFirebaseDb();
    const result = await db.runTransaction(async (tx) => {
      const eventRef = db.collection("stripeEvents").doc(eventId);
      const attemptRef = db.collection("paymentAttempts").doc(sessionId);
      const eventSnapshot = await tx.get(eventRef);
      if (eventSnapshot.exists) return "duplicate" as const;

      const attemptSnapshot = await tx.get(attemptRef);
      const attempt = attemptSnapshot.data();
      if (!attemptSnapshot.exists || attempt?.invoiceId !== invoiceId || attempt?.amountPence !== amountPence) {
        throw new Error("UNKNOWN_PAYMENT_ATTEMPT");
      }

      const invoiceRef = db.collection("invoices").doc(invoiceId);
      const invoiceSnapshot = await tx.get(invoiceRef);
      if (!invoiceSnapshot.exists) throw new Error("INVOICE_NOT_FOUND");

      const payment = calculateInvoicePaymentUpdate(invoiceSnapshot.data() || {}, amountPence);
      const serverNow = FieldValue.serverTimestamp();
      tx.update(invoiceRef, {
        ...payment,
        paymentMethod: "stripe",
        stripeCheckoutSessionId: sessionId,
        paidAt: payment.paymentStatus === "paid" ? serverNow : null,
        updatedAt: serverNow,
      });
      tx.update(attemptRef, { status: "completed", eventId, completedAt: serverNow });
      tx.create(eventRef, { eventId, sessionId, invoiceId, processedAt: serverNow });
      return "processed" as const;
    });

    return NextResponse.json({ received: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "WEBHOOK_PROCESSING_FAILED";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
