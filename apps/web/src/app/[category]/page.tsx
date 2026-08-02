import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { serviceCatalog, type ServiceCategory } from "@/content/service-catalog";

export function generateStaticParams() { return Object.keys(serviceCatalog).map((category) => ({ category })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category } = await params; const item = serviceCatalog[category as ServiceCategory]; return { title: item?.label ?? "Services", description: item?.intro, alternates: { canonical: `/${category}/` } }; }
export default async function ServiceCategoryPage({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; const item = serviceCatalog[category as ServiceCategory]; if (!item) notFound(); return <main id="main-content"><section className="section"><div className="shell"><p className="eyebrow">Bestone Services Ltd</p><h1>{item.label}</h1><p className="lead">{item.intro}</p><div className="card-grid">{item.services.map(([slug, label]) => <article className="content-card" key={slug}><h2>{label}</h2><p>Call or email our team to discuss the property, service requirements, availability and the right next step.</p><Link href={`/${category}/${slug}/`}>Explore {label}</Link></article>)}</div></div></section><section className="section section-white"><div className="shell quote-band"><div><h2>Need help with a service?</h2><p>Contact us by phone or email. We will confirm the scope, availability and full price before booking.</p></div><ButtonLink href="/contact/">Contact Us</ButtonLink></div></section></main>; }
