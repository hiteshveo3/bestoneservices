"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { subscribeAdminInvoices } from "@/lib/repositories/invoices";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type InvoiceItem, type InvoicePaymentStatus, type PaymentMethod } from "@/types/invoice";
import { Spinner } from "@/components/ui/spinner";
import { 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";

export default function AdminInvoicesQueuePage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<InvoicePaymentStatus | "all">("all");

  // Offline Payment Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [paymentAmountPounds, setPaymentAmountPounds] = useState<number>(50);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_completion");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const unSub = subscribeAdminInvoices(statusFilter, (data) => {
      if (!active) return;
      setInvoices(data);
      setLoading(false);
    });

    return () => {
      active = false;
      unSub();
    };
  }, [statusFilter]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || paymentAmountPounds <= 0) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/payments/offline/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          paymentAmountPounds,
          paymentMethod,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Failed to record offline payment");
      } else {
        setSuccessMsg(json.message || "Offline payment recorded successfully.");
        setSelectedInvoice(null);
      }
    } catch {
      setErrorMsg("Network error recording offline payment");
    } finally {
      setSubmitting(false);
    }
  };

  // Aggregate Financial Metrics
  const totalInvoicedPence = invoices.reduce((acc, inv) => acc + (inv.totalPence || 0), 0);
  const totalPaidPence = invoices.reduce((acc, inv) => acc + (inv.depositPaidPence || 0), 0);
  const totalOutstandingPence = invoices.reduce((acc, inv) => acc + (inv.balanceDuePence || 0), 0);

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER & METRICS */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-6 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">FINANCIAL & INVOICING WORKSPACE</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Invoices & Receivables Queue</h1>
            <p className="text-sm text-ink-500">Manage tax invoices, record cash/BACS payments, and monitor outstanding balances</p>
          </div>
        </div>

        {/* METRICS STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E5FBC9] pt-4">
          <div className="p-4 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
            <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Total Invoiced Revenue</span>
            <p className="font-heading font-medium text-xl text-ink-900">
              {formatPenceToGBP(totalInvoicedPence)}
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
            <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Total Cash/Card Collected</span>
            <p className="font-heading font-medium text-xl text-[#1F3A00]">
              {formatPenceToGBP(totalPaidPence)}
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
            <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Outstanding Receivables</span>
            <p className="font-heading font-medium text-xl text-danger-500">
              {formatPenceToGBP(totalOutstandingPence)}
            </p>
          </div>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#E5FBC9] pt-4">
          {[
            { id: "all", label: "All Invoices", count: invoices.length },
            { id: "paid", label: "Paid in Full", count: invoices.filter((i) => i.paymentStatus === "paid").length },
            { id: "partially_paid", label: "Deposit Paid", count: invoices.filter((i) => i.paymentStatus === "partially_paid").length },
            { id: "unpaid", label: "Unpaid / Outstanding", count: invoices.filter((i) => i.paymentStatus === "unpaid").length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as InvoicePaymentStatus | "all")}
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

      {/* INVOICES QUEUE LIST */}
      {loading ? (
        <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Loading Firestore tax invoices...</p>
        </div>
      ) : invoices.length > 0 ? (
        <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <div className="divide-y divide-bone-300">
            {invoices.map((inv) => (
              <div key={inv.id} className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-xs text-ink-600">{inv.reference}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase ${
                      inv.paymentStatus === "paid" ? "bg-[#1F3A00] text-white" : "bg-danger-50 text-danger-900"
                    }`}>
                      {inv.paymentStatus.replace("_", " ")}
                    </span>
                  </div>

                  <p className="font-heading font-medium text-sm text-ink-900">Booking #{inv.bookingReference}</p>
                  <p className="text-xs text-ink-500">
                    Customer: {inv.customerName} ({inv.customerEmail})
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-end font-mono">
                    <span className="text-[10px] text-ink-500 block">TOTAL: {formatPenceToGBP(inv.totalPence)}</span>
                    <span className="font-heading font-medium text-sm text-ink-900 block">
                      DUE: {formatPenceToGBP(inv.balanceDuePence || 0)}
                    </span>
                  </div>

                  {inv.paymentStatus !== "paid" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setPaymentAmountPounds((inv.balanceDuePence || inv.totalPence) / 100);
                      }}
                      className="px-3.5 py-2 rounded-full bg-[#F9FCF5] text-ink-600 hover:bg-[#DCFAB7] text-xs font-medium border-none cursor-pointer"
                    >
                      Record Payment
                    </button>
                  )}

                  <Link
                    href={`/invoice/${inv.reference}`}
                    className="px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] hover:bg-[#2d5004] text-xs font-medium text-decoration-none transition-colors duration-150 inline-flex items-center gap-1 border border-[#E5FBC9]"
                  >
                    <span>View Invoice</span>
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
          <h3 className="font-heading text-lg font-medium text-ink-900">No Invoices Found</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            There are currently no tax invoices matching your selected status filter.
          </p>
        </div>
      )}

      {/* MODAL: RECORD OFFLINE PAYMENT */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-ink-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] max-w-md w-full p-6 sm:p-8 space-y-6 text-start border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <div>
                <span className="text-xs font-mono font-medium text-ink-500">LOG PAYMENT</span>
                <h3 className="font-heading font-medium text-lg text-ink-900">Record Offline Payment</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
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

            <div className="p-4 rounded-[18px] bg-white space-y-1 text-xs font-mono border border-[#E5FBC9]">
              <span className="text-ink-500">Invoice Reference:</span>
              <p className="font-medium text-ink-600">{selectedInvoice.reference}</p>
              <span className="text-ink-500 block pt-1">Current Balance Due: {formatPenceToGBP(selectedInvoice.balanceDuePence || 0)}</span>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Payment Amount (£ GBP) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmountPounds}
                  onChange={(e) => setPaymentAmountPounds(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-sm font-medium text-ink-600 border-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                >
                  <option value="cash_on_completion">Cash on Completion</option>
                  <option value="bank_transfer">Direct BACS Bank Transfer</option>
                  <option value="card_terminal">On-Site Card Terminal</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || paymentAmountPounds <= 0}
                className="w-full py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer disabled:opacity-50 transition-colors duration-150 border border-[#E5FBC9]"
              >
                {submitting ? "Logging Payment..." : "Record Payment & Update Invoice →"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
