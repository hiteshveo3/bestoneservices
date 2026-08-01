import type { Metadata } from "next";
import Image from "next/image";
import {
  Bathtub01Icon,
  BedIcon,
  Building03Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  CleanIcon,
  Home03Icon,
  InformationCircleIcon,
  Key01Icon,
  Location01Icon,
  Sofa01Icon,
  SparklesIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ButtonLink } from "@/components/button-link";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { endOfTenancyContent as content } from "@/content/end-of-tenancy";
import { servicePageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "End of Tenancy Cleaning",
  description: content.description,
  alternates: { canonical: "/end-of-tenancy-cleaning/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: content.seoTitle,
    description: content.description,
    url: "/end-of-tenancy-cleaning/",
    images: [
      {
        url: "/images/end-of-tenancy-hero.jpg",
        width: 1693,
        height: 929,
        alt: "A cleaner preparing a bright rental property for handover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.seoTitle,
    description: content.description,
    images: ["/images/end-of-tenancy-hero.jpg"],
  },
};

const trustItems = [
  [Home03Icon, "Property-led enquiry", "The home and its requirements shape the response."],
  [Calendar03Icon, "Preferred date", "Share the inspection or handover timing."],
  [InformationCircleIcon, "Clear scope", "Confirm the work before it is arranged."],
  [UserMultiple02Icon, "For property people", "Tenants, landlords, agents and managers."],
] as const;

const audienceIcons = [Key01Icon, Home03Icon, Building03Icon, Sofa01Icon, UserMultiple02Icon] as const;
const scopeIcons = [CleanIcon, Bathtub01Icon, BedIcon, Sofa01Icon, Home03Icon, SparklesIcon] as const;
const detailIcons = [Home03Icon, BedIcon, Calendar03Icon, Location01Icon, Sofa01Icon, InformationCircleIcon] as const;

export default function EndOfTenancyCleaningPage() {
  const jsonLd = servicePageSchema({
    name: content.title,
    description: content.description,
    path: "/end-of-tenancy-cleaning/",
    faqs: content.faqs,
  });

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />

      <section className="shell hero" aria-labelledby="service-title">
        <div className="hero-copy">
          <p className="eyebrow"><HugeiconsIcon icon={CleanIcon} size={18} />{content.hero.eyebrow}</p>
          <h1 id="service-title">{content.hero.heading}</h1>
          <p className="lead">{content.hero.summary}</p>
          <div className="button-row">
            <ButtonLink href={`mailto:${siteConfig.email}?subject=End%20of%20Tenancy%20Cleaning%20Quote`}>
              Get a Cleaning Quote
            </ButtonLink>
            <ButtonLink href="#included" secondary arrow={false}>See What&apos;s Included</ButtonLink>
          </div>
          <p className="hero-note"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>No account required. Share the useful property details and receive a response about the next step.</span></p>
        </div>
        <div className="hero-media">
          <Image
            src="/images/end-of-tenancy-hero.jpg"
            alt="A professional cleaner finishing a bright rental flat before handover"
            width={1693}
            height={929}
            priority
            sizes="(max-width: 1020px) 90vw, 500px"
          />
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

      <section className="section section-white" aria-labelledby="quick-answer-title">
        <div className="shell quick-answer">
          <p className="eyebrow">Quick answer</p>
          <h2 id="quick-answer-title">What is end of tenancy cleaning?</h2>
          <p>{content.quickAnswer}</p>
          <dl className="fact-grid">
            <div className="fact-card"><dt>Commonly requested by</dt><dd>Tenants, landlords, letting agents and property managers</dd></div>
            <div className="fact-card"><dt>Quote normally considers</dt><dd>Property size, condition, contents, access and timing</dd></div>
            <div className="fact-card"><dt>Best next step</dt><dd>Share the property details and confirm the final scope</dd></div>
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="overview-title">
        <div className="shell split">
          <div className="reading">
            <p className="eyebrow">Service overview</p>
            <h2 id="overview-title">Prepare the property for its next stage.</h2>
            <p>Moving out involves deadlines, keys, inspections and a long list of practical jobs. A focused end of tenancy clean helps bring the property back to a clear, presentable condition before handover.</p>
            <p>Every property is different. A studio flat, family home, furnished rental and shared accommodation may not need exactly the same approach. The enquiry therefore starts with the property rather than a fixed package.</p>
          </div>
          <aside className="panel" aria-label="Useful quote details">
            <span className="icon-box"><HugeiconsIcon icon={InformationCircleIcon} size={22} /></span>
            <h3>Useful details to share</h3>
            <ul className="clean-list">
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Property type and bedroom count</span></li>
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Furnished or unfurnished</span></li>
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Preferred cleaning date</span></li>
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Postcode, access and parking notes</span></li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="audience-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">Who we help</p><h2 id="audience-title">One service, different property situations.</h2></div></div>
          <div className="audience-grid">
            {content.audiences.map(([title, text], index) => (
              <article className="content-card audience-card" key={title}>
                <span className="icon-box"><HugeiconsIcon icon={audienceIcons[index]} size={22} /></span>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="included" aria-labelledby="included-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">Core cleaning scope</p><h2 id="included-title">What can be included in your enquiry.</h2></div><p>The final scope should always be confirmed against the property and the information you provide.</p></div>
          <div className="card-grid">
            {content.scope.map(([title, text], index) => (
              <article className="content-card" key={title}>
                <span className="icon-box"><HugeiconsIcon icon={scopeIcons[index]} size={22} /></span>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="scope-guide-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">Scope guide</p><h2 id="scope-guide-title">Core areas and separately confirmed work.</h2></div></div>
          <div className="scope-table">
            <table>
              <caption>End of tenancy cleaning enquiry guide</caption>
              <thead><tr><th>Area or item</th><th>Core enquiry</th><th>Confirm separately</th></tr></thead>
              <tbody>
                <tr><th scope="row">Kitchen and bathrooms</th><td>Discuss as core areas</td><td>Condition can affect scope</td></tr>
                <tr><th scope="row">Bedrooms and living spaces</th><td>Discuss as core areas</td><td>Furniture and access</td></tr>
                <tr><th scope="row">Floors and internal surfaces</th><td>Discuss as core areas</td><td>Material-specific treatment</td></tr>
                <tr><th scope="row">Oven, carpets and upholstery</th><td>Mention in the enquiry</td><td>Confirm price and availability</td></tr>
                <tr><th scope="row">Specialist or external work</th><td>Mention in the enquiry</td><td>Confirm price and availability</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="details-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">Quote accuracy</p><h2 id="details-title">Six details make the first response clearer.</h2></div></div>
          <div className="detail-grid">
            {content.quoteDetails.map((detail, index) => (
              <div className="detail-item" key={detail}><HugeiconsIcon icon={detailIcons[index]} size={22} /><strong>{detail}</strong></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white" id="process" aria-labelledby="process-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">How it works</p><h2 id="process-title">A straightforward four-step process.</h2></div></div>
          <div className="process-grid">
            {content.process.map(([title, text]) => <article className="process-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="quote-title">
        <div className="shell quote-band">
          <div><p className="eyebrow">Property-specific quote</p><h2 id="quote-title">Clear pricing starts with accurate details.</h2><p>Final prices will only be published when confirmed by the business. Until then, the property type, bedroom count, condition and requested work are used to discuss a tailored quote.</p></div>
          <ButtonLink href={`mailto:${siteConfig.email}?subject=End%20of%20Tenancy%20Cleaning%20Quote`}>Request a Quote</ButtonLink>
        </div>
      </section>

      <section className="section section-alt" id="faq" aria-labelledby="faq-title">
        <div className="shell">
          <div className="faq-heading"><p className="eyebrow"><HugeiconsIcon icon={InformationCircleIcon} size={18} />FAQs</p><h2 id="faq-title">Answers before you request a quote.</h2></div>
          <FaqList faqs={content.faqs} />
        </div>
      </section>

      <section className="section section-white" id="quote" aria-labelledby="final-cta-title">
        <div className="shell final-cta">
          <div><p className="eyebrow">Start your enquiry</p><h2 id="final-cta-title">Need the property ready for handover?</h2><p>Share the property type, bedroom count, postcode or area, preferred date and useful notes. We can then review the request and explain the next step.</p></div>
          <div className="contact-actions"><ButtonLink href={`mailto:${siteConfig.email}?subject=End%20of%20Tenancy%20Cleaning%20Quote`}>Request Your Quote</ButtonLink><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div>
        </div>
      </section>
    </main>
  );
}
