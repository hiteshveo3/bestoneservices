"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { subscribeAdminBookings } from "@/lib/repositories/bookings";
import { subscribeAdminStaff } from "@/lib/repositories/staff";
import { isStaffCapacityExceeded } from "@/lib/dispatch-domain";
import { type BookingItem } from "@/types/booking";
import { type StaffMemberItem } from "@/types/staff";
import { Spinner } from "@/components/ui/spinner";
import { 
  AlertCircle, 
  CheckCircle2, 
  Users
} from "lucide-react";

export default function AdminDispatchCalendarPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [staff, setStaff] = useState<StaffMemberItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState<"all" | "cleaning" | "pest" | "gardening" | "removals">("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  const [assigning, setAssigning] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const unSubBookings = subscribeAdminBookings({ status: "all" }, (data) => {
      if (!active) return;
      setBookings(data);
      setLoading(false);
    });

    const unSubStaff = subscribeAdminStaff(categoryFilter, (data) => {
      if (active) setStaff(data);
    });

    return () => {
      active = false;
      unSubBookings();
      unSubStaff();
    };
  }, [categoryFilter]);

  const filteredBookings = bookings.filter((b) => categoryFilter === "all" || b.categoryId === categoryFilter);
  const unassignedBookings = filteredBookings.filter((b) => !b.assignedStaffId || b.dispatchStatus === "unassigned");

  const handleAssignStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !selectedStaffId) return;

    const targetStaff = staff.find((s) => s.id === selectedStaffId);
    if (!targetStaff) return;

    setAssigning(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/dispatch`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: targetStaff.id,
          staffName: targetStaff.name,
          dispatchStatus: "assigned",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to assign staff member");
      } else {
        setActionSuccess(`Technician ${targetStaff.name} assigned to booking ${selectedBooking.reference}.`);
        setSelectedBooking(null);
      }
    } catch {
      setActionError("Network error assigning staff member");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER BAR */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">DISPATCH & SCHEDULING WORKSPACE</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Dispatch Calendar & Field Teams</h1>
            <p className="text-sm text-ink-500">Assign field technicians, monitor daily team capacity, and track job dispatch status</p>
          </div>

          <Link
            href="/admin/staff"
            className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs hover:bg-[#2d5004] transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer text-decoration-none border border-[#E5FBC9]"
          >
            <Users className="w-4 h-4 text-white" />
            <span>Manage Staff Roster</span>
          </Link>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5FBC9]">
          {[
            { id: "all", label: "All Categories" },
            { id: "cleaning", label: "Cleaning Services" },
            { id: "pest", label: "Pest Control" },
            { id: "gardening", label: "Gardening & Clearance" },
            { id: "removals", label: "Removals & Storage" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id as "all" | "cleaning" | "pest" | "gardening" | "removals")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ categoryFilter === tab.id ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
            >
              {tab.label}
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

      {/* DISPATCH BOARD GRID */}
      {loading ? (
        <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Loading dispatch calendar & staff roster...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* UNASSIGNED JOBS QUEUE (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <span className="text-xs font-mono font-medium uppercase text-ink-500">UNASSIGNED QUEUE</span>
              <span className="px-2.5 py-0.5 rounded-full bg-warning-50 text-warning-900 text-[10px] font-mono font-medium">
                {unassignedBookings.length} PENDING
              </span>
            </div>

            {unassignedBookings.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {unassignedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-[18px] bg-white space-y-2 border border-[#E5FBC9] text-xs font-mono"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-ink-600">{b.reference}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#F9FCF5] text-[10px] text-ink-500 uppercase font-medium">
                        {b.categoryId}
                      </span>
                    </div>

                    <p className="font-heading font-medium text-sm text-ink-900">{b.serviceNameSnapshot}</p>
                    <p className="text-ink-500">Date: {b.scheduling?.requestedDate || "TBD"}</p>
                    <p className="text-ink-500">Address: {b.address?.postcode || ""}</p>

                    <button
                      type="button"
                      onClick={() => setSelectedBooking(b)}
                      className="w-full py-2 rounded-[18px] bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer transition-colors duration-150 border-none"
                    >
                      Assign Staff Lead →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#1F3A00] mx-auto" />
                <p className="text-xs font-medium text-ink-600">All appointments assigned!</p>
              </div>
            )}
          </div>

          {/* STAFF ROSTER & CAPACITY SCHEDULE (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <span className="text-xs font-mono font-medium uppercase text-ink-500">FIELD STAFF CAPACITY SCHEDULER</span>
              <span className="text-xs font-mono text-ink-500">{staff.length} Technicians Active</span>
            </div>

            {staff.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {staff.map((stf) => {
                  const assignedJobs = bookings.filter((b) => b.assignedStaffId === stf.id);
                  const capacityReached = isStaffCapacityExceeded(assignedJobs.length, stf.dailyCapacityCount);

                  return (
                    <div
                      key={stf.id}
                      className={`p-5 rounded-[18px] border space-y-3 ${
                        capacityReached ? "bg-warning-50/50 border-warning-500" : "bg-white border-[#E5FBC9]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-heading font-medium text-base text-ink-900">{stf.name}</h3>
                          <span className="text-[10px] font-mono uppercase text-ink-500">{stf.role.replace("_", " ")}</span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium ${
                          capacityReached ? "bg-warning-500 text-warning-900" : "bg-success-50 text-success-900"
                        }`}>
                          {assignedJobs.length}/{stf.dailyCapacityCount || 3} JOBS
                        </span>
                      </div>

                      {/* Jobs assigned to this technician */}
                      <div className="space-y-1.5 pt-2 border-t border-[#E5FBC9]">
                        <span className="text-[10px] font-mono font-medium text-ink-500 uppercase block">Assigned Jobs</span>
                        {assignedJobs.length > 0 ? (
                          assignedJobs.map((job) => (
                            <div key={job.id} className="p-2 rounded-[18px] bg-white text-[11px] font-mono flex justify-between items-center border border-[#E5FBC9]">
                              <span className="font-medium text-ink-600">{job.reference}</span>
                              <span className="text-ink-500">{job.scheduling?.requestedDate || ""}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] font-mono text-ink-500">No jobs assigned for today.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center space-y-3">
                <Users className="w-8 h-8 text-[#1F3A00] mx-auto" />
                <p className="text-xs font-medium text-ink-600">No staff members configured in roster.</p>
                <Link href="/admin/staff" className="px-4 py-2 rounded-full bg-[#1F3A00] text-white text-xs font-medium inline-block text-decoration-none">
                  Add First Staff Member
                </Link>
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODAL: ASSIGN STAFF TO BOOKING */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-ink-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] max-w-md w-full p-6 sm:p-8 space-y-6 text-start border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <div>
                <span className="text-xs font-mono font-medium text-ink-500 uppercase">DISPATCH ASSIGNMENT</span>
                <h3 className="font-heading font-medium text-lg text-ink-900">Assign Staff Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-xs font-medium text-ink-500 hover:text-ink-600 cursor-pointer border-none bg-transparent"
              >
                × Close
              </button>
            </div>

            {actionError && (
              <div className="p-3.5 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="p-4 rounded-[18px] bg-white space-y-1 text-xs font-mono border border-[#E5FBC9]">
              <span className="text-ink-500">Booking Reference:</span>
              <p className="font-medium text-ink-600">{selectedBooking.reference} ({selectedBooking.serviceNameSnapshot})</p>
            </div>

            <form onSubmit={handleAssignStaff} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Select Staff Member *</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                  required
                >
                  <option value="">-- Choose Field Lead --</option>
                  {staff.map((stf) => (
                    <option key={stf.id} value={stf.id}>
                      {stf.name} ({stf.role.replace("_", " ")})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={assigning || !selectedStaffId}
                className="w-full py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer disabled:opacity-50 transition-colors duration-150 border border-[#E5FBC9]"
              >
                {assigning ? "Assigning Staff Lead..." : "Confirm Staff Assignment →"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

