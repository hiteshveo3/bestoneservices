"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { type QueryDocumentSnapshot } from "firebase/firestore";
import { 
  fetchAdminBookingsPage, 
  fetchBookingCounts 
} from "@/lib/repositories/bookings";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { Spinner } from "@/components/ui/spinner";
import { 
  type BookingItem, 
  type BookingStatus, 
  type BookingCategory 
} from "@/types/booking";
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  Database
} from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  // Pagination & Cursor State
  const [lastDocStack, setLastDocStack] = useState<QueryDocumentSnapshot[]>([]);
  const [currentLastDoc, setCurrentLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<BookingCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadPage = useCallback(async (
    status: BookingStatus | "all",
    category: BookingCategory | "all",
    startAfterDoc: QueryDocumentSnapshot | null = null
  ) => {
    const res = await fetchAdminBookingsPage({
      status,
      category,
      limitCount: 10,
      lastDoc: startAfterDoc,
    });
    setBookings(res.bookings);
    setCurrentLastDoc(res.lastDoc);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetchBookingCounts().then((c) => {
      if (active) setCounts(c);
    });

    fetchAdminBookingsPage({
      status: statusFilter,
      category: categoryFilter,
      limitCount: 10,
      lastDoc: null,
    }).then((res) => {
      if (!active) return;
      setBookings(res.bookings);
      setCurrentLastDoc(res.lastDoc);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [statusFilter, categoryFilter, loadPage]);

  const handleStatusFilterChange = (newStatus: BookingStatus | "all") => {
    setLoading(true);
    setStatusFilter(newStatus);
    setPageIndex(0);
    setLastDocStack([]);
  };

  const handleCategoryFilterChange = (newCategory: BookingCategory | "all") => {
    setLoading(true);
    setCategoryFilter(newCategory);
    setPageIndex(0);
    setLastDocStack([]);
  };

  const handleNextPage = () => {
    if (!currentLastDoc) return;
    setLoading(true);
    setLastDocStack((prev) => [...prev, currentLastDoc]);
    setPageIndex((prev) => prev + 1);
    loadPage(statusFilter, categoryFilter, currentLastDoc);
  };

  const handlePrevPage = () => {
    if (pageIndex === 0) return;
    setLoading(true);
    const newStack = [...lastDocStack];
    newStack.pop();
    const prevDoc = newStack.length > 0 ? newStack[newStack.length - 1] : null;
    setLastDocStack(newStack);
    setPageIndex((prev) => prev - 1);
    loadPage(statusFilter, categoryFilter, prevDoc);
  };

  // Client-side queue search filtering on loaded page items
  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.reference.toLowerCase().includes(q) ||
      b.customerSnapshot?.fullName.toLowerCase().includes(q) ||
      b.customerSnapshot?.email.toLowerCase().includes(q) ||
      b.customerSnapshot?.phone.includes(q) ||
      b.address?.postcode.toLowerCase().includes(q) ||
      b.serviceNameSnapshot.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "new":
        return <span className="px-2.5 py-1 rounded-full bg-info-50 text-info-900 text-xs font-mono font-medium uppercase">New</span>;
      case "awaiting_confirmation":
        return <span className="px-2.5 py-1 rounded-full bg-warning-50 text-warning-900 text-xs font-mono font-medium uppercase">Awaiting Conf.</span>;
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
    <div className="space-y-6 text-start">
      
      {/* HEADER & QUICK ACTIONS */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">OPERATIONS WORKSPACE</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Booking Queue Management</h1>
            <p className="text-sm text-ink-500">Search, confirm slots, adjust pricing, and track live customer appointments</p>
          </div>

          <Link
            href="/admin/bookings/new"
            className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer text-decoration-none border border-[#E5FBC9]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create Enquiry Booking</span>
          </Link>
        </div>

        {/* QUICK STATUS PILLS */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5FBC9]">
          {[
            { id: "all", label: "All Bookings", count: counts.total || 0 },
            { id: "new", label: "New", count: counts.new || 0 },
            { id: "awaiting_confirmation", label: "Awaiting Conf.", count: counts.awaiting_confirmation || 0 },
            { id: "confirmed", label: "Confirmed", count: counts.confirmed || 0 },
            { id: "scheduled", label: "Scheduled", count: counts.scheduled || 0 },
            { id: "completed", label: "Completed", count: counts.completed || 0 },
            { id: "cancelled", label: "Cancelled", count: counts.cancelled || 0 },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => handleStatusFilterChange(pill.id as BookingStatus | "all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ statusFilter === pill.id ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-[18px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#E5FBC9]">
        
        {/* Search Field with Labeling */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-ink-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter queue by ref, name, email, postcode..."
            className="w-full pl-10 pr-4 py-2 rounded-[18px] bg-[#F9FCF5] text-sm font-medium text-ink-600 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-[#99D055] border-none"
          />
        </div>

        {/* Category Filter & Cursor Indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9FCF5] text-xs font-mono text-ink-500">
            <Database className="w-3.5 h-3.5 text-ink-600" />
            <span>Page {pageIndex + 1}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-ink-500 uppercase shrink-0">
            <Filter className="w-3.5 h-3.5 text-ink-600" />
            <span>Vertical:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value as BookingCategory | "all")}
            className="px-3.5 py-2 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#99D055]"
          >
            <option value="all">All Categories</option>
            <option value="cleaning">Cleaning</option>
            <option value="pest">Pest Control</option>
            <option value="gardening">Gardening</option>
            <option value="removals">Removals</option>
          </select>
        </div>

      </div>

      {/* BOOKINGS CONTENT */}
      {loading ? (
        <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Fetching paginated Firestore bookings...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <>
          {/* DESKTOP OPERATIONAL TABLE */}
          <div className="hidden md:block bg-white rounded-[18px] overflow-hidden border border-[#E5FBC9]">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#E5FBC9] text-xs font-mono font-medium uppercase text-ink-500">
                  <th className="py-4 px-6 text-start">Reference</th>
                  <th className="py-4 px-6 text-start">Version</th>
                  <th className="py-4 px-6 text-start">Customer</th>
                  <th className="py-4 px-6 text-start">Service Scope</th>
                  <th className="py-4 px-6 text-start">Schedule</th>
                  <th className="py-4 px-6 text-start">Postcode</th>
                  <th className="py-4 px-6 text-start">Estimate</th>
                  <th className="py-4 px-6 text-start">Status</th>
                  <th className="py-4 px-6 text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bone-300 text-sm">
                {filteredBookings.map((b) => {
                  const displayPrice = b.pricing?.confirmedPence 
                    ? formatPenceToGBP(b.pricing.confirmedPence)
                    : formatPenceToGBP(b.pricing?.estimateMinPence || 0);

                  return (
                    <tr key={b.id} className="hover:bg-white transition-colors duration-150">
                      <td className="py-4 px-6 font-mono font-medium text-ink-600">
                        <Link href={`/admin/bookings/${b.id}`} className="text-ink-600 hover:underline text-decoration-none">
                          {b.reference}
                        </Link>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-ink-500">
                        v{b.version || 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-ink-500">{b.customerSnapshot?.fullName || "Guest Customer"}</div>
                        <div className="text-xs text-ink-500">{b.customerSnapshot?.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-ink-600">{b.serviceNameSnapshot}</div>
                        <div className="text-xs font-mono text-ink-500 capitalize">{b.categoryId}</div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs">
                        <div className="font-medium text-ink-600">
                          {b.scheduling?.confirmedDate || b.scheduling?.requestedDate}
                        </div>
                        <div className="text-ink-500 uppercase">
                          {b.scheduling?.confirmedTimeSlot || b.scheduling?.requestedTimeSlot}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs font-medium text-ink-600">
                        {b.address?.postcode}
                      </td>
                      <td className="py-4 px-6 font-heading font-medium text-ink-900">
                        {displayPrice}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(b.status)}
                      </td>
                      <td className="py-4 px-6 text-end">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="px-3 py-1.5 rounded-full bg-[#F9FCF5] text-ink-600 hover:bg-[#DCFAB7] text-xs font-medium text-decoration-none inline-flex items-center gap-1 shrink-0"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3.5 h-3.5 text-ink-600" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST VIEW */}
          <div className="md:hidden space-y-3">
            {filteredBookings.map((b) => {
              const displayPrice = b.pricing?.confirmedPence 
                ? formatPenceToGBP(b.pricing.confirmedPence)
                : formatPenceToGBP(b.pricing?.estimateMinPence || 0);

              return (
                <div key={b.id} className="bg-white rounded-[18px] p-5 space-y-3 text-start border-l-4 border-l-blue-500 border border-[#E5FBC9]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-sm text-ink-600">{b.reference} (v{b.version || 1})</span>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="space-y-1">
                    <div className="font-heading font-medium text-base text-ink-900">{b.serviceNameSnapshot}</div>
                    <div className="text-xs text-ink-500">Customer: {b.customerSnapshot?.fullName}</div>
                  </div>

                  <div className="pt-2 border-t border-[#E5FBC9] flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-ink-500 block">{b.scheduling?.requestedDate}</span>
                      <span className="font-medium text-ink-600">{b.address?.postcode}</span>
                    </div>
                    <div className="text-end">
                      <span className="font-heading font-medium text-base text-ink-900 block">{displayPrice}</span>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-xs font-medium text-ink-600 underline text-decoration-none"
                      >
                        Open Workspace →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CURSOR PAGINATION NAVIGATION CONTROLS */}
          <div className="bg-white rounded-[18px] p-4 flex items-center justify-between border border-[#E5FBC9]">
            <button
              type="button"
              disabled={pageIndex === 0}
              onClick={handlePrevPage}
              className="px-4 py-2 rounded-full bg-[#F9FCF5] text-ink-600 font-medium text-xs disabled:opacity-40 flex items-center gap-1 cursor-pointer border-none"
            >
              <ChevronLeft className="w-4 h-4 text-ink-600" />
              <span>Previous Page</span>
            </button>

            <span className="text-xs font-mono font-medium text-ink-500">
              Page {pageIndex + 1} ({filteredBookings.length} items)
            </span>

            <button
              type="button"
              disabled={!currentLastDoc || bookings.length < 10}
              onClick={handleNextPage}
              className="px-4 py-2 rounded-full bg-[#1F3A00] text-white font-medium text-xs disabled:opacity-40 flex items-center gap-1 cursor-pointer border-none"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </>
      ) : (
        /* CLEAN EMPTY STATE */
        <div className="bg-white rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#E5FBC9]">
          <Calendar className="w-10 h-10 text-[#1F3A00] mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">No Bookings Found</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            No active website bookings match your selected status and category filters.
          </p>
          <Link
            href="/admin/bookings/new"
            className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none"
          >
            Create Manual Booking
          </Link>
        </div>
      )}

    </div>
  );
}

