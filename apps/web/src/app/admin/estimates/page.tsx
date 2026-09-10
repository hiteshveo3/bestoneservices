"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { subscribeAdminEstimates } from "@/lib/repositories/estimates";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type EstimateItem, type EstimateStatus } from "@/types/estimate";
import { Spinner } from "@/components/ui/spinner";
import { 
  FileText, 
  ChevronRight
} from "lucide-react";

export default function AdminEstimatesQueuePage() {
  const [estimates, setEstimates] = useState<EstimateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<EstimateStatus | "all">("all");

  useEffect(() => {
    let active = true;
    const unSub = subscribeAdminEstimates(statusFilter, (data) => {
      if (!active) return;
      setEstimates(data);
      setLoading(false);
    });

    return () => {
      active = false;
      unSub();
    };
  }, [statusFilter]);

  // Aggregate metrics
  const totalQuotedPence = estimates.reduce((acc, e) => acc + e.totalPence, 0);
  const convertedCount = estimates.filter((e) => e.status === "converted_to_booking").length;
  const conversionRate = estimates.length > 0 ? Math.round((convertedCount / estimates.length) * 100) : 0;

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER & METRICS */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-6 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">ESTIMATES & FORMAL QUOTES WORKSPACE</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Quotes Pipeline Queue</h1>
            <p className="text-sm text-ink-500">Track instant estimates, customer quote approvals, and state handoff conversions</p>
          </div>
        </div>

        {/* METRICS STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E5FBC9] pt-4">
          <div className="p-4 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
            <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Total Quoted Pipeline</span>
            <p className="font-heading font-medium text-xl text-ink-900">
              {formatPenceToGBP(totalQuotedPence)}
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
            <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Converted Bookings</span>
            <p className="font-heading font-medium text-xl text-ink-900">
              {convertedCount} / {estimates.length} Quotes
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
            <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Quote Conversion Rate</span>
            <p className="font-heading font-medium text-xl text-[#1F3A00]">
              {conversionRate}%
            </p>
          </div>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#E5FBC9] pt-4">
          {[
            { id: "all", label: "All Quotes", count: estimates.length },
            { id: "sent", label: "Sent", count: estimates.filter((e) => e.status === "sent").length },
            { id: "accepted", label: "Accepted", count: estimates.filter((e) => e.status === "accepted").length },
            { id: "converted_to_booking", label: "Converted to Booking", count: convertedCount },
            { id: "expired", label: "Expired", count: estimates.filter((e) => e.status === "expired").length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as EstimateStatus | "all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ statusFilter === tab.id ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* ESTIMATES QUEUE LIST */}
      {loading ? (
        <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Fetching Firestore estimate quotes...</p>
        </div>
      ) : estimates.length > 0 ? (
        <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <div className="divide-y divide-bone-300">
            {estimates.map((est) => (
              <div key={est.id} className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-xs text-ink-600">{est.reference}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase ${
                      est.status === "converted_to_booking" ? "bg-[#1F3A00] text-white" : "bg-success-50 text-success-900"
                    }`}>
                      {est.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="font-heading font-medium text-sm text-ink-900">{est.serviceName}</p>
                  <p className="text-xs text-ink-500">
                    Customer: {est.customerName} ({est.customerEmail})
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <span className="text-[10px] font-mono text-ink-500 block">QUOTED TOTAL</span>
                    <span className="font-heading font-medium text-base text-ink-900">
                      {formatPenceToGBP(est.totalPence)}
                    </span>
                  </div>

                  <Link
                    href={`/quote/${est.reference}${est.accessToken ? `#token=${encodeURIComponent(est.accessToken)}` : ""}`}
                    className="px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] hover:bg-[#2d5004] text-xs font-medium text-decoration-none transition-colors duration-150 inline-flex items-center gap-1 border border-[#E5FBC9]"
                  >
                    <span>View Quote</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#E5FBC9]">
          <FileText className="w-10 h-10 text-[#1F3A00] mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">No Estimate Quotes Found</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            There are currently no estimate quotes matching your selected status filter.
          </p>
        </div>
      )}

    </div>
  );
}
