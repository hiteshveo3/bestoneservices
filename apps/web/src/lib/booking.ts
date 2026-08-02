import { z } from "zod";

export const bookingStatuses = ["New", "Confirmed", "Assigned", "On the Way", "In Progress", "Completed", "Cancelled", "Reschedule Requested"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

export const bookingSchema = z.object({
  idempotencyKey: z.string().uuid(),
  serviceCategory: z.enum(["pest-control", "end-of-tenancy-cleaning"]),
  serviceSlug: z.string().min(2).max(80),
  propertyType: z.string().min(2).max(80),
  bedrooms: z.string().max(20).optional(),
  pestSigns: z.string().max(1200).optional(),
  addressLine1: z.string().min(4).max(160),
  addressLine2: z.string().max(160).optional(),
  city: z.string().min(2).max(80),
  postcode: z.string().min(3).max(12),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z.enum(["morning", "afternoon", "evening", "flexible"]),
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(254),
  notes: z.string().max(1500).optional(),
  termsVersion: z.literal("m2-draft-1"),
  privacyVersion: z.literal("m2-draft-1"),
  termsAccepted: z.literal(true),
  privacyAccepted: z.literal(true),
  marketingConsent: z.boolean().default(false),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const startingPrice = (input: Pick<BookingInput, "serviceCategory" | "serviceSlug" | "bedrooms">) => {
  if (input.serviceCategory === "end-of-tenancy-cleaning") return ({ studio: 79, "1": 99, "2": 119, "3": 139, "4": 159 } as Record<string, number>)[input.bedrooms ?? ""] ?? null;
  return ({ "wasp-treatment": 59, "ant-treatment": 69, "flea-treatment": 89, "mice-control": 99, "rat-control": 109, "cockroach-control": 119, "bed-bug-treatment": 149 } as Record<string, number>)[input.serviceSlug] ?? null;
};
