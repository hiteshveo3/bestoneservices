"use client";

import Link from "next/link";
import { SearchResults } from "@/components/search/SearchResults";

export function SearchPageClient() {
  return (
    <main id="main" className="min-h-screen bg-[#F6F5F1] pb-20">
      {/* 1. Page Header Banner */}
      <section className="border-b border-[#ECEAE3] bg-white/70 backdrop-blur-xs pt-8 pb-8 sm:pt-10 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start space-y-3">
          {/* Breadcrumb row */}
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-[#1D201E]/60 flex items-center gap-1.5">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#1D201E]">All Services</span>
          </nav>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#1D201E]">
            Find Your Service
          </h1>
          <p className="text-base sm:text-lg text-[#1D201E]/80 max-w-3xl leading-relaxed">
            Search and filter across cleaning, pest control, gardening and removals to find exactly what you need across all 32 London Boroughs.
          </p>
        </div>
      </section>

      {/* 2. Full Search & Filter Results System */}
      <SearchResults />
    </main>
  );
}
