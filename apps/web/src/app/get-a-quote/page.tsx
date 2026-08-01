import type { Metadata } from "next";
import Image from "next/image";
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Home03Icon,
  InformationCircleIcon,
  Location01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { DecorativeIcon } from "@/components/decorative-icon";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { QuoteForm } from "@/components/quote-form";
import { siteConfig } from "@/config/site";
import { organisationSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request an end of tenancy cleaning or pest-control quote from Best One Services. Share the property details and receive a clear response about the next step.",
  alternates: { canonical: "/get-a-quote/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: "Get a Free Quote | Best One Services",
    description:
      "Choose a service, share the property details and request a clear response from Best One Services.",
    url: "/get-a-quote/",
  },
};

const quoteFaqs = [
  {
    question: "Do I need to create an account?",
    answer:
      "No. The quote form can be submitted as a guest and no customer account is created.",
  },
  {
    question: "Does my preferred date confirm availability?",
    answer:
      "No. The date helps explain your timing, but availability and any final arrangement are confirmed separately.",
  },
  {
    question: "What if I am unsure which pest I have?",
    answer:
      "Choose pest control and describe what you have noticed, where it is occurring and when it began. The pest-type field can be left as unknown.",
  },
  {
    question: "How is my service area checked?",
    answer:
      "Enter the property postcode or area in the form. Whether the request can be supported in that location can then be confirmed in the response.",
  },
] as const;

const quoteTrustItems = [
  [Home03Icon, "Property-led", "The property and service details shape the request."],
  [Location01Icon, "Area included", "A postcode or area helps check the location."],
  [Calendar03Icon, "Timing shared", "A preferred date explains the required timing."],
  [Mail01Icon, "Direct response", "The reply uses the contact details you provide."],
] as const;

export default async function GetAQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const defaultService =
    service === "pest-control" ? "pest-control" : "end-of-tenancy-cleaning";
  const isPestControl = defaultService === "pest-control";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organisationSchema(),
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/get-a-quote/#webpage`,
        url: `${siteConfig.url}/get-a-quote/`,
        name: "Get a Free Quote | Best One Services",
        description:
          "A quote request form for end of tenancy cleaning and pest-control enquiries.",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        inLanguage: "en-GB",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Get a Free Quote",
            item: `${siteConfig.url}/get-a-quote/`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: quoteFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />

      <section className="shell hero" aria-labelledby="quote-page-title">
          <div className="hero-copy">
            <p className="eyebrow">Free quote request</p>
            <h1 id="quote-page-title">Tell us what the property needs.</h1>
            <p className="lead">Choose cleaning or pest control, share the useful details and provide the contact information you would like us to use for the response.</p>
            <p className="hero-note"><DecorativeIcon icon={CheckmarkCircle02Icon} size={18} /><span>No account or payment is required to submit an enquiry.</span></p>
          </div>
          <div className="hero-media">
            <Image
              src={isPestControl ? "/images/pest-inspection.jpg" : "/images/end-of-tenancy-hero.jpg"}
              alt={isPestControl ? "A pest-control professional inspecting a property" : "A professional cleaner preparing a bright rental property"}
              width={isPestControl ? 1723 : 1693}
              height={isPestControl ? 913 : 929}
              preload
              sizes="(max-width: 1020px) 90vw, 500px"
            />
          </div>
      </section>

      <section className="section" aria-label="Quote request highlights">
        <div className="shell trust-grid">
          {quoteTrustItems.map(([icon, title, text]) => (
            <article className="trust-card" key={title}>
              <span className="icon-box"><DecorativeIcon icon={icon} size={22} /></span>
              <strong>{title}</strong><span>{text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-white" aria-label="Free quote request form">
        <div className="shell form-layout">
          <div className="form-intro">
            <p className="eyebrow">One enquiry path</p>
            <h2>Share the details that shape the response.</h2>
            <p>Required fields are kept focused. Add access, condition or deadline notes only where they are useful.</p>
            <ul className="clean-list form-intro-list">
              <li><DecorativeIcon icon={CheckmarkCircle02Icon} size={18} /><span>Choose cleaning or pest control</span></li>
              <li><DecorativeIcon icon={CheckmarkCircle02Icon} size={18} /><span>Share the postcode and preferred date</span></li>
              <li><DecorativeIcon icon={InformationCircleIcon} size={18} /><span>Availability and scope are confirmed separately</span></li>
            </ul>
          </div>
          <QuoteForm defaultService={defaultService} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="quote-faq-title">
        <div className="shell">
          <div className="faq-heading">
            <p className="eyebrow"><DecorativeIcon icon={InformationCircleIcon} size={18} />FAQs</p>
            <h2 id="quote-faq-title">Before you submit the form.</h2>
          </div>
          <FaqList faqs={quoteFaqs} />
        </div>
      </section>
    </main>
  );
}
