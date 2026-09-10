import { randomBytes } from "crypto";
import { type EstimateStatus } from "@/types/estimate";

export function generateEstimateReference(): string {
  return `EST-${new Date().getUTCFullYear()}-${randomBytes(10).toString("hex").toUpperCase()}`;
}

export function isEstimateExpired(validUntil: unknown): boolean {
  if (!validUntil) return false;
  let targetTime = 0;

  if (typeof validUntil === "string") {
    targetTime = new Date(validUntil).getTime();
  } else if (typeof validUntil === "object" && validUntil !== null && "seconds" in validUntil) {
    targetTime = (validUntil as { seconds: number }).seconds * 1000;
  } else if (validUntil instanceof Date) {
    targetTime = validUntil.getTime();
  }

  if (!targetTime || isNaN(targetTime)) return false;
  return Date.now() > targetTime;
}

export function isValidEstimateStatusTransition(from: EstimateStatus, to: EstimateStatus): boolean {
  if (from === to) return true;
  if (from === "converted_to_booking") return false; // Converted estimates are permanently locked

  if (from === "draft" && (to === "sent" || to === "declined")) return true;
  if (from === "sent" && (to === "accepted" || to === "declined" || to === "expired")) return true;
  if (from === "accepted" && (to === "converted_to_booking" || to === "declined")) return true;

  return false;
}
