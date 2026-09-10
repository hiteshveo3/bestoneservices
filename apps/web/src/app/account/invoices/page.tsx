"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase-client";
import { subscribeCustomerInvoices } from "@/lib/repositories/invoices";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type InvoiceItem } from "@/types/invoice";
import { Spinner } from "@/components/ui/spinner";
import { 
  FileText, 
  ChevronRight
} from "lucide-react";

export default function CustomerInvoicesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const auth = getFirebaseClientAuth();

    if (!auth) {
      setTimeout(() => {
        if (!active) return;
        setAuthLoading(false);
        setLoading(false);
      }, 0);
      return;
    }

    const unSubAuth = onAuthStateChanged(auth, (user) => {
      if (!active) return;
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        subscribeCustomerInvoices(user.uid, (data) => {
          if (!active) return;
          setInvoices(data);
          setLoading(false);
        });
      } else {
        setInvoices([]);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unSubAuth();
    };
  }, []);

  if (authLoading || loading) {
    return (
      <div className="bg-[#F9FCF5] rounded-[18px] p-12 text-center space-y-3 border border-[#B7F56A]">
        <Spinner size={32} className="mx-auto" />
        <p className="text-sm font-medium text-ink-600">Loading your invoices & receipts...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-[#F9FCF5] rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#B7F56A]">
        <FileText className="w-10 h-10 text-[#1F3A00] mx-auto" />
        <h3 className="font-heading text-lg font-medium text-ink-900">Sign In to View Invoices</h3>
        <p className="text-xs text-ink-500">Sign in to access your tax invoices and receipts.</p>
        <Link href="/login" className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none border border-[#E5FBC9]">
          Sign In / Register
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER */}
      <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-2 border border-[#B7F56A]">
        <span className="text-xs font-mono font-medium uppercase text-ink-500">CUSTOMER ACCOUNT</span>
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Invoices & Receipts</h1>
        <p className="text-sm text-ink-500">View tax invoices, track deposit payments, and download receipts</p>
      </div>

      {/* INVOICES GRID */}
      {invoices.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-[#F9FCF5] rounded-[18px] p-6 space-y-4 flex flex-col justify-between border-t-4 border-t-blue-500 border border-[#B7F56A]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] text-[10px] font-mono font-medium text-ink-500">
                    {inv.reference}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase ${
                    inv.paymentStatus === "paid" ? "bg-[#1F3A00] text-white" : "bg-danger-50 text-danger-900"
                  }`}>
                    {inv.paymentStatus.replace("_", " ")}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-medium text-base text-ink-900">Booking #{inv.bookingReference}</h3>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Issued: {new Date(inv.issuedAt as string).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <div className="p-3.5 rounded-[18px] bg-[#F9FCF5] space-y-1 text-xs font-mono border border-[#B7F56A]">
                  <div className="flex justify-between">
                    <span className="text-ink-500">Total Amount:</span>
                    <span className="font-medium text-ink-600">{formatPenceToGBP(inv.totalPence)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E5FBC9]">
                    <span className="text-ink-500">Balance Due:</span>
                    <span className="font-medium text-[#1F3A00]">{formatPenceToGBP(inv.balanceDuePence || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5FBC9] flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-500">
                  Tax Invoice
                </span>

                <Link
                  href={`/invoice/${inv.reference}${inv.accessToken ? `#token=${encodeURIComponent(inv.accessToken)}` : ""}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] hover:bg-[#2d5004] text-xs font-medium text-decoration-none transition-colors duration-150 border border-[#E5FBC9]"
                >
                  <span>View Invoice</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#F9FCF5] rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#B7F56A]">
          <FileText className="w-10 h-10 text-[#1F3A00] mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">No Invoices Issued Yet</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            Invoices will appear here once issued for your booked appointments.
          </p>
        </div>
      )}

    </div>
  );
}

