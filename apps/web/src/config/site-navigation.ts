export const primaryNavigation = [
  { href: "/cleaning-services/end-of-tenancy-cleaning/", label: "Cleaning" },
  { href: "/pest-control-services/", label: "Pest Control" },
  { href: "/#area-title", label: "Check Area" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/about/", label: "About" },
] as const;

export const footerNavigation = [
  {
    title: "Services",
    links: [
      { href: "/cleaning-services/end-of-tenancy-cleaning/", label: "End of tenancy cleaning" },
      { href: "/pest-control-services/", label: "Pest control" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/areas/", label: "Areas we cover" },
      { href: "/prices/", label: "Starting prices" },
      { href: "/guides/", label: "Guides" },
      { href: "/about/", label: "About us" },
    ],
  },
] as const;
