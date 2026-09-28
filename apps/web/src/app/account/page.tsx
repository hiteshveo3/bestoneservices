"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { siteContact } from "@/config/site-contact";
import { 
  Sparkles, 
  Calendar, 
  FileText, 
  Receipt, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  Clock,
  CheckCircle2
} from "lucide-react";

export default function CustomerAccountPage() {
  const { user, profile } = useAuth();

  const customerName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Valued Customer";
  const customerEmail = profile?.email || user?.email || "";

  return (
    <div className="space-y-6 text-start">
      
      {/* 1. Account Welcome Card */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 ">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#B7F56A] text-[#1D201E] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#1D201E] shrink-0" />
              <span>Verified Customer Account</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-[650] text-ink-900">
              Welcome back, {customerName}
            </h1>
            <p className="text-sm text-ink-500">
              Manage your property services, bookings, and contact preferences
            </p>
          </div>

          <Link
            href="/account/profile"
            className="px-4 py-2 rounded-md bg-[#F6F5F1] text-ink-600 text-xs font-medium hover:bg-[#EAF8D6] text-decoration-none inline-flex items-center gap-1.5"
          >
            <UserIcon className="w-3.5 h-3.5 text-ink-600" />
            <span>Manage Profile</span>
          </Link>
        </div>

        <div className="pt-2 border-[#ECEAE3] flex flex-wrap items-center gap-6 text-xs text-ink-500">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-medium text-ink-600">Account Identity:</span>
            <span>{customerEmail}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-medium text-ink-600">Auth Provider:</span>
            <span className="capitalize">{user?.providerData[0]?.providerId.replace(".com", "") || "Firebase Auth"}</span>
          </div>
        </div>
      </div>

      {/* 2. Real Foundation Modules — Elegant Empty States */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Bookings Module Empty State */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 flex flex-col justify-between ">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[18px] bg-[#F6F5F1] text-ink-600 flex items-center justify-center font-medium">
              <Calendar className="w-5 h-5 text-ink-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-medium text-ink-900">Upcoming Bookings</h3>
              <p className="text-sm text-ink-500 leading-relaxed">
                Your scheduled cleaning, pest control, or removal jobs will appear here.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[18px] bg-[#F6F5F1] space-y-3">
            <div className="text-xs font-mono font-medium text-ink-500 uppercase">STATUS</div>
            <p className="text-xs text-ink-600 font-medium">No active bookings found for your account.</p>
            <Link
              href={siteContact.getWhatsappUrl("Hi, I'd like to book a service with Bestone Services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#B7F56A] text-[#1D201E] text-xs font-semibold hover:bg-[#A2EA4E] text-decoration-none "
            >
              <span>Book a Service</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1D201E]" />
            </Link>
          </div>
        </div>

        {/* Pricing & Estimates Empty State */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 flex flex-col justify-between ">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[18px] bg-[#F6F5F1] text-ink-600 flex items-center justify-center font-medium">
              <FileText className="w-5 h-5 text-ink-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-medium text-ink-900">Saved Estimates</h3>
              <p className="text-sm text-ink-500 leading-relaxed">
                Instant quotes calculated via our pricing engine are saved to your profile.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[18px] bg-[#F6F5F1] space-y-3">
            <div className="text-xs font-mono font-medium text-ink-500 uppercase">ESTIMATES</div>
            <p className="text-xs text-ink-600 font-medium">No saved pricing estimates found.</p>
            <Link
              href="/prices"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#B7F56A] text-[#1D201E] text-xs font-medium hover:bg-[#B7F56A] text-decoration-none"
            >
              <span>Calculate Upfront Estimate</span>
              <ArrowRight className="w-3.5 h-3.5 text-ink-600" />
            </Link>
          </div>
        </div>

      </div>

      {/* 3. Account Support & Reassurance */}
      <div className="bg-white rounded-[18px] p-6 space-y-3 ">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[18px] bg-[#B7F56A] text-[#1D201E] flex items-center justify-center font-medium shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#1D201E]" />
          </div>
          <div>
            <h4 className="font-heading font-medium text-base text-ink-900">Bestone Customer Protection</h4>
            <p className="text-xs text-ink-500">
              Every booking includes our 48-Hour Re-Clean Guarantee and certified technicians.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
