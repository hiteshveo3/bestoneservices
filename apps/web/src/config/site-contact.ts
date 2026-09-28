/**
 * Bestone Services - Master Centralized Contact Configuration
 * Single Source of Truth for Company Phone, WhatsApp, and Email across UI & Structured Data
 */

export const siteContact = {
  companyName: "Bestone Services Ltd",
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
  /**
   * Bank details for invoices. Left empty until the client confirms the real
   * account: the invoice page then asks customers to call for the details
   * instead of showing placeholder numbers.
   */
  bankTransfer: undefined as undefined | { accountName: string; sortCode: string; accountNumber: string },
  getWhatsappUrl: (contextMessage?: string) => {
    const base = "https://wa.me/447490623616";
    if (!contextMessage) return base;
    return `${base}?text=${encodeURIComponent(contextMessage)}`;
  },
};

