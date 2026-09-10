import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// /prices/page.tsx is a client component ("use client") and so cannot
// export its own metadata — without this, the page silently inherited the
// root layout's `alternates.canonical: "./"`, which resolves to the
// homepage URL, telling Google this page is a duplicate of "/".
export const metadata: Metadata = {
  title: "Prices & Instant Quote Calculator",
  description: `Transparent starting prices for cleaning, pest control, gardening and removals across Greater London. Calculate an instant quote with ${siteConfig.name}.`,
  alternates: { canonical: "/prices/" },
  openGraph: {
    title: `Prices & Instant Quote Calculator | ${siteConfig.name}`,
    description: `Transparent starting prices for cleaning, pest control, gardening and removals across Greater London.`,
    url: "/prices/",
  },
};

export default function PricesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
