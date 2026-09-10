"use client";

import { Star } from "lucide-react";

export interface GoogleRatingStarsProps {
  rating: number; // e.g. 5.0
  className?: string;
}

export function GoogleRatingStars({ rating = 5.0, className = "" }: GoogleRatingStarsProps) {
  const fullStars = Math.floor(rating);

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 shrink-0 ${
            i < fullStars ? "fill-warning-500 text-warning-500" : "fill-ink-200 text-ink-300"
          }`}
        />
      ))}
    </div>
  );
}
