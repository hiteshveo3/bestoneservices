import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import { calculateInvoicePaymentUpdate, verifyStripeWebhookSignature } from "./stripe-webhook";

describe("Stripe webhook security helpers", () => {
  const payload = '{"id":"evt_test","type":"checkout.session.completed"}';
  const secret = "whsec_test_secret";
  const timestamp = 1_700_000_000;
  const signature = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");

  it("accepts a valid signed payload within the replay window", () => {
    expect(verifyStripeWebhookSignature(payload, `t=${timestamp},v1=${signature}`, secret, timestamp + 60)).toBe(true);
  });

  it("rejects altered payloads, signatures, and stale events", () => {
    expect(verifyStripeWebhookSignature(`${payload} `, `t=${timestamp},v1=${signature}`, secret, timestamp + 60)).toBe(false);
    expect(verifyStripeWebhookSignature(payload, `t=${timestamp},v1=${"0".repeat(64)}`, secret, timestamp + 60)).toBe(false);
    expect(verifyStripeWebhookSignature(payload, `t=${timestamp},v1=${signature}`, secret, timestamp + 301)).toBe(false);
  });

  it("caps collected payment at the invoice total", () => {
    expect(calculateInvoicePaymentUpdate({ totalPence: 10_000, depositPaidPence: 2_500 }, 7_500)).toEqual({
      depositPaidPence: 10_000,
      balanceDuePence: 0,
      paymentStatus: "paid",
    });
    expect(calculateInvoicePaymentUpdate({ totalPence: 10_000, depositPaidPence: 2_500 }, 1_000)).toEqual({
      depositPaidPence: 3_500,
      balanceDuePence: 6_500,
      paymentStatus: "partially_paid",
    });
  });
});
