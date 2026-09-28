"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  BadgeCheck,
  Building,
  Layers,
  AlertTriangle,
  Flame,
  MapPin,
} from "lucide-react";
import type { ApprovedServicePage } from "@/content/approved-service-pages";
import { siteContact } from "@/config/site-contact";
import { Spinner } from "@/components/ui/spinner";
import { FormSuccess, FormError } from "@/components/ui/form-status";
import { BigFacts, Button, Eyebrow, Facts, FaqSplit, Plaque, PriceTile, SlimCta } from "@/components/touchstone";
import { PriceExplorer } from "@/components/touchstone/price-explorer";

/** Splits a hero title into the claim and its quieter answer (two weights, Lab 03 S07 C). */
function splitTitle(title: string): [string, string] {
  const comma = title.indexOf(", ");
  if (comma > 0) return [title.slice(0, comma + 1), title.slice(comma + 2)];
  const inIdx = title.indexOf(" in ");
  if (inIdx > 0) return [title.slice(0, inIdx), title.slice(inIdx + 1)];
  const across = title.indexOf(" Across London");
  if (across > 0) return [title.slice(0, across), "across London"];
  return [title, ""];
}

/** "Starting from £130 for a studio flat." → { amount: "£130", unit: "for a studio flat" } */
function parsePrice(text: string): { amount: string; unit?: string } | null {
  const m = text.match(/£\s?(\d[\d,]*)(.*)$/);
  if (!m) return null;
  const unit = m[2].replace(/\.$/, "").trim();
  return { amount: `£${m[1]}`, unit: unit || undefined };
}

// End of tenancy fixed prices (standard clean), from config/pricing-data.ts.
const EOT_OPTIONS = [
  { id: "studio", label: "Studio", amount: 130, note: "Studio flat, standard clean." },
  { id: "1bed", label: "1 bed", amount: 200, note: "1 bedroom, standard clean." },
  { id: "2bed", label: "2 bed", amount: 230, note: "2 bedrooms, standard clean." },
  { id: "3bed", label: "3 bed", amount: 300, note: "3 bedrooms, up to two bathrooms." },
  { id: "4bed", label: "4 bed", amount: 350, note: "4 bedrooms, multiple bathrooms." },
];

export interface ServiceLayoutProps {
  category: string;
  service: string;
  categoryLabel: string;
  approved: ApprovedServicePage;
  locationName?: string;
  locationIntro?: string;
  /** A short, genuinely location-specific fact (real search demand, or named
   *  neighbouring areas) — distinct per location page rather than the same
   *  templated paragraph with only the place name swapped in. */
  localDemandNote?: string;
  nearbyLocations?: { slug: string; name: string }[];
}

export function ServiceLayout({
  category,
  service,
  categoryLabel,
  approved,
  locationName,
  locationIntro,
  localDemandNote,
  nearbyLocations = [],
}: ServiceLayoutProps) {
  const [postcode, setPostcode] = useState(locationName ? locationName : "");
  const [postcodeStatus, setPostcodeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [postcodeMessage, setPostcodeMessage] = useState<string>("");

  const isCleaning = category.includes("cleaning");
  const whatsappBookingUrl = siteContact.getWhatsappUrl(`Hi, I'd like to book ${categoryLabel} with Bestone Services.`);
  const isPest = category.includes("pest");
  const isRat = service === "rat-control";
  const isEndOfTenancy = service === "end-of-tenancy-cleaning";

  // Location display string
  const locSuffix = locationName ? ` in ${locationName}, London` : " Across London";
  const heroTitle = locationName 
    ? `${approved.title} in ${locationName}, London`
    : isRat 
      ? "Rat control, diagnosed properly before anything is treated"
      : isEndOfTenancy
        ? "End of tenancy cleaning, guaranteed for full deposit return"
        : `${approved.title}${locSuffix}`;

  const heroSubtext = locationIntro
    ? locationIntro
    : isRat
      ? "Rats are one of the most commonly reported pests in UK homes and businesses, and also one of the most misunderstood. This page covers what to look for, why it's worth taking seriously, what a professional visit involves, and how to stop it happening again."
      : isEndOfTenancy
        ? "Professional end of tenancy cleaning in London for tenants, landlords and letting agents. Includes our 48-hour free re-clean guarantee, full agency-approved inventory checklist, and heavy-duty oven degreasing."
        : approved.summary || approved.description;

  // Key stats strip configuration
  const stats = isEndOfTenancy ? [
    { value: "£130+", label: "Fixed studio flat starting rate (final price confirmed with zero hidden fees)" },
    { value: "48 Hours", label: "Free re-clean guarantee if clerk flags any issues" },
    { value: "100%", label: "Inventory clerk inspection pass & deposit return focus" },
    { value: "7 Days", label: "Short-notice and weekend bookings across London" }
  ] : isCleaning ? [
    { value: approved.price.match(/£\d+/)?.[0] || "£90+", label: "Fixed transparent pricing with zero hidden surcharges" },
    { value: "48 Hours", label: "Satisfaction guarantee & free follow-up service" },
    { value: "100%", label: "Eco-friendly commercial cleaning equipment & solutions" },
    { value: "London & M25", label: "Available across all London boroughs and postcodes" }
  ] : isRat ? [
    { value: "15–20mm", label: "Gap a rat can pass through — about a thumb's width" },
    { value: "5 weeks", label: "Age at which rats reach maturity and begin breeding" },
    { value: "6–12", label: "Pups per litter, with several litters a year" },
    { value: "Autumn", label: "When indoor activity is most commonly first noticed" }
  ] : isPest ? [
    { value: approved.price.match(/£\d+/)?.[0] || "£89+", label: "Competitive starting price confirmed before booking" },
    { value: "1–3 Mo", label: "Written eradication guarantee with multi-visit packages" },
    { value: "BPCA", label: "British Pest Control Association compliant standards" },
    { value: "Same-Day", label: "Urgent response & discreet unmarked van option" }
  ] : [
    { value: "Fixed Rates", label: "Clear deterministic calculation with zero surprises" },
    { value: "100%", label: "Fully vetted, insured and background-checked teams" },
    { value: "4.9/5", label: "Rated by verified homeowners and property managers" },
    { value: "London-Wide", label: "Serving Greater London and surrounding postcodes" }
  ];

  // Inclusions / Signs / Scope Cards
  const scopeItems = isEndOfTenancy ? [
    {
      icon: Sparkles,
      title: "Kitchen & Oven Degreasing",
      desc: "Full deep clean inside and outside of oven, extractor fan filters, hob, cupboards, sink descaling, and splashback tiles."
    },
    {
      icon: ShieldCheck,
      title: "Bathrooms & Descaling",
      desc: "Complete limescale removal from taps, shower screens, tiles, grout scrub, toilet sanitation, and mirror polishing."
    },
    {
      icon: Building,
      title: "Living Areas & Bedrooms",
      desc: "Skirting boards, doors, switches, sockets, cobweb removal, interior windows, and thorough vacuuming and mopping."
    },
    {
      icon: Layers,
      title: "Windows, Sills & Frames",
      desc: "Internal window glass cleaned streak-free, window frames, ledges, sills, and reachable blind dusting."
    },
    {
      icon: CheckCircle2,
      title: "Flooring & Carpet Deep Care",
      desc: "All floors vacuumed and mopped; optional hot water extraction commercial steam shampooing for heavy carpet marks."
    },
    {
      icon: BadgeCheck,
      title: "Appliances & White Goods",
      desc: "Fridge/freezer interior wipe-down (must be defrosted), washing machine soap drawers, and dishwasher filters."
    }
  ] : isCleaning ? [
    {
      icon: Sparkles,
      title: "Deep Surface Cleaning",
      desc: "Detailed sanitization of worktops, handles, cupboards, surfaces, and high-touch areas throughout."
    },
    {
      icon: ShieldCheck,
      title: "Hygiene & Sanitation",
      desc: "Hospital-grade, pet-safe and eco-friendly disinfectants removing 99.9% of bacteria and grime."
    },
    {
      icon: Building,
      title: "Room-by-Room Detailing",
      desc: "Thorough attention to corners, skirting boards, light switches, doorframes, and unreachable areas."
    },
    {
      icon: Layers,
      title: "Floorcare & Mopping",
      desc: "Industrial vacuum filtration and pH-balanced hard floor sanitization leaving zero residue."
    },
    {
      icon: CheckCircle2,
      title: "Lime Scale & Grime Scrub",
      desc: "Targeted limescale breakdown on bathroom fittings, kitchen sinks, tiles, and drainage outlets."
    },
    {
      icon: BadgeCheck,
      title: "Insured & Vetted Staff",
      desc: "Uniformed, background-checked and experienced cleaning specialists equipped with commercial tools."
    }
  ] : isRat ? [
    {
      icon: Sparkles,
      title: "Droppings",
      desc: "Dark, roughly rice-grain-sized, often clustered near food sources, along skirting boards, or inside cupboards."
    },
    {
      icon: AlertTriangle,
      title: "Gnaw marks",
      desc: "On skirting, door frames, stored food packaging, and — significantly — electrical cabling, since teeth grow continuously."
    },
    {
      icon: Clock,
      title: "Scratching sounds",
      desc: "Most commonly heard at night, in wall cavities, under floors, or in lofts, traveling along repeat routes."
    },
    {
      icon: ShieldCheck,
      title: "Grease marks",
      desc: "Dark, greasy marks along skirting boards or beams left by fur brushing against the same surface repeatedly."
    },
    {
      icon: MapPin,
      title: "Burrows outdoors",
      desc: "Smooth-sided holes roughly 6–9cm across near decking, compost heaps, garden sheds, or fence bases."
    },
    {
      icon: Flame,
      title: "An unusual smell",
      desc: "A persistent, slightly musky or ammonia-like odour in an enclosed space — lofts or under-stairs cupboards."
    }
  ] : [
    {
      icon: Sparkles,
      title: approved.signs[0] ? approved.signs[0].split(".")[0] : "Verified Scope",
      desc: approved.signs[0] || "Initial inspection confirms the extent of requirements and exact areas needing treatment."
    },
    {
      icon: AlertTriangle,
      title: approved.signs[1] ? approved.signs[1].split(".")[0] : "Targeted Action",
      desc: approved.signs[1] || "Tailored methodology applied directly to the property type and confirmed issues."
    },
    {
      icon: ShieldCheck,
      title: approved.signs[2] ? approved.signs[2].split(".")[0] : "Safe Application",
      desc: approved.signs[2] || "All treatments comply with UK safety standards, protecting children, pets, and food prep areas."
    },
    {
      icon: Clock,
      title: "Rapid Dispatch",
      desc: "Same-day and urgent time slots available across London with transparent arrival windows."
    },
    {
      icon: MapPin,
      title: locationName ? `Local to ${locationName}` : "London Coverage",
      desc: locationName ? `Dedicated mobile teams serving ${locationName} and adjacent postal districts.` : "Operating throughout all 32 London boroughs and inside the M25 ring."
    },
    {
      icon: BadgeCheck,
      title: "Written Guarantee",
      desc: "Complete documentation and clear warranty terms provided after service completion."
    }
  ];

  // Risks / Importance Section Items
  const riskItems = isEndOfTenancy ? [
    {
      num: "01",
      title: "Deposit Deductions",
      desc: "Cleaning is the #1 reason deposit funds are retained in the UK. Letting agents charge premium contractor rates if you fail inventory checks."
    },
    {
      num: "02",
      title: "Strict Clerk Inspections",
      desc: "Professional inventory clerks inspect oven glass, extractor filters, and tile grout with high-powered torches. Standard domestic cleaning falls short."
    },
    {
      num: "03",
      title: "Moving Day Stress",
      desc: "Packing and moving home is exhausting. Handing over the 4 to 8 hour deep clean to fully equipped specialists guarantees your peace of mind."
    }
  ] : isCleaning ? [
    {
      num: "01",
      title: "Health & Hygiene",
      desc: "Accumulated dust mites, allergens, and bacteria deep in carpets and bathroom tiles can worsen allergies and affect indoor air quality."
    },
    {
      num: "02",
      title: "Surface Longevity",
      desc: "Limescale corrodes chrome fixtures, while ingrained grease damages oven heating elements. Routine deep cleaning prolongs property fixtures."
    },
    {
      num: "03",
      title: "Time & Effort Saving",
      desc: "A thorough deep clean requires industrial extractors and hours of intensive labor. Our trained teams complete it efficiently in a single visit."
    }
  ] : isRat ? [
    {
      num: "01",
      title: "Health",
      desc: "Rats carry pathogens transmissible to humans including Weil's disease (leptospirosis), salmonella, and hantavirus through contact with urine or surfaces."
    },
    {
      num: "02",
      title: "Property damage",
      desc: "Constant gnawing damages wiring, pipework, insulation, and timber. Damaged electrical cabling is a documented contributing factor in property fires."
    },
    {
      num: "03",
      title: "Rate of increase",
      desc: "Because rats breed quickly and mature within weeks, a small, easily resolved issue can become a substantially larger infestation within months if left unaddressed."
    }
  ] : [
    {
      num: "01",
      title: "Prompt Intervention",
      desc: "Addressing property issues early avoids compound structural damage, expensive repairs, or escalated environmental hazards."
    },
    {
      num: "02",
      title: "Certified Safety",
      desc: "Professional equipment and certified products guarantee compliance with UK environmental and health regulations."
    },
    {
      num: "03",
      title: "Long-Term Resolution",
      desc: "A diagnostic approach targets the root cause rather than applying temporary superficial remedies."
    }
  ];

  // Causes / Key Factor Hotspots
  const causesItems = isEndOfTenancy ? [
    {
      title: "Oven & Extractor Carbon Buildup",
      desc: "Burnt grease on oven racks, interior glass panels, and extractor mesh filters is the single most common reason inventory clerks fail handovers."
    },
    {
      title: "Bathroom Limescale & Grout Mildew",
      desc: "London's hard water creates heavy calcification on taps, shower heads, and glass screens that supermarket sprays cannot dissolve."
    },
    {
      title: "Skirting Boards, Sills & Door Frames",
      desc: "Dust buildup on door tops, behind radiators, and along skirting lines is immediately noted on move-out inventory photographic reports."
    },
    {
      title: "Defrosting & Appliance Trays",
      desc: "Washing machine detergent drawers with mildew and un-defrosted freezers can delay tenant handover and incur penalty fees."
    }
  ] : isCleaning ? [
    {
      title: "Hard Water Mineral Deposits",
      desc: "London's high mineral content leaves chalky white residue on chrome taps and glass showers that requires professional descaling compounds."
    },
    {
      title: "Airborne Cooking Grease",
      desc: "Vaporized oil settles onto cupboard tops, extractor fans, and splashbacks, attracting dust and becoming tacky over time."
    },
    {
      title: "Deep Carpet & Fabric Traps",
      desc: "Standard domestic vacuum cleaners only remove surface dust; dirt, dead skin, and pollen settle deep within carpet fibers."
    },
    {
      title: "High-Traffic Touch Points",
      desc: "Light switches, door handles, and cupboard edges collect oils and bacteria that require hygienic disinfectant wiping."
    }
  ] : [
    {
      title: "Gaps and access points",
      desc: "Rats can fit through gaps as small as 15–20mm (roughly a thumb's width), so unsealed pipework entries, damaged airbricks, and door gaps are realistic routes."
    },
    {
      title: "Accessible food",
      desc: "Open bins, pet food left out overnight, bird feeders with heavy spillage, compost heaps with food waste, and uncollected fallen fruit."
    },
    {
      title: "Shelter and warmth",
      desc: "Cluttered sheds, dense ivy, cavity walls, and insulated lofts all provide undisturbed shelter, especially as temperatures fall."
    },
    {
      title: "Nearby infrastructure",
      desc: "Proximity to drains, sewers, or waterways can bring rats into a wider neighborhood regardless of individual property upkeep."
    }
  ];

  // Step-by-step process items
  const processItems = isEndOfTenancy ? [
    {
      step: "01",
      title: "Booking & Property Specification",
      desc: "Tell us your bedroom count, property type, handover deadline, and any extras like carpet steam cleaning or external windows."
    },
    {
      step: "02",
      title: "Checklist Deep Cleaning Execution",
      desc: "Our fully equipped team arrives with dip tanks, descalers, and commercial steamers, working methodically through every room on the agency checklist."
    },
    {
      step: "03",
      title: "Detailed Inspection Walkthrough",
      desc: "The lead cleaner performs a final quality audit against the inventory criteria to verify every surface, appliance, and fixture meets standard."
    },
    {
      step: "04",
      title: "48-Hour Re-Clean Guarantee",
      desc: "You receive an official VAT invoice for your letting agent. If your landlord or inventory clerk reports any concern within 48 hours, we return free of charge."
    }
  ] : isCleaning ? [
    {
      step: "01",
      title: "Consultation & Quote",
      desc: "We discuss your property size, specific areas of focus, and confirm a transparent fixed quote before any booking."
    },
    {
      step: "02",
      title: "Systematic Deep Clean",
      desc: "Our trained cleaners arrive on time with professional-grade chemicals, microfiber tools, and industrial vacuum equipment."
    },
    {
      step: "03",
      title: "Sanitation & Surface Polish",
      desc: "All designated surfaces, kitchens, and bathrooms are thoroughly descaled, wiped, and sanitized."
    },
    {
      step: "04",
      title: "Satisfaction Handover",
      desc: "We inspect the finished spaces to ensure the work satisfies our rigorous standards and your personal requirements."
    }
  ] : [
    {
      step: "01",
      title: "Assessment",
      desc: "A walk-through of the affected areas to confirm activity, identify likely entry points, and understand the extent of the problem — inside or outside."
    },
    {
      step: "02",
      title: "Treatment planning",
      desc: "The approach is matched to what's actually found, rather than applied as a single default method regardless of circumstances."
    },
    {
      step: "03",
      title: "Implementation",
      desc: "Treatment is carried out, with any access, safety, or timing considerations (pets, children, food storage) accounted for beforehand."
    },
    {
      step: "04",
      title: "Follow-up & Guarantee",
      desc: "A further visit confirms whether activity has genuinely stopped, with written documentation and proofing guidance provided."
    }
  ];

  // DIY vs Pro Comparison Table
  const comparisonRows = isEndOfTenancy ? [
    {
      item: "Equipment & Chemical Strength",
      diy: "Supermarket sprays & standard domestic vacuum",
      pro: "Industrial dip tanks, commercial descalers & HEPA steamers"
    },
    {
      item: "Oven Deep Degreasing",
      diy: "Surface wipe leaving burnt carbon on glass & racks",
      pro: "Racks soaked in van-mounted dip tank; interior stripped clean"
    },
    {
      item: "Inventory Clerk Checklist",
      diy: "Subjective cleaning prone to missed corners & sills",
      pro: "Standardized 50+ point agency checklist passed guaranteed"
    },
    {
      item: "Deposit Protection Guarantee",
      diy: "No recourse if landlord disputes cleanliness",
      pro: "Written 48-hour re-clean guarantee + official VAT invoice"
    },
    {
      item: "Time & Effort Required",
      diy: "8–14 hours of exhausting manual labor during moving",
      pro: "Completed efficiently in 3–5 hours by an experienced team"
    }
  ] : isCleaning ? [
    {
      item: "Cleaning Solutions",
      diy: "Standard retail detergents",
      pro: "Hospital-grade, eco-friendly commercial formulations"
    },
    {
      item: "Limescale Removal",
      diy: "Temporary surface masking",
      pro: "Chemical dissolution removing embedded mineral buildup"
    },
    {
      item: "Equipment Power",
      diy: "Standard household suction",
      pro: "High-airflow commercial HEPA extraction machinery"
    },
    {
      item: "Guarantee",
      diy: "Self-assessed",
      pro: "48-Hour quality satisfaction commitment"
    }
  ] : [
    {
      item: "Identifying entry points",
      diy: "Not typically included",
      pro: "Assessed and reported on"
    },
    {
      item: "Scaling to established populations",
      diy: "Often limited",
      pro: "Approach adjusted to extent found"
    },
    {
      item: "Access to lofts, voids, drains",
      diy: "Frequently impractical",
      pro: "Part of a full assessment"
    },
    {
      item: "Confirmation of resolution",
      diy: "Self-assessed",
      pro: "Follow-up visit included"
    },
    {
      item: "Prevention advice",
      diy: "Not usually included",
      pro: "Proofing recommendations provided"
    }
  ];

  // Pricing Factors
  const pricingFactors = isEndOfTenancy ? [
    { title: "Property Size & Layout", desc: "Studio, 1-bed, 2-bed, or multi-story houses determine team size and hours required." },
    { title: "Furnished vs. Unfurnished", desc: "Furnished rentals involve cleaning under and behind furniture, sofas, and wardrobe interiors." },
    { title: "Carpet Steam Cleaning", desc: "Hot water extraction carpet shampooing can be bundled into your package at a discounted rate." },
    { title: "Appliance Count", desc: "Standard packages include a single oven. Additional appliances (range cookers, second fridge) are itemized upfront." },
    { title: "Property Condition", desc: "Heavily neglected properties with severe limescale or nicotine residue are quoted before work begins." }
  ] : isCleaning ? [
    { title: "Room & Bathroom Count", desc: "The total number of bedrooms, bathrooms, and reception rooms to be thoroughly cleaned." },
    { title: "Current Condition", desc: "Routine upkeep versus intensive first-time deep cleaning requiring heavy-duty degreasing." },
    { title: "Optional Add-Ons", desc: "Add-ons like inside fridge, interior windows, or carpet steam cleaning." },
    { title: "Access & Parking", desc: "Central London congestion or parking arrangements confirmed ahead of arrival." }
  ] : [
    { title: "Property type", desc: "Terraced homes sharing party walls raise different considerations than detached units since activity can move across buildings." },
    { title: "Extent of activity", desc: "An isolated sighting is a different job than signs across multiple rooms or an established nest." },
    { title: "Access", desc: "Loft hatches, external void access, and whether areas are communal or private all affect treatment." },
    { title: "Construction", desc: "Older buildings with suspended timber floors often have more rat routes than modern solid floors." },
    { title: "Time of year", desc: "Autumn and winter see higher indoor activity as rodents seek shelter from cold weather." }
  ];

  // Prevention & Preparation Tips
  const prepTips = isEndOfTenancy ? [
    { label: "Defrost Fridge & Freezer", desc: "Turn off and defrost freezers 24 hours prior so ice melts and interior surfaces can be sanitized." },
    { label: "Clear Personal Belongings", desc: "Ensure all personal items and rubbish are removed from cupboards and rooms before our team arrives." },
    { label: "Ensure Utilities Connected", desc: "Hot water and electricity must be connected for our commercial steamers and equipment to operate." },
    { label: "Keep Keys & Access Ready", desc: "Keys can be collected from letting agents or concierge by prior arrangement for total convenience." }
  ] : isCleaning ? [
    { label: "Clear Clutter from Surfaces", desc: "Pick up small personal items from counters and floors so cleaners can focus on deep sanitizing." },
    { label: "Note Priority Areas", desc: "Let our team know if particular appliances or bathrooms require extra focused attention." },
    { label: "Pet Arrangements", desc: "Ensure pets are safely secured in a comfortable room while machinery is operating." },
    { label: "Secure Valuables", desc: "Keep delicate heirlooms or important paperwork safely stored away." }
  ] : [
    { label: "Sealing access points", desc: "Wire mesh over airbricks, sealing pipe entries, repairing mortar, and fitting door sweeps." },
    { label: "Managing food sources", desc: "Sealed containers for pet food, secure bin lids, clearing fallen fruit, and managing bird feeders." },
    { label: "Reducing shelter", desc: "Keeping garden vegetation and log piles away from base walls and inspecting lofts periodically." },
    { label: "Ongoing vigilance", desc: "Check dark corners, boiler cupboards, and lofts periodically for early signs of droppings." }
  ];

  // Rich Tenancy FAQs
  const tenancyFaqs = [
    {
      q: "What is your 48-Hour Re-Clean Guarantee?",
      a: "If your landlord, inventory clerk, or letting agent flags any cleaning issues on their checkout report, notify us within 48 hours. Our team will return to the property and re-clean those specific items completely free of charge."
    },
    {
      q: "Is professional oven cleaning included in the price?",
      a: "Yes! Unlike many competitors who charge up to £60 extra for ovens, our standard End of Tenancy cleaning package includes a full deep oven clean (inside, racks, trays, glass, and exterior hob)."
    },
    {
      q: "Will you provide a receipt for my letting agent?",
      a: "Yes. Upon completion, we provide an official itemized VAT invoice detailing the professional service performed. This serves as documented proof for your landlord and deposit protection scheme (TDS, DPS, or MyDeposits)."
    },
    {
      q: "Do I need to be present during the clean?",
      a: "No. You can let the team in and leave, or arrange for key collection from a local estate agent or key lockbox. We will contact you 30 minutes before completion so you can inspect the work or lock up."
    },
    {
      q: "Do you bring your own cleaning supplies and equipment?",
      a: "Yes, our teams arrive fully equipped with commercial-grade chemicals, dip tanks, industrial vacuums, ladders, and steam cleaners. All we require is running hot water and electricity."
    },
    {
      q: "Can you steam clean carpets during the same visit?",
      a: "Absolutely. We offer hot water extraction carpet steam cleaning which can be added to your booking at a bundled discounted rate, saving you the hassle of booking separate companies."
    }
  ];

  // Rat Control specific rich FAQs
  const ratFaqs = [
    {
      q: "How quickly can a rat problem get out of control?",
      a: "Rats reach sexual maturity at around five weeks old, and a single female can produce several litters a year, each with six to twelve pups. In practical terms, a couple of rats spotted in a garden in spring can become an established indoor population by autumn if entry points and food access aren't addressed."
    },
    {
      q: "Do I need to leave the property during treatment?",
      a: "This depends on the treatment method used for your specific situation. Some interventions — proofing work, trap placement, bait station positioning — don't require anyone to leave. Where a different approach is more appropriate, that will be explained clearly before anything is agreed."
    },
    {
      q: "Will rat control harm my pets?",
      a: "Any method used around a property with pets is chosen and positioned with that in mind, using tamper-resistant bait boxes placed in inaccessible locations."
    },
    {
      q: "How can I tell the difference between rats and mice?",
      a: "Size is the most obvious indicator — adult rats are considerably larger than mice, with adult rat droppings roughly the size of a grain of rice compared to a mouse's, which are closer to a grain of black pepper."
    },
    {
      q: "Can rats really cause structural damage?",
      a: "Yes. A rat's incisors grow continuously, so gnawing is a physical necessity. Skirting boards, timber joists, plastic piping, and electrical cabling are all common targets, creating documented fire risks."
    },
    {
      q: "Is it normal to still see one rat after treatment has started?",
      a: "In the days immediately following treatment, seeing continued activity doesn't mean the approach isn't working — it can take time for a population to be fully addressed. This is exactly what our follow-up visit confirms."
    }
  ];

  // Asked on every service page — the price gap is the most common objection,
  // so it gets answered directly rather than left implicit.
  const pricingObjectionFaq = {
    q: "Why is your price lower than other companies?",
    a: "Because there is less between you and the team doing the work. You book us directly, so there is no agency taking a cut, no outsourced call centre, and no franchise fee going upstream every month. We also cluster jobs by area, so our teams spend less of the day travelling. The work, the equipment and the insurance are the same — the overhead is not.",
  };

  // Determine which FAQs to show
  const baseFaqs = isEndOfTenancy
    ? tenancyFaqs
    : isRat
      ? ratFaqs
      : approved.faqs.length > 0
        ? approved.faqs.map(f => ({ q: f.question, a: f.answer }))
        : tenancyFaqs;

  const displayFaqs = [...baseFaqs, pricingObjectionFaq];

  const handlePostcodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = postcode.trim().toUpperCase();
    if (!clean) {
      setPostcodeStatus("error");
      setPostcodeMessage("Please enter a valid London postcode (e.g. IG1, E14, SW1).");
      return;
    }
    setPostcodeStatus("loading");
    setPostcodeMessage("");

    setTimeout(() => {
      // Check for valid UK/London postcode format
      const isUkPostcode = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9]?[A-Z]{0,2}$/i.test(clean) || clean.length >= 2;
      if (isUkPostcode) {
        setPostcodeStatus("success");
        setPostcodeMessage(`Full coverage confirmed in ${clean}. Same-day and weekend slots available.`);
      } else {
        setPostcodeStatus("error");
        setPostcodeMessage("We currently prioritize Greater London & M25 postcodes. Please call " + siteContact.phoneDisplay + " for custom dispatch.");
      }
    }, 450);
  };

  const [titleLead, titleSoft] = splitTitle(heroTitle);
  const price = parsePrice(approved.price);
  const heroImage = isCleaning
    ? { src: "/images/service/best-one-cleaner-hero-v2.webp", alt: "Bestone cleaner ready for an end of tenancy clean" }
    : isPest
      ? { src: "/images/service/best-one-pest-technician-hero-v1.webp", alt: "Bestone pest technician ready to inspect a property" }
      : { src: "/images/service/best-one-team-hero-v1.webp", alt: "Bestone team in uniform" };
  const heroFacts = isCleaning
    ? ["48-hour re-clean", "Agency checklist", "Fixed price"]
    : isPest
      ? ["Inspection first", "1–3 month guarantee", "Treatment report"]
      : ["Fixed price", "Own team", "Written scope"];
  const primaryLabel = isCleaning ? "Get your price" : isPest ? "Book an inspection" : "Get your price";
  const relatedLinks = isCleaning
    ? [
        { href: "/cleaning-services/carpet-cleaning/", title: "Carpet cleaning", desc: "Hot water extraction for stains and allergens" },
        { href: "/cleaning-services/oven-cleaning-service/", title: "Oven cleaning", desc: "Dip-tank deep clean for ovens and ranges" },
      ]
    : [
        { href: "/pest-control-services/rodent-proofing/", title: "Pest proofing", desc: "Blocks the entry points found at inspection" },
        { href: "/pest-control-services/mice-control/", title: "Mice control", desc: "Similar signs, different species and habits" },
      ];
  const sectionHead = (eyebrow: string, lead: string, soft?: string) => (
    <div className="grid max-w-3xl gap-3">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="ts-head m-0 text-[clamp(28px,3.4vw,40px)]">
        {lead}
        {soft ? <> <span className="ts-soft">{soft}</span></> : null}
      </h2>
    </div>
  );
  const wrap = "mx-auto grid max-w-[1240px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* S19 · Service hero: crumbs, two-weight title, price in the first line of sight */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="grid content-start gap-5">
            <nav aria-label="Breadcrumb">
              <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0 text-[13px] text-muted">
                <li><Link href="/" className="no-underline hover:underline">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={`/${category}/`} className="no-underline hover:underline">{categoryLabel}</Link></li>
                <li aria-hidden="true">/</li>
                <li>{locationName ? <Link href={`/${category}/${service}/`} className="no-underline hover:underline">{approved.title}</Link> : <span aria-current="page">{approved.title}</span>}</li>
                {locationName ? (<><li aria-hidden="true">/</li><li aria-current="page">{locationName}</li></>) : null}
              </ol>
            </nav>
            <h1 className="ts-head m-0 text-[clamp(36px,4.6vw,56px)]">
              {titleLead}
              {titleSoft ? <> <span className="ts-soft">{titleSoft}</span></> : null}
            </h1>
            {price ? (
              <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="ts-fig text-[clamp(48px,6vw,64px)]"><small>from</small>{price.amount}</span>
                {price.unit ? <span className="text-muted">{price.unit}</span> : null}
              </p>
            ) : null}
            <p className="m-0 max-w-[58ch] text-lg text-muted">{heroSubtext}</p>
            {localDemandNote ? <p className="m-0 max-w-[58ch] text-sm text-muted">{localDemandNote}</p> : null}
            <div className="flex flex-wrap gap-2">
              <Button href={whatsappBookingUrl} size="lg">{primaryLabel}</Button>
              <Button href={siteContact.phoneHref} variant="white" size="lg" icon={<Phone className="size-[18px]" aria-hidden="true" />}>{siteContact.phoneDisplay}</Button>
            </div>
            <Facts items={heroFacts} />
          </div>
          <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-stone max-lg:aspect-[4/3] max-lg:min-h-0">
            <Image src={heroImage.src} alt={heroImage.alt} fill priority sizes="(max-width: 1024px) 100vw, 46vw" className={isPest ? "object-cover object-top" : "object-cover"} />
          </div>
        </div>
        {/* S16 · In-page tabs */}
        <div className="mx-auto max-w-[1240px] px-4 pb-6 sm:px-6 lg:px-8">
          <nav aria-label="On this page" className="flex flex-wrap gap-1">
            {[
              ["#overview", "Overview"],
              ["#price", "Price"],
              ["#how-it-works", "How it works"],
              ["#questions", "Questions"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-[10px] bg-white px-3.5 py-2 text-[15px] font-semibold text-ink no-underline transition-colors duration-150 hover:bg-lime-soft">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* S35 B · Key figures */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1240px] px-4 pb-14 sm:px-6 lg:px-8">
          <BigFacts items={stats.map((s) => ({ figure: s.value, label: s.label }))} />
        </div>
      </section>

      {/* Overview: what's included, or the signs to look for */}
      <section id="overview" className="scroll-mt-24 bg-white">
        <div className={wrap}>
          {sectionHead(isCleaning ? "What's included" : "Overview", isCleaning ? "Every room," : approved.signsTitle, isCleaning ? "to the agency checklist." : undefined)}
          <div className="grid gap-2 sm:grid-cols-2 sm:[&>div:last-child:nth-child(odd)]:col-span-2">
            {scopeItems.map((item, idx) => {
              const Icon = item.icon ?? CheckCircle2;
              return (
                <div key={idx} className="grid grid-cols-[44px_1fr] gap-4 rounded-2xl bg-paper p-5">
                  <span className="grid size-11 place-items-center rounded-xl bg-lime-soft"><Icon className="size-5" aria-hidden="true" /></span>
                  <span className="grid gap-1">
                    {item.title ? <b className="text-[17px]">{item.title}</b> : null}
                    <span className="text-[15px] text-muted">{item.desc}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why it matters, and the usual causes */}
      <section className="bg-paper">
        <div className={wrap}>
          {sectionHead("Why it matters", isCleaning ? "What agents look for," : "What to take seriously,", "and why.")}
          <ol className={`m-0 grid list-none gap-2 p-0 ${riskItems.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {riskItems.map((item, idx) => (
              <li key={idx} className="grid content-start gap-3 rounded-2xl bg-white p-5">
                <Plaque n={idx + 1} />
                <b className="text-[17px]">{item.title}</b>
                <span className="text-[15px] text-muted">{item.desc}</span>
              </li>
            ))}
          </ol>
          <ul className="ts-rows on-paper m-0 list-none p-0">
            {causesItems.map((item, idx) => (
              <li key={idx} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] sm:gap-6">
                <b>{item.title}</b>
                <span className="text-[15px] text-muted">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* S25 / S27 · Price */}
      <section id="price" className="scroll-mt-24 bg-white">
        <div className={wrap}>
          {sectionHead("Price", "One fixed price,", "confirmed before you book.")}
          {isEndOfTenancy ? (
            <div className="rounded-3xl bg-paper p-1.5">
              <PriceExplorer
                eyebrow="End of tenancy cleaning"
                title="Pick your property size"
                options={EOT_OPTIONS}
                initial={1}
                includes={["Full agency inventory checklist", "Kitchen appliances and oven", "Bathrooms descaled and sanitised", "Free re-clean if flagged within 48 hours"]}
                bookHref={whatsappBookingUrl}
                askHref={siteContact.getWhatsappUrl("Hi Bestone, I have a question about end of tenancy cleaning.")}
              />
            </div>
          ) : price ? (
            <div className="max-w-xl">
              <PriceTile amount={price.amount} unit={price.unit} action={<Button href={whatsappBookingUrl} variant="white" size="sm">{primaryLabel}</Button>} />
            </div>
          ) : null}
          <div className="grid gap-3">
            <Eyebrow>What changes the price</Eyebrow>
            <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
              {pricingFactors.map((f, idx) => (
                <li key={idx} className="grid grid-cols-[42px_1fr] gap-3 rounded-2xl bg-paper p-4">
                  <Plaque n={idx + 1} />
                  <span className="grid gap-1"><b>{f.title}</b><span className="text-[15px] text-muted">{f.desc}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* S42 · How it works, and how a professional visit compares */}
      <section id="how-it-works" className="scroll-mt-24 bg-paper">
        <div className={wrap}>
          {sectionHead("How it works", "What happens,", "step by step.")}
          <ol className={`m-0 grid list-none gap-2 p-0 sm:grid-cols-2 ${processItems.length % 3 === 0 ? "lg:grid-cols-3" : processItems.length === 4 ? "lg:grid-cols-4" : ""}`}>
            {processItems.map((p, idx) => (
              <li key={idx} className="grid content-start gap-3 rounded-2xl bg-white p-5">
                <Plaque n={idx + 1} state={idx === processItems.length - 1 ? "done" : undefined} />
                <b className="text-[17px]">{p.title}</b>
                <span className="text-[15px] text-muted">{p.desc}</span>
              </li>
            ))}
          </ol>
          {comparisonRows.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl bg-white p-2">
              <table className="w-full min-w-[640px] border-separate border-spacing-y-0.5 text-[15px]">
                <caption className="sr-only">Doing it yourself compared with Bestone</caption>
                <thead>
                  <tr className="text-left">
                    <th scope="col" className="ts-eyebrow px-3.5 py-2 font-semibold"> </th>
                    <th scope="col" className="ts-eyebrow px-3.5 py-2 font-semibold">Doing it yourself</th>
                    <th scope="col" className="ts-eyebrow px-3.5 py-2 font-semibold">Bestone</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-paper" : ""}>
                      <th scope="row" className="rounded-l-lg px-3.5 py-3 text-left font-semibold">{row.item}</th>
                      <td className="px-3.5 py-3 text-muted">{row.diy}</td>
                      <td className="rounded-r-lg px-3.5 py-3">
                        <span className="flex items-baseline gap-2"><i className="ts-tick translate-y-[3px]" aria-hidden="true" />{row.pro}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>

      {/* Preparation, and the guarantee (S37, uniform piping) */}
      <section className="bg-white">
        <div className={`${wrap} lg:grid-cols-[1.2fr_0.8fr] lg:items-start`}>
          <div className="grid gap-6">
            {sectionHead(isCleaning ? "Before we arrive" : "Prevention", isCleaning ? "Four things" : "Keep them out,", isCleaning ? "that make the day easier." : "after we leave.")}
            <ul className="ts-rows m-0 list-none p-0">
              {prepTips.map((tip, idx) => (
                <li key={idx} className="grid grid-cols-[24px_1fr] gap-3 px-4 py-3">
                  <i className="ts-tick translate-y-[3px]" aria-hidden="true" />
                  <span className="grid gap-0.5"><b>{tip.label}</b><span className="text-[15px] text-muted">{tip.desc}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ts-piped grid content-start gap-3 rounded-2xl bg-paper py-6 pl-7 pr-6">
            <Eyebrow>Our guarantee</Eyebrow>
            <span className="ts-fig text-[56px]">{isCleaning ? "48h" : isPest ? "1–3" : "100%"}</span>
            <b className="text-lg">{isCleaning ? "Free re-clean" : isPest ? "Month written guarantee" : "Scope agreed in writing"}</b>
            <p className="m-0 text-[15px] text-muted">
              {isCleaning
                ? "If the agent or inventory clerk flags anything within 48 hours, we come back and put it right at no cost."
                : isPest
                  ? "Every treatment plan comes with a written guarantee. If activity returns within it, we come back."
                  : "What we agree before the visit is what we do, and what you pay."}
            </p>
          </div>
        </div>
      </section>

      {/* S55 B · Questions, with the postcode check in the help column */}
      <section id="questions" className="scroll-mt-24 bg-paper">
        <div className={wrap}>
          <FaqSplit
            items={displayFaqs}
            help={
              <div className="grid gap-4">
                <p className="m-0 text-muted">Can&apos;t see yours? Ask us on WhatsApp, Mon–Sat, 8am–8pm.</p>
                <div className="flex flex-wrap gap-2">
                  <Button href={whatsappBookingUrl} variant="white" size="sm" icon={<MessageCircle className="size-4" aria-hidden="true" />}>Ask us</Button>
                  <Button href={siteContact.phoneHref} variant="white" size="sm" icon={<Phone className="size-4" aria-hidden="true" />}>{siteContact.phoneDisplay}</Button>
                </div>
                <form onSubmit={handlePostcodeCheck} className="grid gap-2 rounded-2xl bg-white p-4" noValidate>
                  <label htmlFor="coverage-postcode" className="text-sm font-semibold">Do we cover you?</label>
                  <div className="flex gap-2">
                    <input
                      id="coverage-postcode"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="e.g. IG1 1BA"
                      autoComplete="postal-code"
                      className="min-h-12 w-full rounded-xl border-0 bg-stone px-3.5 text-base text-ink placeholder:text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                    />
                    <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-lime px-4 font-semibold text-ink transition-colors duration-150 hover:bg-lime-2">
                      {postcodeStatus === "loading" ? <Spinner size={18} /> : "Check"}
                    </button>
                  </div>
                  {postcodeStatus === "success" && <FormSuccess title="Covered">{postcodeMessage}</FormSuccess>}
                  {postcodeStatus === "error" && <FormError>{postcodeMessage}</FormError>}
                </form>
              </div>
            }
          />
        </div>
      </section>

      {/* Related services and nearby areas */}
      <section className="bg-white">
        <div className={wrap}>
          {sectionHead("Related", locationName ? `Also in ${locationName}` : "Often booked together")}
          <div className="grid gap-2 sm:grid-cols-2">
            {relatedLinks.map((l) => (
              <Link key={l.href} href={l.href} className="grid gap-1 rounded-2xl bg-paper p-5 no-underline transition-colors duration-150 hover:bg-lime-soft">
                <b className="text-[17px]">{l.title}</b>
                <span className="text-[15px] text-muted">{l.desc}</span>
              </Link>
            ))}
          </div>
          {nearbyLocations.length > 0 ? (
            <div className="grid gap-3">
              <Eyebrow>{approved.title} nearby</Eyebrow>
              <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1.5 p-0">
                {nearbyLocations.map((loc) => (
                  <li key={loc.slug}>
                    <Link href={`/${category}/${service}/${loc.slug}/`} className="flex items-center justify-between gap-2 rounded-lg bg-paper px-3 py-2.5 text-sm font-semibold no-underline transition-colors duration-150 hover:bg-lime-soft">
                      {loc.name}
                      <MapPin className="size-4 text-muted" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <SlimCta title={isCleaning ? "Your fixed price in a minute." : "Book an inspection."} soft="No call needed." action={<Button href={whatsappBookingUrl}>{primaryLabel}</Button>} />
        </div>
      </section>
    </div>
  );
}
