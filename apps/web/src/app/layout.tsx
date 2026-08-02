import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { CookieConsent } from "@/components/cookie-consent";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "End of Tenancy Cleaning & Pest Control | Best One Services",
    template: "%s | Best One Services",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: "End of Tenancy Cleaning & Pest Control | Best One Services",
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: "/images/end-of-tenancy-hero.jpg",
        width: 1693,
        height: 929,
        alt: "A professional cleaner preparing a bright rental property",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "End of Tenancy Cleaning & Pest Control | Best One Services",
    description: siteConfig.description,
    images: ["/images/end-of-tenancy-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <MobileBottomNav />
        <CookieConsent />
      </body>
    </html>
  );
}
