"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  Bookmark, 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Calculator,
  HelpCircle,
  Copy,
  Info,
  AlertTriangle,
  ArrowRight,
  List,
  ExternalLink
} from "lucide-react";
import { getGuideBySlug, GUIDES_DATABASE, type ContentBlock } from "@/lib/guides-data";
import { SectionReveal } from "@/components/motion";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const guide = getGuideBySlug(slug);

  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Extract all H2 headings for Table of Contents
  const headings = guide?.contentBlocks
    .filter((b): b is Extract<ContentBlock, { type: "heading" }> => b.type === "heading" && b.level === 2)
    .map((b) => ({
      id: b.id || b.text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      text: b.text,
    })) || [];

  // Scroll spy active heading observer
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!guide) {
    notFound();
  }

  const handleShare = () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      navigator.share({ title: guide.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const relatedGuides = GUIDES_DATABASE.filter((g) => g.id !== guide.id).slice(0, 2);

  return (
    <main id="main-content" className="py-10 text-start space-y-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* BREADCRUMBS (Normal Body/UI Font, >= 16px) */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-base text-ink-500">
          <Link href="/" className="hover:text-ink-600 text-decoration-none">Home</Link>
          <span>/</span>
          <Link href="/guides/" className="hover:text-ink-600 text-decoration-none">Guides</Link>
          <span>/</span>
          <span className="capitalize text-ink-600 font-medium">{guide.categoryLabel}</span>
        </nav>

        {/* MASTER EDITORIAL GRID (8 Cols Content / 4 Cols Sticky Sidebar) */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: MAIN ARTICLE (8 Columns) */}
          <article className="lg:col-span-8 space-y-8">
            
            {/* HERO HEADER */}
            <div className="space-y-4 text-start">
              <span className="px-3.5 py-1 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-xs font-mono font-semibold uppercase tracking-wider inline-block">
                {guide.categoryLabel}
              </span>

              <h1 className="font-heading text-3xl sm:text-5xl font-medium text-ink-900 tracking-tight leading-[1.15]">
                {guide.title}
              </h1>

              {guide.dek && (
                <p className="text-xl text-ink-500 leading-relaxed font-normal">
                  {guide.dek}
                </p>
              )}

              {/* AUTHOR & PUBLISHED META BAR (16px readable UI font) */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-b border-[#E5FBC9] py-3 text-base text-ink-500">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium text-ink-600">
                    <User className="w-4 h-4 text-ink-600 shrink-0" />
                    <span>{guide.author.name}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-ink-600 shrink-0" />
                    <span>Updated {guide.updatedAt || guide.publishedAt}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-ink-600">
                    <Clock className="w-4 h-4 text-ink-600 shrink-0" />
                    <span>{guide.readingTime} min read</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-4 py-2 rounded-full bg-[#F9FCF5] border-none text-ink-600 font-medium text-sm hover:bg-[#DCFAB7] transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-ink-600 shrink-0" />
                    <span>{copied ? "Copied" : "Share"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSaved(!isSaved)}
                    className={`px-4 py-2 rounded-full border-none text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 cursor-pointer ${
                      isSaved ? "bg-[#1F3A00] text-white font-medium" : "bg-[#F9FCF5] text-[#1F3A00] hover:bg-[#DCFAB7]"
                    }`}
                  >
                    <Bookmark className="w-4 h-4 text-ink-600 shrink-0" />
                    <span>{isSaved ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* HERO MEDIA */}
            {guide.heroImage && (
              <figure className="space-y-2">
                <div className="relative rounded-[18px] overflow-hidden border border-[#E5FBC9] aspect-16/9 bg-[#F9FCF5]">
                  <Image
                    src={guide.heroImage}
                    alt={guide.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 760px"
                    priority
                    className="object-cover"
                  />
                </div>
                {guide.heroCaption && (
                  <figcaption className="text-sm text-ink-500 italic pl-2">
                    {guide.heroCaption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* MOBILE TABLE OF CONTENTS POPOVER */}
            {headings.length > 0 && (
              <div className="lg:hidden p-4 rounded-[18px] bg-[#F9FCF5] border border-[#E5FBC9] space-y-2">
                <button
                  type="button"
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                  className="w-full flex items-center justify-between font-heading font-medium text-base text-ink-900 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-ink-600 shrink-0" />
                    <span>On This Page ({headings.length} Sections)</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-ink-600 transition-transform duration-200 ${mobileTocOpen ? "rotate-90" : ""}`} />
                </button>

                {mobileTocOpen && (
                  <ul className="space-y-2 pt-2 border-t border-[#E5FBC9] list-none p-0">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          onClick={() => setMobileTocOpen(false)}
                          className="text-base text-ink-600 font-medium hover:underline text-decoration-none block py-1"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* KEY TAKEAWAYS BLOCK */}
            {guide.keyTakeaways && guide.keyTakeaways.length > 0 && (
              <div className="p-6 sm:p-8 rounded-[24px] bg-[#F9FCF5] border border-[#E5FBC9] space-y-4 text-start shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-[12px] bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center font-medium">
                    <ShieldCheck className="w-5 h-5 text-[#1F3A00] shrink-0" />
                  </div>
                  <h3 className="font-heading font-medium text-xl text-ink-900">Key Takeaways</h3>
                </div>
                <ul className="space-y-2.5 list-none p-0 text-base text-ink-600 leading-relaxed">
                  {guide.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 font-medium">
                      <span className="w-2 h-2 rounded-full bg-ink-900 shrink-0 mt-2.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* MAIN ARTICLE BLOCK RENDERERS */}
            <div className="space-y-8 text-base text-ink-600">
              {guide.contentBlocks.map((block, idx) => {
                
                if (block.type === "paragraph") {
                  return (
                    <p key={idx} className="text-lg text-ink-600 leading-[1.75] font-normal">
                      {block.text}
                    </p>
                  );
                }

                if (block.type === "heading") {
                  const headingId = block.id || block.text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const Tag = block.level === 2 ? "h2" : "h3";
                  return (
                    <Tag
                      key={idx}
                      id={headingId}
                      className={`font-heading font-medium text-ink-900 tracking-tight scroll-mt-24 ${
                        block.level === 2 ? "text-2xl sm:text-3xl pt-4 border-b border-[#E5FBC9] pb-2" : "text-xl sm:text-2xl pt-2"
                      }`}
                    >
                      {block.text}
                    </Tag>
                  );
                }

                if (block.type === "pullFact") {
                  return (
                    <div key={idx} className="py-4 border-y border-[#E5FBC9] space-y-2 text-start my-6">
                      <div className="font-heading font-medium text-4xl sm:text-5xl text-ink-900">
                        {block.stat}
                      </div>
                      <div className="text-base font-medium text-ink-600 uppercase tracking-wider">{block.label}</div>
                      <p className="text-base text-ink-500">{block.explanation}</p>
                    </div>
                  );
                }

                if (block.type === "image") {
                  return (
                    <figure key={idx} className="space-y-2 my-6">
                      <div className="relative rounded-[18px] overflow-hidden border border-[#E5FBC9] aspect-16/9 bg-[#F9FCF5]">
                        <Image src={block.url} alt={block.alt} fill sizes="(max-width: 1024px) 100vw, 760px" className="object-cover" />
                      </div>
                      {block.caption && (
                        <figcaption className="text-sm text-ink-500 italic pl-2">{block.caption}</figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.type === "table") {
                  return (
                    <div key={idx} className="space-y-3 my-6">
                      {block.title && <h4 className="font-heading font-medium text-xl text-ink-900">{block.title}</h4>}
                      <div className="overflow-x-auto rounded-[18px] border border-[#B7F56A] bg-[#F9FCF5]">
                        <table className="w-full text-start border-collapse text-base">
                          <thead>
                            <tr className="bg-[#F9FCF5] border-b border-[#E5FBC9] text-ink-600 font-medium">
                              {block.headers.map((h, i) => (
                                <th key={i} className="p-4 text-start">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-[#E5FBC9] last:border-none">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-4 text-ink-600">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {block.sourceNote && (
                        <span className="text-xs text-ink-500 italic block pl-2">{block.sourceNote}</span>
                      )}
                    </div>
                  );
                }

                if (block.type === "callout") {
                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-[18px] border-l-4 space-y-2 my-6 ${
                        block.variant === "safety" || block.variant === "important"
                          ? "bg-danger-50 border-danger-500 text-ink-600"
                          : block.variant === "pricing"
                          ? "bg-[#DCFAB7] border-[#99D055] text-ink-600"
                          : "bg-[#F9FCF5] border-ink-900 text-ink-600"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-heading font-medium text-lg">
                        {block.variant === "safety" && <AlertTriangle className="w-5 h-5 text-danger-500 shrink-0" />}
                        <span>{block.title}</span>
                      </div>
                      <p className="text-base leading-relaxed">{block.text}</p>
                      {block.ctaText && block.ctaHref && (
                        <div className="pt-2">
                          <Link
                            href={block.ctaHref}
                            className="px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] text-decoration-none inline-flex items-center gap-1.5"
                          >
                            <span>{block.ctaText}</span>
                            <ArrowRight className="w-4 h-4 text-white" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                if (block.type === "steps") {
                  return (
                    <div key={idx} className="space-y-4 my-6">
                      {block.items.map((st) => (
                        <div key={st.number} className="p-5 rounded-[18px] bg-[#F9FCF5] border-none space-y-2 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-[18px] bg-[#1F3A00] text-white flex items-center justify-center font-heading font-medium text-lg shrink-0">
                            {st.number}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-heading font-medium text-lg text-ink-900">{st.title}</h4>
                            <p className="text-base text-ink-500 leading-relaxed">{st.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (block.type === "checklist") {
                  return (
                    <div key={idx} className="p-6 rounded-[18px] bg-white border border-[#B7F56A] space-y-4 my-6">
                      <h4 className="font-heading font-medium text-xl text-ink-900">{block.title}</h4>
                      <ul className="space-y-2.5 list-none p-0 text-base text-ink-600">
                        {block.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-ink-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                if (block.type === "serviceCTA") {
                  return (
                    <div key={idx} className="p-8 sm:p-10 rounded-[28px] bg-[#1F3A00] text-[#DFFBBC] space-y-4 my-8 text-start border border-[#3A5C13]">
                      <h3 className="font-heading text-2xl font-medium text-white">{block.title}</h3>
                      <p className="text-base text-ink-300 leading-relaxed max-w-xl">{block.text}</p>
                      <Link
                        href={block.href}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none gap-2 cursor-pointer"
                      >
                        <span>{block.buttonText}</span>
                        <ArrowRight className="w-4 h-4 text-[#1F3A00]" />
                      </Link>
                    </div>
                  );
                }

                if (block.type === "pricingCTA") {
                  return (
                    <div key={idx} className="p-6 rounded-[24px] bg-white border border-[#B7F56A] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
                      <div>
                        <span className="text-xs font-mono font-medium text-ink-500 uppercase">VERIFIED ESTIMATE</span>
                        <h4 className="font-heading text-xl font-medium text-ink-900">{block.serviceName}</h4>
                        <p className="text-base text-ink-600 font-medium">Starting from {block.startingPrice}</p>
                      </div>
                      <Link
                        href={block.href}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#1F3A00] text-[#B7F56A] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none shrink-0 cursor-pointer"
                      >
                        Check Your Price
                      </Link>
                    </div>
                  );
                }

                if (block.type === "sources") {
                  return (
                    <div key={idx} className="pt-6 border-t border-[#E5FBC9] space-y-2 text-sm text-ink-500">
                      <span className="font-medium text-ink-600 block">{block.title || "References & Industry Sources"}</span>
                      <ul className="space-y-1 list-none p-0">
                        {block.links.map((link, lIdx) => (
                          <li key={lIdx} className="flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-ink-500 shrink-0" />
                            {link.url ? (
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-ink-500">
                                {link.label}
                              </a>
                            ) : (
                              <span>{link.label}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* AUTHOR CREDIT BLOCK */}
            <div className="p-6 rounded-[18px] bg-[#F9FCF5] flex items-center gap-4 text-start">
              <div className="w-12 h-12 rounded-[18px] bg-[#1F3A00] text-white flex items-center justify-center font-heading font-medium text-xl shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase block">AUTHOR & EXPERTISE</span>
                <h4 className="font-heading font-medium text-lg text-ink-900">{guide.author.name}</h4>
                <p className="text-sm text-ink-500">{guide.author.role} • Best One Services London Operations</p>
              </div>
            </div>

          </article>

          {/* RIGHT COLUMN: STICKY DESKTOP SIDEBAR (4 Columns) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-20">
            
            {/* ON THIS PAGE TABLE OF CONTENTS */}
            {headings.length > 0 && (
              <div className="bg-[#F9FCF5] rounded-[18px] p-6 border border-[#B7F56A] space-y-4 text-start">
                <div className="flex items-center gap-2 border-b border-[#E5FBC9] pb-3">
                  <List className="w-4 h-4 text-ink-600 shrink-0" />
                  <span className="font-heading font-medium text-lg text-ink-900">On This Page</span>
                </div>

                <ul className="space-y-2 list-none p-0 text-base">
                  {headings.map((h) => {
                    const isActive = activeHeading === h.id;
                    return (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className={`flex items-center gap-2 py-1 text-decoration-none transition-colors duration-150 ${
                            isActive
                              ? "text-ink-600 font-medium border-l-2 border-[#99D055] pl-2"
                              : "text-ink-500 hover:text-ink-600 font-normal"
                          }`}
                        >
                          <span className="truncate">{h.text}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* CONTEXTUAL SERVICE CARD */}
            <div className="bg-[#F9FCF5] rounded-[18px] p-6 border border-[#B7F56A] space-y-4 text-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[18px] bg-[#1F3A00] text-white flex items-center justify-center font-medium">
                  <Calculator className="w-4 h-4 text-white shrink-0" />
                </div>
                <span className="font-heading font-medium text-lg text-ink-900">Need This Service?</span>
              </div>
              <p className="text-base text-ink-500 leading-relaxed">
                Check prices and availability for verified property services across London.
              </p>
              <Link
                href="/prices/#smart-calculator"
                className="w-full py-3 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] text-decoration-none flex items-center justify-center gap-2 border border-[#E5FBC9]"
              >
                <span>Calculate Your Price</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

          </aside>

        </div>

        {/* RELATED GUIDES SECTION WITH 3:2 IMAGES */}
        <section className="pt-10 border-t border-[#E5FBC9] space-y-6 text-start">
          <div className="space-y-1">
            <span className="px-3.5 py-1 rounded-full bg-[#1F3A00] text-white text-sm font-medium uppercase tracking-wide">
              RECOMMENDED READING
            </span>
            <h2 className="font-heading text-3xl font-medium text-ink-900">Related Articles & Guides</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {relatedGuides.map((rel) => (
              <Link
                key={rel.id}
                href={`/guides/${rel.category}/${rel.slug}/`}
                className="bg-[#F9FCF5] rounded-[18px] p-5 border border-[#B7F56A] space-y-4 text-decoration-none text-ink-600 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="relative rounded-[18px] overflow-hidden border border-[#E5FBC9] aspect-3/2 bg-[#F9FCF5]">
                    <Image src={rel.heroImage} alt={rel.title} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-xs font-mono font-medium uppercase text-ink-600 inline-block">
                    {rel.categoryLabel}
                  </span>
                  <h3 className="font-heading text-xl font-medium text-ink-900 leading-snug">{rel.title}</h3>
                  <p className="text-base text-ink-500 leading-relaxed line-clamp-2">{rel.excerpt}</p>
                </div>

                <div className="flex items-center justify-between text-sm font-medium text-ink-600 pt-2 border-t border-[#E5FBC9]">
                  <span>{rel.readingTime} min read</span>
                  <ArrowRight className="w-4 h-4 text-ink-600" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
