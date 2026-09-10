"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { BookOpen, Clock, ArrowRight, ChevronRight } from "lucide-react";
import { getGuidesByCategory, GUIDES_DATABASE, GUIDE_CATEGORY_LABELS } from "@/lib/guides-data";

export default function CategoryLandingPage() {
  const params = useParams();
  const categoryParam = params?.category as string;

  const categoryLabel = GUIDE_CATEGORY_LABELS[categoryParam] || "Service Guides";
  const posts = getGuidesByCategory(categoryParam);

  if (posts.length === 0 && !GUIDE_CATEGORY_LABELS[categoryParam]) {
    notFound();
  }

  return (
    <main id="main-content" className="py-12 text-start space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-ink-500">
        <Link href="/" className="hover:text-ink-600 text-decoration-none">Home</Link>
        <span>/</span>
        <Link href="/guides/" className="hover:text-ink-600 text-decoration-none">Guides</Link>
        <span>/</span>
        <span className="capitalize text-ink-600 font-medium">{categoryLabel}</span>
      </nav>

      {/* CATEGORY HERO */}
      <div className="space-y-3 max-w-3xl border-b border-[#E5FBC9] pb-6">
        <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
          CATEGORY HUB
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-ink-900">
          {categoryLabel}
        </h1>
        <p className="text-lg text-ink-500">
          Expert practical advice and property guidance written by Best One technicians.
        </p>
      </div>

      {/* ARTICLES GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-[#F9FCF5] rounded-[18px] p-6 border border-[#B7F56A] space-y-4 flex flex-col justify-between hover:border-ink-900 transition-colors duration-200 group"
          >
            <div className="space-y-3">
              <div className="relative rounded-[18px] overflow-hidden aspect-16/9 bg-[#F9FCF5] border border-[#E5FBC9]">
                <Image src={post.heroImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
              </div>

              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-xs font-mono font-medium text-ink-500">
                  {post.categoryLabel}
                </span>
                <span className="text-xs font-mono text-ink-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-ink-600" />
                  <span>{post.readingTime} min</span>
                </span>
              </div>

              <h2 className="font-heading font-medium text-xl text-ink-900 group-hover:underline">
                <Link href={`/guides/${post.category}/${post.slug}/`} className="text-decoration-none text-ink-600">
                  {post.title}
                </Link>
              </h2>

              <p className="text-sm text-ink-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
            </div>

            <div className="pt-3 border-t border-[#E5FBC9] flex items-center justify-between text-xs font-mono text-ink-500">
              <span className="font-medium text-ink-600">{post.author.name}</span>
              <ArrowRight className="w-4 h-4 text-ink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0" />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
