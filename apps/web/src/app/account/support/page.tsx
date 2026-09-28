"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "@/components/icons";

export default function CustomerSupportPage() {
  return (
    <div className="space-y-6 text-start">
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-2 ">
        <h1 className="font-heading text-2xl sm:text-3xl font-[650] text-ink-900">Customer Support & Guarantees</h1>
        <p className="text-sm text-ink-500">File a 48-hour re-clean claim or request guarantee support</p>
      </div>

      <div className="bg-white rounded-[18px] p-8 space-y-4 text-center max-w-xl mx-auto ">
        <div className="w-12 h-12 rounded-[18px] bg-[#B7F56A] text-[#1D201E] flex items-center justify-center font-medium mx-auto">
          <HelpCircle className="w-6 h-6 text-[#1D201E]" />
        </div>
        <h3 className="font-heading text-xl font-medium text-ink-900">Need Support for a Job?</h3>
        <p className="text-sm text-ink-500 leading-relaxed">
          Customer support ticketing and 48-hour re-clean guarantee claims will be integrated here in Phase 9. You can also contact our support team directly.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B7F56A] text-[#1D201E] font-semibold text-sm hover:bg-[#A2EA4E] text-decoration-none "
        >
          <span>Open Contact Form</span>
          <ArrowRight className="w-4 h-4 text-[#1D201E]" />
        </Link>
      </div>
    </div>
  );
}

