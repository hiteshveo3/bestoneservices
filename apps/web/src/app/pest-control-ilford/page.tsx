import type { Metadata } from "next";
import Image from "next/image";
import {
  Bug01Icon,
  Calendar03Icon,
  Certificate01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Home03Icon,
  InformationCircleIcon,
  Location01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { ButtonLink } from "@/components/button-link";
import { DecorativeIcon as HugeiconsIcon } from "@/components/decorative-icon";
import { FaqList } from "@/components/faq-list";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { pestControlContent } from "@/content/pest-control";
import { pestControlIlfordContent as content } from "@/content/pest-control-ilford";
import { servicePageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Pest Control Ilford",
  description: content.description,
  alternates: { canonical: "/pest-control-ilford/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: content.seoTitle,
    description: content.description,
    url: "/pest-control-ilford/",
    images: [{ url: "/images/pest-inspection.jpg", width: 1723, height: 913, alt: "A pest-control professional inspecting a property" }],
  },
  twitter: {
    card: "summary_large_image",
    title: content.seoTitle,
    description: content.description,
    images: ["/images/pest-inspection.jpg"],
  },
};

const trustItems = [
  [StarIcon, `${siteConfig.googleRating} on Google`, `${siteConfig.googleReviewCount} customer reviews`],
  [Clock01Icon, "Open 24 hours", "Call when you need help"],
  [Certificate01Icon, "Licensed & insured", "Professional service standards"],
  [Location01Icon, "Ilford service area", "Homes, rentals and businesses"],
] as const;

const pestIcons = [Bug01Icon, Home03Icon, InformationCircleIcon, Certificate01Icon] as const;

export default function PestControlIlfordPage() {
  const jsonLd = servicePageSchema({
    name: content.title,
    description: content.description,
    path: "/pest-control-ilford/",
    faqs: content.faqs,
    areaServed: "Ilford",
  });

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />

      <section className="shell hero" aria-labelledby="ilford-title">
        <div className="hero-copy">
          <p className="eyebrow"><HugeiconsIcon icon={Location01Icon} size={18} />{content.hero.eyebrow}</p>
          <h1 id="ilford-title">{content.hero.heading}</h1>
          <p className="lead">{content.hero.summary}</p>
          <div className="button-row">
            <ButtonLink href="/get-a-quote/?service=pest-control">Report a Pest Problem</ButtonLink>
            <ButtonLink href={siteConfig.phoneHref} secondary arrow={false}>Call 24/7</ButtonLink>
          </div>
          <p className="hero-note"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Based in Ilford at {siteConfig.address.streetAddress}. No account is required to request a quote.</span></p>
        </div>
        <div className="hero-media">
          <Image src="/images/pest-inspection.jpg" alt="A pest-control professional inspecting a property" width={1723} height={913} preload sizes="(max-width: 1020px) 90vw, 500px" />
        </div>
      </section>

      <section className="section" aria-label="Ilford pest-control highlights">
        <div className="shell trust-grid">
          {trustItems.map(([icon, title, text]) => (
            <article className="trust-card" key={title}>
              <span className="icon-box"><HugeiconsIcon icon={icon} size={22} /></span>
              <strong>{title}</strong><span>{text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-white" aria-labelledby="ilford-overview-title">
        <div className="shell feature-split">
          <div className="feature-copy">
            <p className="eyebrow"><HugeiconsIcon icon={Bug01Icon} size={18} />A clear starting point</p>
            <h2 id="ilford-overview-title">Tell us what is happening at the property.</h2>
            <p>{content.intro}</p>
            <ul className="clean-list feature-list">
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Describe the pest, signs or damage you have noticed</span></li>
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Include the rooms or outdoor areas affected</span></li>
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Add the Ilford postcode, timing and any access notes</span></li>
            </ul>
            <ButtonLink href="/get-a-quote/?service=pest-control">Get an Ilford Pest-Control Quote</ButtonLink>
          </div>
          <div className="feature-media">
            <Image src="/images/cleaning-service.jpg" alt="A clean, well-kept property interior" width={1536} height={1024} sizes="(max-width: 1020px) 100vw, 48vw" />
          </div>
        </div>
      </section>

      <section className="section" id="ilford-pest-services" aria-labelledby="ilford-services-title">
        <div className="shell">
          <div className="section-head">
            <div><p className="eyebrow">Available pest services</p><h2 id="ilford-services-title">Pest-control treatments available in Ilford.</h2></div>
            <p>Choose the service you recognise, or submit an enquiry with an unknown pest type and describe the signs instead.</p>
          </div>
          <div className="card-grid pest-grid">
            {pestControlContent.pests.map(([title, text], index) => (
              <article className="content-card pest-card" key={title}>
                <span className="icon-box"><HugeiconsIcon icon={pestIcons[index % pestIcons.length]} size={22} /></span>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="ilford-process" aria-labelledby="ilford-process-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow"><HugeiconsIcon icon={Calendar03Icon} size={18} />How it works</p><h2 id="ilford-process-title">From pest signs to the right next step.</h2></div></div>
          <div className="process-grid">
            <article className="process-card"><h3>Report the issue</h3><p>Choose pest control and describe the type of pest or the signs you have noticed.</p></article>
            <article className="process-card"><h3>Share Ilford property details</h3><p>Add the postcode, affected rooms, property type and any useful timing or access notes.</p></article>
            <article className="process-card"><h3>Discuss the service</h3><p>Our team can review the enquiry and discuss availability, requirements and the relevant quote.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="ilford-contact-title">
        <div className="shell area-band">
          <div>
            <p className="eyebrow">Call the Ilford team</p>
            <h2 id="ilford-contact-title">Need to report a pest problem now?</h2>
            <p>Best One Services is open 24 hours. Call {siteConfig.phone} or send a quote request with the property and pest details.</p>
          </div>
          <ButtonLink href={siteConfig.phoneHref} secondary arrow={false}>Call 24/7</ButtonLink>
        </div>
      </section>

      <section className="section section-alt" id="ilford-faqs" aria-labelledby="ilford-faq-title">
        <div className="shell">
          <div className="faq-heading"><p className="eyebrow"><HugeiconsIcon icon={InformationCircleIcon} size={18} />Ilford FAQs</p><h2 id="ilford-faq-title">Questions about pest control in Ilford.</h2></div>
          <FaqList faqs={content.faqs} />
        </div>
      </section>

      <section className="section section-white" aria-labelledby="ilford-final-cta-title">
        <FinalCta eyebrow="Start your enquiry" title="Tell us what you have seen." titleId="ilford-final-cta-title" description="Choose the pest type if known, add the Ilford postcode and explain the rooms or areas affected." href="/get-a-quote/?service=pest-control" buttonLabel="Report a Pest Problem" />
      </section>
    </main>
  );
}
