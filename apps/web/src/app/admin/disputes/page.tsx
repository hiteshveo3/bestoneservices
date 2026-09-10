"use client";

import React, { useState, useEffect } from "react";
import { subscribeAdminDisputes } from "@/lib/repositories/reviews";
import { type DisputeItem, type DisputeStatus } from "@/types/review";
import { Spinner } from "@/components/ui/spinner";
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | "all">("all");

  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);
  const [newStatus, setNewStatus] = useState<DisputeStatus>("re_clean_scheduled");
  const [resolutionNotes, setResolutionNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const unSub = subscribeAdminDisputes(statusFilter, (data) => {
      if (!active) return;
      setDisputes(data);
      setLoading(false);
    });

    return () => {
      active = false;
      unSub();
    };
  }, [statusFilter]);

  const handleResolveDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/disputes/${selectedDispute.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          resolutionNotes: resolutionNotes.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Failed to update dispute resolution");
      } else {
        setSuccessMsg(`Guarantee claim ${selectedDispute.id} updated to ${newStatus.toUpperCase()}.`);
        setSelectedDispute(null);
      }
    } catch {
      setErrorMsg("Network error updating dispute status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER BAR */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5FBC9] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">48-HOUR RE-CLEAN GUARANTEE & DISPUTES</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Dispute Resolution Workspace</h1>
            <p className="text-sm text-ink-500">Manage customer guarantee claims, review photo evidence, and dispatch free re-clean appointments</p>
          </div>
        </div>

        {/* STATUS TABS */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { id: "all", label: "All Claims", count: disputes.length },
            { id: "open", label: "Open Claims", count: disputes.filter((d) => d.status === "open").length },
            { id: "under_review", label: "Under Review", count: disputes.filter((d) => d.status === "under_review").length },
            { id: "re_clean_scheduled", label: "Re-Clean Scheduled", count: disputes.filter((d) => d.status === "re_clean_scheduled").length },
            { id: "resolved", label: "Resolved", count: disputes.filter((d) => d.status === "resolved").length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as DisputeStatus | "all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ statusFilter === tab.id ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* FEEDBACK ALERTS */}
      {successMsg && (
        <div className="p-4 rounded-[18px] bg-success-50 border border-success-500 text-success-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* DISPUTES LIST */}
      {loading ? (
        <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Loading guarantee claims & disputes...</p>
        </div>
      ) : disputes.length > 0 ? (
        <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <div className="divide-y divide-bone-300">
            {disputes.map((dsp) => (
              <div key={dsp.id} className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-xs text-ink-600">{dsp.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-danger-50 text-danger-900 text-[10px] font-mono font-medium uppercase">
                      {dsp.disputeType.replace(/_/g, " ")}
                    </span>
                  </div>

                  <p className="font-heading font-medium text-sm text-ink-900">Booking #{dsp.bookingReference}</p>
                  <p className="text-xs text-ink-500">Customer: {dsp.customerName} ({dsp.customerEmail})</p>
                  <p className="text-xs text-ink-600 italic bg-white p-2.5 rounded-[18px] border border-[#E5FBC9] mt-1 max-w-xl">
                    &ldquo;{dsp.description}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#F9FCF5] text-ink-600 text-xs font-mono font-medium uppercase">
                    {dsp.status.replace(/_/g, " ")}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDispute(dsp);
                      setNewStatus(dsp.status);
                      setResolutionNotes(dsp.resolutionNotes || "");
                    }}
                    className="px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer transition-colors duration-150 border-none border border-[#E5FBC9]"
                  >
                    Resolve Claim →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#E5FBC9]">
          <ShieldAlert className="w-10 h-10 text-[#1F3A00] mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">No Active Guarantee Claims</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            There are currently no guarantee claims or disputes matching your selected status.
          </p>
        </div>
      )}

      {/* MODAL: RESOLVE DISPUTE */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-ink-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] max-w-md w-full p-6 sm:p-8 space-y-6 text-start border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <div>
                <span className="text-xs font-mono font-medium text-ink-500">GUARANTEE RESOLUTION</span>
                <h3 className="font-heading font-medium text-lg text-ink-900">Resolve Claim {selectedDispute.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="text-xs font-medium text-ink-500 hover:text-ink-600 cursor-pointer border-none bg-transparent"
              >
                ✕ Close
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleResolveDispute} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Resolution Decision *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as DisputeStatus)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                >
                  <option value="under_review">Under Investigation</option>
                  <option value="re_clean_scheduled">Dispatch Free Re-Clean Appointment</option>
                  <option value="resolved">Resolved with Goodwill Credit</option>
                  <option value="rejected">Reject Claim (Out of 48h Window)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Resolution Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Explain resolution findings and re-clean dispatch details..."
                  rows={3}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer disabled:opacity-50 transition-colors duration-150 border border-[#E5FBC9]"
              >
                {submitting ? "Updating Resolution..." : "Confirm Resolution Decision →"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
