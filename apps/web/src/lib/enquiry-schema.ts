import { z } from "zod";

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .optional()
    .transform((value) => value || undefined);

export const enquirySchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(100),
    email: z.string().trim().email("Enter a valid email address.").max(254),
    phone: optionalText(30),
    service: z.enum(["end-of-tenancy-cleaning", "pest-control"], {
      error: "Choose the service you need.",
    }),
    propertyType: z.enum(
      ["flat", "house", "shared-accommodation", "commercial", "other"],
      { error: "Choose the property type." },
    ),
    bedrooms: optionalText(20),
    furnitureStatus: z
      .enum(["furnished", "unfurnished", "partly-furnished", "unknown"])
      .optional(),
    pestType: optionalText(80),
    postcode: z.string().trim().min(2, "Enter the postcode or area.").max(20),
    preferredDate: optionalText(10).refine(
      (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
      "Enter a valid preferred date.",
    ),
    message: optionalText(1500),
    privacyConsent: z.literal(true, {
      error: "Confirm that we may use these details to respond to your enquiry.",
    }),
    sourcePath: z.string().trim().startsWith("/").max(300).default("/booking/"),
    website: z.string().max(0, "Unable to submit this enquiry.").default(""),
  })
  .superRefine((data, context) => {
    if (data.service === "end-of-tenancy-cleaning" && !data.bedrooms) {
      context.addIssue({
        code: "custom",
        path: ["bedrooms"],
        message: "Choose the bedroom count for a cleaning enquiry.",
      });
    }
    if (data.service === "end-of-tenancy-cleaning" && !data.furnitureStatus) {
      context.addIssue({
        code: "custom",
        path: ["furnitureStatus"],
        message: "Choose the furniture status for a cleaning enquiry.",
      });
    }
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;
