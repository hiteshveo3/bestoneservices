import { describe, it, expect } from "vitest";
import { 
  generateInvoiceReference, 
  calculateInvoiceTotals, 
  resolvePaymentStatus 
} from "./invoice-domain";

describe("Phase 8 Invoicing & Financial Domain Rules", () => {

  describe("generateInvoiceReference", () => {
    it("generates a cryptographically strong invoice reference", () => {
      const ref = generateInvoiceReference();
      expect(ref).toMatch(/^INV-\d{4}-[A-F0-9]{20}$/);
    });
  });

  describe("calculateInvoiceTotals", () => {
    it("calculates 20% VAT, total, and balance due correctly", () => {
      // Subtotal £200 (20000 pence), Deposit Paid £50 (5000 pence)
      const res = calculateInvoiceTotals(20000, 5000, 20);
      expect(res.subtotalPence).toBe(20000);
      expect(res.vatPence).toBe(4000); // 20% of 20000 = 4000 (£40)
      expect(res.totalPence).toBe(24000); // 20000 + 4000 = 24000 (£240)
      expect(res.balanceDuePence).toBe(19000); // 24000 - 5000 = 19000 (£190)
    });

    it("evaluates balance due as zero when fully paid", () => {
      const res = calculateInvoiceTotals(10000, 12000, 20);
      expect(res.balanceDuePence).toBe(0);
    });
  });

  describe("resolvePaymentStatus", () => {
    it("returns unpaid when zero deposit paid", () => {
      expect(resolvePaymentStatus(24000, 0)).toBe("unpaid");
    });

    it("returns partially_paid when partial deposit paid", () => {
      expect(resolvePaymentStatus(24000, 5000)).toBe("partially_paid");
    });

    it("returns paid when full total is paid", () => {
      expect(resolvePaymentStatus(24000, 24000)).toBe("paid");
      expect(resolvePaymentStatus(24000, 25000)).toBe("paid");
    });
  });

});
