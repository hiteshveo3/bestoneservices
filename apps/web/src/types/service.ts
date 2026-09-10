import { Timestamp } from "firebase/firestore";

export type ServiceStatus = "draft" | "published" | "archived";

export type ServicePricingType = 
  | "flat_rate" 
  | "property_size_matrix" 
  | "hourly" 
  | "package_tiers";

export interface PropertySizePriceMatrix {
  studioPence: number;
  oneBedPence: number;
  twoBedPence: number;
  threeBedPence: number;
  fourBedPence: number;
  fiveBedPlusPence?: number;
}

export interface ServiceAddOnItem {
  id: string;
  name: string;
  pricePence: number;
  description?: string;
}

export interface ServicePackageItem {
  id: string;
  categoryId: "cleaning" | "pest" | "gardening" | "removals";
  name: string;
  slug: string;
  shortDescription: string;
  badgeLabel?: string;
  status: ServiceStatus;
  pricingType: ServicePricingType;

  // Base pricing
  basePricePence: number;

  // Optional Pricing Matrix extensions
  propertySizeMatrix?: PropertySizePriceMatrix;
  hourlyRatePence?: number;
  minHours?: number;

  // Package tiers
  packageTiers?: Array<{
    id: string;
    name: string;
    visitsCount: number;
    pricePence: number;
    guaranteeText?: string;
  }>;

  addOns?: ServiceAddOnItem[];
  features: string[];
  factorsAffectingPrice?: string[];

  minBookingChargePence?: number;
  guaranteeText?: string;

  version: number;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface GlobalPricingRules {
  id: "pricing_engine";
  weekendMultiplier: number; // e.g. 1.15 (+15%)
  nightEmergencySurchargePence: number; // e.g. 5000 (£50)
  minimumDomesticChargePence: number; // e.g. 6000 (£60)
  vatRatePercentage: number; // e.g. 20 for UK 20% VAT
  updatedAt?: Timestamp | string;
  updatedByUid?: string;
}
