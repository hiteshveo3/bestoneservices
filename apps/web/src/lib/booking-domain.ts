import { type BookingStatus } from "@/types/booking";

/** Legal Unidirectional Status Transition Matrix */
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  new: ["awaiting_confirmation", "confirmed", "cancelled"],
  awaiting_confirmation: ["confirmed", "cancelled"],
  confirmed: ["scheduled", "cancelled"],
  scheduled: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [], // Strict Terminal State
  cancelled: [], // Strict Terminal State
};

export function isValidStatusTransition(
  from: BookingStatus, 
  to: BookingStatus
): { isValid: boolean; error?: string } {
  if (from === to) return { isValid: true };

  const allowed = ALLOWED_TRANSITIONS[from] || [];
  if (!allowed.includes(to)) {
    return { 
      isValid: false, 
      error: `Invalid status transition from '${from}' to '${to}'. Allowed transitions: ${allowed.length ? allowed.join(", ") : "None (Terminal State)"}` 
    };
  }

  return { isValid: true };
}

/** Customer Reschedule Eligibility Validation */
export function isRescheduleAllowed(status: BookingStatus): { allowed: boolean; reason?: string } {
  const allowedStatuses: BookingStatus[] = ["new", "awaiting_confirmation", "confirmed", "scheduled"];
  if (allowedStatuses.includes(status)) {
    return { allowed: true };
  }
  if (status === "in_progress") {
    return { allowed: false, reason: "Cannot reschedule an appointment that is currently in progress." };
  }
  if (status === "completed") {
    return { allowed: false, reason: "Cannot reschedule a completed booking." };
  }
  if (status === "cancelled") {
    return { allowed: false, reason: "Cannot reschedule a cancelled booking." };
  }
  return { allowed: false, reason: "Reschedule request not permitted for current booking status." };
}

/** Customer Cancellation Eligibility Validation */
export function isCancellationAllowed(status: BookingStatus): { allowed: boolean; reason?: string } {
  if (status === "completed") {
    return { allowed: false, reason: "Cannot cancel a completed service booking." };
  }
  if (status === "cancelled") {
    return { allowed: false, reason: "Booking is already cancelled." };
  }
  return { allowed: true };
}

/** Monetary Minor Unit Helpers (Pence) */
export function poundsToPence(pounds: number): number {
  return Math.round(pounds * 100);
}

export function penceToPounds(pence: number): number {
  return pence / 100;
}

export function formatPenceToGBP(pence: number): string {
  const pounds = pence / 100;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pounds);
}

/** UK Postcode Normalization */
export function normalizeUKPostcode(rawPostcode: string): string {
  if (!rawPostcode) return "";
  const cleaned = rawPostcode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cleaned.length < 5) return cleaned;
  
  // UK outcode is everything except the last 3 chars
  const outcode = cleaned.slice(0, -3);
  const incode = cleaned.slice(-3);
  return `${outcode} ${incode}`;
}
