import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { publishedPageTargets } from "@/content/page-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  return publishedPageTargets.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: new Date("2026-08-01"),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    images: page.image ? [absoluteUrl(page.image)] : undefined,
  }));
}
