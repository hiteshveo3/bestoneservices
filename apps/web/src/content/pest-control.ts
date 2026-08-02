import { serviceFaqSchema } from "@/content/service-types";

export const pestControlContent = {
  title: "Pest Control",
  seoTitle: "Pest Control Services | Best One Services",
  description:
    "Request pest-control help for a home, rental property or business. Report the signs you have noticed and ask Best One Services for a property-specific quote.",
  hero: {
    eyebrow: "Pest control",
    heading: "Pest control for homes, rentals and businesses.",
    summary:
      "Report rats, mice, bed bugs, cockroaches or another pest concern. Tell us what you have seen, where it is happening and when you need help.",
  },
  quickAnswer:
    "Pest control starts by understanding the pest signs, affected areas and property type. You do not need to diagnose the problem yourself—describe what you have noticed so the most relevant service can be discussed.",
  pests: [
    ["Rat control", "Report sightings, droppings, noise or damage around the property."],
    ["Silverfish treatment", "Describe activity in bathrooms, kitchens, storage areas or damp spaces."],
    ["Spider treatment", "Tell us where spiders or webs are repeatedly appearing around the property."],
    ["Squirrel control", "Report loft noise, entry points or signs of damage."],
    ["Wasp treatment", "Tell us where wasps are active and whether a nest is visible."],
    ["Woodworm treatment", "Describe the affected timber, visible holes, dust or signs of damage."],
    ["Ant treatment", "Identify the rooms, entrances or outdoor areas where activity occurs."],
    ["Mice control", "Describe activity in kitchens, cupboards, walls or storage areas."],
    ["Bed bug treatment", "Mention bites, marks, insects or signs around beds and furniture."],
    ["Carpet beetle treatment", "Share where larvae, shed skins or damage to fabrics have been noticed."],
    ["Cockroach control", "Share where insects have appeared and how often they are seen."],
    ["Flea treatment", "Describe bites, pet areas, carpets and the rooms affected."],
    ["Dead pest removal", "Explain the pest type if known, where it is located and any access details."],
    ["General fogging", "Describe the property, the pest concern and the areas that need attention."],
    ["Moth treatment", "Tell us where moths, larvae or fabric damage have been found."],
  ],
  quoteDetails: [
    "Pest signs",
    "Affected rooms",
    "Property type",
    "Postcode or area",
    "When it started",
    "Preferred date",
  ],
  process: [
    ["Report the problem", "Choose pest control and describe the signs or pest type if known."],
    ["Share the property details", "Add the affected area, postcode, timing and useful access information."],
    ["Discuss the service", "The concern can be reviewed and the relevant quote or visit discussed."],
  ],
  faqs: serviceFaqSchema.array().parse([
    {
      question: "What if I do not know which pest I have?",
      answer:
        "You can still submit an enquiry. Describe the signs, affected rooms and when the problem began instead of guessing the pest type.",
    },
    {
      question: "What information should I include?",
      answer:
        "Share the property type, postcode or area, affected rooms, signs you have noticed, when the issue began and your preferred date.",
    },
    {
      question: "Can tenants and landlords make an enquiry?",
      answer:
        "Yes. Tenants, landlords, letting agents, property managers, homeowners and business contacts can submit the relevant property details.",
    },
    {
      question: "Can I report a pest problem at a business premises?",
      answer:
        "Yes. Choose commercial premises in the quote form and explain the affected area and signs you have noticed.",
    },
    {
      question: "Does a preferred date confirm an appointment?",
      answer:
        "No. It explains when you would like help, but availability and any visit must be confirmed separately.",
    },
    {
      question: "How is the pest-control price discussed?",
      answer:
        "The pest concern, affected area, property type and service requirements help shape the quote. Provide as much useful information as you can.",
    },
    {
      question: "Should I send photographs?",
      answer:
        "The current form collects written details. If photographs are useful, a safe way to share them can be discussed after the enquiry is received.",
    },
    {
      question: "Can I request help for more than one affected room?",
      answer:
        "Yes. List each affected room or area in the notes so the extent of the concern is clear.",
    },
  ]),
} as const;
