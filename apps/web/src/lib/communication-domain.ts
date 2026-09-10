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
      return `Best One Services: Your appointment ${bookingReference} has been confirmed. Thank you for choosing us!`;
    case "reminder_24h":
      return `Best One Services Reminder: Your scheduled appointment ${bookingReference} is tomorrow. Please ensure property access.`;
    case "staff_dispatched":
      return `Best One Services: Our field technician team is en route for appointment ${bookingReference}.`;
    case "invoice_issued":
      return `Best One Services: Tax Invoice for appointment ${bookingReference} is ready for payment.`;
    case "re_clean_approved":
      return `Best One Services: Your 48-Hour Re-Clean Guarantee claim for ${bookingReference} has been approved & dispatched.`;
    default:
      return `Best One Services Notification for Booking ${bookingReference}`;
  }
}
