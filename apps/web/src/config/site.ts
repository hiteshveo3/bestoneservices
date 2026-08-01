export const siteConfig = {
  name: "Best One Services",
  url: "https://www.bestoneservices.co.uk",
  email: "info@bestoneservices.co.uk",
  phone: "+44 7884 510459",
  phoneHref: "tel:+447884510459",
  address: {
    streetAddress: "28-42 Clements Road",
    addressLocality: "Ilford",
    addressRegion: "Greater London",
    postalCode: "IG1 1BA",
    addressCountry: "GB",
  },
  openingHours: "Open 24 hours, every day",
  googleRating: "5.0",
  googleReviewCount: 16,
  description:
    "End of tenancy cleaning and pest-control services for homes, rental properties and businesses.",
  locale: "en_GB",
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
