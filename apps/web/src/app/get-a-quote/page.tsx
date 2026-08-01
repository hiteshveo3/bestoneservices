import type { Metadata } from "next";
import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { DecorativeIcon } from "@/components/decorative-icon";
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

export default async function GetAQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const defaultService =
    service === "pest-control" ? "pest-control" : "end-of-tenancy-cleaning";
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
    ],
  };

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />

      <section className="section quote-hero" aria-labelledby="quote-page-title">
        <div className="shell split">
          <div className="reading">
            <p className="eyebrow">Clear quote request</p>
            <h1 id="quote-page-title">Tell us what the property needs.</h1>
            <p className="lead">Choose cleaning or pest control, share the useful details and provide the contact information you would like us to use for the response.</p>
          </div>
          <aside className="panel quote-reassurance" aria-label="What happens after submission">
            <span className="icon-box"><DecorativeIcon icon={InformationCircleIcon} size={22} /></span>
            <h2>Before you begin</h2>
            <ul className="clean-list">
              <li><DecorativeIcon icon={CheckmarkCircle02Icon} size={18} /><span>No account or payment is required.</span></li>
              <li><DecorativeIcon icon={CheckmarkCircle02Icon} size={18} /><span>A preferred date does not confirm availability.</span></li>
              <li><DecorativeIcon icon={Mail01Icon} size={18} /><span>The response will use the details you provide.</span></li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section section-white" aria-label="Free quote request form">
        <div className="shell form-layout">
          <div className="form-intro">
            <p className="eyebrow">One enquiry path</p>
            <h2>Share the details that shape the response.</h2>
            <p>Required fields are kept focused. Add access, condition or deadline notes only where they are useful.</p>
            <p>If the form is unavailable, email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
          </div>
          <QuoteForm defaultService={defaultService} />
        </div>
      </section>
    </main>
  );
}
