export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id?: string }
  | { type: "image"; url: string; alt: string; caption?: string; isWide?: boolean }
  | { type: "imagePair"; images: { url: string; alt: string; caption?: string }[] }
  | { type: "table"; title?: string; headers: string[]; rows: string[][]; sourceNote?: string }
  | { type: "callout"; variant: "tip" | "important" | "safety" | "pricing" | "expert"; title: string; text: string; ctaText?: string; ctaHref?: string }
  | { type: "pullFact"; stat: string; label: string; explanation: string }
  | { type: "steps"; items: { number: string; title: string; text: string }[] }
  | { type: "checklist"; title: string; items: string[] }
  | { type: "serviceCTA"; title: string; text: string; buttonText: string; href: string }
  | { type: "pricingCTA"; serviceName: string; startingPrice: string; href: string }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "sources"; title?: string; links: { label: string; url?: string }[] };

export interface GuidePost {
  id: string;
  slug: string;
  title: string;
  dek?: string;
  excerpt: string;
  category: "cleaning" | "pest-control" | "gardening" | "removals" | "pricing" | "checklists";
  categoryLabel: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readingTime: number; // minutes
  heroImage: string;
  heroCaption?: string;
  featured?: boolean;
  keyTakeaways?: string[];
  contentBlocks: ContentBlock[];
  relatedServiceIds?: string[];
  relatedPostSlugs?: string[];
}

export const GUIDE_CATEGORY_LABELS: Record<string, string> = {
  "pest-control": "Pest Control Guides",
  cleaning: "Cleaning Services Advice",
  gardening: "Gardening & Clearance Advice",
  removals: "Removals & Packing Guides",
  pricing: "London Cost & Price Guides",
  checklists: "Property Care Checklists",
};

export const GUIDES_DATABASE: GuidePost[] = [
  {
    id: "guide-1",
    slug: "how-to-tell-if-you-have-mice",
    title: "How to Tell If You Have Mice in Your London Home",
    dek: "Recognize early warning signs, unseal hidden ingress points, and understand professional treatment options.",
    excerpt: "Learn the 5 early warning signs of a rodent infestation, common entry points in London properties, and when to seek professional treatment.",
    category: "pest-control",
    categoryLabel: "Pest Control Guide",
    tags: ["Rodents", "Mice", "Inspection", "Pest Prevention"],
    author: {
      name: "Best One Pest Control Team",
      role: "Certified Pest Technicians",
    },
    publishedAt: "2026-02-01",
    updatedAt: "2026-02-07",
    readingTime: 6,
    heroImage: "/images/end-of-tenancy-hero.jpg",
    heroCaption: "A professional pest technician inspecting hidden kitchen kickboard gaps.",
    featured: true,
    keyTakeaways: [
      "Small dark droppings (3–6mm) near kitchen kickboards are the #1 sign of mice.",
      "Mice can fit through gaps as tiny as a pencil (6mm).",
      "Scratching noises inside cavity walls are most noticeable at night.",
      "Professional 2-visit treatment plans include entry point sealing & written guarantees.",
    ],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Mice are one of London's most persistent household pests. With Victorian conversions and terraced properties sharing floor cavities, a single rodent can rapidly move between neighbouring flats. Recognizing early warning signs allows property owners to act before an infestation becomes established.",
      },
      {
        type: "heading",
        level: 2,
        text: "1. Key Visual & Auditory Signs of Mice",
        id: "signs-of-mice",
      },
      {
        type: "paragraph",
        text: "Because mice are nocturnal, you are far more likely to detect physical evidence before seeing a live mouse during daytime hours. Inspect hidden utility zones carefully.",
      },
      {
        type: "pullFact",
        stat: "6 mm",
        label: "Ingress Capability",
        explanation: "A house mouse can squeeze through an exterior opening roughly the width of a standard HB pencil.",
      },
      {
        type: "checklist",
        title: "Physical Evidence Checklist",
        items: [
          "Dark spindle-shaped droppings (3–6mm long) in cupboards or under sinks",
          "Gnaw marks on wooden skirting boards, plastic food packaging, or cabling",
          "Grease smear marks along walls where mice run repeatedly",
          "Shredded paper, cardboard, or insulation gathered in hidden corners",
          "Nighttime scratching or skittering sounds inside walls and ceilings",
        ],
      },
      {
        type: "image",
        url: "/images/end-of-tenancy-hero.jpg",
        alt: "Inspecting entry points under kitchen sink units",
        caption: "Figure 1: Pipe penetrations behind kitchen kickboards are primary mouse entry points.",
        isWide: false,
      },
      {
        type: "callout",
        variant: "safety",
        title: "Electrical Cable Safety Hazard",
        text: "Mice constantly chew on electrical wiring to file down their incisors. Damaged cabling behind built-in appliances poses a documented electrical fire risk.",
      },
      {
        type: "heading",
        level: 2,
        text: "2. Common Entry Points in London Properties",
        id: "entry-points",
      },
      {
        type: "steps",
        items: [
          {
            number: "01",
            title: "Pipework Penetrations",
            text: "Unsealed gaps around kitchen sink waste pipes and radiator pipework entering floorboards.",
          },
          {
            number: "02",
            title: "Air Bricks & Perimeters",
            text: "Unprotected air vents or damaged exterior bricks along the lower building perimeter.",
          },
          {
            number: "03",
            title: "Underneath Kitchen Units",
            text: "Unsealed utility openings behind fitted dishwashers and kickboards.",
          },
        ],
      },
      {
        type: "serviceCTA",
        title: "Suspect Mice in Your Property?",
        text: "Best One offers 2-visit targeted rodent treatments with professional ingress sealing and written guarantees.",
        buttonText: "View Mouse Control Services",
        href: "/pest-control-services/mice-control/",
      },
      {
        type: "heading",
        level: 2,
        text: "3. Professional Treatment & Ingress Proofing",
        id: "treatment-proofing",
      },
      {
        type: "paragraph",
        text: "Store-bought traps rarely address the root cause of a rodent issue. A professional extermination plan includes thorough inspection, strategic baiting, and wire-mesh sealing of entry holes.",
      },
      {
        type: "table",
        title: "Mouse Control Treatment Plan Comparison",
        headers: ["Plan Option", "Visits Included", "Guarantee", "Typical Cost"],
        rows: [
          ["Single Visit Inspection", "1 Visit", "No Guarantee", "£90 – £120"],
          ["2-Visit Treatment Plan", "2 Visits", "1-Month Guarantee", "£160 – £190"],
          ["3-Visit Full Proofing", "3 Visits", "3-Month Guarantee", "£210 – £230"],
        ],
        sourceNote: "Rates match the published price list at /prices/.",
      },
      {
        type: "pricingCTA",
        serviceName: "Mouse Control Treatment",
        startingPrice: "£160 (2 Visits)",
        href: "/prices/?service=mouse-control",
      },
      {
        type: "heading",
        level: 2,
        text: "4. Frequently Asked Questions",
        id: "faqs",
      },
      {
        type: "faq",
        items: [
          {
            q: "How many visits are typically required for mouse control?",
            a: "Most residential infestations are resolved in 2 visits spaced 7–14 days apart.",
          },
          {
            q: "Are the treatments safe for household pets?",
            a: "Yes. All professional baits are secured inside tamper-resistant lockable bait stations.",
          },
        ],
      },
      {
        type: "sources",
        title: "Further Reading & Authorities",
        links: [
          { label: "BPCA Rodent Control Code of Practice", url: "https://bpca.org.uk" },
          { label: "Health & Safety Executive Pest Management Guidelines" },
        ],
      },
    ],
    relatedServiceIds: ["mice-control"],
    relatedPostSlugs: ["mouse-control-cost-guide-london", "end-of-tenancy-cleaning-checklist"],
  },
  {
    id: "guide-2",
    slug: "end-of-tenancy-cleaning-checklist",
    title: "Complete End of Tenancy Cleaning Checklist (Pass Inventory)",
    dek: "Room-by-room move-out cleaning guide engineered for London tenants, landlords, and letting agents.",
    excerpt: "A room-by-room move-out cleaning checklist designed to ensure full deposit return and pass estate agent inventory checks.",
    category: "checklists",
    categoryLabel: "Checklist",
    tags: ["Cleaning", "Move-Out", "Deposit", "Inventory"],
    author: {
      name: "Best One Cleaning Services",
      role: "Tenancy Operations Team",
    },
    publishedAt: "2026-01-15",
    readingTime: 5,
    heroImage: "/images/end-of-tenancy-hero.jpg",
    keyTakeaways: [
      "Property must be emptied of all personal belongings prior to deep cleaning.",
      "Appliance degreasing (oven, extractor fan, fridge) is the #1 item checked by clerks.",
      "Professional 48-hour re-clean guarantees protect your deposit.",
    ],
    contentBlocks: [
      {
        type: "paragraph",
        text: "Moving out of a rented flat in London is stressful. Estate agency inventory clerks inspect properties against strict cleanliness standards. Using an approved checklist ensures no crucial area is overlooked.",
      },
      {
        type: "heading",
        level: 2,
        text: "1. Kitchen Inclusions Checklist",
        id: "kitchen-checklist",
      },
      {
        type: "checklist",
        title: "Kitchen Cleaning Tasks",
        items: [
          "Degrease oven interior, racks, glass door & extractor hood filters",
          "Defrost & wipe down fridge freezer interior and door seals",
          "Clean dishwasher filter, spray arms & door perimeter",
          "Sanitise all countertops, splashbacks, and sink taps",
          "Wipe clean inside and outside of all cupboards & drawers",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "2. Bathroom & Living Areas",
        id: "bathroom-living",
      },
      {
        type: "checklist",
        title: "Bathroom & Living Area Tasks",
        items: [
          "Descale bathtub, shower screen, glass enclosures & wall tiles",
          "Sanitise toilet bowl, seat, hinge base, and flush handle",
          "Vacuum all carpeted areas and steam clean where required",
          "Wipe down all door handles, light switches, and skirting boards",
          "Clean interior window panes, frames, and window sills",
        ],
      },
      {
        type: "serviceCTA",
        title: "Need Guaranteed Move-Out Cleaning?",
        text: "Book our 48-hour re-clean guaranteed End of Tenancy cleaning service with fixed pricing.",
        buttonText: "Calculate Tenancy Cleaning Price",
        href: "/cleaning-services/end-of-tenancy-cleaning/",
      },
    ],
    relatedServiceIds: ["end-of-tenancy-cleaning"],
    relatedPostSlugs: ["how-to-tell-if-you-have-mice", "mouse-control-cost-guide-london"],
  },
  {
    id: "guide-3",
    slug: "mouse-control-cost-guide-london",
    title: "Mouse Control Cost Guide in London (2026 Rates)",
    dek: "Transparent breakdown of visit plans, emergency surcharges, and guarantee terms across London boroughs.",
    excerpt: "Detailed breakdown of pest control pricing, visit plans, emergency surcharges, and guarantee terms across London boroughs.",
    category: "pricing",
    categoryLabel: "Cost Guide",
    tags: ["Pricing", "Pest Control", "Rates"],
    author: {
      name: "Best One Commercial Team",
      role: "Pricing Specialist",
    },
    publishedAt: "2026-01-28",
    readingTime: 4,
    heroImage: "/images/end-of-tenancy-hero.jpg",
    contentBlocks: [
      {
        type: "paragraph",
        text: "Understanding rodent control pricing helps property managers and homeowners budget effectively for pest eradication.",
      },
      {
        type: "heading",
        level: 2,
        text: "1. Standard Treatment Rates",
        id: "treatment-rates",
      },
      {
        type: "table",
        title: "2026 Verified Pest Control Pricing",
        headers: ["Treatment Plan", "Visits Included", "Guarantee Period", "Typical Cost"],
        rows: [
          ["Single Visit Inspection", "1 Visit", "No Guarantee", "£90 – £120"],
          ["2-Visit Treatment Plan", "2 Visits", "1-Month Guarantee", "£160 – £190"],
          ["3-Visit Full Proofing", "3 Visits", "3-Month Guarantee", "£210 – £230"],
        ],
        sourceNote: "Rates match the published price list at /prices/.",
      },
      {
        type: "callout",
        variant: "pricing",
        title: "Transparent Fixed Pricing",
        text: "Our mouse control rates are fixed based on treatment plan and property size. Zero hidden call-out fees.",
        ctaText: "Check Instant Price",
        ctaHref: "/prices/?service=mouse-control",
      },
    ],
    relatedServiceIds: ["mice-control"],
    relatedPostSlugs: ["how-to-tell-if-you-have-mice"],
  },
];

export function getGuideBySlug(slug: string): GuidePost | undefined {
  return GUIDES_DATABASE.find((g) => g.slug === slug);
}

export function getGuidesByCategory(category?: string): GuidePost[] {
  if (!category || category === "all") return GUIDES_DATABASE;
  return GUIDES_DATABASE.filter((g) => g.category === category);
}
