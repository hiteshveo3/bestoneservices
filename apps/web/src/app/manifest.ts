import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Cleaning, Pest Control, Gardening & Removals`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F6F5F1",
    theme_color: "#1D201E",
    icons: [
      {
        src: "/icon.jpg",
        sizes: "640x640",
        type: "image/jpeg",
      },
      {
        src: "/apple-icon.jpg",
        sizes: "640x640",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
