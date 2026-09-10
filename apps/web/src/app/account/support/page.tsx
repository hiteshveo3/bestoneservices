"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";

export default function CustomerSupportPage() {
  return (
    <div className="space-y-6 text-start">
      <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-2 border border-[#B7F56A]">
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Customer Support & Guarantees</h1>
        <p className="text-sm text-ink-500">File a 48-hour re-clean claim or request guarantee support</p>
      </div>

      <div className="bg-[#F9FCF5] rounded-[18px] p-8 space-y-4 text-center max-w-xl mx-auto border border-[#B7F56A]">
        <div className="w-12 h-12 rounded-[18px] bg-[#1F3A00] text-white flex items-center justify-center font-medium mx-auto">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-heading text-xl font-medium text-ink-900">Need Support for a Job?</h3>
        <p className="text-sm text-ink-500 leading-relaxed">
          Customer support ticketing and 48-hour re-clean guarantee claims will be integrated here in Phase 9. You can also contact our support team directly.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] text-decoration-none border border-[#E5FBC9]"
        >
          <span>Open Contact Form</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>
      </div>
    </div>
  );
}

