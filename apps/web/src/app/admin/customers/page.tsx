"use client";

import React from "react";
import { Users } from "lucide-react";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6 text-start">
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-2 border border-[#E5FBC9]">
        <span className="text-xs font-mono font-medium uppercase text-ink-500">PHASE 9 MODULE</span>
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Customer CRM & Profiles</h1>
        <p className="text-sm text-ink-500">Manage customer records, saved addresses, and relationship history</p>
      </div>

      <div className="bg-white rounded-[18px] p-8 space-y-4 text-center max-w-xl mx-auto border border-[#E5FBC9]">
        <div className="w-12 h-12 rounded-[18px] bg-[#1F3A00] text-white flex items-center justify-center font-medium mx-auto">
          <Users className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-heading text-xl font-medium text-ink-900">Customer CRM Phase 9 Ready</h3>
        <p className="text-sm text-ink-500 leading-relaxed">
          Comprehensive customer profiles, address history, and service notes will be managed in Phase 9.
        </p>
      </div>
    </div>
  );
}
