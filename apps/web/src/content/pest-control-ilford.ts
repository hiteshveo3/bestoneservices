import { serviceFaqSchema } from "@/content/service-types";

export const pestControlIlfordContent = {
  title: "Pest Control in Ilford",
  seoTitle: "Pest Control Ilford | 24-Hour Pest Services | Best One Services",
  description:
    "Pest control in Ilford for homes, rental properties and businesses. Report the pest signs, affected areas and property details to Best One Services for a tailored quote.",
  hero: {
    eyebrow: "Ilford pest control",
    heading: "Pest control in Ilford for homes, rentals and businesses.",
    summary:
      "From rat and mice activity to bed bugs, wasps, cockroaches and other pest concerns, tell Best One Services what you have noticed and where it is happening. Our Ilford team is open 24 hours for enquiries.",
  },
  intro:
    "Every pest problem is different. A clear description of the signs, affected rooms, property type and access details helps our team understand the situation before discussing the most relevant service.",
  faqs: serviceFaqSchema.array().parse([
    {
      question: "Do you provide pest control in Ilford?",
      answer:
        "Yes. Best One Services provides pest-control services for homes, rental properties and business premises in Ilford. Tell us the property postcode, pest signs and affected areas when you enquire.",
    },
    {
      question: "Which pest-control services are available in Ilford?",
      answer:
        "Available enquiries include rat, mice, bed bug, cockroach, ant, flea, wasp, squirrel, silverfish, spider, woodworm, carpet beetle and moth treatments, plus dead pest removal and general fogging.",
    },
    {
      question: "Can I call outside normal office hours?",
      answer:
        "Yes. Best One Services is open 24 hours. Call the team or submit an online enquiry with the pest details and property postcode.",
    },
    {
      question: "What should I include in an Ilford pest-control enquiry?",
      answer:
        "Include the pest type if known, the signs you have seen, affected rooms, property type, Ilford postcode, when the issue started and any useful access details.",
    },
    {
      question: "Can tenants, landlords and letting agents request pest control?",
      answer:
        "Yes. Tenants, landlords, letting agents, property managers, homeowners and business contacts can submit the property details needed for the enquiry.",
    },
    {
      question: "Does a preferred date guarantee an appointment?",
      answer:
        "No. It tells us when help is needed. Availability, treatment requirements and any appointment must be confirmed separately with the team.",
    },
  ]),
} as const;
