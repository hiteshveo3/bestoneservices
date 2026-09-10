import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// /contact/page.tsx is a client component ("use client") and so cannot
// export its own metadata — without this, the page silently inherited the
// root layout's `alternates.canonical: "./"`, which resolves to the
// homepage URL, telling Google this page is a duplicate of "/".
export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name} for cleaning, pest control, gardening and removals quotes across Greater London. Call, WhatsApp or send an enquiry.`,
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: `Contact Us | ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name} for cleaning, pest control, gardening and removals quotes across Greater London.`,
    url: "/contact/",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
