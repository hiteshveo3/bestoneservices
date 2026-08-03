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
          {siteConfig.phoneEnabled ? <a className="header-phone" href={siteConfig.phoneHref}>Call us</a> : null}
          <ButtonLink href={siteConfig.bookingEnabled ? "/booking/" : "/contact/"}>
            {siteConfig.bookingEnabled ? "Book as Guest" : "Contact Us"}
          </ButtonLink>
        </nav>
        <Link className="mobile-header-cta" href={siteConfig.bookingEnabled ? "/booking/" : "/contact/"}>{siteConfig.bookingEnabled ? "Book" : "Contact"}</Link>
      </div>
    </header>
  );
}
