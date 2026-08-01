import Link from "next/link";
import { ButtonLink } from "@/components/button-link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell topbar">
        <Link className="brand" href="/" aria-label="Best One Services home">
          <span className="brand-mark" aria-hidden="true">B1</span>
          <span>Best One Services</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/end-of-tenancy-cleaning/">Cleaning</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#faqs">FAQs</Link>
          <ButtonLink href="mailto:info@bestoneservices.co.uk?subject=Free%20Quote%20Request">
            Get a Free Quote
          </ButtonLink>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <Link href="/">Home</Link>
            <Link href="/end-of-tenancy-cleaning/">End of tenancy cleaning</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#faqs">FAQs</Link>
            <a href="mailto:info@bestoneservices.co.uk?subject=Free%20Quote%20Request">Get a Free Quote</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
