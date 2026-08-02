import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { siteConfig } from "@/config/site";
export const metadata: Metadata = { title: "Contact Bestone Services Ltd", description: "Email Bestone Services Ltd about end of tenancy cleaning or pest-control services across London.", alternates: { canonical: "/contact/" } };
export default function ContactPage() { return <main id="main-content"><section className="section"><div className="shell quote-band"><div><p className="eyebrow">Contact</p><h1>Contact Bestone Services Ltd.</h1><p>Email the service you need, property postcode and helpful details. We will discuss the appropriate next step.</p><address>{siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}, {siteConfig.address.postalCode}</address></div><ButtonLink href={`mailto:${siteConfig.email}`}>Email Us</ButtonLink></div></section></main>; }
