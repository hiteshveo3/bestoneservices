"use client";

import { useRef } from "react";
import { ExternalLink, Edit3, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { SectionReveal } from "@/components/motion";
import { getGoogleProfileForCategory, type GoogleBusinessProfile } from "@/config/google-business-profiles";
import { GoogleRatingStars } from "@/components/trust/google-rating-stars";

export interface GoogleReviewsSectionProps {
  category?: string;
  title?: string;
  subtitle?: string;
}

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  );
}

// Avatar color palette for customer initials
const AVATAR_COLORS = [
  "bg-[#DCFAB7] text-[#1F3A00]",
  "bg-[#E5FBC9] text-[#1F3A00]",
  "bg-[#F0FDF4] text-[#166534]",
  "bg-[#ECFDF5] text-[#065F46]",
  "bg-[#F7FEE7] text-[#3F6212]",
];

export function GoogleReviewsSection({
  category = "pest-control",
}: GoogleReviewsSectionProps) {
  const profile: GoogleBusinessProfile = getGoogleProfileForCategory(category);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort reviews by real date descending (newest first)
  const parseTime = (str: string) => {
    if (str.includes("week")) return parseInt(str) || 1;
    if (str.includes("month")) return (parseInt(str) || 1) * 4;
    if (str.includes("year")) return 52;
    return 100;
  };
  const sortedReviews = [...profile.reviews].sort((a, b) => parseTime(a.date) - parseTime(b.date));

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });
  };

  return (
    <SectionReveal className="w-full text-start">
      <div className="rounded-[26px] bg-white border border-[#E5FBC9] p-6 sm:p-10 shadow-2xs space-y-8">
        
        {/* TOP HEADER: Google Trust Summary & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E5FBC9]">
          
          {/* Left: Google Trust Header */}
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9FCF5] border border-[#D1E8B8] text-xs font-semibold text-[#1F3A00]">
              <GoogleIcon className="w-4 h-4" />
              <span>Google Business Profile</span>
              <span className="w-1 h-1 rounded-full bg-[#1F3A00]/40" />
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-4xl sm:text-5xl font-bold text-[#1F3A00] tracking-tight">
                {profile.rating.toFixed(1)}
              </span>
              <div className="space-y-0.5">
                <GoogleRatingStars rating={profile.rating} />
                <span className="text-xs font-semibold text-[#1F3A00]/70 block">
                  Based on <strong className="text-[#1F3A00]">{profile.reviewCount} Google Reviews</strong>
                </span>
              </div>
            </div>

            <h3 className="font-heading text-base sm:text-lg font-bold text-[#1F3A00]">
              {profile.businessName}
            </h3>
          </div>

          {/* Right: Direct Actions & Carousel Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={profile.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-5 rounded-full bg-[#1F3A00] hover:bg-[#2e5400] text-white font-semibold text-xs sm:text-sm transition-all duration-200 inline-flex items-center gap-2 shadow-2xs hover:shadow-xs text-decoration-none"
            >
              <span>Read Reviews on Google</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80 shrink-0" />
            </a>

            <a
              href={profile.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-5 rounded-full bg-white border border-[#B7F56A] hover:bg-[#DCFAB7] text-[#1F3A00] font-semibold text-xs sm:text-sm transition-all duration-200 inline-flex items-center gap-2 text-decoration-none shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#1F3A00] shrink-0" />
              <span>Write a Review</span>
            </a>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
              <button
                type="button"
                onClick={handleScrollLeft}
                className="w-10 h-10 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] hover:bg-[#1F3A00] hover:border-[#1F3A00] text-[#1F3A00] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                aria-label="Previous Google review"
              >
                <ChevronLeft className="w-5 h-5 text-current" />
              </button>
              <button
                type="button"
                onClick={handleScrollRight}
                className="w-10 h-10 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] hover:bg-[#1F3A00] hover:border-[#1F3A00] text-[#1F3A00] hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                aria-label="Next Google review"
              >
                <ChevronRight className="w-5 h-5 text-current" />
              </button>
            </div>
          </div>

        </div>

        {/* REVIEWS CAROUSEL RAIL */}
        <div
          ref={scrollRef}
          role="region"
          aria-label="Verified Customer Google Reviews"
          className="flex items-stretch gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {sortedReviews.map((rev, idx) => {
            const initial = rev.author ? rev.author.charAt(0).toUpperCase() : "G";
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

            return (
              <div
                key={rev.id}
                className="snap-start w-[290px] sm:w-[330px] rounded-[20px] bg-[#F9FCF5] border border-[#E5FBC9] p-5 sm:p-6 text-start flex flex-col justify-between shrink-0 shadow-2xs hover:shadow-xs transition-shadow duration-200"
              >
                <div className="space-y-3.5">
                  {/* Review Header: User Avatar + Name + Date + Google G */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-2xs ${avatarColor}`}
                      >
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#1F3A00] truncate">
                          {rev.author}
                        </h4>
                        <span className="text-xs text-[#1F3A00]/55 font-medium block">
                          {rev.date}
                        </span>
                      </div>
                    </div>
                    <GoogleIcon className="w-5 h-5 shrink-0 opacity-90" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5">
                    <GoogleRatingStars rating={rev.rating} />
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-[#1F3A00]/85 leading-relaxed font-normal italic line-clamp-5">
                    &quot;{rev.text}&quot;
                  </p>
                </div>

                {/* Card Footer: Verified Badge + Direct Map Link */}
                <div className="pt-3.5 mt-3 border-t border-[#E5FBC9] flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified on Google
                  </span>
                  <a
                    href={profile.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1F3A00]/70 hover:text-[#1F3A00] font-bold text-[11px] underline underline-offset-2 flex items-center gap-1 text-decoration-none transition-colors"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3 text-current" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </SectionReveal>
  );
}
