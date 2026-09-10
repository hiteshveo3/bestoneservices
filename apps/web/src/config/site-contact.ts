/**
 * Best One Services - Master Centralized Contact Configuration
 * Single Source of Truth for Company Phone, WhatsApp, and Email across UI & Structured Data
 */

export const siteContact = {
  companyName: "Best One Services Ltd",
  phoneDisplay: "020 8079 7336",
  phoneHref: "tel:+442080797336",
  whatsappDisplay: "07490 623616",
  whatsappNumber: "447490623616",
  whatsappHref: "https://wa.me/447490623616",
  email: "info@bestoneservices.co.uk",
  address: {
    street: "28–42 Clements Rd",
    locality: "Ilford",
    postcode: "IG1 1BA",
    region: "London",
    country: "United Kingdom",
    formatted: "28–42 Clements Rd, Ilford IG1 1BA, London, UK",
  },
  getWhatsappUrl: (contextMessage?: string) => {
    if (!contextMessage) return "https://wa.me/447884510459";
    return `https://wa.me/447884510459?text=${encodeURIComponent(contextMessage)}`;
  },
};

