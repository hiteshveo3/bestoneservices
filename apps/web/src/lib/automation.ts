import type { BookingStatus } from "@/lib/booking";
export type NotificationChannel = "email" | "push";
export type AutomationEvent = "booking-created" | "booking-status-changed" | "review-request" | "marketing-unsubscribed";
export type QueuedMessage = { channel: NotificationChannel; event: AutomationEvent; bookingId?: string; customerId?: string; payload: Record<string, string>; scheduledFor: Date };
export const reviewRequestSchedule = (status: BookingStatus, completedAt: Date) => status === "Completed" ? new Date(completedAt.getTime() + 2 * 60 * 60 * 1000) : null;
export const disabledAutomationAdapter = { async enqueue(message: QueuedMessage) { if (!process.env.EMAIL_PROVIDER && message.channel === "email") return { accepted: false, reason: "EMAIL_DISABLED" as const }; if (!process.env.FCM_ENABLED && message.channel === "push") return { accepted: false, reason: "PUSH_DISABLED" as const }; return { accepted: false, reason: "PROVIDER_PENDING" as const }; } };
export type MarketingPreference = { customerId: string; subscribed: boolean; source: "booking" | "account" | "unsubscribe"; updatedAt: Date; };
