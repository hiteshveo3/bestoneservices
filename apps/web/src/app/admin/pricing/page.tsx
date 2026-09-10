"use client";

import React, { useState, useEffect } from "react";
import { subscribeGlobalPricingRules } from "@/lib/repositories/services";
import { Spinner } from "@/components/ui/spinner";
import { 
  PoundSterling, 
  CheckCircle2, 
  AlertCircle, 
  Save,
  Percent,
  Clock,
  ShieldCheck
} from "lucide-react";

export default function AdminPricingPage() {
  const [loading, setLoading] = useState(true);

  const [weekendMultiplier, setWeekendMultiplier] = useState<number>(1.15);
  const [nightSurchargePounds, setNightSurchargePounds] = useState<number>(50);
  const [minDomesticPounds, setMinDomesticPounds] = useState<number>(60);
  const [vatRate, setVatRate] = useState<number>(20);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const unSub = subscribeGlobalPricingRules((data) => {
      if (!active) return;
      if (data) {
        setWeekendMultiplier(data.weekendMultiplier || 1.15);
        setNightSurchargePounds((data.nightEmergencySurchargePence || 5000) / 100);
        setMinDomesticPounds((data.minimumDomesticChargePence || 6000) / 100);
        setVatRate(data.vatRatePercentage || 20);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      unSub();
    };
  }, []);

  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/pricing/rules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekendMultiplier,
          nightEmergencySurchargePounds: nightSurchargePounds,
          minimumDomesticChargePounds: minDomesticPounds,
          vatRatePercentage: vatRate,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Failed to update global pricing rules");
      } else {
        setSuccessMsg("Global pricing engine surcharges updated successfully.");
      }
    } catch {
      setErrorMsg("Network error updating pricing rules");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
        <Spinner size={32} className="mx-auto" />
        <p className="text-sm font-medium text-ink-600">Loading pricing engine configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-start">
      
      {/* HEADER */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-2 border border-[#E5FBC9]">
        <span className="text-xs font-mono font-medium uppercase text-ink-500">PRICING ENGINE CONFIGURATION</span>
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Global Surcharges & Rules</h1>
        <p className="text-sm text-ink-500">Configure weekend multipliers, emergency night surcharges, and minimum booking rules</p>
      </div>

      {/* FEEDBACK ALERTS */}
      {errorMsg && (
        <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-[18px] bg-success-50 border border-success-500 text-success-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* FORM CARD */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-6 border border-[#E5FBC9]">
        <form onSubmit={handleSaveRules} className="space-y-6">
          
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Weekend Rate Multiplier */}
            <div className="p-5 rounded-[18px] bg-white border border-[#E5FBC9] space-y-2">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-ink-600" />
                <label className="text-xs font-mono font-medium text-ink-600 uppercase">Weekend Rate Multiplier</label>
              </div>
              <input
                type="number"
                step="0.01"
                min="1.0"
                max="2.0"
                value={weekendMultiplier}
                onChange={(e) => setWeekendMultiplier(parseFloat(e.target.value) || 1.0)}
                className="w-full p-3 rounded-[18px] bg-white text-sm font-medium text-ink-600 border border-[#E5FBC9]"
                required
              />
              <p className="text-[11px] text-ink-500">
                e.g. 1.15 adds a +15% surcharge for Saturday & Sunday bookings.
              </p>
            </div>

            {/* Night Emergency Surcharge */}
            <div className="p-5 rounded-[18px] bg-white border border-[#E5FBC9] space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-ink-600" />
                <label className="text-xs font-mono font-medium text-ink-600 uppercase">Night Emergency Slot Surcharge (£)</label>
              </div>
              <input
                type="number"
                value={nightSurchargePounds}
                onChange={(e) => setNightSurchargePounds(parseFloat(e.target.value) || 0)}
                className="w-full p-3 rounded-[18px] bg-white text-sm font-medium text-ink-600 border border-[#E5FBC9]"
                required
              />
              <p className="text-[11px] text-ink-500">
                Flat fee added for emergency appointments requested between 8pm and 5am.
              </p>
            </div>

            {/* Minimum Domestic Booking Charge */}
            <div className="p-5 rounded-[18px] bg-white border border-[#E5FBC9] space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-ink-600" />
                <label className="text-xs font-mono font-medium text-ink-600 uppercase">Minimum Booking Threshold (£)</label>
              </div>
              <input
                type="number"
                value={minDomesticPounds}
                onChange={(e) => setMinDomesticPounds(parseFloat(e.target.value) || 0)}
                className="w-full p-3 rounded-[18px] bg-white text-sm font-medium text-ink-600 border border-[#E5FBC9]"
                required
              />
              <p className="text-[11px] text-ink-500">
                Minimum total subtotal enforced across domestic hourly appointments.
              </p>
            </div>

            {/* UK VAT Rate Percentage */}
            <div className="p-5 rounded-[18px] bg-white border border-[#E5FBC9] space-y-2">
              <div className="flex items-center gap-2">
                <PoundSterling className="w-4 h-4 text-ink-600" />
                <label className="text-xs font-mono font-medium text-ink-600 uppercase">UK VAT Percentage Rate (%)</label>
              </div>
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                className="w-full p-3 rounded-[18px] bg-white text-sm font-medium text-ink-600 border border-[#E5FBC9]"
                required
              />
              <p className="text-[11px] text-ink-500">
                Standard UK VAT percentage rate applied to invoices and receipts.
              </p>
            </div>

          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-[#1F3A00] text-white font-heading font-medium text-sm hover:bg-[#2d5004] cursor-pointer transition-colors duration-150 flex items-center justify-center gap-2 border border-[#E5FBC9]"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{submitting ? "Saving Rules..." : "Save Pricing Engine Surcharge Rules"}</span>
          </button>
        </form>
      </div>

    </div>
  );
}
