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
          <details className="footer-group" key={group.title}>
            <summary><h2>{group.title}</h2></summary>
            <div>{group.links.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</div>
          </details>
        ))}
        <details className="footer-group">
          <summary><h2>Contact</h2></summary>
          <div><Link href="/contact/">Contact Us</Link>{siteConfig.phoneEnabled ? <a href={siteConfig.phoneHref}>{siteConfig.phone}</a> : null}<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>{siteConfig.openingHours ? <span>{siteConfig.openingHours}</span> : null}<span>{siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}</span></div>
        </details>
        <details className="footer-group">
          <summary><h2>Legal</h2></summary>
          <div><Link href="/privacy-policy/">Privacy Policy</Link><Link href="/cookie-policy/">Cookie Policy</Link><Link href="/terms-and-conditions/">Terms and Conditions</Link><Link href="/cancellation-and-refund-policy/">Cancellation &amp; Refund Policy</Link><Link href="/complaints-policy/">Complaints Policy</Link><Link href="/accessibility-statement/">Accessibility Statement</Link></div>
        </details>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
        <span>Property details reviewed before booking</span>
      </div>
    </footer>
  );
}
