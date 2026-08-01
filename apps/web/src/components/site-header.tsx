import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
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
          <ButtonLink href="/get-a-quote/">
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
            <Link href="/get-a-quote/">Get a Free Quote</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
