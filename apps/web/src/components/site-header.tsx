import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { siteConfig } from "@/config/site";
import { primaryNavigation } from "@/config/site-navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell topbar">
        <Link className="brand" href="/" aria-label="Best One Services home">
          <span className="brand-mark" aria-hidden="true">B1</span>
          <span>Best One Services</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
          <a className="header-phone" href={siteConfig.phoneHref}>Call 24/7</a>
          <ButtonLink href="/contact/">
            Get a Free Quote
          </ButtonLink>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <Link href="/">Home</Link>
            {primaryNavigation.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
            <a href={siteConfig.phoneHref}>Call 24/7: {siteConfig.phone}</a>
            <Link href="/contact/">Get a Free Quote</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
