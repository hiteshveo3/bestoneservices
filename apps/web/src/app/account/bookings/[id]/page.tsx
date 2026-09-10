"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase-client";
import { 
  subscribeBookingDetail, 
  subscribeBookingEvents 
} from "@/lib/repositories/bookings";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { formatUKDate } from "@/lib/timezone";
import { Spinner } from "@/components/ui/spinner";
import { 
  type BookingItem, 
  type BookingEventItem 
} from "@/types/booking";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  XCircle, 
  Edit3,
  PoundSterling,
  ShieldCheck
} from "lucide-react";

export default function CustomerBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [authLoading, setAuthLoading] = useState(true);
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [events, setEvents] = useState<BookingEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Reschedule Form State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState<"morning" | "afternoon" | "evening">("morning");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [submittingReschedule, setSubmittingReschedule] = useState(false);

  // Cancel Form State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<"schedule_conflict" | "found_alternative" | "pricing_concern" | "scope_changed" | "other">("schedule_conflict");
  const [cancelDetails, setCancelDetails] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);

  // Scope Change Form State
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [changeNotes, setChangeNotes] = useState("");
  const [submittingChange, setSubmittingChange] = useState(false);

  useEffect(() => {
    const auth = getFirebaseClientAuth();
    if (!auth) {
      const timer = setTimeout(() => {
        setAuthLoading(false);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const unSubAuth = onAuthStateChanged(auth, () => {
      setAuthLoading(false);
    });

    let active = true;

    const unSubDetail = subscribeBookingDetail(bookingId, (data) => {
      if (!active) return;
      setBooking(data);
      if (data) {
        setNewDate(data.scheduling?.requestedDate || "");
        setNewSlot(data.scheduling?.requestedTimeSlot || "morning");
      }
      setLoading(false);
    });

    const unSubEvents = subscribeBookingEvents(bookingId, "customer", (evtItems) => {
      if (active) setEvents(evtItems);
    });

    return () => {
      active = false;
      unSubAuth();
      unSubDetail();
      unSubEvents();
    };
  }, [bookingId]);

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    setActionError(null);
    setActionSuccess(null);
    setSubmittingReschedule(true);

    try {
      const auth = getFirebaseClientAuth();
      const idToken = auth?.currentUser ? await auth.currentUser.getIdToken() : "";

      const res = await fetch(`/api/customer/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` 
        },
        body: JSON.stringify({
          action: "reschedule",
          requestedDate: newDate,
          requestedTimeSlot: newSlot,
          rescheduleReason: rescheduleReason.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to submit reschedule request");
      } else {
        setActionSuccess(json.message || "Reschedule request submitted successfully.");
        setRescheduleModalOpen(false);
        setRescheduleReason("");
      }
    } catch {
      setActionError("Network error while submitting reschedule request");
    } finally {
      setSubmittingReschedule(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    setSubmittingCancel(true);

    try {
      const auth = getFirebaseClientAuth();
      const idToken = auth?.currentUser ? await auth.currentUser.getIdToken() : "";

      const res = await fetch(`/api/customer/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` 
        },
        body: JSON.stringify({
          action: "cancel",
          cancelReason,
          cancelDetails: cancelDetails.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to cancel booking");
      } else {
        setActionSuccess("Your booking cancellation has been recorded.");
        setCancelModalOpen(false);
      }
    } catch {
      setActionError("Network error while cancelling booking");
    } finally {
      setSubmittingCancel(false);
    }
  };

  const handleChangeRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeNotes.trim()) return;
    setActionError(null);
    setActionSuccess(null);
    setSubmittingChange(true);

    try {
      const auth = getFirebaseClientAuth();
      const idToken = auth?.currentUser ? await auth.currentUser.getIdToken() : "";

      const res = await fetch(`/api/customer/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` 
        },
        body: JSON.stringify({
          action: "change_request",
          changeNotes: changeNotes.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to submit scope change request");
      } else {
        setActionSuccess("Scope change request logged. Our team will review and update your booking.");
        setChangeModalOpen(false);
        setChangeNotes("");
      }
    } catch {
      setActionError("Network error while submitting scope change request");
    } finally {
      setSubmittingChange(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-[#F9FCF5] rounded-[18px] p-12 text-center space-y-3 border border-[#B7F56A]">
        <Spinner size={32} className="mx-auto" />
        <p className="text-sm font-medium text-ink-600">Loading your appointment workspace & timeline...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-[#F9FCF5] rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#B7F56A]">
        <AlertCircle className="w-10 h-10 text-danger-500 mx-auto" />
        <h3 className="font-heading text-lg font-medium text-ink-900">Booking Not Found</h3>
        <p className="text-xs text-ink-500">The requested booking record does not exist or you do not have permission to view it.</p>
        <Link href="/account/bookings" className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none border border-[#E5FBC9]">
          Return to My Bookings
        </Link>
      </div>
    );
  }

  const isRescheduleAllowedForStatus = ["new", "awaiting_confirmation", "confirmed", "scheduled"].includes(booking.status);
  const isCancelAllowedForStatus = booking.status !== "completed" && booking.status !== "cancelled";

  const confirmedPriceDisplay = booking.pricing?.confirmedPence 
    ? formatPenceToGBP(booking.pricing.confirmedPence)
    : formatPenceToGBP(booking.pricing?.estimateMinPence || 0);

  // PROGRESS STEPS
  const progressSteps = [
    { key: "received", label: "Enquiry Received", active: true },
    { key: "confirmed", label: "Confirmed & Scheduled", active: ["confirmed", "scheduled", "in_progress", "completed"].includes(booking.status) },
    { key: "in_progress", label: "In Progress", active: ["in_progress", "completed"].includes(booking.status) },
    { key: "completed", label: "Completed", active: booking.status === "completed" },
  ];

  return (
    <div className="space-y-6 text-start">
      
      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <Link
          href="/account/bookings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#B7F56A] text-xs font-medium text-ink-600 hover:bg-[#DCFAB7] transition-colors duration-150 text-decoration-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-ink-600" />
          <span>Back to My Bookings</span>
        </Link>

        <span className="text-xs font-mono font-medium text-ink-500 uppercase">
          ID: {booking.reference}
        </span>
      </div>

      {/* FEEDBACK ALERTS */}
      {actionError && (
        <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 rounded-[18px] bg-success-50 border border-success-500 text-success-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* WORKSPACE HEADER */}
      <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-6 border border-[#B7F56A]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <span className="font-heading font-medium text-2xl sm:text-3xl text-ink-900">
                {booking.reference}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
                {booking.status.replace("_", " ")}
              </span>
            </div>
            <h1 className="font-heading text-lg font-medium text-ink-900">
              {booking.serviceNameSnapshot}
            </h1>
            <p className="text-xs font-mono text-ink-500">
              Confirmed Date: {booking.scheduling?.confirmedDate || booking.scheduling?.requestedDate} ({booking.scheduling?.confirmedTimeSlot?.toUpperCase() || booking.scheduling?.requestedTimeSlot?.toUpperCase()})
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-[#F9FCF5] text-end space-y-1 shrink-0">
            <span className="text-xs font-mono font-medium text-ink-500 uppercase block">SERVICE PRICE</span>
            <div className="font-heading font-medium text-2xl text-ink-900">
              {confirmedPriceDisplay}
            </div>
          </div>
        </div>

        {/* STEP PROGRESS TRACKER */}
        {booking.status === "cancelled" ? (
          <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-3">
            <XCircle className="w-5 h-5 text-danger-500 shrink-0" />
            <div>
              <div className="font-medium text-sm">Booking Cancelled</div>
              <p className="text-danger-500">Reason: {booking.statusReason || "Cancelled by customer or operator"}</p>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-[#E5FBC9] grid grid-cols-2 sm:grid-cols-4 gap-3">
            {progressSteps.map((st, idx) => (
              <div key={st.key} className="space-y-1 text-center sm:text-start">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    st.active ? "bg-[#1F3A00] text-white" : "bg-[#F9FCF5] text-ink-500"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className={`h-1 flex-1 rounded-full ${st.active ? "bg-[#1F3A00]" : "bg-[#F9FCF5]"}`} />
                </div>
                <span className={`text-xs font-medium block ${st.active ? "text-ink-600 font-medium" : "text-ink-500"}`}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CUSTOMER ACTION CONTROL BAR */}
      {booking.status !== "cancelled" && (
        <div className="bg-[#F9FCF5] rounded-[18px] p-4 flex flex-wrap items-center justify-between gap-3 border border-[#B7F56A]">
          <span className="text-xs font-mono font-medium text-ink-500 uppercase px-2">Manage Appointment</span>

          <div className="flex flex-wrap items-center gap-2">
            {isRescheduleAllowedForStatus && (
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#F9FCF5] text-ink-600 hover:bg-[#DCFAB7] text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer border-none"
              >
                <RotateCcw className="w-3.5 h-3.5 text-ink-600" />
                <span>Request Reschedule</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setChangeModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#F9FCF5] text-ink-600 hover:bg-[#DCFAB7] text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Edit3 className="w-3.5 h-3.5 text-ink-600" />
              <span>Request Scope Changes</span>
            </button>

            {isCancelAllowedForStatus && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2 rounded-full bg-danger-50 text-danger-900 hover:bg-danger-50 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer border-none"
              >
                <XCircle className="w-3.5 h-3.5 text-danger-500" />
                <span>Cancel Booking</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT GRID */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SERVICE SPECIFICATIONS & ADDRESS */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-[#F9FCF5] rounded-[18px] p-6 space-y-4 border border-[#B7F56A]">
            <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
              Appointment Specifications
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono text-ink-500 uppercase block">Category</span>
                <span className="font-medium text-ink-600 capitalize">{booking.categoryId}</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-ink-500 uppercase block">Confirmed Date</span>
                <span className="font-mono text-ink-600 font-medium">
                  {booking.scheduling?.confirmedDate || booking.scheduling?.requestedDate}
                </span>
              </div>

              {Object.entries(booking.serviceDetails || {}).map(([key, val]) => {
                if (val === undefined || val === null || val === false) return null;
                return (
                  <div key={key} className="space-y-1">
                    <span className="text-xs font-mono text-ink-500 uppercase block">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="font-medium text-ink-600">
                      {typeof val === "boolean" ? "Yes" : String(val)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E5FBC9] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-ink-500 uppercase">
                <MapPin className="w-3.5 h-3.5 text-ink-600 shrink-0" />
                <span>Service Address</span>
              </div>
              <p className="text-xs text-ink-600 font-medium leading-relaxed bg-[#F9FCF5] p-3 rounded-[18px]">
                {booking.address?.addressLine1}{booking.address?.addressLine2 ? `, ${booking.address.addressLine2}` : ""}<br />
                {booking.address?.city}, <strong className="text-ink-600 font-medium">{booking.address?.postcode}</strong>
              </p>
            </div>
          </div>

          {/* PRICING DETAILS */}
          <div className="bg-[#F9FCF5] rounded-[18px] p-6 space-y-4 border border-[#B7F56A]">
            <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2 flex items-center gap-1.5">
              <PoundSterling className="w-4 h-4 text-ink-600" />
              <span>Pricing Breakdown & Guarantee</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3.5 rounded-[18px] bg-[#F9FCF5] space-y-1">
                <span className="text-ink-500 uppercase block">Estimated Minimum</span>
                <span className="font-heading font-medium text-lg text-ink-900">
                  {formatPenceToGBP(booking.pricing?.estimateMinPence || 0)}
                </span>
              </div>

              <div className="p-3.5 rounded-[18px] bg-[#DCFAB7] border border-[#99D055] space-y-1">
                <span className="text-ink-600 font-medium uppercase block">Confirmed Final Price</span>
                <span className="font-heading font-medium text-xl text-ink-900">
                  {confirmedPriceDisplay}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-[18px] bg-white border border-[#B7F56A] text-xs font-medium flex items-center gap-2 text-ink-500">
              <ShieldCheck className="w-4 h-4 text-[#1F3A00] shrink-0" />
              <span>Includes Best One 48-Hour Service Guarantee & Fixed Transparent Pricing</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE VISUAL TIMELINE */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#F9FCF5] rounded-[18px] p-6 space-y-4 border border-[#B7F56A]">
            <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-ink-600" />
              <span>Live Appointment Timeline</span>
            </h3>

            {events.length > 0 ? (
              <div className="relative pl-6 space-y-4 border-l-2 border-[#E5FBC9]">
                {events.map((evt) => (
                  <div key={evt.id} className="relative space-y-1 text-start">
                    <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#1F3A00] border-2 border-white shrink-0" />
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-ink-600">{evt.summary}</span>
                    </div>
                    <div className="text-[10px] font-mono text-ink-500">
                      {evt.createdAt ? formatUKDate(typeof evt.createdAt === "string" ? new Date(evt.createdAt) : (evt.createdAt as unknown as Date)) : "Recent"} • {evt.actorRole === "customer" ? "You" : "Best One Team"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-500 italic">No customer activity recorded on timeline yet.</p>
            )}
          </div>

        </div>

      </div>

      {/* MODAL: RESCHEDULE */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 bg-ink-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F9FCF5] rounded-[18px] max-w-md w-full p-6 space-y-4 text-start border border-[#B7F56A]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <h3 className="font-heading font-medium text-lg text-ink-900">Request Appointment Reschedule</h3>
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="text-xs font-medium text-ink-500 hover:text-ink-600 cursor-pointer border-none bg-transparent"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">New Desired Date *</label>
                <input
                  type="date"
                  value={newDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none focus:ring-2 focus:ring-[#99D055]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Time Slot *</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value as "morning" | "afternoon" | "evening")}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none focus:ring-2 focus:ring-[#99D055]"
                >
                  <option value="morning">Morning Slot (8am - 12pm)</option>
                  <option value="afternoon">Afternoon Slot (12pm - 4pm)</option>
                  <option value="evening">Evening Slot (4pm - 8pm)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Reason Note (Optional)</label>
                <textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Explain why you need to reschedule..."
                  rows={3}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs text-ink-600 border-none focus:ring-2 focus:ring-[#99D055] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReschedule || !newDate}
                className="w-full py-3 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer disabled:opacity-50 border border-[#E5FBC9]"
              >
                {submittingReschedule ? "Submitting Request..." : "Submit Reschedule Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CANCEL BOOKING */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-ink-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F9FCF5] rounded-[18px] max-w-md w-full p-6 space-y-4 text-start border border-[#B7F56A]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <h3 className="font-heading font-medium text-lg text-danger-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-danger-500" />
                <span>Cancel Booking Confirmation</span>
              </h3>
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="text-xs font-medium text-ink-500 hover:text-ink-600 cursor-pointer border-none bg-transparent"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Cancellation Reason *</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value as "schedule_conflict" | "found_alternative" | "pricing_concern" | "scope_changed" | "other")}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none focus:ring-2 focus:ring-[#99D055]"
                >
                  <option value="schedule_conflict">Schedule Conflict / Travel</option>
                  <option value="found_alternative">Found Alternative Service</option>
                  <option value="pricing_concern">Pricing / Budget Concern</option>
                  <option value="scope_changed">Service Scope Changed</option>
                  <option value="other">Other Reason</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Details (Optional)</label>
                <textarea
                  value={cancelDetails}
                  onChange={(e) => setCancelDetails(e.target.value)}
                  placeholder="Additional context for cancellation..."
                  rows={3}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs text-ink-600 border-none focus:ring-2 focus:ring-[#99D055] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingCancel}
                className="w-full py-3 rounded-full bg-danger-500 text-white text-xs font-medium hover:bg-danger-500 cursor-pointer disabled:opacity-50 border border-[#E5FBC9]"
              >
                {submittingCancel ? "Cancelling..." : "Confirm Booking Cancellation"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCOPE CHANGE REQUEST */}
      {changeModalOpen && (
        <div className="fixed inset-0 bg-ink-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F9FCF5] rounded-[18px] max-w-md w-full p-6 space-y-4 text-start border border-[#B7F56A]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <h3 className="font-heading font-medium text-lg text-ink-900">Request Scope Change or Add-ons</h3>
              <button
                type="button"
                onClick={() => setChangeModalOpen(false)}
                className="text-xs font-medium text-ink-500 hover:text-ink-600 cursor-pointer border-none bg-transparent"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleChangeRequestSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Requested Add-ons or Scope Notes *</label>
                <textarea
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  placeholder="Describe add-on services or scope changes (e.g. Add internal oven cleaning, extra waste clearance bags)..."
                  rows={4}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs text-ink-600 border-none focus:ring-2 focus:ring-[#99D055] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingChange || !changeNotes.trim()}
                className="w-full py-3 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer disabled:opacity-50 border border-[#E5FBC9]"
              >
                {submittingChange ? "Logging Request..." : "Submit Scope Change Request"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
