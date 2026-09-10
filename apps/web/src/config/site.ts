import { siteContact } from "./site-contact";

export const siteConfig = {
  name: "Best One Services",
  url: "https://www.bestoneservices.co.uk",
  email: siteContact.email,
  phone: siteContact.phoneDisplay,
  phoneHref: siteContact.phoneHref,
  phoneEnabled: true,
  // Self-serve online booking is switched off site-wide — every "Book Now" /
  // "Book a Service" CTA routes to WhatsApp instead. The /booking/ flow's
  // pages and components are left in place (unlinked), not deleted.
  bookingEnabled: false,
  address: {
    streetAddress: siteContact.address.street,
    addressLocality: siteContact.address.locality,
    addressRegion: siteContact.address.region,
    postalCode: siteContact.address.postcode,
    addressCountry: "GB",
  },
  openingHours: "Mo-Sa 08:00-20:00",
  googleRating: "5.0",
  googleReviewCount: 16,
  description:
    "End of tenancy cleaning, pest control, gardening and house removals across Greater London. Instant quotes, licensed local specialists, 48-hour guarantee.",
  locale: "en_GB",
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

