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
    heading: "End of tenancy cleaning for a smoother handover.",
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
      question: "How is the cleaning price discussed?",
      answer:
        "The property type, bedroom count, condition, furniture status and requested work help shape the quote. Share these details so the scope and price can be discussed for the actual home.",
    },
    {
      question: "Is oven cleaning included?",
      answer:
        "Mention oven cleaning in your enquiry. Its availability, scope and any separate cost should be confirmed as part of the property-specific quote before work is arranged.",
    },
    {
      question: "Can I request carpet or upholstery cleaning?",
      answer:
        "Yes, you can mention carpets, stains or upholstery when describing the property. The required method, availability and price should be confirmed separately because materials and condition can vary.",
    },
    {
      question: "Can furnished and unfurnished properties be considered?",
      answer:
        "Both can be described in an enquiry. Furniture can affect access and the cleaning scope, so tell us whether the property is furnished, partly furnished or empty.",
    },
    {
      question: "What if keys need to be collected or access is restricted?",
      answer:
        "Add the access, parking or key information to the enquiry. Any collection or entry arrangement must be discussed and confirmed before the service is arranged.",
    },
    {
      question: "How long will the cleaning take?",
      answer:
        "Timing depends on the property size, condition, contents and confirmed scope. A duration should only be discussed after the useful property details have been reviewed.",
    },
  ]),
} as const;

export type ServiceFaq = (typeof endOfTenancyContent.faqs)[number];
