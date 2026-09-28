import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  ArrowRight01Icon,
  CleanIcon,
  Bug01Icon,
  DeliveryTruck01Icon,
} from "@hugeicons/core-free-icons";
import { BLOG_POSTS } from "@/config/blog-data";
import { SECONDARY_BUTTON_CLASS } from "@/lib/ui-classes";
import { siteConfig, absoluteUrl } from "@/config/site";

const PAGE_TITLE = "Property Guides, Advice & Insights";
const PAGE_DESCRIPTION = "Read expert checklists, pest prevention strategies, tenancy deposit guides, and relocation tips from certified London technicians.";

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: `${PAGE_TITLE} | ${siteConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: "/blog/",
    type: "website",
    images: [{ url: "/images/hero-property-services-green-v1.png", alt: PAGE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/images/hero-property-services-green-v1.png"],
  },
};

const ICON_MAP = {
  "Tenancy Cleaning": CleanIcon,
  "Pest Control": Bug01Icon,
  "Gardening": CleanIcon,
  "House Removals": DeliveryTruck01Icon,
};

export default function BlogIndexPage() {
  const postsList = Object.values(BLOG_POSTS);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/blog/")}#collection`,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: absoluteUrl("/blog/"),
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    breadcrumb: { "@id": `${absoluteUrl("/blog/")}#breadcrumb` },
    hasPart: postsList.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}/`),
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl("/blog/")}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/blog/") },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#1D201E] text-start">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ===================================================================
          1. CLEAN EDITORIAL HERO
          =================================================================== */}
      <section className="bg-[#F6F5F1] border-[#ECEAE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#1D201E]/80 font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <span aria-hidden="true" className="text-[#1D201E]/40">/</span>
            <span className="font-semibold text-[#1D201E]">Guides</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 ts-eyebrow">
              Property insights &amp; guides
            </span>
          </div>

          <h1 className="m-0 font-heading text-4xl sm:text-5xl lg:text-[52px] font-[650] leading-[1.06] tracking-tight text-[#1D201E] max-w-3xl">
            Bestone Knowledge Hub
          </h1>
          <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1D201E]/90 max-w-2xl font-normal">
            Practical property advice, inventory checklists, pest eradication guides and moving tips, written by our certified London specialists.
          </p>
        </div>
      </section>

      {/* ===================================================================
          2. GUIDES GRID
          =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div data-reveal-group className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {postsList.map((post) => {
            const Icon = ICON_MAP[post.category] || CleanIcon;

            return (
              <article
                key={post.slug}
                className="group bg-white rounded-[18px] p-5 flex flex-col gap-2.5 hover:bg-[#EAF8D6] transition-colors duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#B7F56A] text-[#1D201E]">
                  <HugeiconsIcon icon={Icon} size={20} strokeWidth={1.8} className="text-[#1D201E]" />
                </span>

                <span className="text-xs font-bold uppercase tracking-wider text-[#1D201E]">
                  {post.category}
                </span>

                <h2 className="m-0 font-heading text-lg font-[650] leading-snug text-[#1D201E]">
                  <Link href={`/blog/${post.slug}/`} className="text-decoration-none text-[#1D201E]">
                    {post.title}
                  </Link>
                </h2>

                <p className="m-0 text-sm leading-relaxed text-[#1D201E] line-clamp-3">
                  {post.description}
                </p>

                <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-2 border-[#ECEAE3]">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1D201E]/70">
                    <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.8} className="text-[#1D201E]/70 shrink-0" />
                    {post.readTime}
                  </span>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D201E] text-decoration-none"
                  >
                    Read guide
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2.2} className="text-[#1D201E]" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* ===================================================================
            3. BOTTOM CALLOUT — light editorial, lime stripe
            =================================================================== */}
        <section className="mt-12 sm:mt-16 p-6 sm:p-11 rounded-[26px] bg-white grid md:grid-cols-[1fr_auto] gap-6 sm:gap-7 items-center relative overflow-hidden">
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B7F56A] rounded-l-[26px]" aria-hidden="true" />
          <div className="space-y-3">
            <h2 data-reveal className="m-0 font-heading text-2xl sm:text-4xl font-[650] tracking-tight text-[#1D201E]">
              Need the job done, not just the guide?
            </h2>
            <p className="m-0 text-base leading-relaxed text-[#1D201E]/80 max-w-xl font-normal">
              Get a transparent fixed price for cleaning, pest control, gardening or removals across all 32 London boroughs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/prices/#smart-calculator"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1D201E] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer"
            >
              Get Instant Quote
            </Link>
            <Link
              href="/contact/"
              className={`inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium ${SECONDARY_BUTTON_CLASS}`}
            >
              Contact Support
            </Link>
          </div>
        </section>
      </div>

    </div>
  );
}
