import { siteContact } from "@/config/site-contact";

/** Kept for older components; every value comes from site-contact.ts. */
export const CONTACT = {
  landline: { display: siteContact.phoneDisplay, tel: siteContact.phoneHref.replace("tel:", "") },
  mobile:   { display: siteContact.mobileDisplay, tel: siteContact.mobileHref.replace("tel:", "") },
  whatsapp: { display: siteContact.whatsappDisplay, wa: siteContact.whatsappNumber },
  email: siteContact.email,
  address: siteContact.address.formatted,
};
