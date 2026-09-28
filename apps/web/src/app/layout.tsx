import type { Metadata } from "next";
import { Albert_Sans, Archivo } from "next/font/google";
import { MarketingChrome } from "@/components/marketing-chrome";
import { CookieConsent } from "@/components/cookie-consent";
import { GoToTop } from "@/components/go-to-top";
import { AppProviders } from "@/components/providers/app-providers";
import { RevealObserver } from "@/components/motion";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Touchstone type, self-hosted via next/font: Archivo (with its width axis,
// set to 82% for headings and figures) and Albert Sans for text.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Cleaning, Pest Control, Gardening & Removals | Bestone Services London",
    template: "%s | Bestone Services",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: "Cleaning, Pest Control, Gardening & Removals | Bestone Services London",
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: "/images/hero-property-services-green-v1.png",
        width: 1376,
        height: 768,
        alt: "Bestone Services cleaning, pest control, gardening and removals professionals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning, Pest Control, Gardening & Removals | Bestone Services London",
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
      className={`${archivo.variable} ${albertSans.variable}`}
    >
      <body suppressHydrationWarning>
        <AppProviders>
          <RevealObserver />
          <a
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-[#B7F56A] focus:text-[#1D201E] focus:font-medium focus:rounded-[12px]"
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
