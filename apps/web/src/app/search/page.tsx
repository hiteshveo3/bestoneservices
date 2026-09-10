import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageClient } from "./search-page-client";

export const metadata: Metadata = {
  title: "Find Your Service | All Property Services | Best One Services",
  description: "Search and filter through all Best One Services in London: End of tenancy cleaning, pest control, gardening, and removals.",
  alternates: { canonical: "/search/" },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9FCF5]" />}>
      <SearchPageClient />
    </Suspense>
  );
}
