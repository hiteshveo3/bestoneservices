import { describe, it, expect } from "vitest";
import { 
  generateStaffId, 
  isStaffCategoryMatch, 
  isStaffCapacityExceeded, 
  isValidDispatchStatusTransition 
} from "./dispatch-domain";

describe("Phase 7 Dispatch & Staff Domain Rules", () => {

  describe("generateStaffId", () => {
    it("generates a cryptographically strong staff ID", () => {
      const id = generateStaffId();
      expect(id).toMatch(/^STF-[A-F0-9]{12}$/);
    });
  });

  describe("isStaffCategoryMatch", () => {
    it("returns true when staff specialization matches booking category", () => {
      expect(isStaffCategoryMatch("cleaning", "cleaning")).toBe(true);
      expect(isStaffCategoryMatch("pest", "pest")).toBe(true);
    });

    it("returns false when staff category differs from booking category", () => {
      expect(isStaffCategoryMatch("cleaning", "pest")).toBe(false);
      expect(isStaffCategoryMatch("gardening", "removals")).toBe(false);
    });
  });

  describe("isStaffCapacityExceeded", () => {
    it("returns true when assigned jobs meet or exceed daily capacity", () => {
      expect(isStaffCapacityExceeded(3, 3)).toBe(true);
      expect(isStaffCapacityExceeded(4, 3)).toBe(true);
    });

    it("returns false when assigned jobs are below daily capacity", () => {
      expect(isStaffCapacityExceeded(1, 3)).toBe(false);
      expect(isStaffCapacityExceeded(2, 3)).toBe(false);
    });
  });

  describe("isValidDispatchStatusTransition", () => {
    it("validates forward dispatch state machine transitions", () => {
      expect(isValidDispatchStatusTransition("unassigned", "assigned")).toBe(true);
      expect(isValidDispatchStatusTransition("assigned", "dispatched")).toBe(true);
      expect(isValidDispatchStatusTransition("dispatched", "on_site")).toBe(true);
      expect(isValidDispatchStatusTransition("on_site", "completed")).toBe(true);
    });
  });

});
