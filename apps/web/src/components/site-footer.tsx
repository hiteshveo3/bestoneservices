import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">B1</span>
            <span>{siteConfig.name}</span>
          </Link>
          <p>{siteConfig.description}</p>
        </div>
        <div>
          <h2>Services</h2>
          <Link href="/end-of-tenancy-cleaning/">End of tenancy cleaning</Link>
          <Link href="/#pest-control">Pest control</Link>
        </div>
        <div>
          <h2>Information</h2>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#faqs">FAQs</Link>
        </div>
        <div>
          <h2>Contact</h2>
          <Link href="/get-a-quote/">Get a Free Quote</Link>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 {siteConfig.name}</span>
        <span>Cleaning and pest-control enquiries</span>
      </div>
    </footer>
  );
}
