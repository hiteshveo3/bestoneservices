export interface ServiceEntity {
  id: string;
  canonicalName: string;
  slug: string;
  category: "cleaning" | "pest-control" | "gardening" | "removals";
  categoryLabel: string;
  coverage: string;
  startingPrice: string;
  startingPriceNumber: number;
  pricingType: string;
  minimumCharge: string;
  guarantee: string;
  includes: string[];
  addOns: Array<{ name: string; priceDisplay: string; amount?: number }>;
  pricingFactors: string[];
  buyingGuideQuestions: Array<{ question: string; answer: string }>;
  hubLocations: Array<{ name: string; slug: string }>;
  aliases: string[];
}

export const SERVICE_REGISTRY: Record<string, ServiceEntity> = {
  "end-of-tenancy": {
    id: "end-of-tenancy",
    canonicalName: "End of Tenancy Cleaning",
    slug: "/cleaning-services/end-of-tenancy-cleaning/",
    category: "cleaning",
    categoryLabel: "Cleaning Services",
    coverage: "Greater London & M25 Postcodes",
    startingPrice: "From £130",
    startingPriceNumber: 130,
    pricingType: "Flat-rate based on property size",
    minimumCharge: "£60 minimum booking charge",
    guarantee: "48-Hour Re-Clean Support",
    includes: [
      "Room-by-room deep sanitisation (bedrooms, living areas, hallways)",
      "Kitchen cupboard interior & exterior cleaning, sink & hob degreasing",
      "Bathroom descaling, shower screens, tiles, and sanitaryware detailing",
      "Skirting boards, light switches, doors, handles, and internal windows",
    ],
    addOns: [
      { name: "Single Carpet Room Steam Clean", priceDisplay: "£35", amount: 35 },
      { name: "Oven / Range Degrease Add-on", priceDisplay: "£25", amount: 25 },
      { name: "Double/King Mattress Steam Sanitise", priceDisplay: "£50", amount: 50 },
      { name: "3-Seater Sofa Upholstery Shampoo", priceDisplay: "£85", amount: 85 },
    ],
    pricingFactors: [
      "Property size (number of bedrooms, bathrooms, and reception rooms)",
      "Overall property condition and degree of buildup (heavy limescale or grease)",
      "Furnished or unfurnished status (cleaning inside drawers and wardrobes)",
      "Optional deep steam add-ons (carpet hot-water extraction or upholstery sanitisation)",
      "Access constraints, parking fees, or lack of running water/electricity",
    ],
    buyingGuideQuestions: [
      { question: "Is the property furnished or unfurnished?", answer: "Furnished properties require cleaning inside wardrobes and drawers, which is included in standard tenancy packages." },
      { question: "Are carpet steam cleaning and oven degreasing included?", answer: "Kitchen oven deep cleaning is included in standard packages. Professional carpet steam extraction can be added as an optional extra." },
      { question: "When should I schedule the clean relative to key handover?", answer: "We recommend scheduling 24 to 48 hours before landlord checkout inspection to maximize the 48-hour re-clean window." },
    ],
    hubLocations: [
      { name: "Ilford", slug: "/areas/" },
      { name: "Barking", slug: "/areas/" },
      { name: "Newham", slug: "/areas/" },
      { name: "Redbridge", slug: "/areas/" },
      { name: "Hackney", slug: "/areas/" },
    ],
    aliases: ["tenan", "move out cleaning", "end tenancy", "checkout clean", "deposit clean"],
  },

  "mice-control": {
    id: "mice-control",
    canonicalName: "Mice Control & Proofing",
    slug: "/pest-control-services/mice-control/",
    category: "pest-control",
    categoryLabel: "Pest Control",
    coverage: "Greater London & M25 Postcodes",
    startingPrice: "From £99",
    startingPriceNumber: 99,
    pricingType: "Package based on visit count and property size",
    minimumCharge: "£80 minimum call-out fee",
    guarantee: "1 to 3 Month Written Package Guarantee",
    includes: [
      "Full property inspection and entry-point identification",
      "Professional baiting and targeted eradication treatment",
      "Minor ingress point proofing recommendations",
      "Detailed safety report for occupants and pets",
    ],
    addOns: [
      { name: "Emergency Night / Weekend Appointment", priceDisplay: "£50", amount: 50 },
      { name: "Follow-up Proofing & Sealing Package", priceDisplay: "£60", amount: 60 },
    ],
    pricingFactors: [
      "Property size and number of active rooms",
      "Severity of rodent infestation and entry points",
      "Number of required follow-up treatment visits",
    ],
    buyingGuideQuestions: [
      { question: "Where have you noticed mouse activity?", answer: "Common areas include kitchens, under sinks, behind kickboards, and along skirting boards." },
      { question: "Are treatments safe for children and pets?", answer: "Yes. All bait stations are tamper-resistant and placed safely away from children and pets." },
    ],
    hubLocations: [
      { name: "Ilford", slug: "/areas/" },
      { name: "Barking", slug: "/areas/" },
      { name: "Newham", slug: "/areas/" },
      { name: "Redbridge", slug: "/areas/" },
    ],
    aliases: ["mouse", "mice", "mouse exterminator", "rodent"],
  },

  "gardening-main": {
    id: "gardening-main",
    canonicalName: "Garden Clearance & Maintenance",
    slug: "/gardening/",
    category: "gardening",
    categoryLabel: "Gardening Services",
    coverage: "Greater London & M25 Postcodes",
    startingPrice: "£70/hr min",
    startingPriceNumber: 70,
    pricingType: "Hourly rate (2-gardener team model)",
    minimumCharge: "£70 minimum (first hour included)",
    guarantee: "100% Satisfaction Service Check",
    includes: [
      "2-person professional gardening team",
      "Lawn mowing, hedge trimming, and border tidying",
      "Weeding, pruning, and green waste bag loading",
    ],
    addOns: [
      { name: "Standard Green Waste Bag Disposal", priceDisplay: "£5/bag", amount: 5 },
      { name: "Jumbo Green Waste Bag Removal", priceDisplay: "£50/bag", amount: 50 },
    ],
    pricingFactors: [
      "Garden size and density of overgrown vegetation",
      "Volume of green waste requiring disposal",
      "Required equipment and hours",
    ],
    buyingGuideQuestions: [
      { question: "How many gardeners will attend?", answer: "Our standard model sends a 2-gardener team equipped with professional petrol tools." },
    ],
    hubLocations: [
      { name: "Ilford", slug: "/areas/" },
      { name: "Barking", slug: "/areas/" },
      { name: "Newham", slug: "/areas/" },
    ],
    aliases: ["garden", "gardening", "clearance", "lawn"],
  },

  "removals-main": {
    id: "removals-main",
    canonicalName: "House Removals & Man & Van",
    slug: "/removals/",
    category: "removals",
    categoryLabel: "Removals Services",
    coverage: "Greater London & M25 Postcodes",
    startingPrice: "From £80/hr",
    startingPriceNumber: 80,
    pricingType: "Hourly rate (minimum 2 hours)",
    minimumCharge: "£160 minimum (2 hours booking)",
    guarantee: "Full Goods-in-Transit Insurance",
    includes: [
      "2 or 3 professional movers + Luton furniture van",
      "Protective blankets, straps, and trolley equipment",
      "Loading, transport, and unloading at destination",
    ],
    addOns: [
      { name: "Full Packing Service", priceDisplay: "£30/hr", amount: 30 },
      { name: "Best One Club Discounted Packing", priceDisplay: "£25/hr", amount: 25 },
    ],
    pricingFactors: [
      "Team size (2 men vs 3 men team)",
      "Booking duration and travel distance",
      "Stair access, lifts, and parking availability",
    ],
    buyingGuideQuestions: [
      { question: "Is insurance included?", answer: "Yes, all removals include full public liability and goods-in-transit insurance coverage." },
    ],
    hubLocations: [
      { name: "Ilford", slug: "/areas/" },
      { name: "Barking", slug: "/areas/" },
      { name: "Newham", slug: "/areas/" },
    ],
    aliases: ["removals", "moving", "man and van", "house move"],
  },
};

export function getServiceEntity(id: string): ServiceEntity | undefined {
  return SERVICE_REGISTRY[id];
}
