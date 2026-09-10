export type PageIntentType = 
  | "discovery"
  | "transactional"
  | "informational"
  | "location"
  | "pricing"
  | "guide";

export interface PageIntentConfig {
  type: PageIntentType;
  primaryCtaText: string;
  secondaryCtaText: string;
  bookButtonHref: string;
}

export function classifyPageIntent(pathname: string): PageIntentConfig {
  if (pathname === "/") {
    return {
      type: "discovery",
      primaryCtaText: "Get Estimate",
      secondaryCtaText: "Explore Services",
      bookButtonHref: "/prices/",
    };
  }

  if (pathname.startsWith("/prices")) {
    return {
      type: "pricing",
      primaryCtaText: "Calculate My Price",
      secondaryCtaText: "Browse All Rates",
      bookButtonHref: "#smart-calculator",
    };
  }

  if (pathname.startsWith("/areas")) {
    return {
      type: "location",
      primaryCtaText: "Get Local Estimate",
      secondaryCtaText: "View Coverage Areas",
      bookButtonHref: "/prices/",
    };
  }

  if (pathname.startsWith("/guides")) {
    return {
      type: "guide",
      primaryCtaText: "Check Service Price",
      secondaryCtaText: "View Relevant Service",
      bookButtonHref: "/prices/",
    };
  }

  if (pathname.startsWith("/about")) {
    return {
      type: "informational",
      primaryCtaText: "Explore Services & Rates",
      secondaryCtaText: "Contact Support",
      bookButtonHref: "/prices/",
    };
  }

  // Single service pages (e.g. /cleaning-services/end-of-tenancy-cleaning/)
  return {
    type: "transactional",
    primaryCtaText: "Get Service Estimate",
    secondaryCtaText: "View Prices",
    bookButtonHref: "#calculator",
  };
}
