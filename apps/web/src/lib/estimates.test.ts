import { describe, it, expect } from "vitest";
import { 
  generateEstimateReference, 
  isEstimateExpired, 
  isValidEstimateStatusTransition 
} from "./estimate-domain";

describe("Phase 6 Estimate & State Handoff Domain Rules", () => {

  describe("generateEstimateReference", () => {
    it("generates a cryptographically strong estimate reference", () => {
      const ref = generateEstimateReference();
      expect(ref).toMatch(/^EST-\d{4}-[A-F0-9]{20}$/);
    });

    it("generates unique references across calls", () => {
      const ref1 = generateEstimateReference();
      const ref2 = generateEstimateReference();
      expect(ref1).not.toBe(ref2);
    });
  });

  describe("isEstimateExpired", () => {
    it("returns false for future validity dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      expect(isEstimateExpired(futureDate.toISOString())).toBe(false);
    });

    it("returns true for past validity dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isEstimateExpired(pastDate.toISOString())).toBe(true);
    });
  });

  describe("isValidEstimateStatusTransition", () => {
    it("allows valid forward estimate transitions", () => {
      expect(isValidEstimateStatusTransition("draft", "sent")).toBe(true);
      expect(isValidEstimateStatusTransition("sent", "accepted")).toBe(true);
      expect(isValidEstimateStatusTransition("accepted", "converted_to_booking")).toBe(true);
    });

    it("locks converted_to_booking state from further mutations", () => {
      expect(isValidEstimateStatusTransition("converted_to_booking", "draft")).toBe(false);
      expect(isValidEstimateStatusTransition("converted_to_booking", "sent")).toBe(false);
      expect(isValidEstimateStatusTransition("converted_to_booking", "accepted")).toBe(false);
      expect(isValidEstimateStatusTransition("converted_to_booking", "declined")).toBe(false);
    });
  });

});
