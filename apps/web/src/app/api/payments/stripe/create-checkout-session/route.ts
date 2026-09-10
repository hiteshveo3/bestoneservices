import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { absoluteUrl } from "@/config/site";
import { canAccessOwnedResource } from "@/lib/roles";

const StripeCheckoutSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  payType: z.enum(["deposit", "full_balance"]),
});

export async function POST(req: Request) {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const parsed = StripeCheckoutSchema.parse(body);

    const docRef = db.collection("invoices").doc(parsed.invoiceId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const inv = docSnap.data();
    if (!inv) {
      return NextResponse.json({ error: "Empty invoice data" }, { status: 404 });
    }
    if (!await canAccessOwnedResource(req, inv)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (inv.paymentStatus === "paid" || Number(inv.balanceDuePence) <= 0) {
      return NextResponse.json({ error: "Invoice is already paid" }, { status: 409 });
    }

    const amountPence = parsed.payType === "deposit"
      ? Math.round(inv.totalPence * 0.25)
      : inv.balanceDuePence || inv.totalPence;
    if (!Number.isSafeInteger(amountPence) || amountPence <= 0) {
      return NextResponse.json({ error: "Invoice has no payable balance" }, { status: 409 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json({
        success: false,
        requiresStripeKeys: true,
        amountPence,
        message: "Stripe Secret Key not configured in .env.local. Please add STRIPE_SECRET_KEY to enable live card payments.",
      }, { status: 503 });
    }

    // Direct Stripe API call via HTTP POST to prevent missing type declaration errors
    const params = new URLSearchParams();
    params.append("payment_method_types[0]", "card");
    params.append("mode", "payment");
    const tokenFragment = typeof inv.accessToken === "string"
      ? `#token=${encodeURIComponent(inv.accessToken)}`
      : "";
    params.append("success_url", absoluteUrl(`/invoice/${inv.reference}?payment=success${tokenFragment}`));
    params.append("cancel_url", absoluteUrl(`/invoice/${inv.reference}?payment=cancelled${tokenFragment}`));
    params.append("line_items[0][price_data][currency]", "gbp");
    params.append("line_items[0][price_data][product_data][name]", `Invoice ${inv.reference} (${parsed.payType === "deposit" ? "25% Deposit" : "Full Balance"})`);
    params.append("line_items[0][price_data][product_data][description]", `Payment for ${inv.customerName} • Booking ${inv.bookingReference}`);
    params.append("line_items[0][price_data][unit_amount]", String(amountPence));
    params.append("line_items[0][quantity]", "1");
    params.append("metadata[invoiceId]", parsed.invoiceId);
    params.append("metadata[payType]", parsed.payType);

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const sessionData = await stripeRes.json();
    if (!stripeRes.ok) {
      return NextResponse.json({ error: sessionData.error?.message || "Stripe API Error" }, { status: 400 });
    }

    if (typeof sessionData.id !== "string") {
      return NextResponse.json({ error: "Stripe did not return a checkout session" }, { status: 502 });
    }

    const serverNow = FieldValue.serverTimestamp();
    await db.collection("paymentAttempts").doc(sessionData.id).create({
      sessionId: sessionData.id,
      invoiceId: parsed.invoiceId,
      amountPence,
      payType: parsed.payType,
      status: "created",
      createdAt: serverNow,
    });
    await docRef.update({
      stripeCheckoutSessionId: sessionData.id,
      updatedAt: serverNow,
    });

    return NextResponse.json({
      success: true,
      url: sessionData.url,
      sessionId: sessionData.id,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Failed to create Stripe Checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
