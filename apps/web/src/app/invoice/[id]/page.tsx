"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { fetchInvoiceDetail } from "@/lib/repositories/invoices";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type InvoiceItem } from "@/types/invoice";
import { Spinner } from "@/components/ui/spinner";
import { 
  AlertCircle, 
  Printer, 
  CreditCard, 
  Building2
} from "lucide-react";

export default function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const invoiceId = resolvedParams.id;

  const [invoice, setInvoice] = useState<InvoiceItem | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [payingStripe, setPayingStripe] = useState(false);
  const [stripeNotice, setStripeNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      const token = new URLSearchParams(window.location.search).get("token")
        ?? new URLSearchParams(window.location.hash.slice(1)).get("token");
      setAccessToken(token);
      const data = await fetchInvoiceDetail(invoiceId, token);
      if (active) {
        setInvoice(data);
        setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [invoiceId]);

  const handlePayStripe = async (payType: "deposit" | "full_balance") => {
    setPayingStripe(true);
    setStripeNotice(null);

    try {
      const res = await fetch("/api/payments/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { "X-Resource-Token": accessToken } : {}),
        },
        body: JSON.stringify({ invoiceId, payType }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.requiresStripeKeys) {
          setStripeNotice(json.message);
        } else {
          setStripeNotice(json.error || "Failed to initialize Stripe payment session.");
        }
      } else if (json.url) {
        window.location.href = json.url;
      }
    } catch {
      setStripeNotice("Network error initiating card payment.");
    } finally {
      setPayingStripe(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center space-y-3">
        <div className="space-y-3">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Loading formal invoice & payment details...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-[#F9FCF5] rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#B7F56A]">
          <AlertCircle className="w-10 h-10 text-danger-500 mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">Invoice Reference Not Found</h3>
          <p className="text-xs text-ink-500">
            The invoice reference <span className="font-mono font-medium text-ink-600">{invoiceId}</span> was not found.
          </p>
          <Link href="/account/invoices" className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none border border-[#E5FBC9]">
            View Your Invoices
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">PAID IN FULL</span>;
      case "partially_paid":
        return <span className="px-3 py-1 rounded-full bg-warning-50 text-warning-900 text-xs font-mono font-medium uppercase">DEPOSIT PAID</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-danger-50 text-danger-900 text-xs font-mono font-medium uppercase">PAYMENT DUE</span>;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 text-start">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* HEADER BAR */}
        <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#B7F56A]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5FBC9] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-medium text-ink-500 uppercase">BEST ONE SERVICES • VAT TAX INVOICE</span>
              <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">
                Invoice {invoice.reference}
              </h1>
              <p className="text-xs font-mono text-ink-500">
                Booking Reference: <span className="font-medium text-ink-600">{invoice.bookingReference}</span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              {getStatusBadge(invoice.paymentStatus)}

              <button
                type="button"
                onClick={() => window.print()}
                className="text-[11px] font-mono text-ink-500 hover:text-ink-600 inline-flex items-center gap-1 cursor-pointer border-none bg-transparent"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Tax Invoice / Receipt</span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-[18px] bg-[#F9FCF5] space-y-1 border border-[#B7F56A]">
              <span className="text-ink-500 uppercase block">BILLED TO</span>
              <p className="font-medium text-ink-600">{invoice.customerName}</p>
              <p className="text-ink-500">{invoice.customerEmail}</p>
            </div>

            <div className="p-3.5 rounded-[18px] bg-[#F9FCF5] space-y-1 border border-[#B7F56A]">
              <span className="text-ink-500 uppercase block">PAYMENT TERMS</span>
              <p className="font-medium text-ink-600">Due on Receipt / Completion</p>
              <p className="text-ink-500">Due Date: {new Date(invoice.dueDate as string).toLocaleDateString("en-GB")}</p>
            </div>
          </div>
        </div>

        {/* ITEMIZED BILL TABLE */}
        <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-6 border border-[#B7F56A]">
          <h2 className="font-heading text-xl font-medium text-ink-900 border-b border-[#E5FBC9] pb-3">
            Itemized Invoice Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start border-collapse">
              <thead>
                <tr className="border-b border-[#E5FBC9] text-left text-[11px] font-mono uppercase text-ink-500">
                  <th className="py-2 font-medium">Description</th>
                  <th className="py-2 text-center font-medium">Qty</th>
                  <th className="py-2 text-right font-medium">Rate</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bone-300 font-mono">
                {invoice.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-ink-600">{item.description}</td>
                    <td className="py-3 text-center text-ink-500">{item.quantity}</td>
                    <td className="py-3 text-right text-ink-500">{formatPenceToGBP(item.unitPricePence)}</td>
                    <td className="py-3 text-right font-medium text-ink-600">{formatPenceToGBP(item.totalPence)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FINANCIAL TOTALS CARD */}
          <div className="p-6 rounded-[18px] bg-white border border-[#B7F56A] space-y-2 text-xs font-mono">
            <div className="flex justify-between text-ink-500">
              <span>Subtotal (Net)</span>
              <span className="font-medium text-ink-600">{formatPenceToGBP(invoice.subtotalPence)}</span>
            </div>

            <div className="flex justify-between text-ink-500">
              <span>UK VAT ({invoice.vatPercentage}%)</span>
              <span className="font-medium text-ink-600">{formatPenceToGBP(invoice.vatPence)}</span>
            </div>

            <div className="flex justify-between text-base font-medium text-ink-600 pt-2 border-t border-[#E5FBC9]">
              <span>Total Invoice Amount</span>
              <span>{formatPenceToGBP(invoice.totalPence)}</span>
            </div>

            <div className="flex justify-between text-success-900 pt-1">
              <span>Deposit Paid</span>
              <span className="font-medium">-{formatPenceToGBP(invoice.depositPaidPence || 0)}</span>
            </div>

            <div className="flex justify-between text-lg font-medium text-ink-600 pt-2 border-t border-[#E5FBC9]">
              <span>Balance Due</span>
              <span className="text-[#1F3A00] font-black">{formatPenceToGBP(invoice.balanceDuePence || 0)}</span>
            </div>
          </div>

          {/* PAYMENT NOTICE ALERTS */}
          {stripeNotice && (
            <div className="p-4 rounded-[18px] bg-warning-50 border border-warning-500 text-warning-900 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning-900 shrink-0" />
              <span>{stripeNotice}</span>
            </div>
          )}

          {/* PAYMENT ACTIONS */}
          {invoice.paymentStatus !== "paid" && (
            <div className="space-y-4 pt-2">
              
              {/* Online Card Payment Button */}
              <button
                type="button"
                onClick={() => handlePayStripe("full_balance")}
                disabled={payingStripe}
                className="w-full py-4 rounded-full bg-[#1F3A00] text-[#B7F56A] font-heading font-semibold text-xs hover:bg-[#2d5004] cursor-pointer disabled:opacity-50 transition-colors duration-150 flex items-center justify-center gap-2 border border-[#E5FBC9]"
              >
                <CreditCard className="w-4 h-4 text-white" />
                <span>{payingStripe ? "Opening Stripe Checkout..." : `Pay Balance Online via Card (${formatPenceToGBP(invoice.balanceDuePence)}) →`}</span>
              </button>

              {/* BACS UK Bank Transfer Details Card */}
              <div className="p-5 rounded-[18px] bg-white border border-[#B7F56A] space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-ink-600 font-medium border-b border-[#E5FBC9] pb-2">
                  <Building2 className="w-4 h-4 text-ink-600" />
                  <span>Direct UK Bank Transfer (BACS)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-ink-500 pt-1">
                  <div>Account Name: <span className="font-medium text-ink-600">Best One Services Ltd</span></div>
                  <div>Sort Code: <span className="font-medium text-ink-600">20-00-00</span></div>
                  <div>Account No: <span className="font-medium text-ink-600">88776655</span></div>
                  <div>Reference: <span className="font-medium text-ink-600">{invoice.reference}</span></div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
