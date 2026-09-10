import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_TOLERANCE_SECONDS = 5 * 60;

function signatureMatches(expected: string, supplied: string): boolean {
  const expectedBuffer = Buffer.from(expected, "hex");
  const suppliedBuffer = Buffer.from(supplied, "hex");
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export function verifyStripeWebhookSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  if (!signatureHeader || !secret) return false;

  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));
  const timestampNumber = Number(timestamp);

  if (!Number.isInteger(timestampNumber) || signatures.length === 0) return false;
  if (Math.abs(nowSeconds - timestampNumber) > DEFAULT_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  return signatures.some((signature) => signatureMatches(expected, signature));
}

export function calculateInvoicePaymentUpdate(invoice: {
  totalPence?: unknown;
  depositPaidPence?: unknown;
}, amountPence: number) {
  const totalPence = Math.max(0, Number(invoice.totalPence) || 0);
  const previouslyPaid = Math.min(totalPence, Math.max(0, Number(invoice.depositPaidPence) || 0));
  const depositPaidPence = Math.min(totalPence, previouslyPaid + amountPence);
  const balanceDuePence = Math.max(0, totalPence - depositPaidPence);

  return {
    depositPaidPence,
    balanceDuePence,
    paymentStatus: balanceDuePence === 0 ? "paid" : depositPaidPence > 0 ? "partially_paid" : "unpaid",
  } as const;
}
