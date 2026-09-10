import { describe, it, expect } from "vitest";
import type { ReviewItem } from "@/types/review";
import { 
  generateReviewId, 
  generateDisputeId, 
  isReCleanGuaranteeEligible, 
  calculateAverageRating 
} from "./review-domain";

describe("Phase 9 Reviews, Ratings & 48-Hour Guarantee Domain Rules", () => {

  describe("generateReviewId & generateDisputeId", () => {
    it("generates a cryptographically strong review ID", () => {
      const id = generateReviewId();
      expect(id).toMatch(/^REV-\d{4}-[A-F0-9]{20}$/);
    });

    it("generates a cryptographically strong dispute ID", () => {
      const id = generateDisputeId();
      expect(id).toMatch(/^DSP-\d{4}-[A-F0-9]{20}$/);
    });
  });

  describe("isReCleanGuaranteeEligible", () => {
    it("returns true when booking completion was within 48 hours", () => {
      const recentCompletion = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago
      expect(isReCleanGuaranteeEligible(recentCompletion)).toBe(true);
    });

    it("returns false when booking completion was over 48 hours ago", () => {
      const oldCompletion = new Date(Date.now() - 72 * 60 * 60 * 1000); // 72h ago
      expect(isReCleanGuaranteeEligible(oldCompletion)).toBe(false);
    });
  });

  describe("calculateAverageRating", () => {
    it("calculates average star rating rounded to 1 decimal place", () => {
      const mockReviews = [
        { id: "1", rating: 5 },
        { id: "2", rating: 4 },
        { id: "3", rating: 5 },
      ] as unknown as ReviewItem[];
      expect(calculateAverageRating(mockReviews)).toBe(4.7);
    });

    it("defaults to 5.0 when reviews array is empty", () => {
      expect(calculateAverageRating([])).toBe(5.0);
    });
  });

});
