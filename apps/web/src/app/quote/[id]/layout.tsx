import type { Metadata } from "next";

// Customer-specific quote pages carry no SEO value and can contain
// personal enquiry details, so they must never be indexed — same pattern
// already used for /booking/, /account/ and /admin/.
export const metadata: Metadata = { title: "Quote", robots: { index: false, follow: false } };

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
