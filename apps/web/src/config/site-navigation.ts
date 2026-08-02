export const primaryNavigation = [
  { href: "/end-of-tenancy-cleaning/", label: "Cleaning" },
  { href: "/pest-control/", label: "Pest Control" },
  { href: "/get-a-quote/#postcode", label: "Check Area" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/about/", label: "About" },
] as const;

export const footerNavigation = [
  {
    title: "Services",
    links: [
      { href: "/end-of-tenancy-cleaning/", label: "End of tenancy cleaning" },
      { href: "/pest-control/", label: "Pest control" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/get-a-quote/#postcode", label: "Check your area" },
      { href: "/#faqs", label: "FAQs" },
      { href: "/about/", label: "About us" },
    ],
  },
] as const;
