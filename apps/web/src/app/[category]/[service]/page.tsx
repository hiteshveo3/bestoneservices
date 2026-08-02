import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { approvedServicePages, type ApprovedServiceKey } from "@/content/approved-service-pages";
import { serviceCatalog, getService, type ServiceCategory } from "@/content/service-catalog";
import { servicePageSchema } from "@/lib/structured-data";

export function generateStaticParams() { return Object.entries(serviceCatalog).flatMap(([category, item]) => item.services.map(([service]) => ({ category, service }))); }
export async function generateMetadata({ params }: { params: Promise<{ category: string; service: string }> }): Promise<Metadata> {
  const { category, service } = await params;
  const record = serviceCatalog[category as ServiceCategory] && getService(category as ServiceCategory, service);
  const path = `/${category}/${service}/`;
  const approved = approvedServicePages[`${category}/${service}` as ApprovedServiceKey];
  return { title: approved?.title ?? record?.[1] ?? "Service", description: approved?.description ?? (record ? `${record[1]} from Bestone Services Ltd across London.` : undefined), alternates: { canonical: path }, robots: approved ? { index: true, follow: true } : { index: false, follow: false } };
}
export default async function ServicePage({ params }: { params: Promise<{ category: string; service: string }> }) {
  const { category, service } = await params;
  if (!(category in serviceCatalog)) notFound();
  const serviceRecord = getService(category as ServiceCategory, service);
  if (!serviceRecord) notFound();
  const [, title] = serviceRecord;
  const isPest = category === "pest-control-services";
  const path = `/${category}/${service}/`;
  const approved = approvedServicePages[`${category}/${service}` as ApprovedServiceKey];
  if (!approved) return <main id="main-content"><section className="section"><div className="shell reading"><p className="eyebrow">Service preview</p><h1>{title}</h1><p>This service page is being prepared with complete approved information. Please contact us for current service information.</p><ButtonLink href="/contact/">Contact Us</ButtonLink></div></section></main>;
  const schema = servicePageSchema({ name: approved.title, description: approved.description, path, faqs: approved.faqs, areaServed: "London", breadcrumbParent: { name: serviceCatalog[category as ServiceCategory].label, path: `/${category}/` } });
  return <main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><section className="shell hero"><div className="hero-copy"><p className="eyebrow">{isPest ? "Pest control" : "Cleaning service"}</p><h1>{approved.title} across London.</h1><p className="lead">{approved.summary}</p><div className="button-row"><ButtonLink href="/contact/">Contact Us</ButtonLink><ButtonLink href={isPest ? "/pest-control-services/" : "/cleaning-services/"} secondary>All Services</ButtonLink></div></div><div className="quick-answer"><p className="eyebrow">Starting price</p><h2>{approved.price}</h2><p>Final price and service arrangement are confirmed before work is booked.</p></div></section><section className="section section-white"><div className="shell split"><div className="reading"><h2>{approved.signsTitle}</h2><ul>{approved.signs.map((item) => <li key={item}>{item}</li>)}</ul></div><aside className="panel"><h2>What affects the quote?</h2><ul>{approved.priceFactors.map((item) => <li key={item}>{item}</li>)}</ul></aside></div></section><section className="section"><div className="shell"><p className="eyebrow">Service process</p><h2>How the service is arranged.</h2><div className="card-grid">{approved.process.map(([heading, body]) => <article className="content-card" key={heading}><h3>{heading}</h3><p>{body}</p></article>)}</div></div></section><section className="section section-white"><div className="shell split"><div className="reading"><p className="eyebrow">Prevention guidance</p><h2>Practical next steps.</h2><ul>{approved.prevention.map((item) => <li key={item}>{item}</li>)}</ul></div><aside className="panel"><h2>Ready to discuss it?</h2><p>Email the team with the property location, relevant details and preferred timing. We confirm the full price before booking.</p><ButtonLink href="/contact/">Contact Us</ButtonLink></aside></div></section><section className="section"><div className="shell reading"><p className="eyebrow">FAQs</p><h2>{approved.title} questions.</h2>{approved.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section></main>;
}
