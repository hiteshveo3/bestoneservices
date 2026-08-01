import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const endOfTenancyContent = {
  title: "End of Tenancy Cleaning",
  seoTitle: "End of Tenancy Cleaning | Best One Services",
  description:
    "Professional end of tenancy cleaning for tenants, landlords and letting agents. Tell Best One Services about your property and request a clear quote.",
  hero: {
    eyebrow: "End of tenancy cleaning",
    heading: "Leave the property ready for a smoother handover.",
    summary:
      "A clear, property-led cleaning service for tenants, landlords and letting agents. Tell us about the home, your preferred date and anything that needs extra attention.",
  },
  quickAnswer:
    "End of tenancy cleaning is a detailed property clean commonly requested before keys are returned, new occupants arrive or a letting agent completes a handover. The exact scope depends on the property, its condition and the requirements confirmed with the quote.",
  audiences: [
    ["Tenants", "Prepare a rental property before keys are returned."],
    ["Landlords", "Reset a property before new occupants arrive."],
    ["Letting agents", "Coordinate cleaning around a managed handover."],
    ["Homeowners", "Request cleaning support before or after a move."],
    ["Property managers", "Share clear requirements across rental homes."],
  ],
  scope: [
    ["Kitchen attention", "Worktops, cupboards, sinks, splashbacks and accessible surfaces can be discussed."],
    ["Bathrooms", "Sanitary fittings, tiles, mirrors and accessible surfaces can be reviewed."],
    ["Bedrooms", "Internal surfaces, floors and storage areas can be included in the enquiry."],
    ["Living spaces", "Floors, skirting areas, internal surfaces and shared spaces can be discussed."],
    ["Hallways and access", "Entrances, stairs and landings can be considered as part of the property."],
    ["Specific priorities", "Mention any room, surface or handover concern that may need extra attention."],
  ],
  quoteDetails: [
    "Property type",
    "Bedroom count",
    "Preferred date",
    "Postcode or area",
    "Furniture status",
    "Access notes",
  ],
  process: [
    ["Choose the service", "Confirm that end of tenancy cleaning matches your property situation."],
    ["Share the details", "Provide the property, location, date and useful notes you already know."],
    ["Review the response", "Your enquiry is considered using the submitted details."],
    ["Arrange the next step", "Proceed once the requirements and suitable arrangement are clear."],
  ],
  faqs: faqSchema.array().parse([
    {
      question: "What is end of tenancy cleaning?",
      answer:
        "It is a detailed property-cleaning service commonly requested before a tenant leaves, a landlord prepares for new occupants or an agent arranges a handover. The exact scope depends on the property and confirmed requirements.",
    },
    {
      question: "What information should I provide?",
      answer:
        "Share the property type, bedroom count, postcode or area, preferred date, furniture status and any access or condition details that may affect the service.",
    },
    {
      question: "Is the cleaning scope the same for every property?",
      answer:
        "No. Property size, condition, contents, access and specific priorities can all change the requirements. The final scope should be confirmed before work is arranged.",
    },
    {
      question: "Can landlords and letting agents enquire?",
      answer:
        "Yes. Tenants, landlords, letting agents, property managers and homeowners can submit relevant property details and request a response.",
    },
    {
      question: "Are fixed prices shown on the website?",
      answer:
        "Pricing will only be published once it has been confirmed by the business. Until then, request a property-specific quote using the details of the home and the required work.",
    },
  ]),
} as const;

export type ServiceFaq = (typeof endOfTenancyContent.faqs)[number];
