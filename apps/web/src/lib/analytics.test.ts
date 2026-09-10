import { describe, it, expect } from "vitest";
import { calculateAnalyticsSummary, generateCsvExport } from "./analytics-engine";
import type { BookingItem } from "@/types/booking";
import type { InvoiceItem } from "@/types/invoice";

describe("Phase 11 Executive BI Analytics & CSV Export Domain Rules", () => {

  describe("calculateAnalyticsSummary", () => {
    it("calculates gross invoiced, net collected, and receivables accurately", () => {
      const mockInvoices = [
        { totalPence: 20000, depositPaidPence: 5000, balanceDuePence: 15000 },
        { totalPence: 10000, depositPaidPence: 10000, balanceDuePence: 0 },
      ] as unknown as InvoiceItem[];

      const summary = calculateAnalyticsSummary([], mockInvoices, [], []);
      expect(summary.grossInvoicedPence).toBe(30000); // £300
      expect(summary.netCollectedPence).toBe(15000); // £150
      expect(summary.outstandingReceivablesPence).toBe(15000); // £150
    });
  });

  describe("generateCsvExport", () => {
    it("generates formatted CSV header and row content for bookings", () => {
      const mockBookings = [
        {
          reference: "BOS-2026-10001",
          customerSnapshot: { fullName: "Alice Smith", email: "alice@example.com" },
          categoryId: "cleaning",
          serviceNameSnapshot: "End of Tenancy Cleaning",
          status: "confirmed",
          scheduling: { requestedDate: "2026-08-20" },
        },
      ] as unknown as BookingItem[];

      const csv = generateCsvExport("bookings", mockBookings);
      expect(csv).toContain("Reference,Customer Name,Customer Email");
      expect(csv).toContain("BOS-2026-10001,\"Alice Smith\",alice@example.com");
    });

    it("generates formatted CSV for invoices", () => {
      const mockInvoices = [
        {
          reference: "INV-2026-90001",
          bookingReference: "BOS-2026-10001",
          customerName: "Bob Miller",
          totalPence: 24000,
          depositPaidPence: 6000,
          balanceDuePence: 18000,
          paymentStatus: "partially_paid",
        },
      ] as unknown as InvoiceItem[];

      const csv = generateCsvExport("invoices", mockInvoices);
      expect(csv).toContain("Invoice Ref,Booking Ref,Customer Name");
      expect(csv).toContain("INV-2026-90001,BOS-2026-10001,\"Bob Miller\",240.00,60.00,180.00,partially_paid");
    });
  });

});
