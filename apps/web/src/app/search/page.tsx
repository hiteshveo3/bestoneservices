import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageClient } from "./search-page-client";

export const metadata: Metadata = {
  title: "Find Your Service | All Property Services | Bestone Services",
  description: "Search and filter through all Bestone Services in London: End of tenancy cleaning, pest control, gardening, and removals.",
  alternates: { canonical: "/search/" },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F5F1]" />}>
      <SearchPageClient />
    </Suspense>
  );
}
