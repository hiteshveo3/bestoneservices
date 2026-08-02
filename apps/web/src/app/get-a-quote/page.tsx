import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { siteConfig } from "@/config/site";
export const metadata: Metadata = { title: "Contact Bestone Services Ltd", description: "Contact Bestone Services Ltd by email for cleaning and pest-control service information.", alternates: { canonical: "/contact/" } };
export default function ContactPage() { return <main id="main-content"><section className="section"><div className="shell quote-band"><div><p className="eyebrow">Contact</p><h1>Contact Bestone Services Ltd.</h1><p>Email our team with the service required, property postcode and helpful details. Public phone contact will appear here after owner approval.</p><p>{siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}, {siteConfig.address.postalCode}</p></div><ButtonLink href={`mailto:${siteConfig.email}`}>Email Us</ButtonLink></div></section></main>; }
