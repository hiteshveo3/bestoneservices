"use client";

import { Star, ShieldCheck } from "lucide-react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";
import { getCategoryReviews } from "@/lib/review-system";

export interface ReviewSectionProps {
  category?: "cleaning" | "pest-control" | "gardening" | "removals";
  title?: string;
}

export function ReviewSection({
  category = "cleaning",
  title = "Verified Customer Feedback",
}: ReviewSectionProps) {
  const reviews = getCategoryReviews(category);
  if (reviews.length === 0) return null;

  return (
    <SectionReveal className="bg-[#F8F9FA] rounded-[16px] p-6 sm:p-8 border border-[#E5FBC9] space-y-6 text-start">
      <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-xs font-mono font-medium uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-ink-600 shrink-0" />
            <span>Verified Feedback</span>
          </div>
          <h3 className="font-heading text-2xl font-medium text-ink-900">{title}</h3>
        </div>

        <div className="flex items-center gap-1 text-ink-500 text-sm font-mono">
          <div className="flex text-warning-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="font-medium text-ink-600 pl-1">5.0</span>
        </div>
      </div>

      <StaggerGrid className="grid sm:grid-cols-2 gap-4" staggerDelay={0.06}>
        {reviews.map((rev) => (
          <StaggerItem key={rev.id} className="p-5 rounded-[16px] bg-white border border-[#B7F56A] space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-heading font-medium text-base text-ink-900">{rev.author}</div>
                <div className="text-xs text-ink-500 font-mono">{rev.location} • {rev.date}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#F9FCF5] text-ink-600 text-xs font-mono font-medium border border-[#B7F56A]">
                {rev.verifiedBooking}
              </span>
            </div>

            <p className="text-sm text-ink-600 font-normal leading-relaxed">{rev.text}</p>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}


