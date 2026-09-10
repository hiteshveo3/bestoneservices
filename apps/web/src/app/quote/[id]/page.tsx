"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchEstimateDetail } from "@/lib/repositories/estimates";
import { isEstimateExpired } from "@/lib/estimate-domain";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type EstimateItem } from "@/types/estimate";
import { Spinner } from "@/components/ui/spinner";
import { 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  Printer
} from "lucide-react";

export default function PublicQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const quoteId = resolvedParams.id;
  const router = useRouter();

  const [estimate, setEstimate] = useState<EstimateItem | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Conversion Modal State
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState("morning");
  const [addressLine1, setAddressLine1] = useState("");
  const [postcode, setPostcode] = useState("");
  const [converting, setConverting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      const token = new URLSearchParams(window.location.search).get("token")
        ?? new URLSearchParams(window.location.hash.slice(1)).get("token");
      setAccessToken(token);
      const data = await fetchEstimateDetail(quoteId, token);
      if (active) {
        setEstimate(data);
        setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [quoteId]);

  const handleConvertEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledDate || !addressLine1 || !postcode) return;

    setConverting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/estimates/${quoteId}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { "X-Resource-Token": accessToken } : {}),
        },
        body: JSON.stringify({
          scheduledDate,
          scheduledTimeSlot,
          addressLine1,
          postcode,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to convert quote to booking");
      } else {
        router.push(`/account/bookings/${json.bookingId}`);
      }
    } catch {
      setActionError("Network error converting quote");
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center space-y-3">
        <div className="space-y-3">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Fetching formal estimate quote details...</p>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-[#F9FCF5] rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#B7F56A]">
          <AlertCircle className="w-10 h-10 text-danger-500 mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">Quote Reference Not Found</h3>
          <p className="text-xs text-ink-500">
            The formal estimate reference <span className="font-mono font-medium text-ink-600">{quoteId}</span> was not found or has expired.
          </p>
          <Link href="/prices" className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none border border-[#E5FBC9]">
            Calculate New Instant Estimate
          </Link>
        </div>
      </div>
    );
  }

  const expired = isEstimateExpired(estimate.validUntil);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 text-start">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* HEADER BAR */}
        <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#B7F56A]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5FBC9] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-medium text-ink-500 uppercase">BEST ONE SERVICES • OFFICIAL QUOTE</span>
              <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">
                {estimate.serviceName}
              </h1>
              <p className="text-xs font-mono text-ink-500">
                Reference: <span className="font-medium text-ink-600">{estimate.reference}</span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium uppercase ${
                estimate.status === "converted_to_booking"
                  ? "bg-[#1F3A00] text-white"
                  : expired
                  ? "bg-danger-50 text-danger-900"
                  : "bg-success-50 text-success-900"
              }`}>
                {estimate.status === "converted_to_booking" ? "CONVERTED TO BOOKING" : expired ? "EXPIRED" : estimate.status.toUpperCase()}
              </span>

              <button
                type="button"
                onClick={() => window.print()}
                className="text-[11px] font-mono text-ink-500 hover:text-ink-600 inline-flex items-center gap-1 cursor-pointer border-none bg-transparent"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Quote Document</span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-[18px] bg-[#F9FCF5] space-y-1 border border-[#B7F56A]">
              <span className="text-ink-500 uppercase block">PREPARED FOR</span>
              <p className="font-medium text-ink-600">{estimate.customerName}</p>
              <p className="text-ink-500">{estimate.customerEmail}</p>
            </div>

            <div className="p-3.5 rounded-[18px] bg-[#F9FCF5] space-y-1 border border-[#B7F56A]">
              <span className="text-ink-500 uppercase block">VALIDITY WINDOW</span>
              <p className="font-medium text-ink-600">Valid for 14 Days</p>
              <p className="text-ink-500">Expires: {new Date(estimate.validUntil as string).toLocaleDateString("en-GB")}</p>
            </div>
          </div>
        </div>

        {/* SPECIFICATIONS & ITEMIZED COST BREAKDOWN */}
        <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-6 border border-[#B7F56A]">
          <div className="space-y-1 border-b border-[#E5FBC9] pb-3">
            <h2 className="font-heading text-xl font-medium text-ink-900">Scope Specifications & Pricing</h2>
            <p className="text-xs text-ink-500">Guaranteed locked transparent pricing line items</p>
          </div>

          {/* Specifications Grid */}
          <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
            {estimate.specifications.propertySize && (
              <div className="p-3 rounded-[18px] bg-white flex justify-between">
                <span className="text-ink-500">Property Size:</span>
                <span className="font-medium text-ink-600 uppercase">{estimate.specifications.propertySize}</span>
              </div>
            )}
            {estimate.specifications.hoursCount && (
              <div className="p-3 rounded-[18px] bg-white flex justify-between">
                <span className="text-ink-500">Duration:</span>
                <span className="font-medium text-ink-600">{estimate.specifications.hoursCount} Hours</span>
              </div>
            )}
            {estimate.specifications.selectedAddOnNames && estimate.specifications.selectedAddOnNames.length > 0 && (
              <div className="p-3 rounded-[18px] bg-white col-span-2 space-y-1">
                <span className="text-ink-500 block">Included Extras:</span>
                <p className="font-medium text-ink-600">{estimate.specifications.selectedAddOnNames.join(", ")}</p>
              </div>
            )}
          </div>

          {/* Itemized Lines */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Itemized Cost Breakdown</span>
            <div className="p-4 rounded-[18px] bg-[#F9FCF5] space-y-2 border border-[#B7F56A]">
              {estimate.breakdown.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-ink-600">
                  <Check className="w-4 h-4 text-[#1F3A00] shrink-0" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Price Card */}
          <div className="p-6 rounded-[18px] bg-[#1F3A00] text-white space-y-3 border border-[#E5FBC9]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-medium uppercase text-ink-400">Total Guaranteed Quote</span>
              <span className="font-heading font-medium text-3xl sm:text-4xl text-[#1F3A00]">
                {formatPenceToGBP(estimate.totalPence)}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-ink-600 text-xs text-ink-300">
              <ShieldCheck className="w-4 h-4 text-[#1F3A00] shrink-0" />
              <span>Includes 48-Hour Re-Clean Guarantee & All Taxes</span>
            </div>
          </div>

          {/* ACTIONS */}
          {estimate.status === "converted_to_booking" ? (
            <div className="p-4 rounded-[18px] bg-success-50 border border-success-500 text-success-900 text-xs font-medium text-center space-y-2">
              <p>This quote has been converted into Booking #{estimate.convertedBookingReference}.</p>
              <Link href={`/account/bookings/${estimate.convertedBookingId}`} className="underline font-mono">
                View Active Appointment →
              </Link>
            </div>
          ) : expired ? (
            <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium text-center">
              This estimate quote has expired. Please calculate a fresh quote.
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setBookModalOpen(true)}
              className="w-full py-4 rounded-full bg-[#1F3A00] text-white font-heading font-medium text-sm hover:bg-[#1F3A00] cursor-pointer transition-colors duration-150 flex items-center justify-center gap-2 border border-[#E5FBC9]"
            >
              <span>Accept Quote & Book Appointment →</span>
            </button>
          )}

        </div>

      </div>

      {/* MODAL: STATE HANDOFF TO ACTIVE BOOKING */}
      {bookModalOpen && (
        <div className="fixed inset-0 bg-ink-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F9FCF5] rounded-[18px] max-w-lg w-full p-6 sm:p-8 space-y-6 text-start border border-[#B7F56A]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <div>
                <span className="text-xs font-mono font-medium text-ink-500 uppercase">FINAL STEP</span>
                <h3 className="font-heading font-medium text-lg text-ink-900">Schedule Your Appointment</h3>
              </div>
              <button
                type="button"
                onClick={() => setBookModalOpen(false)}
                className="text-xs font-medium text-ink-500 hover:text-ink-600 cursor-pointer border-none bg-transparent"
              >
                ✕ Close
              </button>
            </div>

            {actionError && (
              <div className="p-3.5 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleConvertEstimate} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Preferred Service Date *</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Preferred Time Slot *</label>
                <select
                  value={scheduledTimeSlot}
                  onChange={(e) => setScheduledTimeSlot(e.target.value)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                >
                  <option value="morning">09:00 - 12:00 (Morning)</option>
                  <option value="afternoon">12:00 - 15:00 (Afternoon)</option>
                  <option value="evening">15:00 - 18:00 (Late Afternoon)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Property Service Address *</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street address line 1..."
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Postcode *</label>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  placeholder="e.g. SW1A 1AA"
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={converting || !scheduledDate || !addressLine1 || !postcode}
                className="w-full py-4 rounded-full bg-[#1F3A00] text-[#B7F56A] font-heading font-semibold text-xs hover:bg-[#2d5004] cursor-pointer disabled:opacity-50 transition-colors duration-150 border border-[#E5FBC9]"
              >
                {converting ? "Converting Quote to Booking..." : "Confirm & Create Active Booking →"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
