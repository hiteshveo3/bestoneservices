import type { Metadata } from "next";
import Image from "next/image";
import {
  Bug01Icon,
  CheckmarkCircle02Icon,
  CleanIcon,
  Home03Icon,
  InformationCircleIcon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { ButtonLink } from "@/components/button-link";
import { DecorativeIcon as HugeiconsIcon } from "@/components/decorative-icon";
import { FaqList } from "@/components/faq-list";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { organisationSchema, websiteSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: "End of Tenancy Cleaning & Pest Control | Best One Services" },
  description:
    "End of tenancy cleaning and pest-control services for homes, rental properties and businesses. Tell Best One Services what the property needs and request a free quote.",
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
    question: "Which services can I request?",
    answer:
      "Best One Services currently accepts enquiries for end of tenancy cleaning and pest control. Each service has its own page and quote path.",
  },
  {
    question: "Can I request a quote without an account?",
    answer:
      "Yes. Submit the form as a guest using your name, email address and the relevant property details. No customer account is created.",
  },
  {
    question: "What helps with an end of tenancy cleaning quote?",
    answer:
      "Share the property type, bedroom count, furniture status, postcode or area, preferred date and the rooms or add-ons that need attention.",
  },
  {
    question: "What if I am not sure which pest I have?",
    answer:
      "You can still report the problem. Describe the signs, affected rooms and when the issue began instead of guessing the pest type.",
  },
  {
    question: "How do I check whether my area is covered?",
    answer:
      "Enter the property postcode or area in the quote form. Whether that location is covered can then be confirmed.",
  },
  {
    question: "Does my preferred date confirm availability?",
    answer:
      "No. It explains the timing you need, but availability and any booking must be confirmed separately.",
  },
] as const;

const trustItems = [
  [CleanIcon, "Move-out cleaning", "Property cleaning planned around handover details."],
  [Bug01Icon, "Pest enquiries", "Report common pest signs even when the type is unknown."],
  [Home03Icon, "Different properties", "Homes, rentals and business premises can be described."],
  [Shield01Icon, "No account required", "Request a quote as a guest without creating a profile."],
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

      <section className="shell hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Cleaning and pest control</p>
          <h1 id="home-title">End of tenancy cleaning and pest control you can rely on.</h1>
          <p className="lead">Get the property ready for handover or report a pest concern without the runaround. Tell us what needs attention, where the property is and your preferred date.</p>
          <div className="button-row">
            <ButtonLink href="/get-a-quote/">Get My Free Quote</ButtonLink>
            <ButtonLink href="/end-of-tenancy-cleaning/" secondary arrow={false}>View Cleaning Service</ButtonLink>
          </div>
          <p className="hero-note"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>One form for cleaning or pest control. No account required.</span></p>
        </div>
        <div className="hero-media hero-media-dual" aria-label="Cleaning and pest-control services">
          <figure>
            <Image src="/images/end-of-tenancy-hero.jpg" alt="A professional cleaner preparing a bright rental property" width={1693} height={929} preload sizes="(max-width: 1020px) 44vw, 245px" />
            <figcaption><HugeiconsIcon icon={CleanIcon} size={17} />End of tenancy cleaning</figcaption>
          </figure>
          <figure>
            <Image src="/images/pest-inspection.jpg" alt="A pest-control professional inspecting a property" width={1723} height={913} sizes="(max-width: 1020px) 44vw, 245px" />
            <figcaption><HugeiconsIcon icon={Bug01Icon} size={17} />Pest control</figcaption>
          </figure>
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

      <section className="section section-white" id="services" aria-labelledby="services-title">
        <div className="shell">
          <div className="section-head">
            <div><p className="eyebrow">Choose a service</p><h2 id="services-title">What does the property need?</h2></div>
            <p>Choose the service that matches the job. Cleaning and pest-control enquiries ask for different details.</p>
          </div>
          <div className="service-grid">
            <article className="service-card">
              <div>
                <span className="icon-box"><HugeiconsIcon icon={CleanIcon} size={22} /></span>
                <h2>End of Tenancy Cleaning</h2>
                <p>Move-out cleaning for rental-property handovers, inspections and new occupants.</p>
                <ul className="clean-list service-outcome-list">
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Kitchens, bathrooms and living spaces</span></li>
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Furnished and unfurnished properties</span></li>
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Oven, carpet or upholstery requests noted separately</span></li>
                </ul>
                <ButtonLink href="/end-of-tenancy-cleaning/">View Cleaning Service</ButtonLink>
              </div>
              <Image src="/images/cleaning-service.jpg" alt="A bright, clean rental-property kitchen" width={1536} height={1024} sizes="(max-width: 760px) 90vw, 230px" />
            </article>
            <article className="service-card">
              <div>
                <span className="icon-box"><HugeiconsIcon icon={Bug01Icon} size={22} /></span>
                <h2>Pest Control</h2>
                <p>Report a pest concern at a home, rental property or business premises.</p>
                <ul className="clean-list service-outcome-list">
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Rats, mice, bed bugs, cockroaches and more</span></li>
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Describe signs when the pest type is unknown</span></li>
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Residential and commercial enquiries</span></li>
                </ul>
                <ButtonLink href="/pest-control/">View Pest Control</ButtonLink>
              </div>
              <Image src="/images/pest-inspection.jpg" alt="A pest-control professional inspecting a property" width={1723} height={913} sizes="(max-width: 760px) 90vw, 230px" />
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works" aria-labelledby="home-process-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">How it works</p><h2 id="home-process-title">From property details to a quote in three steps.</h2></div></div>
          <div className="process-grid">
            <article className="process-card"><h3>Choose the service</h3><p>Select cleaning or pest control and open the relevant quote path.</p></article>
            <article className="process-card"><h3>Describe the property</h3><p>Add the property type, postcode, preferred date and the details that matter.</p></article>
            <article className="process-card"><h3>Discuss the quote</h3><p>The service requirements, availability and price can then be discussed with you.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="area-title">
        <div className="shell area-band">
          <div>
            <p className="eyebrow">Check your area</p>
            <h2 id="area-title">Tell us where the property is.</h2>
            <p>Add the postcode or area to the quote form. Coverage and availability can then be confirmed for that request.</p>
          </div>
          <ButtonLink href="/get-a-quote/#postcode">Check Availability</ButtonLink>
        </div>
      </section>

      <section className="section section-alt" id="faqs" aria-labelledby="home-faq-title">
        <div className="shell">
          <div className="faq-heading"><p className="eyebrow"><HugeiconsIcon icon={InformationCircleIcon} size={18} />FAQs</p><h2 id="home-faq-title">Questions before requesting a quote.</h2></div>
          <FaqList faqs={homeFaqs} />
        </div>
      </section>

      <section className="section section-white" aria-labelledby="home-cta-title">
        <FinalCta
          eyebrow="Start your enquiry"
          title="Tell us what the property needs."
          titleId="home-cta-title"
          description="Choose cleaning or pest control, add the postcode and share the details that matter for the job."
          buttonLabel="Get My Free Quote"
        />
      </section>
    </main>
  );
}
