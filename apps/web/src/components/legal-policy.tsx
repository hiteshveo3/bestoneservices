import Link from "next/link";
import { siteConfig } from "@/config/site";

export function LegalPolicy({ title, children }: { title: React.ReactNode; children: React.ReactNode }) { return <main id="main-content"><section className="section"><div className="shell reading legal-page"><p className="eyebrow">Bestone Services Ltd</p><h1>{title}</h1><p className="lead">Last updated: [INSERT DATE]</p>{children}<p>Contact: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>{siteConfig.phoneEnabled ? <> · <a href={siteConfig.phoneHref}>{siteConfig.phone}</a></> : null}</p><p><Link href="/">Back to home</Link></p></div></section></main>; }
