"use client";

import React from "react";
import { MapPin } from "lucide-react";

export default function CustomerAddressesPage() {
  return (
    <div className="space-y-6 text-start">
      <div className="bg-[#F6F5F1] rounded-[18px] p-6 sm:p-8 space-y-2 border border-[#ECEAE3]">
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Saved Addresses</h1>
        <p className="text-sm text-ink-500">Manage property locations across London for instant booking</p>
      </div>

      <div className="bg-[#F6F5F1] rounded-[18px] p-8 space-y-4 text-center max-w-xl mx-auto border border-[#ECEAE3]">
        <div className="w-12 h-12 rounded-[18px] bg-[#B7F56A] text-[#1D201E] flex items-center justify-center font-medium mx-auto">
          <MapPin className="w-6 h-6 text-[#1D201E]" />
        </div>
        <h3 className="font-heading text-xl font-medium text-ink-900">No Saved Addresses</h3>
        <p className="text-sm text-ink-500 leading-relaxed">
          Address management and saved London postcodes will be available in Phase 9.
        </p>
      </div>
    </div>
  );
}
