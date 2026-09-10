import type { Metadata } from "next";

// Customer-specific invoice pages carry no SEO value and can contain
// personal billing details, so they must never be indexed — same pattern
// already used for /booking/, /account/ and /admin/.
export const metadata: Metadata = { title: "Invoice", robots: { index: false, follow: false } };

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
