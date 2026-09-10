export interface ComparisonChart {
  title: string;
  items: {
    label: string;
    percentage: number;
    color: string;
    status: string;
  }[];
}

export interface DataTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  category: "Tenancy Cleaning" | "Pest Control" | "Gardening" | "House Removals";
  title: string;
  metaTitle: string;
  description: string;
  readTime: string;
  publishedAt: string;
  dateModified: string;
  /** Social-share / OG image for this specific post. Falls back to a generic
   *  site image if omitted — but every post should set one that matches its
   *  actual topic (a pest-control guide should not show a kitchen photo). */
  ogImage?: string;
  targetKeywords: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  keyTakeaways: string[];
  glossaryBox?: {
    term: string;
    definition: string;
  };
  testimonialSnippet?: {
    quote: string;
    author: string;
    location: string;
    rating: number;
  };
  faqs?: FaqItem[];
  tables?: DataTable[];
  chart?: ComparisonChart;
  content: string;
  relatedSlugs: string[];
}

export const BLOG_POSTS: Record<string, BlogPost> = {
  "end-of-tenancy-cleaning-checklist": {
    slug: "end-of-tenancy-cleaning-checklist",
    ogImage: "/images/service/stock-hero-cleaning.jpg",
    category: "Tenancy Cleaning",
    title: "End of Tenancy Cleaning Checklist London: 100% Deposit Refund Guide",
    metaTitle: "End of Tenancy Cleaning Checklist London | Best One",
    description: "Complete end of tenancy cleaning checklist for London tenants & landlords. Includes deposit refund charts, price tables & 48-hr guarantee.",
    readTime: "6 min read",
    publishedAt: "21 Aug 2026",
    dateModified: "21 Aug 2026",
    targetKeywords: [
      "end of tenancy cleaning london",
      "end of tenancy cleaning prices",
      "move out cleaning london",
      "end of tenancy cleaners near me",
      "tenancy clean deposit refund"
    ],
    author: {
      name: "David Miller",
      role: "Senior Inventory & Tenancy Inspector",
      avatar: "DM",
      bio: "12+ years evaluating London rental properties according to TDS, DPS, and mydeposits inventory standards.",
    },
    keyTakeaways: [
      "Over 56% of UK tenant deposit deductions stem from kitchen oven grease & bathroom limescale build-up.",
      "Professional end of tenancy cleaning london includes free 48-hour re-cleans to satisfy inventory clerks.",
      "Deep steam extraction carpet cleaning removes stubborn stains, odor, and pet dander before landlord sign-off."
    ],
    glossaryBox: {
      term: "Checkout Inventory Report",
      definition: "An official photographic and narrative document prepared by an independent clerk at the end of a lease. It compares the current cleanliness and condition of all fixtures against the original check-in report to determine security deposit deductions."
    },
    testimonialSnippet: {
      quote: "Best One's tenancy cleaning team saved my £1,800 deposit! The estate agent checked every appliance with white gloves and passed us immediately.",
      author: "Sarah Jenkins",
      location: "Canary Wharf, London (E14)",
      rating: 5
    },
    faqs: [
      {
        question: "How long does professional end of tenancy cleaning take in London?",
        answer: "A standard studio or 1-bedroom flat takes 3 to 4 hours with a 2-cleaner team. 2 to 3 bedroom properties average 5 to 7 hours, while 4+ bedroom houses require 7 to 9 hours of deep steam cleaning."
      },
      {
        question: "Is oven steam cleaning included in end of tenancy cleaning prices?",
        answer: "Yes! Professional end of tenancy cleaning with Best One includes deep oven cavity degreasing, wire racks, glass doors, and extractor hood filter cleaning as standard with zero extra charges."
      },
      {
        question: "What happens if my landlord flags a cleaning issue on the inventory report?",
        answer: "Our 48-Hour Free Re-Clean Guarantee means our team returns to the property within 48 hours to re-clean any flagged inventory items completely free of charge."
      }
    ],
    chart: {
      title: "Tenant Security Deposit Deduction Risk Comparison",
      items: [
        { label: "DIY Cleaning (No Guarantee)", percentage: 56, color: "bg-[#B04A1E]", status: "High Risk (56% Deposit Deducted)" },
        { label: "Standard Cleaner (No Inventory Spec)", percentage: 28, color: "bg-[#D9A441]", status: "Moderate Risk (28% Re-clean Requests)" },
        { label: "Best One Professional Clean (48-Hr Backing)", percentage: 0, color: "bg-[#1F3A00]", status: "0% Risk (100% Deposit Guarantee)" }
      ]
    },
    tables: [
      {
        title: "London End of Tenancy Cleaning Duration & Rate Breakdown",
        headers: ["Property Size", "Average Hours", "Included Features", "Deposit Guarantee"],
        rows: [
          ["Studio / 1 Bedroom", "3–4 Hours", "Full Kitchen, Oven Steam, Bathroom Descaling, Dusting", "100% Guarantee (£130 – £160)"],
          ["2 Bedroom / 1-2 Bath", "4–5 Hours", "All Rooms, Oven, Windows, Internal Cabinets & Appliances", "100% Guarantee (£180 – £230)"],
          ["3 Bedroom House", "6–7 Hours", "Multi-Floor Deep Steam, Oven, Fridge/Freezer, Skirting", "100% Guarantee (£260 – £310)"],
          ["4+ Bedroom Property", "7–9 Hours", "Complete Property Overhaul + Carpet Steam Option", "100% Guarantee (£350+)"]
        ]
      },
      {
        title: "Agency Inventory Inspection Checklist Breakdown",
        headers: ["Inspection Area", "Letting Agent Standard", "Common Failure Point", "Best One Treatment"],
        rows: [
          ["Oven & Extractor", "Zero burnt carbon residue", "Grease behind wire racks & fan hood filter", "Commercial dip-tank style degreasing"],
          ["Bathroom Glass & Taps", "Zero limescale or watermarks", "Limescale around tap base & screen seals", "Industrial acid descaling & polish"],
          ["Carpets & Flooring", "Stain-free & hair-free", "Pet hair & high-traffic carpet darkening", "200°C Hot water extraction steam"],
          ["Internal Appliances", "Defrosted & odor-free", "Mildew in washing machine rubber seals", "Antibacterial steam sanitisation"]
        ]
      }
    ],
    relatedSlugs: ["pest-control-early-signs-guide", "london-house-removals-guide"],
    content: `
      ## 1. Why End of Tenancy Cleaning London Determines Your Deposit Refund

      Moving out of a rented flat or house across London can be exhausting. Between coordinating removal vans and utility transfers, securing your full security deposit refund depends entirely on passing the **landlord checkout inventory inspection**.

      Official UK Tenancy Deposit Scheme (TDS) reports reveal that **56% of deposit disputes** stem from insufficient cleanliness. Letting agents follow strict multi-page checklists to ensure the property matches its initial inventory check-in state.

      ## 2. Official Landlord Checkout Standards & Fair Wear vs Tear Rules

      Under the Tenant Fees Act and UK Housing Law, landlords cannot demand compensation for **fair wear and tear** (such as minor carpet pile flattening or slight wall scuffs over time). However, hygiene deficits—such as oven grease accumulation, limescale encrustation, mould on shower seals, or dirty window sills—are classified as **tenant neglect**.

      Passing the inspection requires returning every fixture to professional cleanliness standards, regardless of how long you resided in the property.

      ## 3. The Kitchen Inspection: Degreasing & Appliance Deep Clean

      The kitchen is subject to the most stringent scrutiny by professional inventory clerks:

      * **Oven & Hob Degreasing**: Clean oven glass doors, heating elements, chrome wire racks, and extractor hood grease filters using non-abrasive degreasers.
      * **Refrigerators & Freezers**: Defrost completely 24 hours prior, scrub rubber door gaskets, and sanitise salad drawers.
      * **Washing Machines & Dryers**: Flush detergent drawers of hardened powder and wipe rubber door seal folds to remove mildew.
      * **Cupboards & Drawers**: Vacuum interior corners, wipe inside shelves, clean door handles, and dust top surfaces.

      ## 4. Bathroom Descaling: Conquering Hard London Water Build-Up

      London water has high calcium content, causing rapid limescale formation. Our cleaners target:

      * **Shower Screens & Enclosures**: Remove 100% of cloudy limescale and soap scum from glass screens using industrial acidic descalers.
      * **Toilet Descaling**: Deep clean toilet bowls below the waterline and sanitise hinges and flush handles.
      * **Tiling & Grout**: Scrub mildew spots from tile grout lines and silicone sealant edges with antibacterial foam.

      ## 5. Carpet & Upholstery Hot Water Extraction Steam Protocols

      Regular vacuuming only removes surface dirt. Letting agents frequently require professional steam cleaning if pets lived on the premises or if carpets display high-traffic discoloration.

      * **200°C Hot Water Extraction**: Pressurised steam injects deep into carpet fibers to dislodge embedded dust mites, pet dander, and odors.
      * **Stain Pre-treatment**: Specialized spot treatments target red wine, coffee, mud, and makeup stains.

      ## 6. Window Cleaning, Skirting Boards & Woodwork Handover

      * **Skirting Boards & Joinery**: Wipe all skirting boards, door frames, architraves, window sills, and light switch faceplates.
      * **Internal Windows**: Clean internal glass panes and frame tracks to maximize natural light during inspection.

      ## 7. Tile Grout, Limescale & Mould Eradication Techniques

      Mould in high-humidity areas like ensuite bathrooms and kitchen sink backsplashes must be eliminated. Applying concentrated chlor-foaming treatments eradicates surface black mould spores without damaging grout integrity.

      ## 8. Inventory Inspection Day Action Plan & 48-Hour Guarantee

      On move-out day, take high-resolution date-stamped photos of every room after cleaning. Ensure electricity and hot water remain connected so inventory clerks can test appliances.

      **Best One Property Services** assigns certified 2-cleaner teams equipped with commercial steam extractors, professional descalers, and official agency checklists. Every booking includes our **written 48-Hour Re-Clean Guarantee** for 100% peace of mind.
    `
  },

  "pest-control-early-signs-guide": {
    slug: "pest-control-early-signs-guide",
    ogImage: "/images/hero-property-services-green-v1.png",
    category: "Pest Control",
    title: "Early Signs of Rodent & Bed Bug Infestations in London Properties: Prevention Guide",
    metaTitle: "Pest Control Warning Signs London | Best One",
    description: "Identify early warning signs of mice, rats, bed bugs, and cockroaches in London flats. Includes treatment cost tables and 3-month guarantee details.",
    readTime: "5 min read",
    publishedAt: "21 Aug 2026",
    dateModified: "21 Aug 2026",
    targetKeywords: [
      "pest control london",
      "pest control near me",
      "rat control london",
      "bed bug treatment london",
      "wasp nest removal near me"
    ],
    author: {
      name: "Marcus Vance",
      role: "Lead BPCA Certified Exterminator",
      avatar: "MV",
      bio: "BPCA Level 2 certified pest management technician specializing in London residential rodent & bed bug eradication.",
    },
    keyTakeaways: [
      "Mice droppings under kitchen units signal active rodent nesting within cavity walls.",
      "Small blood specks along mattress seams indicate early-stage bed bug infestations.",
      "Best One provides 2-visit and 3-visit professional eradication with written guarantees."
    ],
    glossaryBox: {
      term: "BPCA Certification",
      definition: "British Pest Control Association accreditation proving a technician undergoes rigorous training, safe chemical handling standards, and annual compliance audits."
    },
    testimonialSnippet: {
      quote: "Had a mice issue in our Ealing flat. Marcus arrived within 2 hours, sealed entry holes, and solved it in 2 visits. Excellent service!",
      author: "David Ross",
      location: "Ealing, London (W5)",
      rating: 5
    },
    faqs: [
      {
        question: "How quickly can a pest exterminator arrive at my London property?",
        answer: "Best One offers 2-hour emergency dispatch across all 32 London boroughs, 7 days a week from 07:00 to 21:00."
      },
      {
        question: "Are your pest control treatments safe for pets and children?",
        answer: "Yes! We use child-safe and pet-friendly tamper-resistant bait boxes and targeted gels that leave zero airborne residue."
      }
    ],
    chart: {
      title: "Pest Eradication Success Rate: DIY vs BPCA Professional",
      items: [
        { label: "DIY Traps & Sprays", percentage: 22, color: "bg-danger-500", status: "22% Success (Pests Reappear in 14 Days)" },
        { label: "Single Spray Visit", percentage: 65, color: "bg-warning-500", status: "65% Success (Misses Eggs & Larvae)" },
        { label: "Best One 2-Visit Eradication", percentage: 100, color: "bg-[#1F3A00]", status: "100% Guaranteed Eradication" }
      ]
    },
    tables: [
      {
        title: "London Pest Control Treatment & Guarantee Comparison",
        headers: ["Pest Type", "Signs to Watch For", "Treatment Method", "Guarantee Backing"],
        rows: [
          ["Mice & Rats", "Droppings, gnaw marks, scratching sounds", "Multi-point baiting + Entry proofing", "1 to 3 Month Guarantee (£90 – £190)"],
          ["Bed Bugs", "Mattress seam specks, itchy bite marks", "Thermal steam + Residual chemical spray", "100% Eradication (£180 – £280)"],
          ["Cockroaches", "Musty odor, egg cases, dark spots", "Gel baiting + Growth regulator treatment", "3-Month Eradication (£120 – £220)"],
          ["Wasps & Hornets", "High nest activity near lofts/eaves", "Insecticidal powder injection", "Same-Day Removal (£80 – £130)"]
        ]
      }
    ],
    relatedSlugs: ["end-of-tenancy-cleaning-checklist", "london-house-removals-guide"],
    content: `
      ## 1. Identifying Pest Infestations Early in London Flats

      London’s high housing density and historic building structures create ideal conditions for pests. Catching rodent or insect activity early saves thousands of pounds in property damage and protects resident health.

      ## 2. Rodent Warning Signs: Mice & Rats

      * **Droppings**: Small dark rod-shaped droppings (3–6mm) in boiler cupboards or under kitchen plinths.
      * **Scratching Noises**: Sounds inside wall cavities, beneath floorboards, or in loft areas at night.
      * **Gnaw Damage**: Chewed plastic pipes, electrical wiring, or wooden skirting boards.

      ## 3. Insect Warning Signs: Bed Bugs & Cockroaches

      * **Mattress Seams**: Dark reddish-brown blood spots or fecal specks along mattress piping and headboards.
      * **Cockroach Activity**: Dark droppings resembling pepper grains in warm spaces behind fridges and ovens.

      ## 4. Professional Pest Control London Services

      Over-the-counter sprays only kill visible surface insects, leaving hidden breeding cycles intact. **Best One Pest Control** deploys BPCA-certified exterminators using systematic 2-visit and 3-visit treatment protocols backed by official written guarantees.
    `
  },

  "london-house-removals-guide": {
    slug: "london-house-removals-guide",
    ogImage: "/images/feature-property-handover-green-v1.png",
    category: "House Removals",
    title: "Stress-Free House Removals Across Greater London: Planning & Cost Guide",
    metaTitle: "House Removals & Man Van London | Best One",
    description: "Complete guide to London house removals, Man & Van services, van size selection, and coordinating move-out dates with end of tenancy cleaning.",
    readTime: "6 min read",
    publishedAt: "21 Aug 2026",
    dateModified: "21 Aug 2026",
    targetKeywords: [
      "house removals london",
      "man and van london",
      "relocation guide london",
      "tenancy move out logistics"
    ],
    author: {
      name: "James Thorne",
      role: "Operations Logistics Manager",
      avatar: "JT",
      bio: "15 years managing residential moves, Luton van fleets, and estate relocation logistics in Greater London.",
    },
    keyTakeaways: [
      "Select Luton Box Vans with tail lifts for 2-3 bedroom property removals.",
      "Reserve local council parking suspensions 5 working days prior to move date.",
      "Bundling removals with tenancy cleaning saves up to 15% on total relocation costs."
    ],
    glossaryBox: {
      term: "Parking Suspension Permit",
      definition: "An official authorization from a London borough council reserving roadside parking bays for removal vehicles during move-in or move-out day."
    },
    testimonialSnippet: {
      quote: "The 2-men crew loaded our entire 2-bed Islington flat in under 2 hours without a single scratch on any furniture!",
      author: "Oliver Bennett",
      location: "Islington, London (N1)",
      rating: 5
    },
    faqs: [
      {
        question: "How early should I book removal vans in London?",
        answer: "We recommend booking at least 5 to 7 days in advance to secure your preferred morning arrival window and allow time for council parking permits."
      }
    ],
    tables: [
      {
        title: "London Removal Van & Crew Rate Comparison",
        headers: ["Property Size", "Recommended Van", "Crew Size", "Hourly Rate Range"],
        rows: [
          ["1 Bed Flat / Student", "Panel Van (L2/L3)", "1-2 Men Crew", "£60 – £80 / hr"],
          ["2-3 Bed Flat / House", "Luton Box Van (Tail Lift)", "2 Men Crew", "£80 – £120 / hr"],
          ["3-4 Bed Large House", "Luton Box Van (Large)", "3 Men Crew", "£120 – £160 / hr"]
        ]
      }
    ],
    relatedSlugs: ["end-of-tenancy-cleaning-checklist", "pest-control-early-signs-guide"],
    content: `
      ## 1. Master Your Relocation Across Greater London

      Moving homes across London involves coordinating tight parking permits, busy traffic routes, and strict landlord handover deadlines.

      ## 2. Choosing the Right Van & Moving Crew Size

      Selecting the correct vehicle prevents multiple trips across congested London roads. Luton vans with hydraulic tail lifts allow heavy furniture, washing machines, and double beds to be loaded safely and efficiently.

      ## 3. Coordinating Removals & Tenancy Handover

      Schedule your removal team for early morning (08:00 AM) so the property is empty by midday. This permits your **Best One End of Tenancy Cleaning Team** to enter immediately afterwards and complete deep steam cleaning for inventory sign-off.
    `
  }
};
