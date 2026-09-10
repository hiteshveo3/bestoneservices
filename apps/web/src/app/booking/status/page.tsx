"use client";

import React, { useState } from "react";
import Link from "next/link";
import { fetchGuestBookingByRefAndEmail } from "@/lib/repositories/bookings";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type BookingItem } from "@/types/booking";
import { Spinner } from "@/components/ui/spinner";
import { 
  Search, 
  Clock, 
  MapPin, 
  AlertCircle, 
  ArrowLeft
} from "lucide-react";

export default function GuestBookingStatusPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || !email.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSearched(true);

    try {
      const result = await fetchGuestBookingByRefAndEmail(reference, email);
      if (!result) {
        setBooking(null);
        setErrorMsg("No matching booking found for the reference and email provided.");
      } else {
        setBooking(result);
      }
    } catch {
      setErrorMsg("Error querying booking record. Please check your credentials.");
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-2.5 py-1 rounded-full bg-info-50 text-info-900 text-xs font-mono font-medium uppercase">Enquiry Received</span>;
      case "awaiting_confirmation":
        return <span className="px-2.5 py-1 rounded-full bg-warning-50 text-warning-900 text-xs font-mono font-medium uppercase">Awaiting Confirmation</span>;
      case "confirmed":
        return <span className="px-2.5 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">Confirmed</span>;
      case "scheduled":
        return <span className="px-2.5 py-1 rounded-full bg-success-50 text-success-900 text-xs font-mono font-medium uppercase">Scheduled</span>;
      case "in_progress":
        return <span className="px-2.5 py-1 rounded-full bg-[#F9FCF5] text-[#1F3A00] text-xs font-mono font-medium uppercase">In Progress</span>;
      case "completed":
        return <span className="px-2.5 py-1 rounded-full bg-ink-200 text-ink-600 text-xs font-mono font-medium uppercase">Completed</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 rounded-full bg-danger-50 text-danger-900 text-xs font-mono font-medium uppercase">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-ink-100 text-ink-600 text-xs font-mono font-medium uppercase">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6 text-start">
        
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#B7F56A] text-xs font-medium text-ink-600 hover:bg-[#DCFAB7] transition-colors duration-150 text-decoration-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-ink-600" />
          <span>Back to Home</span>
        </Link>

        {/* HEADER & FORM CARD */}
        <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-6 border border-[#B7F56A]">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">GUEST ACCESS PORTAL</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Track Guest Booking Status</h1>
            <p className="text-sm text-ink-500">Enter your booking reference and email address to check your appointment schedule</p>
          </div>

          <form onSubmit={handleLookup} className="space-y-4 pt-2 border-t border-[#E5FBC9]">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Booking Reference *</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. BOS-2026-8A39F"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-sm font-mono font-medium text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="The email used during booking..."
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-sm font-medium text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !reference.trim() || !email.trim()}
              className="w-full py-3 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-[#E5FBC9]"
            >
              <Search className="w-4 h-4 text-white" />
              <span>{loading ? "Searching Firestore..." : "Lookup Booking Status"}</span>
            </button>
          </form>
        </div>

        {/* ERROR NOTICE */}
        {errorMsg && (
          <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* RESULTS CARD */}
        {loading ? (
          <div className="bg-[#F9FCF5] rounded-[18px] p-8 text-center space-y-3 border border-[#B7F56A]">
            <Spinner size={32} className="mx-auto" />
            <p className="text-sm font-medium text-ink-600">Querying guest booking records...</p>
          </div>
        ) : booking ? (
          <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-6 border-l-4 border-l-blue-500 border border-[#B7F56A]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5FBC9] pb-4">
              <div className="space-y-0.5">
                <span className="font-heading font-medium text-2xl text-ink-900">{booking.reference}</span>
                <span className="text-xs font-mono text-ink-500 block capitalize">Category: {booking.categoryId}</span>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono text-ink-500 uppercase block">Service Name</span>
                <div className="font-heading font-medium text-base text-ink-900">{booking.serviceNameSnapshot}</div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-ink-500 uppercase block">Appointment Slot</span>
                <div className="font-mono font-medium text-ink-600 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-ink-600 shrink-0" />
                  <span>{booking.scheduling?.confirmedDate || booking.scheduling?.requestedDate} ({booking.scheduling?.confirmedTimeSlot?.toUpperCase() || booking.scheduling?.requestedTimeSlot?.toUpperCase()})</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-ink-500 uppercase block">Customer Name</span>
                <div className="font-medium text-ink-600">{booking.customerSnapshot?.fullName}</div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-ink-500 uppercase block">Service Price</span>
                <div className="font-heading font-medium text-lg text-ink-900">
                  {booking.pricing?.confirmedPence ? formatPenceToGBP(booking.pricing.confirmedPence) : formatPenceToGBP(booking.pricing?.estimateMinPence || 0)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5FBC9] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-ink-500 uppercase">
                <MapPin className="w-3.5 h-3.5 text-ink-600 shrink-0" />
                <span>Service Location</span>
              </div>
              <p className="text-xs text-ink-600 font-medium leading-relaxed bg-[#F9FCF5] p-3 rounded-[18px]">
                {booking.address?.addressLine1}, {booking.address?.city}, <strong>{booking.address?.postcode}</strong>
              </p>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/account/login"
                className="text-xs font-medium text-ink-600 underline hover:text-ink-600"
              >
                Log in to create an account & manage full appointment timeline →
              </Link>
            </div>
          </div>
        ) : searched && !loading && (
          <div className="bg-[#F9FCF5] rounded-[18px] p-8 text-center space-y-3 border border-[#B7F56A]">
            <AlertCircle className="w-8 h-8 text-warning-500 mx-auto" />
            <p className="text-sm font-medium text-ink-600">No Booking Record Found</p>
            <p className="text-xs text-ink-500">Double check your reference number (e.g. BOS-2026-XXXXX) and email address.</p>
          </div>
        )}

      </div>
    </div>
  );
}

