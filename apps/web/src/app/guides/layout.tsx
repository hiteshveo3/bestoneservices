import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// /guides/, /guides/[category]/ and /guides/[category]/[slug]/ are all
// "use client" pages, so none of them can export their own metadata.
// Nested layouts below (guides/[category]/layout.tsx,
// guides/[category]/[slug]/layout.tsx) override title/description/canonical
// for their own routes — this is just the fallback for the hub itself.
export const metadata: Metadata = {
  title: "Service Guides & Property Advice",
  description: `Practical cleaning, pest control, gardening and removals guides from ${siteConfig.name} — written for London homeowners, tenants and landlords.`,
  alternates: { canonical: "/guides/" },
  openGraph: {
    title: `Service Guides & Property Advice | ${siteConfig.name}`,
    description: `Practical cleaning, pest control, gardening and removals guides for London homeowners, tenants and landlords.`,
    url: "/guides/",
  },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
