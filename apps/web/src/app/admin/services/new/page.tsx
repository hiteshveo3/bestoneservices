"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  AlertCircle 
} from "lucide-react";

export default function AdminNewServicePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<"cleaning" | "pest" | "gardening" | "removals">("cleaning");
  const [shortDescription, setShortDescription] = useState("");
  const [badgeLabel, setBadgeLabel] = useState("");
  const [pricingType, setPricingType] = useState<"flat_rate" | "property_size_matrix" | "hourly" | "package_tiers">("property_size_matrix");
  const [basePricePounds, setBasePricePounds] = useState<number>(150);

  // Property Size Matrix
  const [studioPounds, setStudioPounds] = useState<number>(130);
  const [oneBedPounds, setOneBedPounds] = useState<number>(200);
  const [twoBedPounds, setTwoBedPounds] = useState<number>(230);
  const [threeBedPounds, setThreeBedPounds] = useState<number>(300);
  const [fourBedPounds, setFourBedPounds] = useState<number>(350);

  // Hourly Rate & Min Hours
  const [hourlyRatePounds, setHourlyRatePounds] = useState<number>(22);
  const [minHours, setMinHours] = useState<number>(3);

  const [guaranteeText, setGuaranteeText] = useState("48-Hour Re-Clean Guarantee Included");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortDescription.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          categoryId,
          shortDescription: shortDescription.trim(),
          badgeLabel: badgeLabel.trim() || undefined,
          pricingType,
          basePricePounds,
          ...(pricingType === "property_size_matrix" ? {
            propertySizeMatrix: {
              studioPounds,
              oneBedPounds,
              twoBedPounds,
              threeBedPounds,
              fourBedPounds,
            }
          } : {}),
          ...(pricingType === "hourly" ? {
            hourlyRatePounds,
            minHours,
          } : {}),
          features: [
            "Agency-approved checklist",
            "Deep cleaning & sanitising",
            "Professional grade equipment"
          ],
          guaranteeText: guaranteeText.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Failed to create service package draft");
      } else {
        router.push(`/admin/services/${json.service.id}`);
      }
    } catch {
      setErrorMsg("Network error creating service package");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-start">
      
      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E5FBC9] text-xs font-medium text-ink-600 hover:bg-[#DCFAB7] transition-colors duration-150 text-decoration-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-ink-600" />
          <span>Back to Catalog Queue</span>
        </Link>

        <span className="text-xs font-mono font-medium text-ink-500 uppercase">
          CREATE DRAFT SERVICE
        </span>
      </div>

      {/* ERROR ALERTS */}
      {errorMsg && (
        <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CREATE FORM CARD */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-6 border border-[#E5FBC9]">
        <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
          <span className="text-xs font-mono font-medium uppercase text-ink-500">STEP 1 OF 2</span>
          <h1 className="font-heading text-2xl font-medium text-ink-900">Create New Service Package</h1>
          <p className="text-sm text-ink-500">Draft new service definitions and baseline pricing matrix</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Service Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. End of Tenancy Cleaning"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-sm font-medium text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Category Vertical *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as "cleaning" | "pest" | "gardening" | "removals")}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055]"
              >
                <option value="cleaning">Cleaning Services</option>
                <option value="pest">Pest Control</option>
                <option value="gardening">Gardening & Clearance</option>
                <option value="removals">Removals & Storage</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Short Description *</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="High-level customer description..."
              className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055]"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Badge Label (Optional)</label>
              <input
                type="text"
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                placeholder="e.g. 48-HOUR RE-CLEAN GUARANTEE"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Pricing Engine Model *</label>
              <select
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value as "flat_rate" | "property_size_matrix" | "hourly" | "package_tiers")}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055]"
              >
                <option value="property_size_matrix">Property Size Matrix (Studio → 4+ Bed)</option>
                <option value="flat_rate">Flat Rate Fixed Price (£)</option>
                <option value="hourly">Hourly Rate (£/hour)</option>
                <option value="package_tiers">Multi-Visit Package Tiers</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC PRICING MATRIX FIELDS */}
          {pricingType === "property_size_matrix" ? (
            <div className="p-4 rounded-[18px] bg-white space-y-3 border border-[#E5FBC9]">
              <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Property Size Matrix Rates (£ GBP)</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-ink-500 block">Studio</label>
                  <input
                    type="number"
                    value={studioPounds}
                    onChange={(e) => setStudioPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-xs font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-ink-500 block">1 Bed</label>
                  <input
                    type="number"
                    value={oneBedPounds}
                    onChange={(e) => setOneBedPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-xs font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-ink-500 block">2 Bed</label>
                  <input
                    type="number"
                    value={twoBedPounds}
                    onChange={(e) => setTwoBedPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-xs font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-ink-500 block">3 Bed</label>
                  <input
                    type="number"
                    value={threeBedPounds}
                    onChange={(e) => setThreeBedPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-xs font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-ink-500 block">4 Bed</label>
                  <input
                    type="number"
                    value={fourBedPounds}
                    onChange={(e) => setFourBedPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-xs font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>
              </div>
            </div>
          ) : pricingType === "hourly" ? (
            <div className="p-4 rounded-[18px] bg-white space-y-3 border border-[#E5FBC9]">
              <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Hourly Pricing Rules</span>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-ink-500 block">Hourly Rate (£/hr)</label>
                  <input
                    type="number"
                    value={hourlyRatePounds}
                    onChange={(e) => setHourlyRatePounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-[18px] bg-white text-xs font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-ink-500 block">Minimum Hours Rule</label>
                  <input
                    type="number"
                    value={minHours}
                    onChange={(e) => setMinHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2.5 rounded-[18px] bg-white text-xs font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Base Price (£ GBP)</label>
              <input
                type="number"
                value={basePricePounds}
                onChange={(e) => setBasePricePounds(parseFloat(e.target.value) || 0)}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-sm font-medium text-ink-600 border-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Guarantee Text</label>
            <input
              type="text"
              value={guaranteeText}
              onChange={(e) => setGuaranteeText(e.target.value)}
              placeholder="e.g. Includes 48-Hour Re-Clean Guarantee"
              className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer disabled:opacity-50 transition-colors duration-150 border border-[#E5FBC9]"
          >
            {submitting ? "Creating Service Package Draft..." : "Create Package & Configure Add-ons →"}
          </button>
        </form>
      </div>

    </div>
  );
}
