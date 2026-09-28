import { randomBytes } from "crypto";
import { type TriggerEvent } from "@/types/communication";

export function generateConversationId(): string {
  return `CNV-${new Date().getUTCFullYear()}-${randomBytes(10).toString("hex").toUpperCase()}`;
}

export function generateLogId(): string {
  return `LOG-${new Date().getUTCFullYear()}-${randomBytes(10).toString("hex").toUpperCase()}`;
}

export function formatTriggerMessage(
  event: TriggerEvent,
  bookingReference: string
): string {
  switch (event) {
    case "booking_confirmation":
      return `Bestone Services: Your appointment ${bookingReference} has been confirmed. Thank you for choosing us!`;
    case "reminder_24h":
      return `Bestone Services Reminder: Your scheduled appointment ${bookingReference} is tomorrow. Please ensure property access.`;
    case "staff_dispatched":
      return `Bestone Services: Our field technician team is en route for appointment ${bookingReference}.`;
    case "invoice_issued":
      return `Bestone Services: Tax Invoice for appointment ${bookingReference} is ready for payment.`;
    case "re_clean_approved":
      return `Bestone Services: Your 48-Hour Re-Clean Guarantee claim for ${bookingReference} has been approved & dispatched.`;
    default:
      return `Bestone Services Notification for Booking ${bookingReference}`;
  }
}
