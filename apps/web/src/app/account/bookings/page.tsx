"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase-client";
import { subscribeCustomerBookings } from "@/lib/repositories/bookings";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type BookingItem, type BookingStatus } from "@/types/booking";
import { Spinner } from "@/components/ui/spinner";
import { 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  MapPin,
  AlertCircle
} from "lucide-react";

export default function CustomerBookingsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "cancelled">("all");

  useEffect(() => {
    const auth = getFirebaseClientAuth();
    if (!auth) {
      const timer = setTimeout(() => {
        setAuthLoading(false);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const unSubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        const unSubBookings = subscribeCustomerBookings(user.uid, (data) => {
          setBookings(data);
          setLoading(false);
        });

        return () => {
          unSubBookings();
        };
      } else {
        setBookings([]);
        setLoading(false);
      }
    });

    return () => {
      unSubAuth();
    };
  }, []);

  const getStatusBadge = (status: BookingStatus) => {
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

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "completed") return b.status === "completed";
    if (statusFilter === "cancelled") return b.status === "cancelled";
    if (statusFilter === "active") {
      return ["new", "awaiting_confirmation", "confirmed", "scheduled", "in_progress"].includes(b.status);
    }
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="bg-[#F9FCF5] rounded-[18px] p-12 text-center space-y-3 border border-[#B7F56A]">
        <Spinner size={32} className="mx-auto" />
        <p className="text-sm font-medium text-ink-600">Syncing your service bookings...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-[#F9FCF5] rounded-[18px] p-8 space-y-4 text-center max-w-xl mx-auto border border-[#B7F56A]">
        <AlertCircle className="w-10 h-10 text-warning-500 mx-auto" />
        <h3 className="font-heading text-xl font-medium text-ink-900">Customer Sign In Required</h3>
        <p className="text-sm text-ink-500 leading-relaxed">
          Please log in to your Best One account to manage active bookings, request reschedules, or track live service appointment status.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/account/login"
            className="px-6 py-3 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] text-decoration-none border border-[#E5FBC9]"
          >
            Log In to Account
          </Link>
          <Link
            href="/booking/status"
            className="px-6 py-3 rounded-full bg-[#F9FCF5] text-ink-600 font-medium text-sm hover:bg-[#DCFAB7] text-decoration-none"
          >
            Lookup Guest Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER & FILTER BAR */}
      <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#B7F56A]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">CUSTOMER PORTAL</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">My Service Bookings</h1>
            <p className="text-sm text-ink-500">Track appointments, view live timelines, or submit reschedule requests</p>
          </div>

          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] transition-colors duration-150 text-decoration-none border border-[#E5FBC9]"
          >
            <span>Book New Service</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5FBC9]">
          {[
            { id: "all", label: "All Bookings", count: bookings.length },
            { 
              id: "active", 
              label: "Active Appointments", 
              count: bookings.filter((b) => ["new", "awaiting_confirmation", "confirmed", "scheduled", "in_progress"].includes(b.status)).length 
            },
            { id: "completed", label: "Completed", count: bookings.filter((b) => b.status === "completed").length },
            { id: "cancelled", label: "Cancelled", count: bookings.filter((b) => b.status === "cancelled").length },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setStatusFilter(pill.id as "all" | "active" | "completed" | "cancelled")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ statusFilter === pill.id ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>
      </div>

      {/* BOOKINGS LIST */}
      {filteredBookings.length > 0 ? (
        <div className="grid gap-4">
          {filteredBookings.map((b) => {
            const displayPrice = b.pricing?.confirmedPence 
              ? formatPenceToGBP(b.pricing.confirmedPence)
              : formatPenceToGBP(b.pricing?.estimateMinPence || 0);

            const displayDate = b.scheduling?.confirmedDate || b.scheduling?.requestedDate;
            const displaySlot = b.scheduling?.confirmedTimeSlot || b.scheduling?.requestedTimeSlot;

            return (
              <div 
                key={b.id} 
                className="bg-[#F9FCF5] rounded-[18px] p-6 space-y-4 border-l-4 border-l-blue-500 border border-[#B7F56A]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-mono font-medium text-sm text-ink-600">{b.reference}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] text-[10px] font-mono font-medium uppercase text-ink-500">
                      {b.categoryId}
                    </span>
                  </div>
                  {getStatusBadge(b.status)}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-ink-500 uppercase block">Service Booked</span>
                    <div className="font-heading font-medium text-base text-ink-900">{b.serviceNameSnapshot}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono text-ink-500 uppercase block">Appointment Slot</span>
                    <div className="font-mono font-medium text-ink-600 inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-ink-600 shrink-0" />
                      <span>{displayDate} ({displaySlot?.toUpperCase()})</span>
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                    <span className="text-xs font-mono text-ink-500 uppercase block">Service Address</span>
                    <div className="font-mono text-xs text-ink-600 inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-ink-600 shrink-0" />
                      <span className="truncate">{b.address?.addressLine1}, {b.address?.postcode}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5FBC9] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-ink-500 uppercase block">Service Price</span>
                    <span className="font-heading font-medium text-xl text-ink-900">{displayPrice}</span>
                  </div>

                  <Link
                    href={`/account/bookings/${b.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1F3A00] text-white font-medium text-xs hover:bg-[#2d5004] text-decoration-none transition-colors duration-150 border border-[#E5FBC9]"
                  >
                    <span>View Workspace & Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CLEAN EMPTY STATE */
        <div className="bg-[#F9FCF5] rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#B7F56A]">
          <Calendar className="w-10 h-10 text-[#1F3A00] mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">No Bookings Found</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            You don&apos;t have any bookings matching your selected status filter.
          </p>
          <Link
            href="/booking"
            className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none border border-[#E5FBC9]"
          >
            Book a Service Now
          </Link>
        </div>
      )}

    </div>
  );
}

