import { notFound } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Clock01Icon,
  Calendar01Icon,
  CleanIcon,
  Bug01Icon,
  DeliveryTruck01Icon,
  Tick01Icon,
  Bookmark01Icon,
  Shield01Icon,
  StarIcon,
  HelpCircleIcon,
  Call02Icon,
} from "@hugeicons/core-free-icons";
import { BLOG_POSTS } from "@/config/blog-data";
import { siteConfig } from "@/config/site";
import { siteContact } from "@/config/site-contact";
import { organisationSchema } from "@/lib/structured-data";
import { PrintChecklistButton } from "@/components/blog/print-checklist-button";
import { SECONDARY_BUTTON_CLASS, SIDEBAR_CALL_BUTTON_CLASS } from "@/lib/ui-classes";
import { PhoneCall } from "lucide-react";

function renderInlineBold(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-[#1F3A00]">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) return { title: "Article Not Found" };

  const canonicalUrl = `${siteConfig.url}/blog/${slug}/`;
  const ogImageUrl = `${siteConfig.url}${post.ogImage || "/images/hero-property-services-green-v1.png"}`;

  return {
    title: post.metaTitle || post.title,
    description: post.description,
    keywords: post.targetKeywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.dateModified,
      authors: [post.author.name],
      images: [
        {
          url: ogImageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    notFound();
  }

  const iconMap = {
    "Tenancy Cleaning": CleanIcon,
    "Pest Control": Bug01Icon,
    "Gardening": CleanIcon,
    "House Removals": DeliveryTruck01Icon,
  };
  const IconComponent = iconMap[post.category] || CleanIcon;

  const relatedPosts = post.relatedSlugs
    .map(s => BLOG_POSTS[s])
    .filter(Boolean);

  const contentBlocks = post.content.split("\n\n");
  const sectionHeadings = contentBlocks
    .filter((block) => block.trim().startsWith("## "))
    .map((block, index) => ({
      id: `sec-${index + 1}`,
      title: block.trim().replace("## ", "").trim(),
    }));
  const canonicalUrl = `${siteConfig.url}/blog/${slug}/`;

  // Comprehensive JSON-LD Schemas (Article, FAQ, Breadcrumbs, LocalBusiness)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role,
      "description": post.author.bio
    },
    "publisher": {
      "@type": "Organization",
      "name": "Best One Property Services London",
      "url": siteConfig.url,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/icon.jpg`
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.dateModified,
    "keywords": post.targetKeywords.join(", ")
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteConfig.url
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog & Guides",
        "item": `${siteConfig.url}/blog/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": canonicalUrl
      }
    ]
  };

  const faqSchema = post.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  // Reuses the shared Organization/LocalBusiness schema (same one used on
  // every service page) so the phone, address, image and star-rating stay
  // in sync from a single source instead of duplicating them per template.
  const localBusinessSchema = {
    "@context": "https://schema.org",
    ...organisationSchema(),
    areaServed: ["Greater London", "M25 Area", "Home Counties"],
    priceRange: "££",
  };

  return (
    <div className="min-h-screen bg-[#F9FCF5] text-[#1F3A00] text-start">

      {/* Inject Schema.org JSON-LD Suite */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* ===================================================================
          1. CLEAN EDITORIAL HERO
          =================================================================== */}
      <section className="bg-[#F9FCF5] border-b border-[#E5FBC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#1F3A00]/80 font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <span aria-hidden="true" className="text-[#1F3A00]/40">/</span>
            <Link href="/blog/" className="hover:underline">Guides</Link>
            <span aria-hidden="true" className="text-[#1F3A00]/40">/</span>
            <span className="font-semibold text-[#1F3A00] truncate max-w-[180px] sm:max-w-none">{post.title}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-5">

          {/* Eyebrow badge + back link */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#DCFAB7]/80 border border-[#B7F56A] text-xs font-bold uppercase tracking-wider text-[#1F3A00] w-fit shadow-2xs">
              <HugeiconsIcon icon={IconComponent} size={14} strokeWidth={2} className="text-[#1F3A00] shrink-0" />
              {post.category}
            </span>
            <Link
              href="/blog/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F3A00] text-decoration-none hover:underline"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2.2} className="text-[#1F3A00] shrink-0" />
              All guides
            </Link>
          </div>

          <h1 className="m-0 font-heading text-3xl sm:text-4xl lg:text-[52px] font-semibold leading-[1.08] tracking-tight text-[#1F3A00] max-w-4xl">
            {post.title}
          </h1>

          <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]/90 max-w-2xl font-normal">
            {post.description}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-medium text-[#1F3A00]/70">
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={Calendar01Icon} size={14} strokeWidth={1.8} className="shrink-0" />
              Published {post.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.8} className="shrink-0" />
              Updated {post.dateModified}
            </span>
            <span>{post.readTime}</span>
          </div>

          {/* Author card */}
          <div className="flex items-start gap-3 p-4 bg-white rounded-[18px] border border-[#E5FBC9] shadow-2xs max-w-xl">
            <div className="w-10 h-10 rounded-full bg-[#B7F56A] border border-[#99D055] text-[#1F3A00] font-bold text-xs flex items-center justify-center shrink-0">
              {post.author.avatar}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="text-sm font-semibold text-[#1F3A00]">{post.author.name}</div>
              <div className="text-xs text-[#1F3A00]/70">{post.author.role}</div>
              {post.author.bio && <div className="text-xs text-[#1F3A00]/70 leading-relaxed">{post.author.bio}</div>}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. MAIN CONTENT (LEFT) & STICKY SIDEBAR (RIGHT)
          =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_330px] gap-10 sm:gap-16 items-start">

          {/* LEFT MAIN CONTENT COLUMN */}
          <div className="flex flex-col gap-12 sm:gap-16 min-w-0">

            {/* GLOSSARY DEFINITION (Featured Snippet Bait) */}
            {post.glossaryBox && (
              <div className="p-5 bg-[#DCFAB7] rounded-[18px] border border-[#E5FBC9] flex flex-col gap-1.5">
                <strong className="text-xs font-bold uppercase tracking-wider text-[#1F3A00]">
                  Glossary definition: {post.glossaryBox.term}
                </strong>
                <span className="text-sm leading-relaxed text-[#1F3A00]">
                  {post.glossaryBox.definition}
                </span>
              </div>
            )}

            {/* KEY TAKEAWAYS */}
            <section className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F3A00]">
                Key takeaways
              </h2>
              <div className="p-5 sm:p-6 bg-white rounded-[18px] border border-[#E5FBC9] shadow-2xs">
                <ul className="m-0 p-0 list-none flex flex-col gap-3">
                  {post.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-base leading-relaxed text-[#1F3A00]">
                      <HugeiconsIcon icon={Tick01Icon} size={18} strokeWidth={2.5} className="text-[#1F3A00] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* RISK COMPARISON CHART */}
            {post.chart && (
              <section className="scroll-mt-24 flex flex-col gap-5">
                <h2 data-reveal className="m-0 font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F3A00]">
                  {post.chart.title}
                </h2>

                <div className="p-5 sm:p-6 bg-white rounded-[18px] border border-[#E5FBC9] shadow-2xs flex flex-col gap-4">
                  {post.chart.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="text-sm font-semibold text-[#1F3A00]">{item.label}</span>
                        <span className="text-xs font-medium text-[#1F3A00]/70 sm:shrink-0">{item.status}</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] overflow-hidden">
                        <div
                          style={{ width: `${Math.max(item.percentage, 6)}%` }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                  <span className="text-xs font-medium text-[#1F3A00]/60">Source: TDS deposit dispute data</span>
                </div>
              </section>
            )}

            {/* DATA TABLES */}
            {post.tables && post.tables.length > 0 && post.tables.map((table, tIdx) => (
              <section key={tIdx} className="scroll-mt-24 flex flex-col gap-5">
                <h2 data-reveal className="m-0 font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F3A00]">
                  {table.title}
                </h2>

                <div className="overflow-x-auto border border-[#E5FBC9] rounded-[20px] bg-white shadow-2xs">
                  <table className="w-full min-w-[500px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-[#DCFAB7] text-[#1F3A00]">
                        {table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3.5 sm:p-4 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5FBC9] text-[#1F3A00]">
                      {table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`p-3.5 sm:p-4 ${cIdx === 0 ? "font-semibold" : ""}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <span className="text-xs font-medium text-[#1F3A00]/60 lg:hidden">Swipe the table sideways to see every column →</span>
              </section>
            ))}

            {/* ARTICLE BODY */}
            <div className="flex flex-col gap-12 sm:gap-16">
              {(() => {
                const sections: React.ReactNode[] = [];
                let current: React.ReactNode[] = [];
                let currentHeading: { id: string; text: string } | null = null;
                let headingCount = 0;

                const flush = () => {
                  if (!currentHeading && current.length === 0) return;
                  sections.push(
                    <section
                      key={currentHeading?.id ?? `intro-${sections.length}`}
                      id={currentHeading?.id}
                      className="scroll-mt-24 flex flex-col gap-5"
                    >
                      {currentHeading && (
                        <h2 data-reveal className="m-0 font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F3A00]">
                          {currentHeading.text}
                        </h2>
                      )}
                      {current}
                    </section>
                  );
                  current = [];
                };

                contentBlocks.forEach((paragraph, index) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return;

                  if (trimmed.startsWith("## ")) {
                    flush();
                    headingCount += 1;
                    currentHeading = { id: `sec-${headingCount}`, text: trimmed.replace("## ", "").trim() };
                    return;
                  }

                  if (trimmed.startsWith("* ")) {
                    const listItems = trimmed.split("\n").map(li => li.replace("* ", "").trim());
                    current.push(
                      <ul key={index} className="m-0 p-0 list-none flex flex-col gap-2.5">
                        {listItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1F3A00] shrink-0 mt-2.5" aria-hidden="true" />
                            <span>{renderInlineBold(item)}</span>
                          </li>
                        ))}
                      </ul>
                    );
                    return;
                  }

                  current.push(
                    <p key={index} className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                      {renderInlineBold(trimmed)}
                    </p>
                  );
                });

                flush();
                return sections;
              })()}
            </div>

            {/* CUSTOMER TESTIMONIAL */}
            {post.testimonialSnippet && (
              <section className="scroll-mt-24 p-5 sm:p-6 bg-white rounded-[18px] border border-[#E5FBC9] shadow-2xs flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    {[...Array(post.testimonialSnippet.rating)].map((_, i) => (
                      <HugeiconsIcon key={i} icon={StarIcon} size={16} className="fill-warning-500 stroke-warning-500 shrink-0" />
                    ))}
                  </span>
                  <span className="text-xs font-semibold text-[#1F3A00]">5.0 · Verified inspection review</span>
                </div>
                <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00] italic">
                  &ldquo;{post.testimonialSnippet.quote}&rdquo;
                </p>
                <span className="text-sm font-medium text-[#1F3A00]/70">
                  — {post.testimonialSnippet.author}, {post.testimonialSnippet.location}
                </span>
              </section>
            )}

            {/* IN-ARTICLE FAQS (static list — fully crawlable) */}
            {post.faqs && post.faqs.length > 0 && (
              <section id="faqs" className="scroll-mt-24 flex flex-col gap-5">
                <h2 data-reveal className="m-0 font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F3A00] flex items-center gap-2.5">
                  <HugeiconsIcon icon={HelpCircleIcon} size={24} strokeWidth={1.8} className="text-[#1F3A00] shrink-0" />
                  Frequently asked questions
                </h2>

                <div className="border border-[#E5FBC9] rounded-[20px] bg-white overflow-hidden divide-y divide-[#E5FBC9] shadow-2xs">
                  {post.faqs.map((faq, fIdx) => (
                    <div key={fIdx} className="p-5 flex flex-col gap-1.5">
                      <h3 className="m-0 text-base sm:text-lg font-semibold text-[#1F3A00]">{faq.question}</h3>
                      <p className="m-0 text-sm sm:text-base leading-relaxed text-[#1F3A00]">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* GUARANTEE + PRINT CHECKLIST */}
            <div className="p-5 sm:p-6 bg-[#DCFAB7] rounded-[20px] border border-[#E5FBC9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#B7F56A] border border-[#99D055] text-[#1F3A00] shrink-0">
                  <HugeiconsIcon icon={Shield01Icon} size={20} strokeWidth={1.8} className="text-[#1F3A00]" />
                </span>
                <div className="min-w-0">
                  <strong className="block text-base font-semibold text-[#1F3A00]">48-hour re-clean guarantee</strong>
                  <span className="text-sm leading-relaxed text-[#1F3A00]">100% security deposit protection backing</span>
                </div>
              </div>
              <PrintChecklistButton />
            </div>

          </div>

          {/* ===================================================================
              RIGHT COLUMN: STICKY SIDEBAR
              =================================================================== */}
          <aside className="lg:sticky lg:top-28 min-w-0 flex flex-col gap-4">

            {/* Booking CTA */}
            <div className="flex flex-col gap-4 bg-white border border-[#E5FBC9] rounded-[22px] p-6 shadow-2xs">
              <p className="m-0 text-xs font-bold uppercase tracking-wider text-[#1F3A00]">
                Book this service
              </p>
              <h3 className="m-0 font-heading text-2xl font-semibold leading-tight text-[#1F3A00]">
                Guaranteed handover clean
              </h3>
              <p className="m-0 text-sm leading-relaxed text-[#1F3A00]">
                Get a fixed quote in 60 seconds, with the 48-hour re-clean guarantee included.
              </p>

              <Link
                href={siteContact.getWhatsappUrl("Hi, I'd like an instant quote from Best One Services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shadow-2xs"
              >
                Get Instant Quote
              </Link>
              <Link
                href="/contact/"
                className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-md font-inter text-base font-medium ${SIDEBAR_CALL_BUTTON_CLASS}`}
              >
                <PhoneCall className="w-4 h-4 text-[#1F3A00]" />
                <span>Call Us</span>
              </Link>
            </div>

            {/* Table of Contents */}
            {sectionHeadings.length > 0 && (
              <nav className="bg-white border border-[#E5FBC9] rounded-[22px] p-6 shadow-2xs flex flex-col gap-3" aria-label="On this page">
                <p className="m-0 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1F3A00]">
                  <HugeiconsIcon icon={Bookmark01Icon} size={14} strokeWidth={2} className="text-[#1F3A00] shrink-0" />
                  On this page
                </p>
                <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                  {sectionHeadings.map((sec) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className="block text-sm leading-snug text-[#1F3A00] text-decoration-none hover:underline"
                      >
                        {sec.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Related Guides */}
            {relatedPosts.length > 0 && (
              <div className="bg-white border border-[#E5FBC9] rounded-[22px] p-6 shadow-2xs flex flex-col gap-3">
                <p className="m-0 text-xs font-bold uppercase tracking-wider text-[#1F3A00]">
                  Related guides
                </p>
                <div className="flex flex-col gap-3 divide-y divide-[#E5FBC9]">
                  {relatedPosts.map((rPost) => (
                    <div key={rPost.slug} className="pt-3 first:pt-0 flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1F3A00]/60">
                        {rPost.category}
                      </span>
                      <Link
                        href={`/blog/${rPost.slug}/`}
                        className="text-sm font-semibold leading-snug text-[#1F3A00] text-decoration-none hover:underline"
                      >
                        {rPost.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </aside>

        </div>
      </div>

    </div>
  );
}
