"use client";

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { 
  Clock01Icon, 
  ArrowRight01Icon,
  CleanIcon,
  Bug01Icon,
  DeliveryTruck01Icon
} from "@hugeicons/core-free-icons";

export interface BlogArticle {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  href: string;
  hugeIcon: IconSvgElement;
  badgeColor: string;
  imageSrc: string;
}

const ARTICLES: BlogArticle[] = [
  {
    id: "end-of-tenancy-checklist",
    category: "Tenancy Cleaning",
    title: "The Ultimate End of Tenancy Cleaning Checklist for 100% Deposit Refund",
    excerpt: "Learn what letting agents inspect during checkout inventory reports and how professional steam cleaning secures your deposit refund.",
    readTime: "5 min read",
    date: "Aug 2026",
    href: "/cleaning-services/end-of-tenancy-cleaning/#checklist",
    hugeIcon: CleanIcon,
    imageSrc: "/images/end-of-tenancy-hero.jpg",
    badgeColor: "bg-ink-100 text-ink-600",
  },
  {
    id: "pest-control-signs",
    category: "Pest Control",
    title: "Early Signs of Mice & Bed Bug Infestations in London Flats",
    excerpt: "How to spot subtle pest activity early and compare DIY traps against certified 2-visit eradication treatments with written backing.",
    readTime: "4 min read",
    date: "Aug 2026",
    href: "/pest-control-services/",
    hugeIcon: Bug01Icon,
    imageSrc: "/images/pest-inspection.jpg",
    badgeColor: "bg-ink-100 text-ink-600",
  },
  {
    id: "removals-roadmap",
    category: "House Removals",
    title: "Stress-Free House Removals Across Greater London: A Tenant’s Guide",
    excerpt: "Essential packing strategies, van size selection, and how to seamlessly coordinate move-out dates with tenancy handover cleaning.",
    readTime: "6 min read",
    date: "Aug 2026",
    href: "/removals/",
    hugeIcon: DeliveryTruck01Icon,
    imageSrc: "/images/hero-mover.png",
    badgeColor: "bg-ink-100 text-ink-600",
  },
];

export function LatestArticlesSection() {
  return (
    <section className="w-full bg-[#F8F9FA] py-16 border-t border-[#E5FBC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 text-start">
        <div className="space-y-3 max-w-2xl">
          <span className="px-4 py-1.5 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-sm sm:text-base font-medium inline-block">
            Property Guides & Insights
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-ink-900">
            Expert Advice for Tenants & Landlords
          </h2>
          <p className="text-base text-ink-500">
            Practical checklists, pest prevention strategies, and relocation tips written by our certified London technicians.
          </p>
        </div>

        <Link
          href="/blog/"
          className="px-5 py-2.5 rounded-full bg-transparent text-ink-900 font-medium text-sm border-2 border-ink-900 hover:bg-ink-900 hover:text-white transition-colors duration-200 shrink-0 inline-flex items-center gap-2 text-decoration-none cursor-pointer self-start sm:self-auto"
        >
          <span>View All Articles</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-current stroke-[2] shrink-0" />
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {ARTICLES.map((article) => (
          <article 
            key={article.id}
            className="bg-[#F9FCF5] rounded-2xl p-6 sm:p-8 border border-[#B7F56A] text-start flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-5">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-[#F9FCF5]">
                <Image src={article.imageSrc} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              
              {/* Category & Read Time Header */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${article.badgeColor} border border-[#E5FBC9]`}>
                  <HugeiconsIcon icon={article.hugeIcon} size={14} className="text-ink-600 stroke-[2] shrink-0" />
                  <span>{article.category}</span>
                </span>

                <div className="flex items-center gap-1 text-xs text-ink-500 font-mono">
                  <HugeiconsIcon icon={Clock01Icon} size={14} className="text-ink-500 stroke-[1.75] shrink-0" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-2.5">
                <h3 className="font-heading font-medium text-xl text-ink-900 group-hover:text-ink-900 transition-colors duration-150 leading-snug">
                  <Link href={article.href} className="text-decoration-none text-ink-900">
                    {article.title}
                  </Link>
                </h3>
                <p className="text-sm sm:text-base text-ink-500 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

            </div>

            {/* Read Article Link Footer */}
            <div className="pt-6 mt-6 border-t border-[#E5FBC9] flex items-center justify-between text-sm font-medium text-ink-600 group-hover:underline">
              <span>Read Full Guide</span>
              <div className="w-8 h-8 rounded-full bg-ink-100 border border-[#E5FBC9] flex items-center justify-center group-hover:bg-ink-900 group-hover:border-ink-900 transition-colors duration-200">
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-ink-600 group-hover:text-white stroke-[2] shrink-0 transition-colors duration-200" />
              </div>
            </div>

          </article>
        ))}
      </div>

    </div>
    </section>
  );
}
