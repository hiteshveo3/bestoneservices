export const siteConfig = {
  name: "Best One Services",
  url: "https://www.bestoneservices.co.uk",
  email: "info@bestoneservices.co.uk",
  description:
    "End of tenancy cleaning and pest-control enquiry support for homes, rental properties and businesses.",
  locale: "en_GB",
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
