import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Cleaning, Pest Control, Gardening & Removals`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F9FCF5",
    theme_color: "#1F3A00",
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
