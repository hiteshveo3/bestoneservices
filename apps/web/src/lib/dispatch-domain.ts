import { randomBytes } from "crypto";
import { type DispatchStatus } from "@/types/staff";

export function generateStaffId(): string {
  return `STF-${randomBytes(6).toString("hex").toUpperCase()}`;
}

export function isStaffCategoryMatch(
  staffCategory: "cleaning" | "pest" | "gardening" | "removals",
  bookingCategory: "cleaning" | "pest" | "gardening" | "removals"
): boolean {
  return staffCategory === bookingCategory;
}

export function isStaffCapacityExceeded(
  currentJobsAssigned: number,
  dailyCapacityCount: number = 3
): boolean {
  return currentJobsAssigned >= dailyCapacityCount;
}

export function isValidDispatchStatusTransition(
  from: DispatchStatus | "unassigned",
  to: DispatchStatus
): boolean {
  if (from === to) return true;
  if (from === "unassigned" && (to === "assigned" || to === "dispatched")) return true;
  if (from === "assigned" && (to === "dispatched" || to === "on_site" || to === "unassigned")) return true;
  if (from === "dispatched" && (to === "on_site" || to === "completed")) return true;
  if (from === "on_site" && to === "completed") return true;
  return false;
}
