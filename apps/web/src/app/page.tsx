import type { Metadata } from "next";
import Image from "next/image";
import {
  Bug01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  CleanIcon,
  Home03Icon,
  InformationCircleIcon,
  Location01Icon,
  Mail01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ButtonLink } from "@/components/button-link";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { organisationSchema, websiteSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: "End of Tenancy Cleaning & Pest Control | Best One Services" },
  description:
    "Professional end of tenancy cleaning and pest-control enquiry support for homes, rental properties and businesses. Request a clear quote from Best One Services.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: "End of Tenancy Cleaning & Pest Control | Best One Services",
    description: siteConfig.description,
    url: "/",
    images: [
      {
        url: "/images/end-of-tenancy-hero.jpg",
        width: 1693,
        height: 929,
        alt: "A professional cleaner preparing a bright rental property",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "End of Tenancy Cleaning & Pest Control | Best One Services",
    description: siteConfig.description,
    images: ["/images/end-of-tenancy-hero.jpg"],
  },
};

const homeFaqs = [
  {
    question: "What services does Best One Services focus on?",
    answer:
      "The website focuses on end of tenancy cleaning and pest-control enquiries for homes, rental properties and businesses.",
  },
  {
    question: "Can I request a quote without creating an account?",
    answer:
      "Yes. You can send an enquiry as a guest using your name, email address and the relevant property or pest details.",
  },
  {
    question: "What if I am not sure which pest I have?",
    answer:
      "You can describe what you have noticed, where the issue is occurring and when it began. The enquiry can then be reviewed against the available service categories.",
  },
  {
    question: "Are prices confirmed on the website?",
    answer:
      "Prices will only be published after they have been confirmed by the business. Until then, request a quote based on the property and service requirements.",
  },
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    organisationSchema(),
    websiteSchema(),
    {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/#webpage`,
      url: siteConfig.url,
      name: "End of Tenancy Cleaning & Pest Control | Best One Services",
      description: siteConfig.description,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      inLanguage: "en-GB",
    },
    {
      "@type": "FAQPage",
      mainEntity: homeFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />

      <section className="shell hero home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Cleaning and pest control</p>
          <h1 id="home-title">Property services, made easier to understand.</h1>
          <p className="lead">Choose end of tenancy cleaning or pest-control support, share the useful details and receive a clear response about the next step.</p>
          <div className="button-row">
            <ButtonLink href={`mailto:${siteConfig.email}?subject=Free%20Quote%20Request`}>Get a Free Quote</ButtonLink>
            <ButtonLink href="#services" secondary arrow={false}>Explore Services</ButtonLink>
          </div>
          <p className="hero-note"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>No account required. Enquiries are reviewed using the information you provide.</span></p>
        </div>
        <div className="hero-media">
          <Image src="/images/end-of-tenancy-hero.jpg" alt="A cleaner preparing a bright rental property" width={1693} height={929} priority sizes="(max-width: 1020px) 90vw, 500px" />
        </div>
      </section>

      <section className="section" id="services" aria-labelledby="services-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">Choose a service</p><h2 id="services-title">Two clear starting points.</h2></div><p>Every property has different needs. Select the service that best matches the current situation.</p></div>
          <div className="service-grid">
            <article className="service-card">
              <div><span className="icon-box"><HugeiconsIcon icon={CleanIcon} size={22} /></span><h2>End of Tenancy Cleaning</h2><p>For tenants, landlords and letting agents preparing a rental property for inspection, key return or new occupants.</p><ButtonLink href="/end-of-tenancy-cleaning/">Explore Cleaning</ButtonLink></div>
              <Image src="/images/cleaning-service.jpg" alt="A bright, clean rental-property kitchen" width={1536} height={1024} sizes="(max-width: 760px) 90vw, 230px" />
            </article>
            <article className="service-card" id="pest-control">
              <div><span className="icon-box"><HugeiconsIcon icon={Bug01Icon} size={22} /></span><h2>Pest Control</h2><p>Submit details about a pest concern at a home, rental property or business premises for the relevant next step.</p><ButtonLink href={`mailto:${siteConfig.email}?subject=Pest%20Control%20Enquiry`}>Request Pest Support</ButtonLink></div>
              <Image src="/images/pest-inspection.jpg" alt="A pest-control professional inspecting a property" width={1723} height={913} sizes="(max-width: 760px) 90vw, 230px" />
            </article>
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="home-quick-answer">
        <div className="shell quick-answer">
          <p className="eyebrow">In brief</p>
          <h2 id="home-quick-answer">What does Best One Services help with?</h2>
          <p>Best One Services provides a clear route to request end of tenancy cleaning or pest-control support. Customers explain the property or pest issue, share the location and preferred date, and receive a response using the contact details provided.</p>
          <dl className="fact-grid">
            <div className="fact-card"><dt>Cleaning</dt><dd>Rental-property preparation before handover</dd></div>
            <div className="fact-card"><dt>Pest control</dt><dd>Enquiries for common property pest concerns</dd></div>
            <div className="fact-card"><dt>Contact</dt><dd>{siteConfig.email}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section" id="how-it-works" aria-labelledby="home-process-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">How it works</p><h2 id="home-process-title">A clear four-step enquiry process.</h2></div></div>
          <div className="process-grid">
            <article className="process-card"><h3>Choose a service</h3><p>Select cleaning or pest control based on the property situation.</p></article>
            <article className="process-card"><h3>Share the details</h3><p>Provide the property, area, timing and a short explanation of the requirement.</p></article>
            <article className="process-card"><h3>Receive a response</h3><p>The enquiry is reviewed using the information and contact details supplied.</p></article>
            <article className="process-card"><h3>Arrange the next step</h3><p>Proceed after the service requirements and suitable arrangement are clear.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="who-title">
        <div className="shell split">
          <div className="reading"><p className="eyebrow">Who we help</p><h2 id="who-title">Support for different property responsibilities.</h2><p>Tenants may be preparing to move out. Landlords and letting agents may be planning a handover. Homeowners may need help with a pest concern, while businesses may need to explain an issue at their premises.</p><p>The enquiry begins with the actual situation, so visitors do not need to search through unrelated service options.</p></div>
          <aside className="panel"><span className="icon-box"><HugeiconsIcon icon={UserMultiple02Icon} size={22} /></span><h3>Useful information</h3><ul className="clean-list"><li><HugeiconsIcon icon={Home03Icon} size={18} /><span>Property type and relevant rooms</span></li><li><HugeiconsIcon icon={Location01Icon} size={18} /><span>Postcode or service area</span></li><li><HugeiconsIcon icon={Calendar03Icon} size={18} /><span>Preferred date or fixed deadline</span></li><li><HugeiconsIcon icon={Mail01Icon} size={18} /><span>A working email address for the response</span></li></ul></aside>
        </div>
      </section>

      <section className="section section-alt" id="faqs" aria-labelledby="home-faq-title">
        <div className="shell">
          <div className="faq-heading"><p className="eyebrow"><HugeiconsIcon icon={InformationCircleIcon} size={18} />FAQs</p><h2 id="home-faq-title">Common questions before an enquiry.</h2></div>
          <FaqList faqs={homeFaqs} />
        </div>
      </section>

      <section className="section section-white" aria-labelledby="home-cta-title">
        <div className="shell final-cta">
          <div><p className="eyebrow">Start here</p><h2 id="home-cta-title">Need cleaning or pest-control support?</h2><p>Select the relevant service, share the property or pest details and request a clear response about the next step.</p></div>
          <div className="contact-actions"><ButtonLink href={`mailto:${siteConfig.email}?subject=Free%20Quote%20Request`}>Get a Free Quote</ButtonLink><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div>
        </div>
      </section>
    </main>
  );
}
