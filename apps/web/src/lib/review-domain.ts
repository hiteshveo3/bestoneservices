import { randomBytes } from "crypto";
import { type ReviewItem } from "@/types/review";

export function generateReviewId(): string {
  return `REV-${new Date().getUTCFullYear()}-${randomBytes(10).toString("hex").toUpperCase()}`;
}

export function generateDisputeId(): string {
  return `DSP-${new Date().getUTCFullYear()}-${randomBytes(10).toString("hex").toUpperCase()}`;
}

export function isReCleanGuaranteeEligible(completedAt: unknown): boolean {
  if (!completedAt) return false;
  let timeMs = 0;

  if (typeof completedAt === "string") {
    timeMs = new Date(completedAt).getTime();
  } else if (typeof completedAt === "object" && completedAt !== null && "seconds" in completedAt) {
    timeMs = (completedAt as { seconds: number }).seconds * 1000;
  } else if (completedAt instanceof Date) {
    timeMs = completedAt.getTime();
  }

  if (!timeMs || isNaN(timeMs)) return false;
  const FortyEightHoursMs = 48 * 60 * 60 * 1000;
  return (Date.now() - timeMs) <= FortyEightHoursMs;
}

export function calculateAverageRating(reviews: ReviewItem[]): number {
  if (!reviews || reviews.length === 0) return 5.0;
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
  const avg = sum / reviews.length;
  return Math.round(avg * 10) / 10;
}
