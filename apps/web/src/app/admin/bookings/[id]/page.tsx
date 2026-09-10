"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  subscribeBookingDetail, 
  subscribeBookingEvents, 
  subscribeInternalNotes 
} from "@/lib/repositories/bookings";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { formatUKDate } from "@/lib/timezone";
import { Spinner } from "@/components/ui/spinner";
import { 
  type BookingItem, 
  type BookingStatus, 
  type BookingEventItem, 
  type InternalNoteItem,
  type PriceChangeReason
} from "@/types/booking";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  PoundSterling, 
  AlertCircle,
  Send,
  Edit3,
  Lock
} from "lucide-react";

export default function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [events, setEvents] = useState<BookingEventItem[]>([]);
  const [internalNotes, setInternalNotes] = useState<InternalNoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Status Change Form
  const [targetStatus, setTargetStatus] = useState<BookingStatus>("confirmed");
  const [statusReason, setStatusReason] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Price Adjustment Form
  const [priceFormOpen, setPriceFormOpen] = useState(false);
  const [newPricePounds, setNewPricePounds] = useState<number>(0);
  const [priceReason, setPriceReason] = useState<PriceChangeReason>("scope_differed_from_booking");
  const [priceDetails, setPriceDetails] = useState("");
  const [submittingPrice, setSubmittingPrice] = useState(false);

  // Schedule Update Form
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [confirmedDate, setConfirmedDate] = useState("");
  const [confirmedSlot, setConfirmedSlot] = useState<"morning" | "afternoon" | "evening">("morning");
  const [confirmedExactTime, setConfirmedExactTime] = useState("");
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  // New Internal Note Form
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    let active = true;

    const unSubDetail = subscribeBookingDetail(bookingId, (data) => {
      if (!active) return;
      setBooking(data);
      if (data) {
        const estPounds = data.pricing?.confirmedPence 
          ? data.pricing.confirmedPence / 100 
          : data.pricing?.estimateMinPence / 100;
        setNewPricePounds(estPounds);
        setConfirmedDate(data.scheduling?.confirmedDate || data.scheduling?.requestedDate || "");
        setConfirmedSlot(data.scheduling?.confirmedTimeSlot || data.scheduling?.requestedTimeSlot || "morning");
        setConfirmedExactTime(data.scheduling?.confirmedTimeExact || "");
      }
      setLoading(false);
    });

    const unSubEvents = subscribeBookingEvents(bookingId, "admin", (evtItems) => {
      if (active) setEvents(evtItems);
    });

    const unSubNotes = subscribeInternalNotes(bookingId, (noteItems) => {
      if (active) setInternalNotes(noteItems);
    });

    return () => {
      active = false;
      unSubDetail();
      unSubEvents();
      unSubNotes();
    };
  }, [bookingId]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setActionError(null);
    setActionSuccess(null);
    setSubmittingStatus(true);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          expectedVersion: booking.version || 1,
          status: targetStatus,
          statusReason: statusReason.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.message || json.error || "Failed to update status");
      } else {
        setActionSuccess(`Booking status successfully updated to ${targetStatus.toUpperCase()}`);
        setStatusReason("");
      }
    } catch {
      setActionError("Network error while updating status");
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handlePriceAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setActionError(null);
    setActionSuccess(null);
    setSubmittingPrice(true);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjust_price",
          expectedVersion: booking.version || 1,
          newPricePounds,
          priceChangeReason: priceReason,
          priceChangeDetails: priceDetails.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.message || json.error || "Failed to adjust price");
      } else {
        setActionSuccess("Booking price adjustment recorded and history logged.");
        setPriceFormOpen(false);
      }
    } catch {
      setActionError("Network error while adjusting price");
    } finally {
      setSubmittingPrice(false);
    }
  };

  const handleScheduleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setActionError(null);
    setActionSuccess(null);
    setSubmittingSchedule(true);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_schedule",
          expectedVersion: booking.version || 1,
          confirmedDate,
          confirmedTimeSlot: confirmedSlot,
          confirmedTimeExact: confirmedExactTime.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.message || json.error || "Failed to update schedule");
      } else {
        setActionSuccess("Confirmed appointment slot updated successfully.");
        setScheduleFormOpen(false);
      }
    } catch {
      setActionError("Network error while updating schedule");
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setActionError(null);
    setSubmittingNote(true);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_internal_note",
          internalNote: newNote,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.message || json.error || "Failed to add internal note");
      } else {
        setNewNote("");
      }
    } catch {
      setActionError("Network error while adding internal note");
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
        <Spinner size={32} className="mx-auto" />
        <p className="text-sm font-medium text-ink-600">Loading booking operational workspace...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-white rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#E5FBC9]">
        <AlertCircle className="w-10 h-10 text-danger-500 mx-auto" />
        <h3 className="font-heading text-lg font-medium text-ink-900">Booking Not Found</h3>
        <p className="text-xs text-ink-500">The requested booking record does not exist or was moved.</p>
        <Link href="/admin/bookings" className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none">
          Return to Booking Queue
        </Link>
      </div>
    );
  }

  const confirmedPriceDisplay = booking.pricing?.confirmedPence 
    ? formatPenceToGBP(booking.pricing.confirmedPence)
    : formatPenceToGBP(booking.pricing?.estimateMinPence || 0);

  return (
    <div className="space-y-6 text-start">
      
      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E5FBC9] text-xs font-medium text-ink-600 hover:bg-[#DCFAB7] transition-colors duration-150 text-decoration-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-ink-600" />
          <span>Back to Bookings Queue</span>
        </Link>

        <span className="text-xs font-mono font-medium text-ink-500 uppercase">
          ID: {booking.id} • Version: v{booking.version || 1}
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
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#E5FBC9]">
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
              Requested Date: {booking.scheduling?.requestedDate} ({booking.scheduling?.requestedTimeSlot?.toUpperCase()})
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-[#F9FCF5] text-end space-y-1 shrink-0">
            <span className="text-xs font-mono font-medium text-ink-500 uppercase block">CONFIRMED PRICE</span>
            <div className="font-heading font-medium text-2xl text-ink-900">
              {confirmedPriceDisplay}
            </div>
          </div>
        </div>
      </div>

      {/* WORKSPACE MAIN GRID */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SERVICE DETAILS, SCHEDULING, PRICING & TIMELINE */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Service Details Snapshot */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
              Service Specifications
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono text-ink-500 uppercase block">Vertical Category</span>
                <span className="font-medium text-ink-600 capitalize">{booking.categoryId}</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-ink-500 uppercase block">Service ID</span>
                <span className="font-mono text-ink-600 font-medium">{booking.serviceId}</span>
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

            {booking.notes && (
              <div className="pt-3 border-t border-[#E5FBC9] space-y-1">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Customer Booking Notes</span>
                <p className="text-xs text-ink-600 italic bg-[#F9FCF5] p-3 rounded-[18px] leading-relaxed">
                  &quot;{booking.notes}&quot;
                </p>
              </div>
            )}
          </div>

          {/* 2. Scheduling & Slot Confirmation */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-2">
              <h3 className="font-heading text-lg font-medium text-ink-900">Schedule & Time Slot</h3>
              <button
                type="button"
                onClick={() => setScheduleFormOpen(!scheduleFormOpen)}
                className="text-xs font-mono font-medium text-ink-600 underline cursor-pointer inline-flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-ink-600" />
                <span>{scheduleFormOpen ? "Close Edit" : "Edit Schedule"}</span>
              </button>
            </div>

            {scheduleFormOpen ? (
              <form onSubmit={handleScheduleUpdate} className="space-y-3 p-4 rounded-[18px] bg-[#F9FCF5]">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Confirmed Date</label>
                    <input
                      type="date"
                      value={confirmedDate}
                      onChange={(e) => setConfirmedDate(e.target.value)}
                      className="w-full p-2.5 rounded-[18px] bg-white border border-[#E5FBC9] text-xs font-medium text-ink-600"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Time Slot</label>
                    <select
                      value={confirmedSlot}
                      onChange={(e) => setConfirmedSlot(e.target.value as "morning" | "afternoon" | "evening")}
                      className="w-full p-2.5 rounded-[18px] bg-white border border-[#E5FBC9] text-xs font-medium text-ink-600"
                    >
                      <option value="morning">Morning (8am - 12pm)</option>
                      <option value="afternoon">Afternoon (12pm - 4pm)</option>
                      <option value="evening">Evening (4pm - 8pm)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Exact Time Note (Optional)</label>
                  <input
                    type="text"
                    value={confirmedExactTime}
                    onChange={(e) => setConfirmedExactTime(e.target.value)}
                    placeholder="e.g. 10:30 AM arrival confirmed with team"
                    className="w-full p-2.5 rounded-[18px] bg-white border border-[#E5FBC9] text-xs font-medium text-ink-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingSchedule}
                  className="px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer"
                >
                  {submittingSchedule ? "Saving..." : "Confirm Schedule Update"}
                </button>
              </form>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono">
                <div className="space-y-1">
                  <span className="text-xs text-ink-500 uppercase block">Customer Requested</span>
                  <div className="font-medium text-ink-600">{booking.scheduling?.requestedDate}</div>
                  <div className="text-xs text-ink-500 uppercase">{booking.scheduling?.requestedTimeSlot}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-ink-500 uppercase block">Admin Confirmed</span>
                  <div className="font-medium text-ink-600">
                    {booking.scheduling?.confirmedDate || "Pending Confirmation"}
                  </div>
                  {booking.scheduling?.confirmedTimeSlot && (
                    <div className="text-xs text-ink-500 uppercase">
                      {booking.scheduling.confirmedTimeSlot} {booking.scheduling.confirmedTimeExact ? `(${booking.scheduling.confirmedTimeExact})` : ""}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Pricing Lifecycle & Adjustments */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-2">
              <h3 className="font-heading text-lg font-medium text-ink-900">Commercial Pricing & Adjustments</h3>
              <button
                type="button"
                onClick={() => setPriceFormOpen(!priceFormOpen)}
                className="text-xs font-mono font-medium text-ink-600 underline cursor-pointer inline-flex items-center gap-1"
              >
                <PoundSterling className="w-3.5 h-3.5 text-ink-600" />
                <span>{priceFormOpen ? "Close Edit" : "Adjust Price"}</span>
              </button>
            </div>

            {priceFormOpen ? (
              <form onSubmit={handlePriceAdjustment} className="space-y-3 p-4 rounded-[18px] bg-[#F9FCF5]">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-ink-500 uppercase block">New Price (£ GBP)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPricePounds}
                      onChange={(e) => setNewPricePounds(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-[18px] bg-white border border-[#E5FBC9] text-xs font-medium text-ink-600"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Structured Reason *</label>
                    <select
                      value={priceReason}
                      onChange={(e) => setPriceReason(e.target.value as PriceChangeReason)}
                      className="w-full p-2.5 rounded-[18px] bg-white border border-[#E5FBC9] text-xs font-medium text-ink-600"
                    >
                      <option value="scope_differed_from_booking">Scope Differed From Booking</option>
                      <option value="additional_time">Additional Time Required</option>
                      <option value="additional_work">Additional Work Requested</option>
                      <option value="customer_requested_extras">Customer Requested Extras</option>
                      <option value="reduced_time">Reduced Work Duration</option>
                      <option value="discount_goodwill">Discount / Goodwill Adjustment</option>
                      <option value="correction">Correction / Typo</option>
                      <option value="other">Other Reason</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Explanation / Audit Context</label>
                  <input
                    type="text"
                    value={priceDetails}
                    onChange={(e) => setPriceDetails(e.target.value)}
                    placeholder="Provide details explaining the price adjustment..."
                    className="w-full p-2.5 rounded-[18px] bg-white border border-[#E5FBC9] text-xs font-medium text-ink-600"
                    required={priceReason === "other"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingPrice}
                  className="px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer"
                >
                  {submittingPrice ? "Recording..." : "Save Price Adjustment & Record Audit"}
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono">
                  <div className="p-3.5 rounded-[18px] bg-[#F9FCF5] space-y-1">
                    <span className="text-xs text-ink-500 uppercase block">INITIAL WEBSITE ESTIMATE</span>
                    <div className="font-heading font-medium text-lg text-ink-900">
                      {formatPenceToGBP(booking.pricing?.estimateMinPence || 0)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-[18px] bg-[#DCFAB7] border border-[#99D055] space-y-1">
                    <span className="text-xs text-ink-600 uppercase font-medium block">CONFIRMED FINAL PRICE</span>
                    <div className="font-heading font-medium text-xl text-ink-900">
                      {confirmedPriceDisplay}
                    </div>
                  </div>
                </div>

                {/* Price History Log */}
                {booking.pricing?.priceHistory && booking.pricing.priceHistory.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#E5FBC9]">
                    <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Adjustment History Log</span>
                    <div className="space-y-2">
                      {booking.pricing.priceHistory.map((rec, idx) => (
                        <div key={idx} className="p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-mono space-y-1">
                          <div className="flex justify-between items-center font-medium text-ink-600">
                            <span>{formatPenceToGBP(rec.oldPence)} → {formatPenceToGBP(rec.newPence)}</span>
                            <span className="text-[10px] text-ink-500">{rec.actorName} ({rec.reason.replaceAll("_", " ")})</span>
                          </div>
                          {rec.reasonDetails && <p className="text-ink-500 italic">{rec.reasonDetails}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Timeline Events Feed */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
              Booking Events Timeline
            </h3>

            {events.length > 0 ? (
              <div className="relative pl-6 space-y-4 border-l-2 border-[#E5FBC9]">
                {events.map((evt) => (
                  <div key={evt.id} className="relative space-y-1 text-start">
                    <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#1F3A00] border-2 border-white shrink-0" />
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-ink-600">{evt.summary}</span>
                      <span className="text-[10px] font-mono text-ink-500">
                        {evt.createdAt ? formatUKDate(typeof evt.createdAt === "string" ? new Date(evt.createdAt) : (evt.createdAt as unknown as Date)) : "Recent"}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-ink-500">
                      Actor: {evt.actorName} ({evt.actorRole}) • Visibility: {evt.visibility}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-500 italic">No event history recorded yet.</p>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: STATUS TRANSITION CONTROLS, CUSTOMER SNAPSHOT & INTERNAL NOTES */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Status Transition Actions */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
              Status Transition Control
            </h3>

            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Target Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as BookingStatus)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055]"
                >
                  <option value="awaiting_confirmation">Awaiting Confirmation</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {(targetStatus === "completed" || targetStatus === "cancelled" || booking.status === "completed" || booking.status === "cancelled") && (
                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Transition Reason *</label>
                  <input
                    type="text"
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="Reason for cancellation or status override..."
                    className="w-full p-2.5 rounded-[18px] bg-[#F9FCF5] text-xs text-ink-600"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submittingStatus}
                className="w-full py-3 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer border border-[#E5FBC9]"
              >
                {submittingStatus ? "Updating..." : `Transition to ${targetStatus.replace("_", " ").toUpperCase()}`}
              </button>
            </form>
          </div>

          {/* 2. Customer Contact Snapshot */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
              Customer Contact Snapshot
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-ink-500 shrink-0" />
                <span className="font-medium text-ink-600">{booking.customerSnapshot?.fullName}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-ink-500 shrink-0" />
                <a href={`mailto:${booking.customerSnapshot?.email}`} className="text-xs font-mono text-ink-600 hover:underline truncate">
                  {booking.customerSnapshot?.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-ink-500 shrink-0" />
                <a href={`tel:${booking.customerSnapshot?.phone}`} className="text-xs font-mono font-medium text-ink-600 hover:underline">
                  {booking.customerSnapshot?.phone}
                </a>
              </div>

              <div className="pt-2 border-t border-[#E5FBC9] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-ink-500 uppercase">
                  <MapPin className="w-3.5 h-3.5 text-ink-600 shrink-0" />
                  <span>Service Address</span>
                </div>
                <p className="text-xs text-ink-600 font-medium leading-relaxed">
                  {booking.address?.addressLine1}{booking.address?.addressLine2 ? `, ${booking.address.addressLine2}` : ""}<br />
                  {booking.address?.city}, <strong className="text-ink-600 font-medium">{booking.address?.postcode}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* 3. Private Internal Notes (Strictly Admin Access Only) */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-2">
              <h3 className="font-heading text-lg font-medium text-ink-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#1F3A00]" />
                <span>Internal Notes</span>
              </h3>
              <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Admin Only</span>
            </div>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add private operational note (hidden from customer)..."
                rows={3}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055] resize-none"
              />
              <button
                type="submit"
                disabled={submittingNote || !newNote.trim()}
                className="w-full py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3 h-3 text-white" />
                <span>Add Internal Note</span>
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {internalNotes.length > 0 ? (
                internalNotes.map((n) => (
                  <div key={n.id} className="p-3 rounded-[18px] bg-[#F9FCF5] text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-ink-500">
                      <span className="font-medium text-ink-600">{n.authorName}</span>
                      <span>{n.createdAt ? formatUKDate(typeof n.createdAt === "string" ? new Date(n.createdAt) : (n.createdAt as unknown as Date)) : "Recent"}</span>
                    </div>
                    <p className="text-ink-600 font-normal leading-relaxed">{n.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-ink-500 italic">No internal notes added yet.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
