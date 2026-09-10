"use client";

import React, { useState, useEffect } from "react";
import { subscribeAdminReviews } from "@/lib/repositories/reviews";
import { calculateAverageRating } from "@/lib/review-domain";
import { type ReviewItem, type ReviewStatus } from "@/types/review";
import { Spinner } from "@/components/ui/spinner";
import { 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare
} from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("all");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const unSub = subscribeAdminReviews(statusFilter, (data) => {
      if (!active) return;
      setReviews(data);
      setLoading(false);
    });

    return () => {
      active = false;
      unSub();
    };
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: ReviewStatus) => {
    setUpdatingId(id);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to update review status");
      } else {
        setActionSuccess(`Review ${id} status changed to ${newStatus.toUpperCase()}`);
      }
    } catch {
      setActionError("Network error updating review status");
    } finally {
      setUpdatingId(null);
    }
  };

  const avgRating = calculateAverageRating(reviews);

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER & RATING STATS */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-6 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">QUALITY CONTROL & REVIEWS</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Customer Reviews & Ratings</h1>
            <p className="text-sm text-ink-500">Monitor 5-star customer feedback, staff service ratings, and published testimonials</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-4 rounded-[18px] border border-[#E5FBC9]">
            <Star className="w-8 h-8 text-warning-500 fill-warning-500 shrink-0" />
            <div>
              <span className="font-heading font-medium text-2xl text-ink-900">{avgRating} / 5.0</span>
              <span className="text-xs font-mono text-ink-500 block">Average Rating ({reviews.length} Reviews)</span>
            </div>
          </div>
        </div>

        {/* STATUS TABS */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#E5FBC9] pt-4">
          {[
            { id: "all", label: "All Reviews", count: reviews.length },
            { id: "published", label: "Published Testimonials", count: reviews.filter((r) => r.status === "published").length },
            { id: "flagged", label: "Flagged / Under Review", count: reviews.filter((r) => r.status === "flagged").length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as ReviewStatus | "all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ statusFilter === tab.id ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* FEEDBACK ALERTS */}
      {actionSuccess && (
        <div className="p-4 rounded-[18px] bg-success-50 border border-success-500 text-success-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* REVIEWS GRID */}
      {loading ? (
        <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Loading customer reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-[18px] p-6 space-y-4 flex flex-col justify-between border border-[#E5FBC9]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rev.rating ? "text-warning-500 fill-warning-500" : "text-ink-300"}`}
                      />
                    ))}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase ${
                    rev.status === "published" ? "bg-success-50 text-success-900" : "bg-danger-50 text-danger-900"
                  }`}>
                    {rev.status}
                  </span>
                </div>

                <p className="text-sm text-ink-600 font-medium italic leading-relaxed">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>

                <div className="p-3 rounded-[18px] bg-white space-y-1 text-xs font-mono border border-[#E5FBC9]">
                  <div className="flex justify-between">
                    <span className="text-ink-500">Customer:</span>
                    <span className="font-medium text-ink-600">{rev.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500">Booking:</span>
                    <span className="font-medium text-ink-600">{rev.bookingReference} ({rev.serviceCategory.toUpperCase()})</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5FBC9] flex items-center justify-end gap-2">
                {rev.status !== "published" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rev.id, "published")}
                    disabled={updatingId === rev.id}
                    className="px-3.5 py-1.5 rounded-full bg-success-500 text-white text-xs font-medium hover:bg-success-500 border-none cursor-pointer"
                  >
                    Publish Review
                  </button>
                )}

                {rev.status !== "flagged" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rev.id, "flagged")}
                    disabled={updatingId === rev.id}
                    className="px-3.5 py-1.5 rounded-full bg-danger-50 text-danger-900 text-xs font-medium hover:bg-danger-500 border-none cursor-pointer"
                  >
                    Flag Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#E5FBC9]">
          <MessageSquare className="w-10 h-10 text-[#1F3A00] mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">No Reviews Found</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            No customer reviews match your selected filter.
          </p>
        </div>
      )}

    </div>
  );
}
