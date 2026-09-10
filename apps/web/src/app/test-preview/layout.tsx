import type { Metadata } from "next";

// Internal preview/scratch page — never meant to be public or indexed.
export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

export default function TestPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
