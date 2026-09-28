"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase-client";
import { subscribeCustomerBookings } from "@/lib/repositories/bookings";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type BookingItem, type BookingStatus } from "@/types/booking";
import { Spinner } from "@/components/ui/spinner";
import { siteContact } from "@/config/site-contact";
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
        return <span className="px-2.5 py-1 rounded-md bg-info-50 text-info-900 text-xs font-mono font-medium uppercase">Enquiry Received</span>;
      case "awaiting_confirmation":
        return <span className="px-2.5 py-1 rounded-md bg-warning-50 text-warning-900 text-xs font-mono font-medium uppercase">Awaiting Confirmation</span>;
      case "confirmed":
        return <span className="ts-chip">Confirmed</span>;
      case "scheduled":
        return <span className="px-2.5 py-1 rounded-md bg-success-50 text-success-900 text-xs font-mono font-medium uppercase">Scheduled</span>;
      case "in_progress":
        return <span className="px-2.5 py-1 rounded-md bg-[#F6F5F1] text-[#1D201E] text-xs font-mono font-medium uppercase">In Progress</span>;
      case "completed":
        return <span className="px-2.5 py-1 rounded-md bg-ink-200 text-ink-600 text-xs font-mono font-medium uppercase">Completed</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 rounded-md bg-danger-50 text-danger-900 text-xs font-mono font-medium uppercase">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md bg-ink-100 text-ink-600 text-xs font-mono font-medium uppercase">{status}</span>;
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
      <div className="bg-white rounded-[18px] p-12 text-center space-y-3 ">
        <Spinner size={32} className="mx-auto" />
        <p className="text-sm font-medium text-ink-600">Syncing your service bookings...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-[18px] p-8 space-y-4 text-center max-w-xl mx-auto ">
        <AlertCircle className="w-10 h-10 text-warning-500 mx-auto" />
        <h3 className="font-heading text-xl font-medium text-ink-900">Customer Sign In Required</h3>
        <p className="text-sm text-ink-500 leading-relaxed">
          Please log in to your Bestone account to manage active bookings, request reschedules, or track live service appointment status.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/account/login"
            className="px-6 py-3 rounded-xl bg-[#B7F56A] text-[#1D201E] font-semibold text-sm hover:bg-[#A2EA4E] text-decoration-none "
          >
            Log In to Account
          </Link>
          <Link
            href="/booking/status"
            className="px-6 py-3 rounded-xl bg-[#F6F5F1] text-ink-600 font-medium text-sm hover:bg-[#EAF8D6] text-decoration-none"
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
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 ">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">CUSTOMER PORTAL</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-[650] text-ink-900">My Service Bookings</h1>
            <p className="text-sm text-ink-500">Track appointments, view live timelines, or submit reschedule requests</p>
          </div>

          <Link
            href={siteContact.getWhatsappUrl("Hi, I'd like to book a new service with Bestone Services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B7F56A] text-[#1D201E] font-semibold text-sm hover:bg-[#A2EA4E] transition-colors duration-150 text-decoration-none "
          >
            <span>Book New Service</span>
            <ArrowRight className="w-4 h-4 text-[#1D201E]" />
          </Link>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-[#ECEAE3]">
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
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ statusFilter === pill.id ? "bg-[#B7F56A] text-[#1D201E] font-medium " : "bg-white text-ink-500 hover:text-[#1D201E]" } `}
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
                className="bg-white rounded-[18px] p-6 space-y-4  border-l-blue-500 "
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-mono font-medium text-sm text-ink-600">{b.reference}</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#F6F5F1] text-[10px] font-mono font-medium uppercase text-ink-500">
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

                <div className="pt-3 border-[#ECEAE3] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-ink-500 uppercase block">Service Price</span>
                    <span className="font-heading font-medium text-xl text-ink-900">{displayPrice}</span>
                  </div>

                  <Link
                    href={`/account/bookings/${b.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#B7F56A] text-[#1D201E] font-medium text-xs hover:bg-[#A2EA4E] text-decoration-none transition-colors duration-150 "
                  >
                    <span>View Workspace & Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#1D201E]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CLEAN EMPTY STATE */
        <div className="bg-white rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto ">
          <Calendar className="w-10 h-10 text-[#1D201E] mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">No Bookings Found</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            You don&apos;t have any bookings matching your selected status filter.
          </p>
          <Link
            href={siteContact.getWhatsappUrl("Hi, I'd like to book a service with Bestone Services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-md bg-[#B7F56A] text-[#1D201E] font-medium text-xs inline-block text-decoration-none "
          >
            Book a Service Now
          </Link>
        </div>
      )}

    </div>
  );
}

