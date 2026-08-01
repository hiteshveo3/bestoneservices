import type { Metadata } from "next";
import Image from "next/image";
import {
  Bug01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  CleanIcon,
  Home03Icon,
  InformationCircleIcon,
  Key01Icon,
  Location01Icon,
  Mail01Icon,
  Shield01Icon,
  SparklesIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { ButtonLink } from "@/components/button-link";
import { DecorativeIcon as HugeiconsIcon } from "@/components/decorative-icon";
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
      "Yes. Use the quote form as a guest. Provide your name, email address and the relevant property or pest details; no customer account is created.",
  },
  {
    question: "What details help with an end of tenancy cleaning quote?",
    answer:
      "The property type, bedroom count, furniture status, postcode or area, preferred date, access notes and any separately requested work make the first response clearer.",
  },
  {
    question: "What if I am not sure which pest I have?",
    answer:
      "You can still submit an enquiry. Describe what you have noticed, where it is occurring and when it began instead of trying to diagnose the problem yourself.",
  },
  {
    question: "Does a preferred date confirm availability?",
    answer:
      "No. A preferred date provides useful timing information, but availability and the final arrangement must be confirmed separately.",
  },
  {
    question: "Are fixed prices or guarantees shown on the website?",
    answer:
      "Only confirmed business information should be published. Until prices, coverage or service commitments are verified, the website guides customers towards a property-specific enquiry.",
  },
] as const;

const trustItems = [
  [Home03Icon, "Property-led", "The real property situation shapes the enquiry."],
  [InformationCircleIcon, "Clear details", "Only the useful information is requested."],
  [Shield01Icon, "Verified claims", "Unconfirmed prices and promises stay unpublished."],
  [Mail01Icon, "Direct response", "The contact details provided are used for the reply."],
] as const;

const audienceItems = [
  [Key01Icon, "Tenants", "Prepare a rental property before keys are returned."],
  [Home03Icon, "Landlords", "Explain cleaning or pest concerns between tenancies."],
  [UserMultiple02Icon, "Letting agents", "Share clear requirements for a managed property."],
  [SparklesIcon, "Homeowners", "Request support based on the actual home situation."],
  [Shield01Icon, "Businesses", "Describe a pest concern at commercial premises."],
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
          <p className="eyebrow">Cleaning and pest-control support</p>
          <h1 id="home-title">End of tenancy cleaning and pest control, made simple.</h1>
          <p className="lead">Whether you are preparing a rental property for handover or dealing with an unwanted pest concern, choose the right service, share the useful details and receive a clear response about the next step.</p>
          <div className="button-row">
            <ButtonLink href="/get-a-quote/">Get a Free Quote</ButtonLink>
            <ButtonLink href="#services" secondary arrow={false}>Explore Services</ButtonLink>
          </div>
          <p className="hero-note"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>No account required. Tell us what you need, where the property is and your preferred date.</span></p>
        </div>
        <div className="hero-media">
          <Image src="/images/end-of-tenancy-hero.jpg" alt="A professional cleaner preparing a bright rental property" width={1693} height={929} preload sizes="(max-width: 1020px) 90vw, 500px" />
        </div>
      </section>

      <section className="section" aria-label="Service highlights">
        <div className="shell trust-grid">
          {trustItems.map(([icon, title, text]) => (
            <article className="trust-card" key={title}>
              <span className="icon-box"><HugeiconsIcon icon={icon} size={22} /></span>
              <strong>{title}</strong><span>{text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-white" aria-labelledby="home-quick-answer">
        <div className="shell quick-answer">
          <p className="eyebrow">Quick answer</p>
          <h2 id="home-quick-answer">What does Best One Services help with?</h2>
          <p>Best One Services gives tenants, landlords, letting agents, homeowners, property managers and businesses one clear place to request end of tenancy cleaning or pest-control support.</p>
          <dl className="fact-grid">
            <div className="fact-card"><dt>Cleaning</dt><dd>Rental-property preparation before handover</dd></div>
            <div className="fact-card"><dt>Pest control</dt><dd>Common property pest concerns and next steps</dd></div>
            <div className="fact-card"><dt>Contact</dt><dd>{siteConfig.email}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section" id="services" aria-labelledby="services-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">Choose a service</p><h2 id="services-title">Two services, one clear starting point.</h2></div><p>Select the option that matches the current situation. Each path collects different property details without making you search through unrelated services.</p></div>
          <div className="service-grid">
            <article className="service-card">
              <div><span className="icon-box"><HugeiconsIcon icon={CleanIcon} size={22} /></span><h2>End of Tenancy Cleaning</h2><p>For tenants, landlords and letting agents preparing a rental property for inspection, key return or new occupants.</p><ButtonLink href="/end-of-tenancy-cleaning/">Explore Cleaning</ButtonLink></div>
              <Image src="/images/cleaning-service.jpg" alt="A bright, clean rental-property kitchen" width={1536} height={1024} sizes="(max-width: 760px) 90vw, 230px" />
            </article>
            <article className="service-card" id="pest-control">
              <div><span className="icon-box"><HugeiconsIcon icon={Bug01Icon} size={22} /></span><h2>Pest Control</h2><p>Describe a pest concern at a home, rental property or business premises, even when you are unsure of the pest type.</p><ButtonLink href="/get-a-quote/?service=pest-control">Get a Free Quote</ButtonLink></div>
              <Image src="/images/pest-inspection.jpg" alt="A pest-control professional inspecting a property" width={1723} height={913} sizes="(max-width: 760px) 90vw, 230px" />
            </article>
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="cleaning-feature-title">
        <div className="shell feature-split">
          <div className="feature-media"><Image src="/images/cleaning-service.jpg" alt="A clean rental-property kitchen ready for a handover" width={1536} height={1024} sizes="(max-width: 1020px) 90vw, 520px" /></div>
          <div className="feature-copy"><p className="eyebrow">End of tenancy cleaning</p><h2 id="cleaning-feature-title">Prepare the property for its next stage.</h2><p>Moving out involves inspections, access, keys and deadlines. Share the property type, bedroom count, furniture status and any specific cleaning priorities so the request can be reviewed against the actual home.</p><ul className="clean-list feature-list"><li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>For tenants, landlords, agents and property managers</span></li><li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Scope confirmed against property condition and requirements</span></li><li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Separately requested work identified before arrangement</span></li></ul><ButtonLink href="/end-of-tenancy-cleaning/">Explore Cleaning</ButtonLink></div>
        </div>
      </section>

      <section className="section" aria-labelledby="pest-feature-title">
        <div className="shell feature-split feature-reverse">
          <div className="feature-copy"><p className="eyebrow">Pest-control support</p><h2 id="pest-feature-title">Start with what you have noticed.</h2><p>You do not need to diagnose the issue yourself. Describe the affected area, when the concern began and any signs you have seen so the enquiry can move towards the most relevant next step.</p><ul className="clean-list feature-list"><li><HugeiconsIcon icon={Location01Icon} size={18} /><span>Share the property postcode or area</span></li><li><HugeiconsIcon icon={Bug01Icon} size={18} /><span>Name the pest only when you know it</span></li><li><HugeiconsIcon icon={Calendar03Icon} size={18} /><span>Add timing information without assuming availability</span></li></ul><ButtonLink href="/get-a-quote/?service=pest-control">Get a Free Quote</ButtonLink></div>
          <div className="feature-media"><Image src="/images/pest-inspection.jpg" alt="A pest-control professional carrying out a property inspection" width={1723} height={913} sizes="(max-width: 1020px) 90vw, 520px" /></div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="who-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">Who we help</p><h2 id="who-title">Built around different property responsibilities.</h2></div><p>Choose the service and explain your own situation rather than fitting it into a generic package.</p></div>
          <div className="audience-grid">
            {audienceItems.map(([icon, title, text]) => (
              <article className="content-card audience-card" key={title}><span className="icon-box"><HugeiconsIcon icon={icon} size={22} /></span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works" aria-labelledby="home-process-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">How it works</p><h2 id="home-process-title">A straightforward four-step process.</h2></div></div>
          <div className="process-grid">
            <article className="process-card"><h3>Choose your service</h3><p>Select cleaning or pest control based on the current property situation.</p></article>
            <article className="process-card"><h3>Share the details</h3><p>Provide the property, area, timing and a short explanation of the requirement.</p></article>
            <article className="process-card"><h3>Receive a response</h3><p>The enquiry is reviewed using the information and contact details supplied.</p></article>
            <article className="process-card"><h3>Confirm the next step</h3><p>Proceed only after the service requirements and suitable arrangement are clear.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="clarity-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">Why this process</p><h2 id="clarity-title">Better decisions start with clearer information.</h2></div></div>
          <div className="card-grid clarity-grid">
            <article className="content-card"><span className="icon-box"><HugeiconsIcon icon={InformationCircleIcon} size={22} /></span><h3>Clear service categories</h3><p>Cleaning and pest-control enquiries stay separate, so visitors can provide more relevant details.</p></article>
            <article className="content-card"><span className="icon-box"><HugeiconsIcon icon={Home03Icon} size={22} /></span><h3>Property-specific context</h3><p>The property type, contents, access and timing help explain the request before any arrangement.</p></article>
            <article className="content-card"><span className="icon-box"><HugeiconsIcon icon={Shield01Icon} size={22} /></span><h3>Verified information only</h3><p>Unconfirmed prices, reviews, coverage and credentials are not presented as established facts.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="quote-details-title">
        <div className="shell split">
          <div className="reading"><p className="eyebrow">Quote accuracy</p><h2 id="quote-details-title">A few useful details make the response clearer.</h2><p>The quote form adapts to the selected service. Cleaning asks for bedroom information; pest control lets you describe the pest type only when known.</p><ButtonLink href="/get-a-quote/">Get a Free Quote</ButtonLink></div>
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
          <div className="contact-actions"><ButtonLink href="/get-a-quote/">Get a Free Quote</ButtonLink><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div>
        </div>
      </section>
    </main>
  );
}
