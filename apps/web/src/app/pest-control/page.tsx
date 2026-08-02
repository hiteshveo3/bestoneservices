import type { Metadata } from "next";
import Image from "next/image";
import {
  BedIcon,
  Bug01Icon,
  Building03Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Home03Icon,
  InformationCircleIcon,
  Location01Icon,
  Shield01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { ButtonLink } from "@/components/button-link";
import { DecorativeIcon as HugeiconsIcon } from "@/components/decorative-icon";
import { FaqList } from "@/components/faq-list";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { multiVisitPestServices, pestControlContent as content, pricingNotice } from "@/content/pest-control";
import { servicePageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Pest Control Services",
  description: content.description,
  alternates: { canonical: "/pest-control/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: content.seoTitle,
    description: content.description,
    url: "/pest-control/",
    images: [
      {
        url: "/images/pest-inspection.jpg",
        width: 1723,
        height: 913,
        alt: "A pest-control professional inspecting a property",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.seoTitle,
    description: content.description,
    images: ["/images/pest-inspection.jpg"],
  },
};

const trustItems = [
  [Bug01Icon, "Describe the signs", "Report what you have seen without diagnosing it yourself."],
  [Home03Icon, "Homes and rentals", "Share the rooms or areas affected at the property."],
  [Building03Icon, "Business premises", "Commercial property contacts can submit an enquiry."],
  [Calendar03Icon, "Preferred date", "Tell us when you would like the problem reviewed."],
] as const;

const pestIcons = [
  Bug01Icon,
  Home03Icon,
  BedIcon,
  Building03Icon,
  SparklesIcon,
  InformationCircleIcon,
  Shield01Icon,
  Location01Icon,
] as const;

const detailIcons = [
  Bug01Icon,
  Home03Icon,
  Building03Icon,
  Location01Icon,
  InformationCircleIcon,
  Calendar03Icon,
] as const;

export default function PestControlPage() {
  const jsonLd = servicePageSchema({
    name: content.title,
    description: content.description,
    path: "/pest-control/",
    faqs: content.faqs,
  });

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />

      <section className="shell hero" aria-labelledby="pest-service-title">
        <div className="hero-copy">
          <p className="eyebrow"><HugeiconsIcon icon={Bug01Icon} size={18} />{content.hero.eyebrow}</p>
          <h1 id="pest-service-title">{content.hero.heading}</h1>
          <p className="lead">{content.hero.summary}</p>
          <div className="button-row">
            <ButtonLink href="/get-a-quote/?service=pest-control">Report a Pest Problem</ButtonLink>
            <ButtonLink href="#pest-types" secondary arrow={false}>View Pest Types</ButtonLink>
          </div>
          <p className="hero-note"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>You can submit an enquiry even when the pest type is unknown.</span></p>
        </div>
        <div className="hero-media">
          <Image
            src="/images/pest-inspection.jpg"
            alt="A pest-control professional carrying out a property inspection"
            width={1723}
            height={913}
            preload
            sizes="(max-width: 1020px) 90vw, 500px"
          />
        </div>
      </section>

      <section className="section" aria-label="Pest-control highlights">
        <div className="shell trust-grid">
          {trustItems.map(([icon, title, text]) => (
            <article className="trust-card" key={title}>
              <span className="icon-box"><HugeiconsIcon icon={icon} size={22} /></span>
              <strong>{title}</strong><span>{text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-white" aria-labelledby="pest-quick-answer">
        <div className="shell quick-answer">
          <p className="eyebrow">Quick answer</p>
          <h2 id="pest-quick-answer">What does a pest-control enquiry cover?</h2>
          <p>{content.quickAnswer}</p>
          <dl className="fact-grid">
            <div className="fact-card"><dt>Start with</dt><dd>The signs, rooms and property type</dd></div>
            <div className="fact-card"><dt>If unsure</dt><dd>Describe what you have noticed</dd></div>
            <div className="fact-card"><dt>Include</dt><dd>Postcode, timing and access details</dd></div>
          </dl>
        </div>
      </section>

      <section className="section" id="pest-types" aria-labelledby="pest-types-title">
        <div className="shell">
          <div className="section-head">
            <div><p className="eyebrow">Common enquiries</p><h2 id="pest-types-title">Choose a pest type—or tell us the signs.</h2></div>
            <p>The form also accepts an unknown pest type, so you do not have to identify the problem before contacting us.</p>
          </div>
          <div className="card-grid pest-grid">
            {content.pests.map(([title, text], index) => (
              <article className="content-card pest-card" key={title}>
                <span className="icon-box"><HugeiconsIcon icon={pestIcons[index % pestIcons.length]} size={22} /></span>
                <h3>{title}</h3><p>{text}</p>{multiVisitPestServices.has(title) ? <p className="service-note">Treatment may require more than one visit depending on the infestation.</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white" id="pest-prices" aria-labelledby="pest-prices-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">Starting prices</p><h2 id="pest-prices-title">Pest-control prices from the most common treatments.</h2></div><p>The final treatment and visit plan are confirmed after the pest, property and extent of the problem are understood.</p></div>
          <div className="pricing-grid">
            {content.startingPrices.map(([label, price]) => <article className="price-card" key={label}><h3>{label}</h3><strong>{price}</strong></article>)}
          </div>
          <div className="pricing-notice"><p>{pricingNotice[0]}</p><p>{pricingNotice[1]}</p></div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="pest-details-title">
        <div className="shell">
          <div className="section-head">
            <div><p className="eyebrow">Useful details</p><h2 id="pest-details-title">Six details help explain the problem.</h2></div>
            <p>A short, factual description is enough. Include the affected rooms and signs that are most relevant.</p>
          </div>
          <div className="detail-grid">
            {content.quoteDetails.map((detail, index) => (
              <div className="detail-item" key={detail}><HugeiconsIcon icon={detailIcons[index]} size={22} /><strong>{detail}</strong></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="pest-process" aria-labelledby="pest-process-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">How it works</p><h2 id="pest-process-title">Report the problem in three steps.</h2></div></div>
          <div className="process-grid">
            {content.process.map(([title, text]) => (
              <article className="process-card" key={title}><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="ilford-local-title">
        <div className="shell quote-band">
          <div>
            <p className="eyebrow"><HugeiconsIcon icon={Location01Icon} size={18} />Local pest control</p>
            <h2 id="ilford-local-title">Looking for pest control in Ilford?</h2>
            <p>Visit our dedicated Ilford page for available treatments, local enquiry details and frequently asked questions.</p>
          </div>
          <ButtonLink href="/pest-control-ilford/">Pest Control Ilford</ButtonLink>
        </div>
      </section>

      <section className="section section-alt" id="pest-faq" aria-labelledby="pest-faq-title">
        <div className="shell">
          <div className="faq-heading"><p className="eyebrow"><HugeiconsIcon icon={InformationCircleIcon} size={18} />FAQs</p><h2 id="pest-faq-title">Questions before reporting a pest problem.</h2></div>
          <FaqList faqs={content.faqs} />
        </div>
      </section>

      <section className="section section-white" aria-labelledby="pest-final-cta-title">
        <FinalCta
          eyebrow="Start your enquiry"
          title="Seen signs of a pest problem?"
          titleId="pest-final-cta-title"
          description="Tell us what you have noticed, where it is happening and the property postcode or area."
          href="/get-a-quote/?service=pest-control"
          buttonLabel="Report a Pest Problem"
        />
      </section>
    </main>
  );
}
