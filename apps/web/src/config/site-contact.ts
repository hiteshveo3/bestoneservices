/**
 * Bestone Services - Master Centralized Contact Configuration
 * Single Source of Truth for Company Phone, WhatsApp, and Email across UI & Structured Data
 */

/** WhatsApp is on the mobile number (client, 2026-09-28). */
const WHATSAPP_NUMBER = "447884510459";

export const siteContact = {
  companyName: "Bestone Services Ltd",
  /** Office landline, the main number for calls. */
  phoneDisplay: "020 8149 4328",
  phoneHref: "tel:+442081494328",
  /** Mobile, also listed for calls; WhatsApp runs on this number. */
  mobileDisplay: "07884 510459",
  mobileHref: "tel:+447884510459",
  whatsappDisplay: "07884 510459",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}`,
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
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    if (!contextMessage) return base;
    return `${base}?text=${encodeURIComponent(contextMessage)}`;
  },
};

