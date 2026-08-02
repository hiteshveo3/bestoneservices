import type { Metadata } from "next";
import { Call02Icon, CheckmarkCircle02Icon, Clock01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { ButtonLink } from "@/components/button-link";
import { DecorativeIcon } from "@/components/decorative-icon";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { organisationSchema } from "@/lib/structured-data";

export const metadata: Metadata = { title: "Contact Best One Services", description: "Call or email Best One Services to discuss end of tenancy cleaning or pest control across London.", alternates: { canonical: "/get-a-quote/" } };

export default function ContactPage() {
  return <main id="main-content"><JsonLd data={organisationSchema()} />
    <section className="shell hero" aria-labelledby="contact-title"><div className="hero-copy"><p className="eyebrow">Contact Best One Services</p><h1 id="contact-title">Call or email to discuss your service.</h1><p className="lead">For end of tenancy cleaning or pest control, call our team 24 hours a day or email the property and service details when it suits you.</p><div className="button-row"><ButtonLink href={siteConfig.phoneHref}>Call {siteConfig.phone}</ButtonLink><ButtonLink href={`mailto:${siteConfig.email}`} secondary>Email Us</ButtonLink></div><p className="hero-note"><DecorativeIcon icon={CheckmarkCircle02Icon} size={18} /><span>No online forms. We will confirm the scope, availability and full price before booking.</span></p></div><div className="quick-answer"><p className="eyebrow">Open 24 hours</p><h2>A direct route to the right service.</h2><p>Tell us whether you need cleaning or pest control, the property postcode, relevant details and preferred timing.</p></div></section>
    <section className="section section-white"><div className="shell trust-grid"><article className="trust-card"><span className="icon-box"><DecorativeIcon icon={Call02Icon} size={22} /></span><strong>Call our team</strong><span>{siteConfig.phone}</span><a href={siteConfig.phoneHref}>Call now</a></article><article className="trust-card"><span className="icon-box"><DecorativeIcon icon={Mail01Icon} size={22} /></span><strong>Email your details</strong><span>{siteConfig.email}</span><a href={`mailto:${siteConfig.email}`}>Send an email</a></article><article className="trust-card"><span className="icon-box"><DecorativeIcon icon={Clock01Icon} size={22} /></span><strong>Available 24/7</strong><span>Same-day callouts where required and available.</span></article><article className="trust-card"><span className="icon-box"><DecorativeIcon icon={CheckmarkCircle02Icon} size={22} /></span><strong>Clear before booking</strong><span>Scope and final price are confirmed in advance.</span></article></div></section>
    <section className="section"><div className="shell quote-band"><div><p className="eyebrow">What to include</p><h2>Help us understand the property or pest issue.</h2><p>For cleaning, include the property type, bedroom count, condition and preferred date. For pest control, include the pest signs, affected rooms, postcode and timing.</p></div><ButtonLink href={`mailto:${siteConfig.email}?subject=Service%20enquiry`}>Email Service Details</ButtonLink></div></section>
  </main>;
}
