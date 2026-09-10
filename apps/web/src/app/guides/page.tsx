"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, 
  Search, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";
import { GUIDES_DATABASE } from "@/lib/guides-data";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SitewideIllustrationGrid } from "@/components/illustrations/sitewide-illustration-grid";

export default function GuidesHubPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const featuredPost = GUIDES_DATABASE.find((g) => g.featured) || GUIDES_DATABASE[0];

  const filteredPosts = GUIDES_DATABASE.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main id="main-content" className="py-12 text-start space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* EDITORIAL HERO */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-[#DCFAB7] text-[#1F3A00]">
          <BookOpen className="w-3.5 h-3.5 text-[#1F3A00] shrink-0" />
          <span>BEST ONE GUIDES & ADVICE</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-ink-900">
          Practical Advice for Your Property
        </h1>
        <p className="text-lg text-ink-500 leading-relaxed">
          Expert guides on move-out cleaning, rodent control, garden clearance, moving, and London pricing standards.
        </p>

        {/* SEARCH BAR */}
        <div className="relative max-w-md pt-2">
          <Search className="w-5 h-5 text-ink-500 absolute left-3.5 top-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, checklists, costs..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#B7F56A] text-ink-600 font-medium text-base focus:outline-none focus:ring-2 focus:ring-[#99D055]"
          />
        </div>
      </div>

      <SitewideIllustrationGrid
        eyebrow="Visual property guide"
        title="Understand the difference a planned service makes"
        cards={[
          { slug: "before-after-results", title: "Before & After Standards", description: "Use our guides to understand preparation, service scope and realistic completion standards.", href: "/cleaning-services/end-of-tenancy-cleaning/" },
        ]}
      />

      {/* FEATURED ARTICLE BLOCK */}
      {featuredPost && activeCategory === "all" && !searchQuery && (
        <div className="p-6 sm:p-10 rounded-[24px] bg-white border border-[#B7F56A] shadow-2xs space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-10 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-xs font-mono font-semibold text-ink-700">
              FEATURED GUIDE
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-medium text-ink-900 tracking-tight leading-tight">
              <Link href={`/guides/${featuredPost.category}/${featuredPost.slug}/`} className="hover:underline text-decoration-none text-ink-600">
                {featuredPost.title}
              </Link>
            </h2>
            <p className="text-base text-ink-500 leading-relaxed">{featuredPost.excerpt}</p>

            <div className="flex items-center gap-4 text-xs font-mono text-ink-500 pt-2">
              <span className="flex items-center gap-1 font-medium text-ink-600">
                <Clock className="w-3.5 h-3.5 text-ink-600" />
                <span>{featuredPost.readingTime} min read</span>
              </span>
              <span>•</span>
              <span>Updated {featuredPost.updatedAt || featuredPost.publishedAt}</span>
            </div>

            <div className="pt-2">
              <Link
                href={`/guides/${featuredPost.category}/${featuredPost.slug}/`}
                className="px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 inline-flex items-center gap-2 text-decoration-none"
              >
                <span>Read Full Guide</span>
                <ChevronRight className="w-4 h-4 text-[#1F3A00]" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-[20px] overflow-hidden aspect-16/10 border border-[#E5FBC9] bg-[#F9FCF5]">
            <Image
              src={featuredPost.heroImage}
              alt={featuredPost.title}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* CATEGORY FILTER BAR */}
      <SegmentedControl
        label="Filter by Topic"
        options={[
          { value: "all", label: "All Guides" },
          { value: "pest-control", label: "Pest Control" },
          { value: "cleaning", label: "Cleaning" },
          { value: "gardening", label: "Gardening" },
          { value: "removals", label: "Removals" },
          { value: "pricing", label: "Cost Guides" },
          { value: "checklists", label: "Checklists" },
        ]}
        value={activeCategory}
        onChange={setActiveCategory}
      />

      {/* GUIDES GRID (VARIANTS A, B, C) */}
      {filteredPosts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#F9FCF5] rounded-[24px] p-6 border border-[#B7F56A] shadow-2xs hover:border-[#1F3A00] space-y-4 flex flex-col justify-between transition-colors duration-200 group"
            >
              <div className="space-y-3">
                <div className="relative rounded-[16px] overflow-hidden aspect-16/9 bg-[#F9FCF5] border border-[#E5FBC9]">
                  <Image src={post.heroImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-xs font-mono font-semibold text-ink-700">
                    {post.categoryLabel}
                  </span>
                  <span className="text-xs font-mono text-ink-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-ink-600" />
                    <span>{post.readingTime} min</span>
                  </span>
                </div>

                <h3 className="font-heading font-medium text-xl text-ink-900 group-hover:underline">
                  <Link href={`/guides/${post.category}/${post.slug}/`} className="text-decoration-none text-ink-600">
                    {post.title}
                  </Link>
                </h3>

                <p className="text-sm text-ink-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
              </div>

              <div className="pt-3 border-t border-[#E5FBC9] flex items-center justify-between text-xs font-mono text-ink-500">
                <span className="font-medium text-ink-600">{post.author.name}</span>
                <ArrowRight className="w-4 h-4 text-ink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0" />
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* EMPTY SEARCH STATE */
        <div className="p-8 rounded-[18px] bg-white border border-[#B7F56A] space-y-4 text-center">
          <p className="text-lg font-heading font-medium text-ink-900">No articles found matching &quot;{searchQuery}&quot;</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="px-6 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-sm cursor-pointer"
          >
            Clear Filters & View All Guides
          </button>
        </div>
      )}

      {/* DEMO NEWSLETTER SIGNUP BLOCK */}
      <div className="p-8 sm:p-10 rounded-[28px] bg-white border border-[#B7F56A] shadow-2xs space-y-4 max-w-2xl mx-auto text-center">
        <div className="space-y-1">
          <span className="text-xs font-mono font-medium text-ink-500 uppercase">STAY INFORMED</span>
          <h3 className="font-heading text-2xl font-medium text-ink-900">Get Useful Property Advice</h3>
          <p className="text-sm text-ink-500">Occasional cleaning, pest prevention, gardening, and moving advice.</p>
        </div>

        {emailSubmitted ? (
          <div className="p-3 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Thank you for subscribing! Demo state confirmed.</span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmailSubmitted(true);
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-ink-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-md font-inter text-sm font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

