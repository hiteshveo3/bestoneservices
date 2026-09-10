import type { Metadata } from "next";
import { getGuideBySlug } from "@/lib/guides-data";
import { absoluteUrl, siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide || guide.category !== category) return { robots: { index: false, follow: false } };

  const path = `/guides/${category}/${slug}/`;
  const description = guide.dek || guide.excerpt;

  return {
    // See the note in guides/[category]/layout.tsx — `absolute` is used
    // because the root layout's title template doesn't reliably reach this
    // deeply nested a segment.
    title: { absolute: `${guide.title} | ${siteConfig.name}` },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: guide.title,
      description,
      url: path,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author.name],
      images: [{ url: absoluteUrl(guide.heroImage), alt: guide.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description,
      images: [absoluteUrl(guide.heroImage)],
    },
  };
}

export default function GuideArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
