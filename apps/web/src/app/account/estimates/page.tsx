"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase-client";
import { subscribeCustomerEstimates } from "@/lib/repositories/estimates";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type EstimateItem } from "@/types/estimate";
import { Spinner } from "@/components/ui/spinner";
import { 
  FileText, 
  ChevronRight
} from "lucide-react";

export default function CustomerEstimatesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [estimates, setEstimates] = useState<EstimateItem[]>([]);
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
        subscribeCustomerEstimates(user.uid, (data) => {
          if (!active) return;
          setEstimates(data);
          setLoading(false);
        });
      } else {
        setEstimates([]);
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
        <p className="text-sm font-medium text-ink-600">Loading your saved estimates & quotes...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-[#F9FCF5] rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#B7F56A]">
        <FileText className="w-10 h-10 text-[#1F3A00] mx-auto" />
        <h3 className="font-heading text-lg font-medium text-ink-900">Sign In to View Saved Estimates</h3>
        <p className="text-xs text-ink-500">Sign in to access your saved formal quote estimates and convert them into bookings.</p>
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
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Saved Estimates & Formal Quotes</h1>
        <p className="text-sm text-ink-500">Review past price estimates and convert accepted quotes into active appointments</p>
      </div>

      {/* ESTIMATES GRID */}
      {estimates.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {estimates.map((est) => (
            <div
              key={est.id}
              className="bg-[#F9FCF5] rounded-[18px] p-6 space-y-4 flex flex-col justify-between border-t-4 border-t-blue-500 border border-[#B7F56A]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] text-[10px] font-mono font-medium text-ink-500">
                    {est.reference}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase ${
                    est.status === "converted_to_booking" ? "bg-[#1F3A00] text-white" : "bg-success-50 text-success-900"
                  }`}>
                    {est.status.replace("_", " ")}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-medium text-lg text-ink-900">{est.serviceName}</h3>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Category: {est.categoryId.toUpperCase()}
                  </p>
                </div>

                <div className="p-3.5 rounded-[18px] bg-[#F9FCF5] space-y-1 text-xs font-mono border border-[#B7F56A]">
                  <div className="flex justify-between items-center">
                    <span className="text-ink-500">Quoted Total</span>
                    <span className="font-heading font-medium text-lg text-ink-900">
                      {formatPenceToGBP(est.totalPence)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5FBC9] flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-500">
                  Valid: 14 Days
                </span>

                <Link
                  href={`/quote/${est.reference}${est.accessToken ? `#token=${encodeURIComponent(est.accessToken)}` : ""}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] hover:bg-[#2d5004] text-xs font-medium text-decoration-none transition-colors duration-150 border border-[#E5FBC9]"
                >
                  <span>Review Quote</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#F9FCF5] rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#B7F56A]">
          <FileText className="w-10 h-10 text-[#1F3A00] mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">No Saved Estimates Found</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            You don&apos;t have any saved price quotes yet. Use our smart calculator to generate an instant estimate.
          </p>
          <Link href="/prices" className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none border border-[#E5FBC9]">
            Calculate Instant Estimate
          </Link>
        </div>
      )}

    </div>
  );
}

