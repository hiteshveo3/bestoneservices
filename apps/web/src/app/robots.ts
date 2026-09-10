import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      // Previously disallowed — reversed per the AI-visibility strategy so
      // pricing/service pages can be cited by ChatGPT, Claude and Perplexity.
      // FLAG: if GPTBot was blocked deliberately (e.g. to keep content out of
      // OpenAI's training set), undo this rule — that's a content-licensing
      // decision, not a technical one, and shouldn't have been reversed silently.
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
