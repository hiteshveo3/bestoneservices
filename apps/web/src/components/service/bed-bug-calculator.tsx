"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { masterPricingData } from "@/config/pricing-data";
import { siteContact } from "@/config/site-contact";

export interface PriceBreakdown {
  basePrice: number;
  roomsAdjustment: number;
  visitsAdjustment: number;
  total: number;
}

// Base rate, per-room and per-visit surcharges all come from pricing-data.ts's
// "species_bed_bug" variant — the single source of truth. Do not hardcode these
// numbers here; update the variant instead so this stays in sync with every
// other place the bed bug price appears.
const BED_BUG_VARIANT = masterPricingData["pest-control"].variants.find((v) => v.id === "species_bed_bug");
if (!BED_BUG_VARIANT || !BED_BUG_VARIANT.perRoomRate || !BED_BUG_VARIANT.perVisitRate) {
  throw new Error("bed-bug-calculator: species_bed_bug variant (with perRoomRate/perVisitRate) missing from pricing-data.ts");
}
const BASE_PRICE = BED_BUG_VARIANT.startingPrice;
const PER_ROOM_RATE = BED_BUG_VARIANT.perRoomRate;
const PER_VISIT_RATE = BED_BUG_VARIANT.perVisitRate;

export function BedBugPriceCalculator() {
  const [rooms, setRooms] = useState(1);
  const [infestationLevel, setInfestationLevel] = useState<"low" | "medium" | "high">("medium");
  const [estimatedVisits, setEstimatedVisits] = useState(1);

  const pricing: PriceBreakdown = useMemo(() => {
    const basePrice = BASE_PRICE;
    const roomMultiplier = Math.min(rooms, 6);
    const roomsAdjustment = (roomMultiplier - 1) * PER_ROOM_RATE;
    // Severity is a UI-only estimation aid, not a separately advertised rate —
    // it's never shown as its own line item, only folded into the total.
    const infestationMultipliers = { low: 0, medium: 0.15, high: 0.35 };
    const infestationAdjustment = (basePrice + roomsAdjustment) * infestationMultipliers[infestationLevel];
    const visitAdjustment = (estimatedVisits - 1) * PER_VISIT_RATE;
    const total = Math.round(basePrice + roomsAdjustment + infestationAdjustment + visitAdjustment);

    return {
      basePrice,
      roomsAdjustment,
      visitsAdjustment: visitAdjustment,
      total,
    };
  }, [rooms, infestationLevel, estimatedVisits]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-start">
      <div className="space-y-6">
        
        {/* Rooms Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium text-ink-900">
            <span>Number of affected rooms:</span>
            <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-white font-medium text-base">
              {rooms} {rooms === 1 ? "room" : "rooms"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={rooms}
            onChange={(e) => setRooms(Number(e.currentTarget.value))}
            aria-label="Number of affected rooms"
            className="w-full h-2 bg-[#E5FBC9] rounded-[16px] appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-ink-500">
            <span>1 room (£{BASE_PRICE} base)</span>
            <span>6+ rooms (£{BASE_PRICE + 5 * PER_ROOM_RATE}+ base)</span>
          </div>
        </div>

        {/* Infestation Level Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-ink-900 block">Infestation Severity Level:</label>
          <div className="grid grid-cols-3 gap-3">
            {(["low", "medium", "high"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setInfestationLevel(level)}
                className={`p-3 rounded-[16px] border text-start transition-colors duration-150 cursor-pointer ${
                  infestationLevel === level
                    ? "border-ink-900 bg-[#DCFAB7] ring-2 ring-blue-600"
                    : "border-[#E5FBC9] bg-white hover:bg-[#DCFAB7]"
                }`}
              >
                <div className="font-medium text-sm capitalize text-ink-900">
                  {level === "low" && "🟢 Light"}
                  {level === "medium" && "🟡 Moderate"}
                  {level === "high" && "🔴 Severe"}
                </div>
                <p className="text-xs text-ink-500 mt-1 leading-snug">
                  {level === "low" && "Isolated area, few signs"}
                  {level === "medium" && "Multiple rooms, active"}
                  {level === "high" && "Widespread infestation"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Visits Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-900 block">Recommended Visit Package:</label>
          <div className="flex gap-3">
            {([1, 2, 3] as const).map((visit) => (
              <button
                key={visit}
                type="button"
                onClick={() => setEstimatedVisits(visit)}
                className={`flex-1 py-2.5 px-4 rounded-[16px] font-medium text-sm transition-colors duration-150 cursor-pointer border ${
                  estimatedVisits === visit
                    ? "bg-[#1F3A00] text-white border-[#1F3A00]"
                    : "bg-[#F9FCF5] text-ink-600 border-[#E5FBC9] hover:bg-[#DCFAB7]"
                }`}
              >
                {visit} Visit{visit > 1 ? "s" : ""}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-500">Initial thorough treatment + follow-up inspection on Day 7–14.</p>
        </div>
      </div>

      {/* Price Breakdown Summary Box */}
      <div className="bg-white rounded-[16px] p-6 border-2 border-[#99D055] space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-ink-500">Base Bed Bug Treatment (1 Room)</span>
            <span className="text-ink-900 font-medium">£{pricing.basePrice}</span>
          </div>
          {pricing.roomsAdjustment > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Additional Rooms ({rooms - 1} × £{PER_ROOM_RATE})</span>
              <span className="text-ink-900 font-medium">+£{pricing.roomsAdjustment}</span>
            </div>
          )}
          {pricing.visitsAdjustment > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Follow-Up Visit ({estimatedVisits - 1} × £{PER_VISIT_RATE})</span>
              <span className="text-ink-900 font-medium">+£{pricing.visitsAdjustment}</span>
            </div>
          )}
        </div>

        <div className="border-t border-[#E5FBC9] pt-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-ink-500 uppercase tracking-wider font-mono">Estimated Total</div>
            <div className="font-heading text-3xl font-medium text-ink-900">£{pricing.total}</div>
          </div>
          <Link
            href={siteContact.getWhatsappUrl(
              `Hi, I'd like to book bed bug treatment with Best One Services. Rooms: ${rooms}, estimated visits: ${estimatedVisits}, estimated price: £${pricing.total}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-[#1F3A00] text-white font-medium text-base hover:bg-[#1F3A00] transition-colors duration-150 text-decoration-none border border-[#E5FBC9]"
          >
            Book This Estimate →
          </Link>
        </div>
      </div>

      {/* Service Guarantees Pill */}
      <div className="p-4 rounded-[16px] bg-[#F9FCF5] border border-[#E5FBC9] text-xs text-ink-500 space-y-1.5">
        <div className="font-medium text-ink-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-ink-600 shrink-0" />
          <span>Includes Best One Written Guarantee & 48h Re-Clean Support</span>
        </div>
        <p className="leading-relaxed">Final price is locked in after initial property check. All technicians are licensed, insured, and BPCA compliant.</p>
      </div>
    </div>
  );
}
