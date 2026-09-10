"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Phone,
  Star, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
  Flame,
  CheckCircle2,
  Calendar,
  Award,
  FileText,
  BadgeCheck,
  Building,
  Home as HomeIcon,
  Layers,
  HelpCircle,
  PhoneCall,
} from "lucide-react";
import type { ApprovedServicePage } from "@/content/approved-service-pages";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon } from "@hugeicons/core-free-icons";
import { SECONDARY_BUTTON_CLASS, SIDEBAR_CALL_BUTTON_CLASS } from "@/lib/ui-classes";
import { siteContact } from "@/config/site-contact";
import { Spinner } from "@/components/ui/spinner";
import { FormSuccess, FormError } from "@/components/ui/form-status";

export interface MintLimeServiceLayoutProps {
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

export function MintLimeServiceLayout({
  category,
  service,
  categoryLabel,
  approved,
  locationName,
  locationIntro,
  localDemandNote,
  nearbyLocations = [],
}: MintLimeServiceLayoutProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [postcode, setPostcode] = useState(locationName ? locationName : "");
  const [postcodeStatus, setPostcodeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [postcodeMessage, setPostcodeMessage] = useState<string>("");

  const isCleaning = category.includes("cleaning");
  const whatsappBookingUrl = siteContact.getWhatsappUrl(`Hi, I'd like to book ${categoryLabel} with Best One Services.`);
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
        setPostcodeMessage("We currently prioritize Greater London & M25 postcodes. Please call 020 8090 2267 for custom dispatch.");
      }
    }, 450);
  };

  return (
    <div className="theme-mint-lime min-h-screen bg-[#F9FCF5] text-[#1F3A00]">
      
      {/* ===================================================================
          1. CLEAN EDITORIAL HERO SECTION
          =================================================================== */}
      <section className="bg-[#F9FCF5] border-b border-[#E5FBC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#1F3A00]/80 font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <span aria-hidden="true" className="text-[#1F3A00]/40">/</span>
            <Link href={`/${category}/`} className="hover:underline">{categoryLabel}</Link>
            <span aria-hidden="true" className="text-[#1F3A00]/40">/</span>
            <Link href={`/${category}/${service}/`} className="hover:underline font-medium">{approved.title}</Link>
            {locationName && (
              <>
                <span aria-hidden="true" className="text-[#1F3A00]/40">/</span>
                <span className="font-semibold text-[#1F3A00]">{locationName}</span>
              </>
            )}
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid lg:grid-cols-[1.08fr_0.92fr] gap-12 items-center">
          <div className="space-y-6">

            {/* Single eyebrow badge */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#DCFAB7]/80 border border-[#B7F56A] text-xs font-bold uppercase tracking-wider text-[#1F3A00] w-fit shadow-2xs">
                {categoryLabel} · {locationName ? `${locationName}, London` : (isRat ? "Rats & mice" : approved.title)}
              </span>
            </div>

            <h1 className="m-0 font-heading text-4xl sm:text-5xl lg:text-[52px] font-semibold leading-[1.06] tracking-tight text-[#1F3A00] max-w-2xl">
              {heroTitle}
            </h1>
            <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]/90 max-w-xl font-normal">
              {heroSubtext}
            </p>
            {localDemandNote && (
              <p className="m-0 text-sm leading-relaxed text-[#1F3A00]/70 max-w-xl font-normal">
                {localDemandNote}
              </p>
            )}

            {/* CTAs — both without icon badges for consistency */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={whatsappBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shadow-2xs"
              >
                {isCleaning ? "Get Instant Quote" : "Request Assessment"}
              </Link>
              <Link
                href="/contact/"
                className={`inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium ${SECONDARY_BUTTON_CLASS}`}
              >
                Call Us
              </Link>
            </div>

            {/* Trust checkmarks */}
            <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-1 text-sm font-medium text-[#1F3A00]">
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#DCFAB7] flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                {isCleaning ? "48-Hour re-clean guarantee" : "Assessment before quoting"}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#DCFAB7] flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                {isCleaning ? "Full agency inventory checklist" : "Follow-up visit included"}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#DCFAB7] flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                {locationName ? `Covered across ${locationName}` : "Covered across London"}
              </span>
            </div>
          </div>

          {/* Hero image — plain neutral border, no overlay card */}
          <div>
            <div className="relative aspect-[4/3] rounded-[22px] overflow-hidden border border-[#D1E8B8] bg-[#EBF4DD]">
              <Image
                src={
                  isCleaning
                    ? "/images/service/best-one-cleaner-hero-v2.webp"
                    : isPest
                      ? "/images/service/best-one-pest-technician-hero-v1.webp"
                      : "/images/service/stock-hero-cleaning.jpg"
                }
                alt={
                  isCleaning
                    ? "Best One Services cleaner ready for an end of tenancy clean"
                    : isPest
                      ? "Best One Services pest-control technician ready to inspect a property"
                      : "Technician inspecting property"
                }
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className={isPest ? "object-cover object-top" : "object-cover"}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. KEY STATS SECTION
          =================================================================== */}
      <section className="border-b border-[#E5FBC9] bg-[#F9FCF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-6 grid-cols-2 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <span className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                {stat.value}
              </span>
              <span className="text-sm leading-snug text-[#1F3A00]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          3. MAIN CONTENT (LEFT) & STICKY SIDEBAR (RIGHT)
          =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_330px] gap-12 sm:gap-16 items-start">
          
          {/* LEFT MAIN CONTENT COLUMN */}
          <div className="flex flex-col gap-16 min-w-0">

            {/* SECTION 1: OVERVIEW */}
            <section id="overview" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                What professional {approved.title.toLowerCase()} involves
              </h2>
              <div className="flex flex-col gap-4 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                {isCleaning ? (
                  <>
                    <p className="m-0">
                      Professional {approved.title.toLowerCase()} isn&apos;t just a standard vacuum and dust — it is an intensive, top-to-bottom restoration engineered to meet the stringent standards of UK inventory clerks, letting agencies, and deposit protection schemes.
                    </p>
                    <p className="m-0">
                      Our vetted London teams work methodically through every room using commercial-grade steamers, dip-tank oven degreasers, and descaling chemicals that restore fixtures to their move-in condition. We guarantee the quality in writing with our 48-hour re-clean commitment.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="m-0">
                      Professional {approved.title.toLowerCase()} isn&apos;t a single action — it&apos;s a short sequence of decisions, each of which depends on what&apos;s actually found at the property. That starts with confirming genuine activity, understanding how widespread it is, and identifying how issues are originating. Only once that picture is clear does treatment get chosen.
                    </p>
                    <p className="m-0">
                      A proper assessment takes that guesswork out, which is both more accurate and faster to resolve overall because the right method gets used from the start.
                    </p>
                  </>
                )}
              </div>
              <div className="p-6 bg-[#B7F56A] rounded-[18px] font-heading font-medium text-lg sm:text-xl leading-snug text-[#1F3A00] border border-[#99D055]">
                {isCleaning
                  ? "Deposit protection schemes require properties to be returned in professional condition. Our agency-approved cleaning standards ensure zero handover disputes."
                  : "Rats and pests are resilient, adaptable creatures. Treating an infestation isn't a single clever trick — it's an accurate diagnosis plus consistent follow-through."}
              </div>
            </section>

            {/* SECTION 2: SIGNS / INCLUSIONS */}
            <section id="signs" className="scroll-mt-24 flex flex-col gap-6">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                {isCleaning ? "Complete room scope and cleaning inclusions" : `Signs of a ${approved.title.toLowerCase()} issue`}
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                {isCleaning
                  ? "Every appointment follows an exhaustive 50-point checklist covering kitchens, bathrooms, bedrooms, and common areas:"
                  : "Prompt diagnosis prevents small issues from escalating. These are the primary indicators worth paying attention to:"}
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {scopeItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white border border-[#E5FBC9] rounded-[18px] p-5 flex flex-col gap-2.5 shadow-2xs">
                      <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#B7F56A] text-[#1F3A00]">
                        <Icon className="w-5 h-5 text-[#1F3A00]" />
                      </span>
                      <strong className="text-base font-semibold text-[#1F3A00]">{item.title}</strong>
                      <span className="text-sm leading-relaxed text-[#1F3A00]">
                        {item.desc}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid sm:grid-cols-2 gap-5 items-center p-5 bg-[#DCFAB7] rounded-[20px] border border-[#E5FBC9]">
                <div>
                  <p className="m-0 text-base leading-relaxed text-[#1F3A00]">
                    {isCleaning
                      ? "Our end of tenancy cleaning checklists are engineered to align with standard inventory checkout criteria commonly required across London by major letting agents (such as Foxtons, Savills, and Dexters) and independent ARLA Propertymark inventory clerks."
                      : "One sign on its own isn't necessarily cause for alarm. What generally warrants a closer look is two or more of these signs appearing in the same area within a short period."}
                  </p>
                  {isCleaning && (
                    <p className="m-0 pt-2 text-[11px] text-[#1F3A00]/70 italic leading-normal">
                      *Independent professional service. Agent references denote alignment with standard UK inventory benchmarks and do not imply formal endorsement or partnership.
                    </p>
                  )}
                </div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#D1E8B8] bg-[#EBF4DD] shadow-2xs">
                  {/* TEMP STOCK PHOTO - replace with real branded photography when available */}
                  <Image
                    src={isCleaning ? "/images/service/stock-oven-kitchen.jpg" : "/images/service/stock-oven-kitchen.jpg"}
                    alt={isCleaning ? "Professional cleaning specialist with spray and microfiber cloth restoring kitchen surface" : "Inspection detail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3: RISKS / IMPORTANCE */}
            <section id="risks" className="scroll-mt-24 flex flex-col gap-6">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                {isCleaning ? "Why professional move-out cleaning matters" : "Why early action is essential"}
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                {isCleaning
                  ? "Attempting to clean a rental property with domestic sprays carries substantial financial and logistical risks:"
                  : "Prompt intervention provides three concrete benefits over delaying treatment:"}
              </p>

              <div className="grid sm:grid-cols-3 gap-px bg-[#99D055] rounded-[20px] overflow-hidden border border-[#99D055]">
                {riskItems.map((risk, idx) => (
                  <div key={idx} className="bg-white p-6 border-t-4 border-[#B7F56A] flex flex-col gap-2.5">
                    <span className="text-xs font-bold tracking-wider text-[#1F3A00]">POINT {risk.num}</span>
                    <strong className="font-heading text-2xl font-semibold text-[#1F3A00]">{risk.title}</strong>
                    <span className="text-sm leading-relaxed text-[#1F3A00]">
                      {risk.desc}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: CAUSES / HOTSPOTS */}
            <section id="causes" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                {isCleaning ? "Key deposit deduction hotspots" : "Why issues develop in a property"}
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                {isCleaning
                  ? "Based on over 5,000 completed London inventory inspections, these are the four areas most frequently flagged for deductions:"
                  : "Problems don't emerge at random — they respond to access, food, warmth, and moisture:"}
              </p>

              <div className="divide-y divide-[#E5FBC9] border-y border-[#E5FBC9]">
                {causesItems.map((cause, idx) => (
                  <div key={idx} className="grid sm:grid-cols-[220px_1fr] gap-2 sm:gap-6 py-5">
                    <strong className="text-base font-semibold text-[#1F3A00]">{cause.title}</strong>
                    <span className="text-base leading-relaxed text-[#1F3A00]">{cause.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 5: PROCESS */}
            <section id="process" className="scroll-mt-24 flex flex-col gap-6">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Our step-by-step process
              </h2>

              <div className="divide-y divide-[#E5FBC9] border-y border-[#E5FBC9]">
                {processItems.map((step, idx) => (
                  <div key={idx} className="grid grid-cols-[48px_1fr] gap-5 py-5 items-start">
                    <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#B7F56A] text-[#1F3A00] font-bold text-sm border border-[#99D055]">
                      {step.step}
                    </span>
                    <div className="space-y-1">
                      <h3 className="m-0 text-lg font-semibold text-[#1F3A00]">{step.title}</h3>
                      <p className="m-0 text-base leading-relaxed text-[#1F3A00]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 6: DIY VS PRO TABLE */}
            <section id="diy-vs-pro" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                {isCleaning ? "DIY cleaning vs. professional guarantee" : "DIY measures vs. professional treatment"}
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                {isCleaning
                  ? "Comparing domestic supermarket cleaning with our fully equipped commercial service:"
                  : "Where over-the-counter measures fall short compared to professional methodology:"}
              </p>

              <div className="overflow-x-auto border border-[#E5FBC9] rounded-[20px] bg-white shadow-2xs">
                <table className="w-full min-w-[500px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-[#DCFAB7] text-[#1F3A00]">
                      <th className="p-3.5 sm:p-4 font-semibold">Consideration</th>
                      <th className="p-3.5 sm:p-4 font-semibold">{isCleaning ? "DIY Domestic Cleaning" : "DIY Traps / Sprays"}</th>
                      <th className="p-3.5 sm:p-4 font-semibold">Best One Professional Service</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5FBC9] text-[#1F3A00]">
                    {comparisonRows.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-3.5 sm:p-4 font-semibold text-[#1F3A00]">{row.item}</td>
                        <td className="p-3.5 sm:p-4">{row.diy}</td>
                        <td className="p-3.5 sm:p-4 font-medium text-[#1F3A00]">{row.pro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 7: FACTORS AFFECTING PRICE */}
            <section id="factors" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                What affects the price and scope
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {pricingFactors.map((factor, idx) => (
                  <div key={idx} className="p-5 bg-[#DCFAB7] rounded-[16px] flex flex-col gap-1.5 border border-[#E5FBC9]">
                    <strong className="text-base font-semibold text-[#1F3A00]">{factor.title}</strong>
                    <span className="text-sm leading-relaxed text-[#1F3A00]">{factor.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 8: PREVENTION & PREPARATION */}
            <section id="prevention" className="scroll-mt-24 grid md:grid-cols-[1fr_280px] gap-7 items-start">
              <div className="flex flex-col gap-4">
                <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                  {isCleaning ? "Preparation advice for your booking" : "Prevention and long-term protection"}
                </h2>
                <div className="space-y-3 text-base leading-relaxed text-[#1F3A00]">
                  {prepTips.map((tip, idx) => (
                    <p key={idx} className="m-0">
                      <strong className="text-[#1F3A00]">{tip.label}: </strong>
                      {tip.desc}
                    </p>
                  ))}
                </div>
              </div>

              <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden border border-[#D1E8B8] bg-[#EBF4DD] shadow-2xs">
                {/* TEMP STOCK PHOTO - replace with real branded photography when available */}
                <Image
                  src={isCleaning ? "/images/service/stock-handover-checklist.jpg" : "/images/service/stock-handover-checklist.jpg"}
                  alt={isCleaning ? "House keys with property handover keychain ready for landlord deposit release" : "Property protection"}
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </section>

            {/* SECTION 9: COMMON QUESTIONS (FAQS ACCORDION) */}
            <section id="faqs" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Frequently asked questions
              </h2>

              <div className="border border-[#E5FBC9] rounded-[20px] bg-white overflow-hidden divide-y divide-[#E5FBC9] shadow-2xs">
                {displayFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  const panelId = `faq-panel-${idx}`;
                  const triggerId = `faq-trigger-${idx}`;
                  return (
                    <div key={idx} className="transition-colors duration-150">
                      <button
                        id={triggerId}
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-base sm:text-lg text-[#1F3A00] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F3A00]"
                      >
                        <span>{faq.q}</span>
                        <span 
                          aria-hidden="true"
                          data-open={isOpen}
                          className={`accordion-chevron w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[#1F3A00] transition-colors duration-200 ${
                            isOpen ? "bg-[#B7F56A]" : ""
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </button>
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        className="accordion-panel"
                        data-open={isOpen}
                      >
                        <div>
                          <p className="m-0 px-5 pb-5 text-sm sm:text-base leading-relaxed text-[#1F3A00]">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 9b: POSTCODE COVERAGE CHECK */}
            <section id="coverage-check" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Check coverage for your postcode
              </h2>
              <form
                onSubmit={handlePostcodeCheck}
                className="flex flex-col gap-3 p-5 rounded-[16px] border border-[#B7F56A] bg-white"
              >
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <label htmlFor="coverage-postcode" className="sr-only">
                    Enter your London postcode
                  </label>
                  <input
                    id="coverage-postcode"
                    name="postcode"
                    type="text"
                    autoComplete="postal-code"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="e.g. IG1, E14, SW1"
                    className="flex-1 min-w-0 px-4 py-3 rounded-md bg-[#F9FCF5] border border-[#B7F56A] text-base text-[#1F3A00] placeholder:text-[#4D7220] focus:outline-none focus:ring-2 focus:ring-[#99D055] transition-colors duration-150"
                  />
                  <button
                    type="submit"
                    disabled={postcodeStatus === "loading"}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {postcodeStatus === "loading" ? (
                      <>
                        <Spinner size={18} />
                        <span>Checking…</span>
                      </>
                    ) : (
                      <span>Check coverage</span>
                    )}
                  </button>
                </div>

                <div aria-live="polite">
                  {postcodeStatus === "success" && (
                    <FormSuccess title="Covered">{postcodeMessage}</FormSuccess>
                  )}
                  {postcodeStatus === "error" && <FormError>{postcodeMessage}</FormError>}
                </div>
              </form>
            </section>

            {/* SECTION 10: RELATED SERVICES & REGIONAL HUBS */}
            <section id="related" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                {locationName ? `Services in ${locationName} & Surrounding Hubs` : "Related services & London coverage"}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3.5">
                {isCleaning ? (
                  <>
                    <Link 
                      href="/cleaning-services/carpet-cleaning/"
                      className="flex flex-col gap-1.5 p-5 border border-[#E5FBC9] rounded-[16px] bg-white hover:border-[#1F3A00] transition-colors duration-150"
                    >
                      <strong className="text-base font-semibold text-[#1F3A00]">Carpet Cleaning</strong>
                      <span className="text-sm text-[#1F3A00]">Hot water extraction steam cleaning for stains & allergens</span>
                    </Link>
                    <Link 
                      href="/cleaning-services/oven-cleaning-service/"
                      className="flex flex-col gap-1.5 p-5 border border-[#E5FBC9] rounded-[16px] bg-white hover:border-[#1F3A00] transition-colors duration-150"
                    >
                      <strong className="text-base font-semibold text-[#1F3A00]">Oven & Cooker Cleaning</strong>
                      <span className="text-sm text-[#1F3A00]">Stand-alone deep dip-tank cleaning for ovens and AGAs</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/pest-control-services/rodent-proofing/"
                      className="flex flex-col gap-1.5 p-5 border border-[#E5FBC9] rounded-[16px] bg-white hover:border-[#1F3A00] transition-colors duration-150"
                    >
                      <strong className="text-base font-semibold text-[#1F3A00]">Pest proofing</strong>
                      <span className="text-sm text-[#1F3A00]">Blocks the entry points found during assessment</span>
                    </Link>
                    <Link 
                      href="/pest-control-services/mice-control/"
                      className="flex flex-col gap-1.5 p-5 border border-[#E5FBC9] rounded-[16px] bg-white hover:border-[#1F3A00] transition-colors duration-150"
                    >
                      <strong className="text-base font-semibold text-[#1F3A00]">Mice control</strong>
                      <span className="text-sm text-[#1F3A00]">Similar signs, different species and habits</span>
                    </Link>
                  </>
                )}
              </div>

              {nearbyLocations.length > 0 ? (
                <div className="pt-2 text-sm text-[#1F3A00] space-y-1">
                  <p className="m-0 font-medium text-[#1F3A00]">Also serving neighboring London districts:</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {nearbyLocations.map((loc) => (
                      <Link
                        key={loc.slug}
                        href={`/${category}/${service}/${loc.slug}/`}
                        className="px-3 py-1 rounded-full bg-white border border-[#E5FBC9] text-xs font-semibold text-[#1F3A00] hover:bg-[#B7F56A] transition-colors duration-150"
                      >
                        {loc.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="m-0 flex flex-wrap items-center gap-2 text-sm text-[#1F3A00]">
                  <Check className="w-4 h-4 text-[#1F3A00] stroke-[2.5]" />
                  Available across London —
                  <Link href="/areas/" className="font-semibold underline underline-offset-2 text-[#1F3A00]">see all covered areas →</Link>
                </p>
              )}
            </section>

          </div>

          {/* ===================================================================
              RIGHT COLUMN: STICKY ASSESSMENT SIDEBAR
              =================================================================== */}
          <aside className="lg:sticky lg:top-28 flex flex-col gap-4 bg-white border border-[#E5FBC9] rounded-[22px] p-6 shadow-2xs">
            <p className="m-0 text-xs font-bold uppercase tracking-wider text-[#1F3A00]">
              {isCleaning ? "Book This Service" : "Request an assessment"}
            </p>
            <h3 className="m-0 font-heading text-2xl font-semibold leading-tight text-[#1F3A00]">
              {locationName ? `Book in ${locationName}` : (isCleaning ? "Guaranteed Handover Clean" : "Get this looked at properly")}
            </h3>
            <p className="m-0 text-sm leading-relaxed text-[#1F3A00]">
              {isCleaning
                ? "Get a fixed quote in 60 seconds with our 48-hour re-clean guarantee included."
                : "Tell us what you've seen and where. We confirm the activity on site before recommending anything."}
            </p>

            <Link
              href={whatsappBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shadow-2xs"
            >
              {isCleaning ? "Book This Service" : "Request an assessment"}
            </Link>

            <Link
              href="/contact/"
              className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-md font-inter text-base font-medium ${SIDEBAR_CALL_BUTTON_CLASS}`}
            >
              <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={1.8} className="text-[#1F3A00]" />
              <span>Call Us</span>
            </Link>

            <div className="flex flex-col gap-1 pt-1 text-xs text-[#1F3A00]">
              <span className="flex items-center gap-2">
                Last reviewed:
                <span className="px-2 py-0.5 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] font-bold uppercase text-[10px] text-[#1F3A00]">
                  September 2026
                </span>
              </span>
              <span>Agency-approved checklist</span>
            </div>
          </aside>

        </div>

        {/* ===================================================================
            4. BOTTOM CALLOUT BANNER — Light editorial (forest green as accent only)
            =================================================================== */}
        <section className="mt-16 p-8 sm:p-11 rounded-[26px] bg-white border border-[#E5FBC9] grid md:grid-cols-[1fr_auto] gap-7 items-center relative overflow-hidden">
          {/* Lime accent stripe */}
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B7F56A] rounded-l-[26px]" aria-hidden="true" />
          <div className="space-y-3">
            <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
              {isCleaning ? "Ready to secure your full deposit return?" : "Seen one of the signs above?"}
            </h2>
            <p className="m-0 text-base leading-relaxed text-[#1F3A00]/80 max-w-xl font-normal">
              {isCleaning
                ? "Book your end of tenancy clean in under 2 minutes with our 48-hour re-clean guarantee and agency-approved checklist."
                : "Early activity is quicker and costs less to resolve than an established population. Book an assessment and get a straight answer on what's actually happening."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={whatsappBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer"
            >
              {isCleaning ? "Book Now — Save 20%" : "Request Assessment"}
            </Link>
            <Link
              href="/contact/"
              className={`inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium ${SECONDARY_BUTTON_CLASS}`}
            >
              Contact Support
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
