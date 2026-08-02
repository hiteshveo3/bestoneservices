export const siteConfig = {
  name: "Best One Services",
  url: "https://www.bestoneservices.co.uk",
  email: "info@bestoneservices.co.uk",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "",
  phoneHref: process.env.NEXT_PUBLIC_PHONE_NUMBER ? `tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER.replace(/[^+\d]/g, "")}` : "",
  phoneEnabled: process.env.NEXT_PUBLIC_PHONE_ENABLED === "true" && Boolean(process.env.NEXT_PUBLIC_PHONE_NUMBER),
  bookingEnabled: process.env.NEXT_PUBLIC_BOOKING_ENABLED === "true",
  address: {
    streetAddress: "28-42 Clements Road",
    addressLocality: "Ilford",
    addressRegion: "Greater London",
    postalCode: "IG1 1BA",
    addressCountry: "GB",
  },
  openingHours: "",
  googleRating: "",
  googleReviewCount: 0,
  description:
    "End of tenancy cleaning and pest-control services for homes, rental properties and businesses.",
  locale: "en_GB",
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
