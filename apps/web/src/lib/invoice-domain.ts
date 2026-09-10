import { randomBytes } from "crypto";
import { type InvoicePaymentStatus } from "@/types/invoice";

export function generateInvoiceReference(): string {
  return `INV-${new Date().getUTCFullYear()}-${randomBytes(10).toString("hex").toUpperCase()}`;
}

export function calculateInvoiceTotals(
  subtotalPence: number,
  depositPaidPence: number = 0,
  vatPercentage: number = 20
): {
  subtotalPence: number;
  vatPence: number;
  totalPence: number;
  depositPaidPence: number;
  balanceDuePence: number;
} {
  const vatPence = Math.round((subtotalPence * vatPercentage) / 100);
  const totalPence = subtotalPence + vatPence;
  const balanceDuePence = Math.max(totalPence - depositPaidPence, 0);

  return {
    subtotalPence,
    vatPence,
    totalPence,
    depositPaidPence,
    balanceDuePence,
  };
}

export function resolvePaymentStatus(
  totalPence: number,
  depositPaidPence: number
): InvoicePaymentStatus {
  if (depositPaidPence >= totalPence && totalPence > 0) {
    return "paid";
  }
  if (depositPaidPence > 0 && depositPaidPence < totalPence) {
    return "partially_paid";
  }
  return "unpaid";
}
