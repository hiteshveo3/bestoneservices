"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  subscribeServiceDetail, 
  subscribeGlobalPricingRules 
} from "@/lib/repositories/services";
import { calculateServiceEstimatePence } from "@/lib/pricing-engine";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { Spinner } from "@/components/ui/spinner";
import { 
  type ServicePackageItem, 
  type GlobalPricingRules
} from "@/types/service";
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Send, 
  Plus, 
  Trash2, 
  PoundSterling,
  ShieldCheck
} from "lucide-react";

export default function AdminServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const [service, setService] = useState<ServicePackageItem | null>(null);
  const [globalRules, setGlobalRules] = useState<GlobalPricingRules | null>(null);
  const [loading, setLoading] = useState(true);

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [badgeLabel, setBadgeLabel] = useState("");
  const [basePricePounds, setBasePricePounds] = useState<number>(0);
  const [guaranteeText, setGuaranteeText] = useState("");

  // Room Matrix
  const [studioPounds, setStudioPounds] = useState<number>(0);
  const [oneBedPounds, setOneBedPounds] = useState<number>(0);
  const [twoBedPounds, setTwoBedPounds] = useState<number>(0);
  const [threeBedPounds, setThreeBedPounds] = useState<number>(0);
  const [fourBedPounds, setFourBedPounds] = useState<number>(0);

  // Hourly Rate & Min Hours
  const [hourlyRatePounds, setHourlyRatePounds] = useState<number>(0);
  const [minHours, setMinHours] = useState<number>(2);

  // Features list
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState("");

  // Add-ons list
  const [addOns, setAddOns] = useState<Array<{ id: string; name: string; pricePounds: number }>>([]);
  const [newAddOnName, setNewAddOnName] = useState("");
  const [newAddOnPrice, setNewAddOnPrice] = useState<number>(35);

  // Live Customer Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewSize, setPreviewSize] = useState<"Studio" | "1 Bed" | "2 Bed" | "3 Bed" | "4 Bed">("2 Bed");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const unSubService = subscribeServiceDetail(serviceId, (data) => {
      if (!active) return;
      setService(data);
      if (data) {
        setName(data.name);
        setShortDescription(data.shortDescription);
        setBadgeLabel(data.badgeLabel || "");
        setBasePricePounds((data.basePricePence || 0) / 100);
        setGuaranteeText(data.guaranteeText || "");

        if (data.propertySizeMatrix) {
          setStudioPounds((data.propertySizeMatrix.studioPence || 0) / 100);
          setOneBedPounds((data.propertySizeMatrix.oneBedPence || 0) / 100);
          setTwoBedPounds((data.propertySizeMatrix.twoBedPence || 0) / 100);
          setThreeBedPounds((data.propertySizeMatrix.threeBedPence || 0) / 100);
          setFourBedPounds((data.propertySizeMatrix.fourBedPence || 0) / 100);
        }

        if (data.hourlyRatePence) {
          setHourlyRatePounds(data.hourlyRatePence / 100);
        }
        if (data.minHours) {
          setMinHours(data.minHours);
        }

        setFeatures(data.features || []);

        if (data.addOns) {
          setAddOns(data.addOns.map((a) => ({ id: a.id, name: a.name, pricePounds: a.pricePence / 100 })));
        }
      }
      setLoading(false);
    });

    const unSubRules = subscribeGlobalPricingRules((rules) => {
      if (active) setGlobalRules(rules);
    });

    return () => {
      active = false;
      unSubService();
      unSubRules();
    };
  }, [serviceId]);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setActionError(null);
    setActionSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_details",
          name: name.trim(),
          shortDescription: shortDescription.trim(),
          badgeLabel: badgeLabel.trim() || undefined,
          basePricePounds,
          guaranteeText: guaranteeText.trim() || undefined,
          ...(service.pricingType === "property_size_matrix" ? {
            propertySizeMatrix: {
              studioPounds,
              oneBedPounds,
              twoBedPounds,
              threeBedPounds,
              fourBedPounds,
            }
          } : {}),
          ...(service.pricingType === "hourly" ? {
            hourlyRatePounds,
            minHours,
          } : {}),
          features,
          addOns,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to update service details");
      } else {
        setActionSuccess("Service package specifications saved successfully.");
      }
    } catch {
      setActionError("Network error updating service specifications");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!service) return;
    setActionError(null);
    setActionSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to publish service package");
      } else {
        setActionSuccess(json.message || "Service published and live on public website.");
      }
    } catch {
      setActionError("Network error while publishing service package");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    if (!service) return;
    setActionError(null);
    setActionSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unpublish" }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to unpublish service package");
      } else {
        setActionSuccess("Service package reverted to draft state.");
      }
    } catch {
      setActionError("Network error while unpublishing service package");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText("");
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddAddOn = () => {
    if (!newAddOnName.trim()) return;
    const newId = `addon_${Date.now()}`;
    setAddOns([...addOns, { id: newId, name: newAddOnName.trim(), pricePounds: newAddOnPrice }]);
    setNewAddOnName("");
    setNewAddOnPrice(35);
  };

  const handleRemoveAddOn = (id: string) => {
    setAddOns(addOns.filter((a) => a.id !== id));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
        <Spinner size={32} className="mx-auto" />
        <p className="text-sm font-medium text-ink-600">Loading service package editor & pricing engine...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-white rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#E5FBC9]">
        <AlertCircle className="w-10 h-10 text-danger-500 mx-auto" />
        <h3 className="font-heading text-lg font-medium text-ink-900">Service Package Not Found</h3>
        <p className="text-xs text-ink-500">The requested service package record does not exist or was moved.</p>
        <Link href="/admin/services" className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none border border-[#E5FBC9]">
          Return to Service Catalog
        </Link>
      </div>
    );
  }

  // Calculate preview estimate using domain engine
  const previewEstimate = calculateServiceEstimatePence(
    {
      ...service,
      propertySizeMatrix: {
        studioPence: Math.round(studioPounds * 100),
        oneBedPence: Math.round(oneBedPounds * 100),
        twoBedPence: Math.round(twoBedPounds * 100),
        threeBedPence: Math.round(threeBedPounds * 100),
        fourBedPence: Math.round(fourBedPounds * 100),
      },
    },
    { propertySize: previewSize },
    globalRules || undefined
  );

  return (
    <div className="space-y-6 text-start">
      
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
          ID: {service.id} • Version: v{service.version || 1}
        </span>
      </div>

      {/* FEEDBACK ALERTS */}
      {actionError && (
        <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 rounded-[18px] bg-success-50 border border-success-500 text-success-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* WORKSPACE HEADER & DRAFT / PREVIEW / PUBLISH TOOLBAR */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <h1 className="font-heading font-medium text-2xl sm:text-3xl text-ink-900">
                {service.name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium uppercase ${
                service.status === "published" ? "bg-[#1F3A00] text-white" : "bg-warning-50 text-warning-900"
              }`}>
                {service.status}
              </span>
            </div>
            <p className="text-xs font-mono text-ink-500">
              Category: {service.categoryId.toUpperCase()} • Pricing Model: {service.pricingType.toUpperCase()}
            </p>
          </div>

          {/* WORKFLOW BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-[#F9FCF5] text-ink-600 hover:bg-[#DCFAB7] text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer border-none border border-[#E5FBC9]"
            >
              <Eye className="w-4 h-4 text-ink-600" />
              <span>Customer Preview</span>
            </button>

            {service.status === "published" ? (
              <button
                type="button"
                onClick={handleUnpublish}
                disabled={submitting}
                className="px-4 py-2.5 rounded-full bg-warning-50 text-warning-900 hover:bg-warning-500 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer border-none"
              >
                <span>Revert to Draft</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={submitting}
                className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-[#B7F56A] hover:bg-[#2d5004] text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer border-none border border-[#E5FBC9]"
              >
                <Send className="w-4 h-4 text-white" />
                <span>Publish Package (v{(service.version || 1) + 1})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SERVICE SPECIFICATIONS FORM */}
      <form onSubmit={handleSaveDetails} className="space-y-6">
        
        <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
            General Specifications & Copy
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Service Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-sm font-medium text-ink-600 border-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Badge Label</label>
              <input
                type="text"
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                placeholder="e.g. 48-HOUR RE-CLEAN GUARANTEE"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Short Customer Description</label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none resize-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Guarantee Assurance Text</label>
            <input
              type="text"
              value={guaranteeText}
              onChange={(e) => setGuaranteeText(e.target.value)}
              placeholder="e.g. Includes 48-Hour Re-Clean Guarantee"
              className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
            />
          </div>
        </div>

        {/* PRICING MATRIX CONFIGURATION */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2 flex items-center gap-1.5">
            <PoundSterling className="w-4 h-4 text-ink-600" />
            <span>Pricing Engine Matrix Configuration</span>
          </h3>

          {service.pricingType === "property_size_matrix" ? (
            <div className="space-y-3">
              <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Property Size Room Matrix Rates (£ GBP)</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
                  <label className="text-[10px] font-mono font-medium text-ink-500 uppercase block">Studio Flat</label>
                  <input
                    type="number"
                    value={studioPounds}
                    onChange={(e) => setStudioPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-sm font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>

                <div className="p-3 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
                  <label className="text-[10px] font-mono font-medium text-ink-500 uppercase block">1 Bedroom</label>
                  <input
                    type="number"
                    value={oneBedPounds}
                    onChange={(e) => setOneBedPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-sm font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>

                <div className="p-3 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
                  <label className="text-[10px] font-mono font-medium text-ink-500 uppercase block">2 Bedroom</label>
                  <input
                    type="number"
                    value={twoBedPounds}
                    onChange={(e) => setTwoBedPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-sm font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>

                <div className="p-3 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
                  <label className="text-[10px] font-mono font-medium text-ink-500 uppercase block">3 Bedroom</label>
                  <input
                    type="number"
                    value={threeBedPounds}
                    onChange={(e) => setThreeBedPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-sm font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>

                <div className="p-3 rounded-[18px] bg-white space-y-1 border border-[#E5FBC9]">
                  <label className="text-[10px] font-mono font-medium text-ink-500 uppercase block">4 Bedroom</label>
                  <input
                    type="number"
                    value={fourBedPounds}
                    onChange={(e) => setFourBedPounds(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-[18px] bg-white text-sm font-medium text-ink-600 border border-[#E5FBC9]"
                  />
                </div>
              </div>
            </div>
          ) : service.pricingType === "hourly" ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Hourly Rate (£/hr)</label>
                <input
                  type="number"
                  value={hourlyRatePounds}
                  onChange={(e) => setHourlyRatePounds(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-sm font-medium text-ink-600 border-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Minimum Billable Hours Rule</label>
                <input
                  type="number"
                  value={minHours}
                  onChange={(e) => setMinHours(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-sm font-medium text-ink-600 border-none"
                />
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
        </div>

        {/* FEATURES & ADD-ONS MANAGER */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Features Bullets */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
              Feature Bullets Checklist
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="Add feature item (e.g. Deep oven cleaning)..."
                className="flex-1 p-2.5 rounded-[18px] bg-[#F9FCF5] text-xs text-ink-600 border-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2.5 rounded-[18px] bg-[#1F3A00] text-white text-xs font-medium cursor-pointer border-none"
              >
                Add Feature
              </button>
            </div>

            <div className="space-y-2">
              {features.map((ft, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-[18px] bg-white text-xs">
                  <span className="font-medium text-ink-600">• {ft}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-danger-500 hover:text-danger-900 text-xs cursor-pointer border-none bg-transparent"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons Options */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
              Add-On Extras Manager
            </h3>

            <div className="grid sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={newAddOnName}
                onChange={(e) => setNewAddOnName(e.target.value)}
                placeholder="Add-on item name..."
                className="sm:col-span-7 p-2.5 rounded-[18px] bg-[#F9FCF5] text-xs text-ink-600 border-none"
              />
              <input
                type="number"
                value={newAddOnPrice}
                onChange={(e) => setNewAddOnPrice(parseFloat(e.target.value) || 0)}
                placeholder="Price (£)"
                className="sm:col-span-3 p-2.5 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
              />
              <button
                type="button"
                onClick={handleAddAddOn}
                className="sm:col-span-2 p-2.5 rounded-[18px] bg-[#1F3A00] text-white text-xs font-medium cursor-pointer border-none flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="space-y-2">
              {addOns.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2.5 rounded-[18px] bg-white text-xs font-mono">
                  <span className="font-medium text-ink-600">{a.name} (+£{a.pricePounds})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAddOn(a.id)}
                    className="text-danger-500 hover:text-danger-900 text-xs cursor-pointer border-none bg-transparent"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SAVE SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-full bg-[#1F3A00] text-white font-heading font-medium text-sm hover:bg-[#2d5004] cursor-pointer transition-colors duration-150 border border-[#E5FBC9]"
        >
          {submitting ? "Saving Specifications..." : "Save Service Package Specifications"}
        </button>
      </form>

      {/* MODAL: LIVE CUSTOMER PREVIEW */}
      {previewModalOpen && (
        <div className="fixed inset-0 bg-ink-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] max-w-xl w-full p-6 sm:p-8 space-y-6 text-start border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <div className="inline-flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#1F3A00]" />
                <h3 className="font-heading font-medium text-lg text-ink-900">Live Customer Booking Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="text-xs font-medium text-ink-500 hover:text-ink-600 cursor-pointer border-none bg-transparent"
              >
                ✕ Close
              </button>
            </div>

            {/* PREVIEW CARD */}
            <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-white text-[10px] font-mono font-medium uppercase">
                  {service.categoryId}
                </span>
                {badgeLabel && (
                  <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-white text-[10px] font-mono font-medium uppercase">
                    {badgeLabel}
                  </span>
                )}
              </div>

              <div>
                <h2 className="font-heading text-xl font-medium text-ink-900">{name}</h2>
                <p className="text-xs text-ink-500 leading-relaxed mt-1">{shortDescription}</p>
              </div>

              {service.pricingType === "property_size_matrix" && (
                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Select Property Size</label>
                  <div className="flex flex-wrap gap-2">
                    {(["Studio", "1 Bed", "2 Bed", "3 Bed", "4 Bed"] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setPreviewSize(sz)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-none ${
                          previewSize === sz ? "bg-[#1F3A00] text-white" : "bg-white text-ink-600 border border-[#E5FBC9]"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-[18px] bg-white space-y-2 border border-[#E5FBC9]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-medium text-ink-500 uppercase">Calculated Estimate</span>
                  <span className="font-heading font-medium text-2xl text-ink-900">
                    {formatPenceToGBP(previewEstimate.totalPence)}
                  </span>
                </div>
                {previewEstimate.breakdown.map((line, idx) => (
                  <p key={idx} className="text-[11px] font-mono text-ink-500">• {line}</p>
                ))}
              </div>

              {guaranteeText && (
                <div className="flex items-center gap-2 text-xs font-medium text-ink-600">
                  <ShieldCheck className="w-4 h-4 text-[#1F3A00] shrink-0" />
                  <span>{guaranteeText}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setPreviewModalOpen(false)}
              className="w-full py-3 rounded-full bg-[#1F3A00] text-white text-xs font-medium cursor-pointer"
            >
              Close Preview Mode
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
