import { describe, it, expect } from "vitest";
import { 
  isValidStatusTransition, 
  poundsToPence, 
  penceToPounds, 
  formatPenceToGBP, 
  normalizeUKPostcode 
} from "./booking-domain";

describe("Booking Domain Rules & Money Architecture", () => {
  it("enforces legal unidirectional status transitions", () => {
    expect(isValidStatusTransition("new", "confirmed").isValid).toBe(true);
    expect(isValidStatusTransition("confirmed", "scheduled").isValid).toBe(true);
    expect(isValidStatusTransition("scheduled", "in_progress").isValid).toBe(true);
    expect(isValidStatusTransition("in_progress", "completed").isValid).toBe(true);
  });

  it("blocks illegal status transitions", () => {
    const check = isValidStatusTransition("new", "in_progress");
    expect(check.isValid).toBe(false);
    expect(check.error).toContain("Invalid status transition");
  });

  it("strictly treats completed and cancelled as terminal states", () => {
    const fromCompleted = isValidStatusTransition("completed", "new");
    expect(fromCompleted.isValid).toBe(false);
    expect(fromCompleted.error).toContain("Terminal State");

    const fromCancelled = isValidStatusTransition("cancelled", "confirmed");
    expect(fromCancelled.isValid).toBe(false);
    expect(fromCancelled.error).toContain("Terminal State");
  });

  it("accurately converts money between pounds and minor units (pence)", () => {
    expect(poundsToPence(180)).toBe(18000);
    expect(poundsToPence(130.50)).toBe(13050);
    expect(penceToPounds(13050)).toBe(130.50);
  });

  it("formats minor units into clean GBP currency strings", () => {
    expect(formatPenceToGBP(18000)).toBe("£180.00");
    expect(formatPenceToGBP(13050)).toBe("£130.50");
  });

  it("normalizes UK postcodes correctly", () => {
    expect(normalizeUKPostcode("ig1 1ba")).toBe("IG1 1BA");
    expect(normalizeUKPostcode("e152ab")).toBe("E15 2AB");
    expect(normalizeUKPostcode(" SW1A 1AA ")).toBe("SW1A 1AA");
  });
});
