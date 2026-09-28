"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { fetchInvoiceDetail } from "@/lib/repositories/invoices";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type InvoiceItem } from "@/types/invoice";
import { Spinner } from "@/components/ui/spinner";
import { siteContact } from "@/config/site-contact";
import { 
  AlertCircle, 
  Printer, 
  CreditCard, 
  Building2
} from "@/components/icons";

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
        <div className="bg-white rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto ">
          <AlertCircle className="w-10 h-10 text-danger-500 mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">Invoice Reference Not Found</h3>
          <p className="text-xs text-ink-500">
            The invoice reference <span className="font-mono font-medium text-ink-600">{invoiceId}</span> was not found.
          </p>
          <Link href="/account/invoices" className="px-5 py-2.5 rounded-md bg-[#B7F56A] text-[#1D201E] font-medium text-xs inline-block text-decoration-none ">
            View Your Invoices
          </Link>
        </div>
      </div>
    );
  }

  const statusChip =
    invoice.paymentStatus === "paid" ? (
      <span className="ts-chip" data-tone="solid">Paid in full</span>
    ) : invoice.paymentStatus === "partially_paid" ? (
      <span className="ts-chip bg-warning-50! text-warning-900!">Deposit paid</span>
    ) : (
      <span className="ts-chip bg-danger-50! text-danger-900!">Payment due</span>
    );
  const fmtDate = (d: unknown) => (d ? new Date(d as string).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");
  const bank = siteContact.bankTransfer;

  return (
    <div className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 print:bg-white print:p-0">
      {/* Lab 03 S64 · the invoice as a document, the same on screen and on paper */}
      <article className="mx-auto grid max-w-3xl gap-6 rounded-3xl bg-white p-6 sm:p-10 print:rounded-none">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="grid gap-1.5">
            <span className="ts-head text-[26px]">Bestone</span>
            <p className="m-0 text-[13px] leading-relaxed text-muted">
              {siteContact.companyName} · Company no. 15574809<br />
              {siteContact.address.formatted}
            </p>
          </div>
          <div className="grid justify-items-end gap-2 text-right">
            <h1 className="ts-head m-0 text-[32px]">Invoice</h1>
            {statusChip}
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink print:hidden">
              <Printer className="size-4" aria-hidden="true" /> Print or save as PDF
            </button>
          </div>
        </header>

        <dl className="m-0 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {[
            ["Invoice", invoice.reference],
            ["Booking", invoice.bookingReference],
            ["Issued", fmtDate(invoice.issuedAt)],
            ["Due", fmtDate(invoice.dueDate)],
          ].map(([k, v]) => (
            <div key={k} className="grid rounded-lg bg-paper px-3 py-2">
              <dt className="text-[12px] text-muted">{k}</dt>
              <dd className="m-0 text-[14px] font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-1">
          <p className="ts-eyebrow m-0">Billed to</p>
          <p className="m-0 font-semibold">{invoice.customerName}</p>
          <p className="m-0 text-sm text-muted">{invoice.customerEmail}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-y-0.5 text-[15px] tabular-nums">
            <thead>
              <tr className="text-left">
                <th scope="col" className="ts-eyebrow px-3 py-2 font-semibold">Item</th>
                <th scope="col" className="ts-eyebrow px-3 py-2 text-center font-semibold">Qty</th>
                <th scope="col" className="ts-eyebrow px-3 py-2 text-right font-semibold">Rate</th>
                <th scope="col" className="ts-eyebrow px-3 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? "bg-paper" : ""}>
                  <td className="rounded-l-lg px-3 py-3 font-semibold">{item.description}</td>
                  <td className="px-3 py-3 text-center text-muted">{item.quantity}</td>
                  <td className="px-3 py-3 text-right text-muted">{formatPenceToGBP(item.unitPricePence)}</td>
                  <td className="rounded-r-lg px-3 py-3 text-right font-semibold">{formatPenceToGBP(item.totalPence)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="ts-rows m-0 ml-auto grid w-full max-w-sm">
          {[
            ["Subtotal", formatPenceToGBP(invoice.subtotalPence)],
            [`VAT (${invoice.vatPercentage}%)`, formatPenceToGBP(invoice.vatPence)],
            ["Total", formatPenceToGBP(invoice.totalPence)],
            ["Deposit paid", `−${formatPenceToGBP(invoice.depositPaidPence || 0)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-3 py-2 text-[15px]">
              <dt className="text-muted">{k}</dt>
              <dd className="m-0 font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 px-3 pt-3">
            <dt className="font-semibold">Balance due</dt>
            <dd className="ts-fig m-0 text-[36px]">{formatPenceToGBP(invoice.balanceDuePence || 0)}</dd>
          </div>
        </dl>

        {invoice.paymentStatus === "paid" ? (
          <div className="justify-self-end">
            <span className="ts-stamp">Paid<b>{fmtDate(invoice.paidAt)}</b><small>{invoice.reference}</small></span>
          </div>
        ) : null}

        {stripeNotice && (
          <div className="flex items-start gap-2 rounded-xl bg-warning-50 p-4 text-sm text-warning-900 print:hidden">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{stripeNotice}</span>
          </div>
        )}

        {invoice.paymentStatus !== "paid" && (
          <div className="grid gap-3 print:hidden">
            <button
              type="button"
              onClick={() => handlePayStripe("full_balance")}
              disabled={payingStripe}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[14px] bg-lime px-6 text-[17px] font-semibold text-ink transition-colors duration-150 hover:bg-lime-2 disabled:bg-stone disabled:text-faint"
            >
              <CreditCard className="size-5" aria-hidden="true" />
              <span>{payingStripe ? "Opening secure checkout…" : `Pay ${formatPenceToGBP(invoice.balanceDuePence)} by card`}</span>
            </button>
            {bank ? (
              <div className="grid gap-2 rounded-2xl bg-paper p-4 text-[15px]">
                <p className="m-0 flex items-center gap-2 font-semibold"><Building2 className="size-4" aria-hidden="true" /> Or pay by bank transfer</p>
                <dl className="m-0 grid gap-1 sm:grid-cols-2">
                  {[["Account name", bank.accountName], ["Sort code", bank.sortCode], ["Account number", bank.accountNumber], ["Reference", invoice.reference]].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 sm:block"><dt className="text-muted">{k}</dt><dd className="m-0 font-semibold tabular-nums">{v}</dd></div>
                  ))}
                </dl>
              </div>
            ) : (
              <p className="m-0 text-sm text-muted">To pay by bank transfer, ask us for the account details on {siteContact.phoneDisplay} and quote {invoice.reference}.</p>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
