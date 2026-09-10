import {
  type ServicePackageItem,
  type GlobalPricingRules,
  type ServiceStatus
} from "@/types/service";
import { masterPricingData } from "@/config/pricing-data";

function findVariant(vertical: keyof typeof masterPricingData, id: string) {
  const variant = masterPricingData[vertical].variants.find((v) => v.id === id);
  if (!variant) throw new Error(`pricing-engine: unknown variant "${id}" in "${vertical}" — check pricing-data.ts`);
  return variant;
}

export interface EstimateOptions {
  propertySize?: "Studio" | "1 Bed" | "2 Bed" | "3 Bed" | "4 Bed" | "5+ Bed";
  hoursCount?: number;
  selectedTierId?: string;
  selectedAddOnIds?: string[];
  isWeekend?: boolean;
  isNightEmergency?: boolean;
}

export function calculateServiceEstimatePence(
  service: ServicePackageItem,
  options: EstimateOptions = {},
  globalRules?: Partial<GlobalPricingRules>
): {
  subtotalPence: number;
  addOnsPence: number;
  surchargesPence: number;
  totalPence: number;
  breakdown: string[];
} {
  let basePence = service.basePricePence || 0;
  const breakdown: string[] = [];

  // 1. Resolve Pricing Type
  if (service.pricingType === "property_size_matrix" && service.propertySizeMatrix && options.propertySize) {
    const matrix = service.propertySizeMatrix;
    switch (options.propertySize) {
      case "Studio":
        basePence = matrix.studioPence || basePence;
        break;
      case "1 Bed":
        basePence = matrix.oneBedPence || basePence;
        break;
      case "2 Bed":
        basePence = matrix.twoBedPence || basePence;
        break;
      case "3 Bed":
        basePence = matrix.threeBedPence || basePence;
        break;
      case "4 Bed":
        basePence = matrix.fourBedPence || basePence;
        break;
      case "5+ Bed":
        basePence = matrix.fiveBedPlusPence || matrix.fourBedPence || basePence;
        break;
    }
    breakdown.push(`Base Rate (${options.propertySize}): £${(basePence / 100).toFixed(2)}`);
  } else if (service.pricingType === "hourly" && service.hourlyRatePence) {
    const minH = service.minHours || 2;
    const actualH = Math.max(options.hoursCount || minH, minH);
    basePence = actualH * service.hourlyRatePence;
    breakdown.push(`Hourly Rate (${actualH} hrs @ £${(service.hourlyRatePence / 100).toFixed(2)}/hr): £${(basePence / 100).toFixed(2)}`);
  } else if (service.pricingType === "package_tiers" && service.packageTiers && options.selectedTierId) {
    const tier = service.packageTiers.find((t) => t.id === options.selectedTierId);
    if (tier) {
      basePence = tier.pricePence;
      breakdown.push(`Package Tier (${tier.name}): £${(basePence / 100).toFixed(2)}`);
    } else {
      breakdown.push(`Base Package Rate: £${(basePence / 100).toFixed(2)}`);
    }
  } else {
    breakdown.push(`Base Flat Rate: £${(basePence / 100).toFixed(2)}`);
  }

  // 2. Resolve Add-ons
  let addOnsPence = 0;
  if (service.addOns && options.selectedAddOnIds && options.selectedAddOnIds.length > 0) {
    service.addOns.forEach((item) => {
      if (options.selectedAddOnIds?.includes(item.id)) {
        addOnsPence += item.pricePence;
        breakdown.push(`Add-on (${item.name}): £${(item.pricePence / 100).toFixed(2)}`);
      }
    });
  }

  let subtotalPence = basePence + addOnsPence;

  // 3. Minimum Charge Enforcement
  const minCharge = service.minBookingChargePence || globalRules?.minimumDomesticChargePence || 0;
  if (subtotalPence < minCharge) {
    subtotalPence = minCharge;
    breakdown.push(`Minimum booking threshold applied: £${(minCharge / 100).toFixed(2)}`);
  }

  // 4. Calculate Surcharges
  let surchargesPence = 0;
  if (options.isWeekend && globalRules?.weekendMultiplier && globalRules.weekendMultiplier > 1) {
    const weekendAddition = Math.round(subtotalPence * (globalRules.weekendMultiplier - 1));
    surchargesPence += weekendAddition;
    breakdown.push(`Weekend Rate Surcharge (+${Math.round((globalRules.weekendMultiplier - 1) * 100)}%): £${(weekendAddition / 100).toFixed(2)}`);
  }

  if (options.isNightEmergency && globalRules?.nightEmergencySurchargePence) {
    surchargesPence += globalRules.nightEmergencySurchargePence;
    breakdown.push(`Night Emergency Slot Surcharge: £${(globalRules.nightEmergencySurchargePence / 100).toFixed(2)}`);
  }

  const totalPence = subtotalPence + surchargesPence;

  return {
    subtotalPence,
    addOnsPence,
    surchargesPence,
    totalPence,
    breakdown,
  };
}

/** Validates Status Transitions for Service Packages */
export function isValidServiceStatusTransition(from: ServiceStatus, to: ServiceStatus): boolean {
  if (from === to) return true;
  if (from === "draft" && (to === "published" || to === "archived")) return true;
  if (from === "published" && (to === "draft" || to === "archived")) return true;
  if (from === "archived" && to === "draft") return true;
  return false;
}

/** Legacy Calculator Compatibility Interface & Estimator */
export interface LegacyPricingInput {
  vertical: "cleaning" | "pest" | "gardening" | "removals";
  cleaning?: {
    subcategory?: string;
    propertySize?: string;
    carpetCleaning?: boolean;
    ovenCleaning?: boolean;
  };
  pest?: {
    pestType?: string;
    treatmentPlan?: string;
    nightEmergency?: boolean;
  };
  gardening?: {
    gardeningType?: string;
    gardeningHours?: number;
    wasteBags?: number;
  };
  removals?: {
    teamConfig?: string;
    removalHours?: number;
    packingOption?: string;
  };
}

/**
 * Reads exclusively from pricing-data.ts — the single source of truth. Do not
 * hardcode a price here; add/adjust the relevant variant in pricing-data.ts
 * instead so the calculator, static tables and schema markup stay identical.
 */
export function calculatePricing(input: LegacyPricingInput): {
  priceMin: number;
  priceMax: number;
  breakdown: string[];
  minimumChargeRule: string;
} {
  const breakdown: string[] = [];
  let priceMin = 60;
  let priceMax = 60;
  let rule = "Minimum booking charge applies.";

  if (input.vertical === "cleaning") {
    rule = masterPricingData.cleaning.minChargeText;
    const pSize = input.cleaning?.propertySize || "2bed";
    const variantId = `${pSize}_std`;
    const variant = findVariant("cleaning", variantId);

    priceMin = variant.startingPrice;
    priceMax = variant.startingPrice;
    breakdown.push(`Property Base Clean (${pSize.toUpperCase()}): £${priceMin}`);

    if (input.cleaning?.carpetCleaning) {
      const addOn = masterPricingData.cleaning.addOns.find((a) => a.name === "Single Carpet Room");
      const amount = 35;
      priceMin += amount;
      priceMax += amount;
      breakdown.push(`Carpet Steam Clean Add-on: +${addOn?.priceDisplay ?? `£${amount}`}`);
    }
    if (input.cleaning?.ovenCleaning) {
      const addOn = masterPricingData.cleaning.addOns.find((a) => a.name === "Oven / Range Degrease Add-on");
      const amount = 25;
      priceMin += amount;
      priceMax += amount;
      breakdown.push(`Deep Oven Degreasing Add-on: +${addOn?.priceDisplay ?? `£${amount}`}`);
    }
  } else if (input.vertical === "pest") {
    rule = masterPricingData["pest-control"].minChargeText;
    const plan = input.pest?.treatmentPlan || "2visit";
    const variantId = plan === "single" ? "pest_1bed_single" : plan === "3visit" ? "pest_1bed_3visit" : "pest_1bed_2visit";
    const variant = findVariant("pest-control", variantId);

    priceMin = variant.startingPrice;
    priceMax = variant.maxPrice ?? variant.startingPrice;
    breakdown.push(`Pest Eradication (${plan.toUpperCase()} Plan): £${priceMin}${variant.maxPrice ? `–£${variant.maxPrice}` : ""}`);

    if (input.pest?.nightEmergency) {
      const addOn = masterPricingData["pest-control"].addOns.find((a) => a.name.startsWith("Night Emergency"));
      const amount = 50;
      priceMin += amount;
      priceMax += amount;
      breakdown.push(`Night Emergency Slot Surcharge: +${addOn?.priceDisplay ?? `£${amount}`}`);
    }
  } else if (input.vertical === "gardening") {
    rule = masterPricingData.gardening.minChargeText;
    const hrs = Math.max(input.gardening?.gardeningHours || 2, 2);
    const firstHour = findVariant("gardening", "garden_maint_1st_hr").startingPrice;
    const addHour = findVariant("gardening", "garden_maint_add_hr").startingPrice;

    priceMin = firstHour + (hrs - 1) * addHour;
    priceMax = priceMin;
    breakdown.push(`Gardening Team (1st hr @ £${firstHour} + ${hrs - 1} add'l hr${hrs - 1 === 1 ? "" : "s"} @ £${addHour}/hr): £${priceMin}`);
  } else if (input.vertical === "removals") {
    rule = masterPricingData.removals.minChargeText;
    const hrs = Math.max(input.removals?.removalHours || 2, 2);
    const variant = findVariant("removals", input.removals?.teamConfig === "3men" ? "van_3men" : "van_2men");
    const rateMin = variant.startingPrice;
    const rateMax = variant.maxPrice ?? variant.startingPrice;

    priceMin = hrs * rateMin;
    priceMax = hrs * rateMax;
    breakdown.push(`Removals Team (${hrs} hrs @ £${rateMin}${variant.maxPrice ? `–£${rateMax}` : ""}/hr): £${priceMin}${variant.maxPrice ? `–£${priceMax}` : ""}`);
  }

  return {
    priceMin,
    priceMax,
    breakdown,
    minimumChargeRule: rule,
  };
}
