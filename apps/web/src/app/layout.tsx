import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Schibsted_Grotesk } from "next/font/google";
import { MarketingChrome } from "@/components/marketing-chrome";
import { CookieConsent } from "@/components/cookie-consent";
import { GoToTop } from "@/components/go-to-top";
import { AppProviders } from "@/components/providers/app-providers";
import { RevealObserver } from "@/components/motion";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Self-hosted via next/font — removes the render-blocking Google Fonts
// request that a <link>/@import was making on every single page (the
// stylesheet was also being loaded twice: once here and once again via an
// @import at the top of globals.css). Family names/weights match exactly
// what the old Google Fonts URL requested, so nothing visually changes.
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Cleaning, Pest Control, Gardening & Removals | Best One Services London",
    template: "%s | Best One Services",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: "Cleaning, Pest Control, Gardening & Removals | Best One Services London",
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: "/images/hero-property-services-green-v1.png",
        width: 1376,
        height: 768,
        alt: "Best One Services cleaning, pest control, gardening and removals professionals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning, Pest Control, Gardening & Removals | Best One Services London",
    description: siteConfig.description,
    images: ["/images/hero-property-services-green-v1.png"],
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
    <html
      lang="en-GB"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${bricolageGrotesque.variable} ${schibstedGrotesk.variable} ${inter.variable}`}
    >
      <body suppressHydrationWarning>
        <AppProviders>
          <RevealObserver />
          <a
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-[#1F3A00] focus:text-[#B7F56A] focus:font-medium focus:rounded-[18px]"
            href="#main-content"
          >
            Skip to main content
          </a>
          <MarketingChrome>{children}</MarketingChrome>
          <CookieConsent />
          <GoToTop />
        </AppProviders>
      </body>
    </html>
  );
}
