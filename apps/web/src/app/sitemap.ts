import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { publishedPageTargets } from "@/content/page-registry";
import { BLOG_POSTS } from "@/config/blog-data";

// Blog posts carry a real, maintained `dateModified` — use it. Every other
// page previously reported the same fixed lastModified regardless of
// whether it had actually changed, which is a false freshness signal (and
// one Google explicitly discounts once it notices a sitemap never varies).
// Omitting the field for those pages is more honest than guessing a date.
const blogLastModified = new Map(
  Object.values(BLOG_POSTS).map((post) => [`/blog/${post.slug}/`, new Date(post.dateModified)])
);

export default function sitemap(): MetadataRoute.Sitemap {
  return publishedPageTargets.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: blogLastModified.get(page.path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    images: page.image ? [absoluteUrl(page.image)] : undefined,
  }));
}
