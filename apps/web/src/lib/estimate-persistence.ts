"use client";

import { calculatePricing } from "@/lib/pricing-engine";

export interface EstimateState {
  category: string;
  service: string;
  propertySize?: string;
  bedrooms?: string;
  packageType?: string;
  addOns?: string[];
  estimatedPrice?: number;
  updatedAt?: string;
  isRefreshed?: boolean;
}

const LOCAL_STORAGE_KEY = "bos_last_estimate_v1";

export function saveEstimateLocally(state: EstimateState): void {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      ...state,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Could not save estimate locally", err);
  }
}

export function loadSavedEstimate(): EstimateState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EstimateState;
    return revalidateEstimate(parsed);
  } catch {
    return null;
  }
}

export function revalidateEstimate(state: EstimateState): EstimateState {
  if (!state.category || !state.estimatedPrice) return state;

  try {
    const vertical = (state.category === "cleaning" ? "cleaning" : state.category.includes("pest") ? "pest" : state.category === "gardening" ? "gardening" : "removals") as "cleaning" | "pest" | "gardening" | "removals";
    const propertySizeValue = (state.bedrooms === "5bed" ? "4bed" : (state.bedrooms || "2bed")) as "studio" | "1bed" | "2bed" | "3bed" | "4bed";
    const currentCalc = calculatePricing({
      vertical,
      cleaning: { subcategory: "endOfTenancy", propertySize: propertySizeValue, carpetCleaning: false, ovenCleaning: false },
      pest: { pestType: "rodents", treatmentPlan: "2visit", nightEmergency: false },
      gardening: { gardeningType: "clearance", gardeningHours: 2, wasteBags: 2 },
      removals: { teamConfig: "2men", removalHours: 2, packingOption: "none" },
    });

    if (currentCalc && state.estimatedPrice && currentCalc.priceMin !== state.estimatedPrice) {
      return {
        ...state,
        estimatedPrice: currentCalc.priceMin,
        isRefreshed: true,
      };
    }
  } catch {
    // fallback cleanly
  }

  return state;
}

export function clearSavedEstimate(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Generates shareable URL containing ZERO PII (no name, email, phone, address) */
export function generateShareableUrl(state: EstimateState): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams();
  if (state.category) params.set("category", state.category);
  if (state.service) params.set("service", state.service);
  if (state.propertySize) params.set("propertySize", state.propertySize);
  if (state.bedrooms) params.set("bedrooms", state.bedrooms);
  if (state.packageType) params.set("packageType", state.packageType);
  if (state.addOns && state.addOns.length > 0) params.set("addOns", state.addOns.join(","));

  const baseUrl = `${window.location.origin}/prices/`;
  return `${baseUrl}?${params.toString()}#smart-calculator`;
}
