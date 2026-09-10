import { describe, it, expect } from "vitest";
import { isRescheduleAllowed, isCancellationAllowed } from "./booking-domain";
import { type BookingStatus } from "@/types/booking";

describe("Phase 4 Customer Booking Domain Rules", () => {
  describe("isRescheduleAllowed", () => {
    it("allows reschedule for active initial statuses", () => {
      const activeStatuses: BookingStatus[] = ["new", "awaiting_confirmation", "confirmed", "scheduled"];
      activeStatuses.forEach((st) => {
        const result = isRescheduleAllowed(st);
        expect(result.allowed).toBe(true);
      });
    });

    it("disallows reschedule when service is in_progress", () => {
      const result = isRescheduleAllowed("in_progress");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("currently in progress");
    });

    it("disallows reschedule for completed bookings", () => {
      const result = isRescheduleAllowed("completed");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("completed booking");
    });

    it("disallows reschedule for cancelled bookings", () => {
      const result = isRescheduleAllowed("cancelled");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("cancelled booking");
    });
  });

  describe("isCancellationAllowed", () => {
    it("allows cancellation for non-terminal statuses", () => {
      const cancellableStatuses: BookingStatus[] = ["new", "awaiting_confirmation", "confirmed", "scheduled", "in_progress"];
      cancellableStatuses.forEach((st) => {
        const result = isCancellationAllowed(st);
        expect(result.allowed).toBe(true);
      });
    });

    it("disallows cancellation for completed bookings", () => {
      const result = isCancellationAllowed("completed");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("completed service booking");
    });

    it("disallows cancellation for already cancelled bookings", () => {
      const result = isCancellationAllowed("cancelled");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("already cancelled");
    });
  });
});
