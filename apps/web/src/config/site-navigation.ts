export interface MegaMenuItem {
  label: string;
  href: string;
  badge?: string;
  isFeatured?: boolean;
}

export interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuFeaturePanel {
  iconName: "Sparkles" | "Bug" | "Trees" | "Truck";
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export interface MegaMenuCategory {
  id: "cleaning" | "pest" | "gardening" | "removals";
  label: string;
  href: string;
  columns: MegaMenuColumn[];
  featurePanel: MegaMenuFeaturePanel;
}

export const megaMenuData: MegaMenuCategory[] = [
  {
    id: "cleaning",
    label: "Cleaning",
    href: "/cleaning-services/end-of-tenancy-cleaning/",
    columns: [
      {
        title: "Cleaning Services",
        items: [
          { label: "End of Tenancy Cleaning", href: "/cleaning-services/end-of-tenancy-cleaning/", badge: "Popular" },
          { label: "Regular Domestic Cleaning", href: "/cleaning-services/end-of-tenancy-cleaning/#calculator" },
          { label: "Deep House Cleaning", href: "/cleaning-services/end-of-tenancy-cleaning/" },
          { label: "After Builders Cleaning", href: "/cleaning-services/after-builders-cleaning/" },
          { label: "Carpet & Rug Steam Cleaning", href: "/cleaning-services/carpet-cleaning/" },
          { label: "Oven & Appliance Cleaning", href: "/cleaning-services/oven-cleaning-service/" },
          { label: "Window Cleaning", href: "/cleaning-services/window-cleaning/" },
          { label: "Mattress Steam Sanitising", href: "/cleaning-services/mattress-cleaning-service/" },
        ],
      },
      {
        title: "Useful Links",
        items: [
          { label: "Cleaning Prices & Rates", href: "/prices/?category=cleaning" },
          { label: "London Coverage Areas", href: "/areas/" },
          { label: "Get Instant Estimate", href: "/prices/?category=cleaning#smart-calculator", badge: "Instant", isFeatured: true },
        ],
      },
    ],
    featurePanel: {
      iconName: "Sparkles",
      title: "Need a Professional Clean?",
      description: "Explore move-out cleaning options or calculate your upfront property estimate.",
      ctaText: "Get Cleaning Estimate",
      ctaHref: "/prices/?category=cleaning#smart-calculator",
    },
  },
  {
    id: "pest",
    label: "Pest Control",
    href: "/pest-control-services/",
    columns: [
      {
        title: "Pest Treatments",
        items: [
          { label: "Mice Control & Proofing", href: "/pest-control-services/mice-control/", badge: "Popular" },
          { label: "Rat Control Packages", href: "/pest-control-services/rat-control/" },
          { label: "Cockroach Eradication", href: "/pest-control-services/cockroach-control/" },
          { label: "Flea & Insect Spraying", href: "/pest-control-services/flea-treatment/" },
          { label: "Bed Bug Heat Treatment", href: "/pest-control-services/bed-bug-treatment/" },
          { label: "Wasp Nest Removal", href: "/pest-control-services/wasp-treatment/" },
        ],
      },
      {
        title: "Useful Links",
        items: [
          { label: "Pest Control Prices", href: "/prices/?category=pest-control" },
          { label: "Areas We Cover", href: "/areas/" },
          { label: "Get Pest Estimate", href: "/prices/?category=pest-control#smart-calculator", badge: "Instant", isFeatured: true },
        ],
      },
    ],
    featurePanel: {
      iconName: "Bug",
      title: "Not Sure Which Treatment You Need?",
      description: "Find the right pest-control service and check treatment pricing.",
      ctaText: "Check Pest Control Prices",
      ctaHref: "/prices/?category=pest-control#smart-calculator",
    },
  },
  {
    id: "gardening",
    label: "Gardening",
    href: "/gardening/",
    columns: [
      {
        title: "Gardening Services",
        items: [
          { label: "Garden Maintenance", href: "/gardening/", badge: "Popular" },
          { label: "Garden Clearance & Waste", href: "/gardening/" },
          { label: "Lawn Mowing & Hedge Care", href: "/gardening/" },
        ],
      },
      {
        title: "Useful Links",
        items: [
          { label: "Gardening Prices", href: "/prices/?category=gardening" },
          { label: "Areas We Cover", href: "/areas/" },
          { label: "Get Gardening Estimate", href: "/prices/?category=gardening#smart-calculator", badge: "Instant", isFeatured: true },
        ],
      },
    ],
    featurePanel: {
      iconName: "Trees",
      title: "Need Help With Your Garden?",
      description: "Choose the gardening service you need and get an estimate based on your job.",
      ctaText: "Get Gardening Estimate",
      ctaHref: "/prices/?category=gardening#smart-calculator",
    },
  },
  {
    id: "removals",
    label: "Removals",
    href: "/removals/",
    columns: [
      {
        title: "Moving Services",
        items: [
          { label: "House Removals", href: "/removals/", badge: "Popular" },
          { label: "Man & Van Moving", href: "/removals/" },
          { label: "Packing Services & Boxes", href: "/removals/" },
        ],
      },
      {
        title: "Useful Links",
        items: [
          { label: "Removals Prices", href: "/prices/?category=removals" },
          { label: "Areas We Cover", href: "/areas/" },
          { label: "Get Moving Estimate", href: "/prices/?category=removals#smart-calculator", badge: "Instant", isFeatured: true },
        ],
      },
    ],
    featurePanel: {
      iconName: "Truck",
      title: "Planning a Move?",
      description: "Choose your moving team size and estimate your move across London.",
      ctaText: "Estimate Your Move",
      ctaHref: "/prices/?category=removals#smart-calculator",
    },
  },
];

export const primaryNavigation = megaMenuData.map((item) => ({
  href: item.href,
  label: item.label,
  id: item.id,
}));

export const footerNavigation = [
  {
    title: "Service Verticals",
    links: [
      { href: "/search", label: "All Services (Search & Filter)" },
      { href: "/cleaning-services/end-of-tenancy-cleaning/", label: "End of Tenancy Cleaning" },
      { href: "/pest-control-services/", label: "Pest Control Services" },
      { href: "/gardening/", label: "Gardening & Clearance" },
      { href: "/removals/", label: "Removals & Storage" },
    ],
  },
  {
    title: "Information & Booking",
    links: [
      { href: "/#how-it-works", label: "How It Works" },
      { href: "/areas/", label: "Areas We Cover" },
      { href: "/prices/", label: "Starting Prices" },
      { href: "/guides/", label: "Service Guides" },
      { href: "/about/", label: "About Best One" },
    ],
  },
] as const;
