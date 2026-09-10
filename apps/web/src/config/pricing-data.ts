// Bump this whenever a price in this file actually changes — it's the one
// place "prices last updated" is sourced from, shown on /prices/ and used for
// schema priceValidUntil freshness. Do not wire this to build/deploy time;
// it must only move when a number below genuinely changes.
export const PRICING_LAST_UPDATED = "2026-09-10";

export interface PriceVariantData {
  id: string;
  name: string;
  propertySize?: string;
  startingPrice: number;
  maxPrice?: number;
  unit?: string;
  guarantee?: string;
  features: string[];
  /** Per-room surcharge for services that scale by room count (e.g. bed bug treatment). */
  perRoomRate?: number;
  /** Per-visit surcharge for services with an optional follow-up visit. */
  perVisitRate?: number;
}

export interface ServicePricingCategory {
  id: "cleaning" | "pest-control" | "gardening" | "removals";
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  startingRateDisplay: string;
  pricingType: "property_size" | "hourly" | "package" | "itemized";
  variants: PriceVariantData[];
  addOns: Array<{ name: string; priceDisplay: string }>;
  factorsAffectingPrice: string[];
  guaranteeText: string;
  minChargeText: string;
  /**
   * Honest market anchoring shown beside the pricing table. Describes the
   * general London market range without naming competitors (comparative-
   * advertising risk). Re-check against the variants below whenever prices move.
   */
  marketContext: string;
}

export const masterPricingData: Record<"cleaning" | "pest-control" | "gardening" | "removals", ServicePricingCategory> = {
  cleaning: {
    id: "cleaning",
    title: "Cleaning Services Pricing",
    subtitle: "Agency-approved End of Tenancy, Carpet, Oven, and Domestic Deep Cleaning",
    badge: "48-HOUR RE-CLEAN GUARANTEE",
    description: "Fixed transparent rates for End of Tenancy cleaning based on property size, plus hourly domestic and specialized itemized cleaning.",
    startingRateDisplay: "From £60",
    pricingType: "property_size",
    minChargeText: "Minimum booking charge of £60 applies for domestic hourly cleaning.",
    guaranteeText: "Includes 48-Hour Re-Clean Guarantee assurance.",
    marketContext:
      "London end of tenancy cleaning typically costs £150–£650+ depending on property size and provider. Our flat rate for a studio is £130.",
    variants: [
      { id: "studio_std", name: "Studio Flat - Standard", propertySize: "Studio", startingPrice: 130, unit: "flat rate", features: ["Full inventory checklist", "Deep oven cleaning", "Bathroom sanitising", "Window glass inside"] },
      { id: "studio_prem", name: "Studio Flat - Premium", propertySize: "Studio", startingPrice: 160, unit: "flat rate", features: ["Standard tenancy clean", "Professional carpet steam clean", "Deodorising treatment"] },
      { id: "1bed_std", name: "1 Bedroom - Standard", propertySize: "1 Bed", startingPrice: 200, unit: "flat rate", features: ["Full tenancy checklist", "Kitchen appliances clean", "Deep bathroom descaling"] },
      { id: "1bed_prem", name: "1 Bedroom - Premium", propertySize: "1 Bed", startingPrice: 230, unit: "flat rate", features: ["Standard 1-bed clean", "Carpet hot water extraction", "Full appliance sanitise"] },
      { id: "2bed_std", name: "2 Bedroom - Standard", propertySize: "2 Bed", startingPrice: 230, unit: "flat rate", features: ["Full tenancy checklist", "Kitchen & bathroom deep clean", "Living area & hallway"] },
      { id: "2bed_prem", name: "2 Bedroom - Premium", propertySize: "2 Bed", startingPrice: 280, unit: "flat rate", features: ["Standard 2-bed clean", "All carpets deep steam cleaned", "Upholstery refresh"] },
      { id: "3bed_std", name: "3 Bedroom - Standard", propertySize: "3 Bed", startingPrice: 300, unit: "flat rate", features: ["Full tenancy checklist", "Up to 2 bathrooms included", "Complete floor sanitise"] },
      { id: "3bed_prem", name: "3 Bedroom - Premium", propertySize: "3 Bed", startingPrice: 350, unit: "flat rate", features: ["Standard 3-bed clean", "All carpets steam cleaned", "Appliance deep degrease"] },
      { id: "4bed_std", name: "4 Bedroom - Standard", propertySize: "4 Bed", startingPrice: 350, unit: "flat rate", features: ["Full tenancy checklist", "Multiple bathrooms included", "Deep oven degreasing"] },
      { id: "4bed_prem", name: "4 Bedroom - Premium", propertySize: "4 Bed", startingPrice: 420, unit: "flat rate", features: ["Standard 4-bed clean", "Complete carpet extraction", "Full window frames & glass"] },
      { id: "domestic_hourly", name: "Regular Domestic Cleaning", propertySize: "Per Hour", startingPrice: 22, unit: "per hour (min 3 hrs)", features: ["General house cleaning", "Dusting & vacuuming", "Ironing & linen change", "Kitchen & bathroom tidy"] },
      // Standalone specialty services (booked independently of an End of Tenancy package).
      { id: "carpet_cleaning_standalone", name: "Carpet & Rug Steam Cleaning", propertySize: "Standalone Service", startingPrice: 60, unit: "per visit", features: ["Hot water extraction steam clean", "Stain & odour treatment", "Quick-dry finish"] },
      { id: "oven_cleaning_standalone", name: "Oven & Appliance Cleaning", propertySize: "Standalone Service", startingPrice: 45, unit: "per visit", features: ["Full oven interior degrease", "Racks & trays soaked separately", "Hob & extractor filter clean"] },
      { id: "window_cleaning_standalone", name: "Window Cleaning", propertySize: "Standalone Service", startingPrice: 40, unit: "per visit", features: ["Interior glass, streak-free finish", "Frames, sills & ledges", "Reachable exterior on request"] },
      { id: "mattress_cleaning_standalone", name: "Mattress Steam Sanitising", propertySize: "Standalone Service", startingPrice: 45, unit: "per visit", features: ["Steam sanitising treatment", "Stain & odour removal", "Allergen reduction"] },
      { id: "after_builders_standalone", name: "After Builders Cleaning", propertySize: "Standalone Service", startingPrice: 140, unit: "per visit", features: ["Full dust & debris removal", "Surface, fitting & fixture wipe-down", "Floor deep clean"] },
    ],
    addOns: [
      { name: "Single Mattress Clean", priceDisplay: "£35" },
      { name: "Double/King Mattress Clean", priceDisplay: "£50" },
      { name: "Single Carpet Room", priceDisplay: "£35" },
      { name: "Leather Armchair Treatment", priceDisplay: "£45" },
      { name: "Leather 3-Seater Sofa", priceDisplay: "£85" },
      { name: "BBQ Deep Degrease", priceDisplay: "£55" },
      { name: "Oven / Range Degrease Add-on", priceDisplay: "£25" },
    ],
    factorsAffectingPrice: [
      "Property size and number of bedrooms/bathrooms",
      "Overall condition and level of buildup (e.g. heavy grease or limescale)",
      "Add-on services such as carpet steam cleaning or upholstery restoration",
      "Access constraints or lack of electricity/running water",
    ],
  },

  "pest-control": {
    id: "pest-control",
    title: "Pest Control Services Pricing",
    subtitle: "BPCA-certified Pest Eradication & Prevention for Residential & Commercial Properties",
    badge: "1 TO 3 MONTH GUARANTEE PACKAGES",
    description: "Structured visit packages based on property size and infestation type with optional emergency night appointments.",
    startingRateDisplay: "From £80",
    pricingType: "package",
    minChargeText: "Minimum charge of £80 applies for single visit treatments.",
    guaranteeText: "2-Visit packages include 1-month written guarantee; 3-Visit packages include 3-month guarantee.",
    marketContext:
      "Private pest control in London typically ranges £150–£450 per treatment. Our packages start from £80.",
    variants: [
      { id: "pest_1bed_single", name: "1 Bed - Single Visit", propertySize: "1 Bed", startingPrice: 90, maxPrice: 120, unit: "single treatment", guarantee: "No guarantee", features: ["Initial inspection", "Targeted bait/spray", "Safety report"] },
      { id: "pest_1bed_2visit", name: "1 Bed - 2 Visits Package", propertySize: "1 Bed", startingPrice: 160, maxPrice: 190, unit: "2 visit package", guarantee: "1-Month Guarantee", features: ["Full inspection & treatment", "Follow-up visit in 14 days", "1-Month written guarantee"] },
      { id: "pest_1bed_3visit", name: "1 Bed - 3 Visits Package", propertySize: "1 Bed", startingPrice: 210, maxPrice: 230, unit: "3 visit package", guarantee: "3-Month Guarantee", features: ["3 Comprehensive visits", "Proofing recommendations", "3-Month written guarantee"] },
      { id: "pest_2bed_2visit", name: "2 Bed - 2 Visits Package", propertySize: "2 Bed", startingPrice: 180, maxPrice: 220, unit: "2 visit package", guarantee: "1-Month Guarantee", features: ["Full 2-bed property treatment", "Follow-up inspection", "1-Month written guarantee"] },
      { id: "pest_2bed_3visit", name: "2 Bed - 3 Visits Package", propertySize: "2 Bed", startingPrice: 240, maxPrice: 270, unit: "3 visit package", guarantee: "3-Month Guarantee", features: ["3 Comprehensive visits", "Extended proofing advice", "3-Month written guarantee"] },
      { id: "pest_3bed_2visit", name: "3 Bed - 2 Visits Package", propertySize: "3 Bed", startingPrice: 190, maxPrice: 240, unit: "2 visit package", guarantee: "1-Month Guarantee", features: ["Full 3-bed property treatment", "Follow-up treatment", "1-Month written guarantee"] },
      { id: "pest_3bed_3visit", name: "3 Bed - 3 Visits Package", propertySize: "3 Bed", startingPrice: 240, maxPrice: 299, unit: "3 visit package", guarantee: "3-Month Guarantee", features: ["3 Full property visits", "Complete eradication check", "3-Month written guarantee"] },
      { id: "wasp_removal", name: "Wasp Nest Treatment", propertySize: "Per Nest", startingPrice: 59, unit: "flat rate", guarantee: "Same-day clearance", features: ["Insecticide dust treatment", "Nest neutralization", "Access height check"] },
      { id: "dead_animal", name: "Dead Animal Removal", propertySize: "Per Incident", startingPrice: 80, maxPrice: 225, unit: "per incident", guarantee: "Sanitised removal", features: ["Hygienic extraction", "Biocidal sanitisation", "Odor neutralising spray"] },
      // Per-species base rates — these are the prices actually live and search-indexed on
      // individual /pest-control-services/[service]/ pages. The property-size packages above
      // remain available as a structured multi-visit tier alongside these, not instead of them.
      { id: "species_rat", name: "Rat Control", propertySize: "Per Species", startingPrice: 109, unit: "starting rate", features: ["Initial inspection", "Targeted treatment", "Written guarantee"] },
      { id: "species_mice", name: "Mice Control", propertySize: "Per Species", startingPrice: 99, unit: "starting rate", features: ["Initial inspection", "Targeted treatment", "Written guarantee"] },
      {
        id: "species_bed_bug",
        name: "Bed Bug Treatment",
        propertySize: "Per Species",
        startingPrice: 149,
        unit: "starting rate (1 room)",
        perRoomRate: 45,
        perVisitRate: 79,
        features: ["Base rate covers 1 room", "+£45 per additional room", "+£79 per follow-up visit"],
      },
      { id: "species_cockroach", name: "Cockroach Control", propertySize: "Per Species", startingPrice: 119, unit: "starting rate", features: ["Initial inspection", "Targeted treatment", "Written guarantee"] },
      { id: "species_ant", name: "Ant Treatment", propertySize: "Per Species", startingPrice: 69, unit: "starting rate", features: ["Initial inspection", "Targeted treatment", "Written guarantee"] },
      { id: "species_flea", name: "Flea Treatment", propertySize: "Per Species", startingPrice: 89, unit: "starting rate", features: ["Initial inspection", "Targeted treatment", "Written guarantee"] },
    ],
    addOns: [
      { name: "Night Emergency Appointment (8pm–5am)", priceDisplay: "+£50 Surcharge" },
      { name: "Additional Baiting Station", priceDisplay: "£25" },
      { name: "Entry Point Mesh Proofing", priceDisplay: "£45–£85" },
      { name: "Follow-up Proofing & Sealing Package", priceDisplay: "£60" },
    ],
    factorsAffectingPrice: [
      "Target pest species (e.g. rodents, bed bugs, wasps, or dead animals)",
      "Property size and number of levels/rooms requiring treatment",
      "Selected package (Single visit vs 2-visit or 3-visit guarantee plans)",
      "Time of appointment (Night emergency slots 8pm–5am carry a £50 surcharge)",
    ],
  },

  gardening: {
    id: "gardening",
    title: "Gardening & Clearance Pricing",
    subtitle: "2-Gardener Teams for Maintenance, Lawn Care, Pressure Washing & Garden Clearance",
    badge: "2-GARDENER TEAM INCLUDED",
    description: "Straightforward hourly rates for 2-gardener teams plus transparent bag-based clearance options.",
    startingRateDisplay: "From £50",
    pricingType: "hourly",
    minChargeText: "Minimum charge of £70 (first hour for 2 gardeners) applies.",
    guaranteeText: "100% Satisfaction Guarantee with commercial-grade petrol equipment.",
    marketContext:
      "A single gardener in London typically charges £35–£40/hr. Our 2-gardener team starts at £70 for the first hour.",
    variants: [
      { id: "garden_maint_1st_hr", name: "2-Gardener Maintenance (First Hour)", propertySize: "1st Hour", startingPrice: 70, unit: "first hour", features: ["2 Professional gardeners", "Commercial mowers & trimmers", "Lawn edging & hedge tidy"] },
      { id: "garden_maint_add_hr", name: "2-Gardener Maintenance (Additional Hours)", propertySize: "Add. Hour", startingPrice: 50, unit: "per add. hour", features: ["Continuous 2-man work", "Weed removal & border care", "Pruning & leaf clearance"] },
      { id: "lawn_mowing_session", name: "Lawn Mowing Session", propertySize: "Standard Lawn", startingPrice: 50, maxPrice: 70, unit: "per session", features: ["Mowing & neat border edging", "Clippings collection", "Blow-clean patio pathways"] },
      { id: "lawn_fertilise", name: "Lawn Fertilisation Treatment", propertySize: "Per Session", startingPrice: 60, unit: "per session", features: ["Seasonal nutrient feed", "Weed suppression feed", "Lawn green-up treatment"] },
      { id: "lawn_aeration", name: "Lawn Aeration & De-Thatching", propertySize: "Per Session", startingPrice: 70, unit: "per session", features: ["Hollow tine aeration", "Soil compaction relief", "Root growth stimulation"] },
      { id: "pressure_washing", name: "Jet Pressure Washing", propertySize: "Per 20 sqm", startingPrice: 60, unit: "per 20 sqm / hr", features: ["High-pressure patio clean", "Driveway & deck wash", "Algae & moss removal"] },
      { id: "garden_clearance", name: "Garden Clearance & Waste Removal", propertySize: "Per Session", startingPrice: 80, unit: "per session", features: ["Full overgrown garden clearance", "Green waste bagged & removed", "Access path cleared"] },
    ],
    addOns: [
      { name: "Standard Green Waste Bag", priceDisplay: "£5 / bag" },
      { name: "Jumbo Heavy Clearance Bag", priceDisplay: "£50 / bag" },
      { name: "Hedge Reduction (Over 8ft)", priceDisplay: "Custom Quote" },
    ],
    factorsAffectingPrice: [
      "Total duration of work and garden size",
      "Volume of green waste generated for disposal (standard vs jumbo bags)",
      "Overgrown condition requiring heavy clearance equipment",
      "Hard surface area for jet pressure washing",
    ],
  },

  removals: {
    id: "removals",
    title: "Removals & Storage Pricing",
    subtitle: "Reliable Man & Van, House Removals, Office Moves & Professional Packing",
    badge: "BEST ONE CLUB MEMBER DISCOUNTS",
    description: "Fully insured moving teams with 2-men or 3-men vehicle options, packing services, and club member rates.",
    startingRateDisplay: "From £80/hr",
    pricingType: "hourly",
    minChargeText: "Minimum booking charge of £160 (2 hours) applies for removal vehicles.",
    guaranteeText: "Full goods-in-transit and public liability insurance coverage included.",
    marketContext:
      "Man and van services in London typically cost £50–£120 per hour. Our 2-person Luton van team is £80–£120/hr, fully insured.",
    variants: [
      { id: "man_and_van", name: "Man & Van Moving Services", propertySize: "Studio/1 Bed Moves", startingPrice: 60, unit: "per hour, emergency-eligible", features: ["Single mover + van", "Single bulky item transport", "Student & small flat relocations"] },
      { id: "van_2men", name: "2 Men + 1 Luton Van", propertySize: "1-2 Bed Moves", startingPrice: 80, maxPrice: 120, unit: "per hour (min 2 hrs)", features: ["2 Professional movers", "Fully equipped Luton van", "Blankets, straps & tail-lift", "Goods-in-transit insurance"] },
      { id: "van_3men", name: "3 Men + 1 Large Van", propertySize: "3-4 Bed Moves", startingPrice: 120, maxPrice: 160, unit: "per hour (min 2 hrs)", features: ["3 Professional movers", "Large capacity vehicle", "Heavy furniture lifting", "Full loading & unloading"] },
      { id: "packing_standard", name: "Full Packing Service (Standard Rate)", propertySize: "Per Hour", startingPrice: 30, unit: "per hour per packer", features: ["Professional packing team", "Fragile item bubble wrapping", "Box labeling by room"] },
      { id: "packing_member", name: "Full Packing Service (Best One Club Rate)", propertySize: "Per Hour", startingPrice: 25, unit: "per hour per packer", features: ["£5/hr discount for members", "Free box tape included", "Priority scheduling"] },
    ],
    addOns: [
      { name: "Cardboard Moving Boxes Pack", priceDisplay: "£35 / 10 boxes" },
      { name: "Bubble Wrap Roll (50m)", priceDisplay: "£20" },
      { name: "Furniture Dismantle & Reassembly", priceDisplay: "Included in hourly" },
    ],
    factorsAffectingPrice: [
      "Selected crew size (2 Men vs 3 Men team)",
      "Total duration of move and travel distance",
      "Stairs, lifts, or long carry distances to vehicle",
      "Packing service requirements and materials used",
    ],
  },
};
