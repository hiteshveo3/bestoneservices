import type { Metadata } from "next";
import { Certificate01Icon, CheckmarkCircle02Icon, Clock01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { ButtonLink } from "@/components/button-link";
import { DecorativeIcon as HugeiconsIcon } from "@/components/decorative-icon";
import { FaqList } from "@/components/faq-list";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { organisationSchema } from "@/lib/structured-data";

export const metadata: Metadata = { title: "About Bestone Services Ltd", description: "Learn about Bestone Services Ltd, a licensed and insured BPCA member providing end of tenancy cleaning and pest control across London.", alternates: { canonical: "/about/" } };

const faqs = [
  { question: "What areas do you cover?", answer: "We provide services across London and all boroughs. Share your postcode or area with your enquiry so we can review the requirements." },
  { question: "Do you offer same-day callouts?", answer: "Same-day callouts are available where required and subject to service availability." },
  { question: "Are you licensed and insured?", answer: "Yes. Bestone Services Ltd is fully licensed and insured, and is a BPCA member." },
  { question: "What pests do you treat?", answer: "Services include rats, mice, bed bugs, cockroaches, ants, fleas, wasps, squirrels, spiders, silverfish, moths, carpet beetles and woodworm." },
] as const;

export default function AboutPage() {
  return <main id="main-content"><JsonLd data={organisationSchema()} />
    <section className="shell hero" aria-labelledby="about-title"><div className="hero-copy"><p className="eyebrow">About Bestone Services Ltd</p><h1 id="about-title">Cleaning and pest-control support across London.</h1><p className="lead">We help homes, rental properties, landlords, letting agents, property managers and businesses take the next practical step.</p><div className="button-row"><ButtonLink href="/get-a-quote/">Get a Free Quote</ButtonLink><ButtonLink href="/pest-control/" secondary>Explore Pest Control</ButtonLink></div></div><div className="quick-answer"><p className="eyebrow">London-wide service</p><h2>Clear support, 24 hours a day.</h2><p>Based in Ilford, we provide cleaning and pest-control services across London and Greater London, including same-day callouts where required and available.</p></div></section>
    <section className="section section-white"><div className="shell trust-grid"><article className="trust-card"><span className="icon-box"><HugeiconsIcon icon={Certificate01Icon} size={22} /></span><strong>Licensed &amp; insured</strong><span>Professional service standards for every enquiry.</span></article><article className="trust-card"><span className="icon-box"><HugeiconsIcon icon={Clock01Icon} size={22} /></span><strong>Open 24 hours</strong><span>Call us whenever you need help.</span></article><article className="trust-card"><span className="icon-box"><HugeiconsIcon icon={Location01Icon} size={22} /></span><strong>London coverage</strong><span>Homes, rentals and commercial premises.</span></article><article className="trust-card"><span className="icon-box"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} /></span><strong>BPCA member</strong><span>Committed to responsible pest-control standards.</span></article></div></section>
    <section className="section"><div className="shell service-grid"><article className="service-card"><div><p className="eyebrow">End of tenancy cleaning</p><h2>Property cleaning for a smoother handover.</h2><p>Tell us the property type, bedroom count, condition, preferred date and any required add-ons. We will discuss the right scope before booking.</p><ButtonLink href="/end-of-tenancy-cleaning/">View Cleaning Service</ButtonLink></div></article><article className="service-card"><div><p className="eyebrow">Pest control</p><h2>Help with common property pest concerns.</h2><p>Describe the pest signs, affected rooms and property details. If the pest is unknown, we can still review the enquiry.</p><ButtonLink href="/pest-control/">Explore Pest Control</ButtonLink></div></article></div></section>
    <section className="section section-alt"><div className="shell"><div className="section-head"><div><p className="eyebrow">How we work</p><h2>A simple process from enquiry to service.</h2></div></div><div className="process-grid"><article className="process-card"><h3>Choose your service</h3><p>Select cleaning or pest control, or use the relevant treatment category when you know it.</p></article><article className="process-card"><h3>Share your requirements</h3><p>Add the property, postcode, timing and useful details about the clean or pest issue.</p></article><article className="process-card"><h3>Confirm the next step</h3><p>We discuss the scope, availability and final price before any work is booked.</p></article></div></div></section>
    <section className="section section-white"><div className="shell quote-band"><div><p className="eyebrow">Company information</p><h2>Bestone Services Ltd</h2><p>Private limited company no. 15574809, incorporated 19 March 2024. Registered office: 28–42 Clements Road, Ilford, England, IG1 1BA.</p></div><ButtonLink href={siteConfig.phoneHref} secondary>Call 24/7</ButtonLink></div></section>
    <section className="section section-alt" id="about-faq"><div className="shell"><div className="faq-heading"><p className="eyebrow">FAQs</p><h2>Questions about our service.</h2></div><FaqList faqs={faqs} /></div></section>
    <section className="section section-white"><FinalCta eyebrow="Start your enquiry" title="Tell us what you need." titleId="about-cta" description="Share a few details about the property or pest concern and request a clear quote today." href="/get-a-quote/" buttonLabel="Get a Free Quote" /></section>
  </main>;
}
