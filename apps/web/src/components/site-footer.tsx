import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerNavigation } from "@/config/site-navigation";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand" href="/" aria-label="Best One Services home">
            <span className="brand-mark" aria-hidden="true">B1</span>
            <span>{siteConfig.name}</span>
          </Link>
          <p>{siteConfig.description}</p>
        </div>
        {footerNavigation.map((group) => (
          <div key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </div>
        ))}
        <div>
          <h2>Contact</h2>
          <Link href="/get-a-quote/">Get a Free Quote</Link>
          <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <span>{siteConfig.openingHours}</span>
          <span>{siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}</span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
        <span>Property details reviewed before booking</span>
      </div>
    </footer>
  );
}
