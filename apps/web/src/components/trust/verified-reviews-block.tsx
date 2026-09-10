"use client";

import { Star, ShieldCheck } from "lucide-react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";
import { getVerifiedReviewsForService, type VerifiedReview } from "@/lib/verified-reviews-data";

export interface VerifiedReviewsBlockProps {
  title?: string;
  subtitle?: string;
  serviceId?: string;
  reviews?: VerifiedReview[];
}

export function VerifiedReviewsBlock({
  title = "Verified Customer Feedback",
  subtitle = "Authentic customer reviews from verified service completions",
  serviceId,
  reviews = getVerifiedReviewsForService(serviceId),
}: VerifiedReviewsBlockProps) {
  // STRICT RULE: Do not render section if no verified review data exists
  if (!reviews || reviews.length === 0) return null;

  return (
    <SectionReveal className="space-y-6 text-start">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
          <span>VERIFIED FEEDBACK</span>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">{title}</h3>
        <p className="text-base text-ink-500">{subtitle}</p>
      </div>

      {/* REVIEWS GRID */}
      <StaggerGrid className="grid sm:grid-cols-2 gap-4" staggerDelay={0.06}>
        {reviews.map((rev) => (
          <StaggerItem
            key={rev.id}
            className="bg-[#F9FCF5] rounded-[16px] p-6 border border-[#B7F56A] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {/* 5 Yellow Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning-500 text-warning-500 shrink-0" />
                  ))}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-xs font-mono font-medium text-ink-500">
                  {rev.source}
                </span>
              </div>

              <p className="text-base text-ink-600 leading-relaxed italic font-normal">&quot;{rev.text}&quot;</p>
            </div>

            <div className="pt-2 border-t border-[#E5FBC9] flex items-center justify-between text-xs font-mono text-ink-500">
              <span className="font-medium text-ink-600">{rev.author}</span>
              {rev.areaName && <span>{rev.areaName}, London</span>}
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}
