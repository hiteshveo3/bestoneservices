import type { Metadata } from "next";
import { GUIDE_CATEGORY_LABELS } from "@/lib/guides-data";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const label = GUIDE_CATEGORY_LABELS[category];
  if (!label) return { robots: { index: false, follow: false } };

  const path = `/guides/${category}/`;
  return {
    // `absolute` bypasses title templating entirely — at this nesting depth
    // (root → /guides/ → /guides/[category]/) the root layout's "%s | Best
    // One Services" template does not reliably cascade past the first
    // intermediate segment, so the suffix is added explicitly instead.
    title: { absolute: `${label} | ${siteConfig.name}` },
    description: `${label} from ${siteConfig.name} — practical, London-specific advice for homeowners, tenants and landlords.`,
    alternates: { canonical: path },
    openGraph: { title: `${label} | ${siteConfig.name}`, url: path },
  };
}

export default function GuideCategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
