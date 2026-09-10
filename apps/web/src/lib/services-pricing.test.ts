import { describe, it, expect } from "vitest";
import { 
  calculateServiceEstimatePence, 
  isValidServiceStatusTransition 
} from "./pricing-engine";
import { type ServicePackageItem, type GlobalPricingRules } from "@/types/service";

describe("Phase 5 Services & Pricing Engine Domain Rules", () => {
  const samplePropertyService: ServicePackageItem = {
    id: "cleaning_end_of_tenancy",
    categoryId: "cleaning",
    name: "End of Tenancy Cleaning",
    slug: "end-of-tenancy",
    shortDescription: "Deep checkout cleaning for tenants & landlords",
    status: "published",
    pricingType: "property_size_matrix",
    basePricePence: 13000,
    propertySizeMatrix: {
      studioPence: 13000,
      oneBedPence: 20000,
      twoBedPence: 23000,
      threeBedPence: 30000,
      fourBedPence: 35000,
    },
    addOns: [
      { id: "carpet", name: "Carpet Steam Clean", pricePence: 3500 },
      { id: "mattress", name: "Double Mattress Clean", pricePence: 5000 },
    ],
    features: ["48-Hour Guarantee", "Oven Clean Included"],
    version: 1,
  };

  const sampleHourlyService: ServicePackageItem = {
    id: "cleaning_domestic_hourly",
    categoryId: "cleaning",
    name: "Regular Domestic Cleaning",
    slug: "domestic-cleaning",
    shortDescription: "Hourly house cleaning service",
    status: "published",
    pricingType: "hourly",
    basePricePence: 2200,
    hourlyRatePence: 2200,
    minHours: 3,
    minBookingChargePence: 6000,
    features: ["General house tidy"],
    version: 1,
  };

  const sampleRules: GlobalPricingRules = {
    id: "pricing_engine",
    weekendMultiplier: 1.15,
    nightEmergencySurchargePence: 5000,
    minimumDomesticChargePence: 6000,
    vatRatePercentage: 20,
  };

  describe("calculateServiceEstimatePence", () => {
    it("resolves property size matrix rates correctly", () => {
      const resStudio = calculateServiceEstimatePence(samplePropertyService, { propertySize: "Studio" });
      expect(resStudio.totalPence).toBe(13000);

      const res2Bed = calculateServiceEstimatePence(samplePropertyService, { propertySize: "2 Bed" });
      expect(res2Bed.totalPence).toBe(23000);

      const res4Bed = calculateServiceEstimatePence(samplePropertyService, { propertySize: "4 Bed" });
      expect(res4Bed.totalPence).toBe(35000);
    });

    it("includes selected add-on prices", () => {
      const res = calculateServiceEstimatePence(samplePropertyService, {
        propertySize: "1 Bed",
        selectedAddOnIds: ["carpet", "mattress"],
      });
      // 20000 + 3500 + 5000 = 28500 pence
      expect(res.subtotalPence).toBe(28500);
      expect(res.totalPence).toBe(28500);
      expect(res.addOnsPence).toBe(8500);
    });

    it("enforces minimum hours rule on hourly services", () => {
      // Customer selected 1 hr, but minHours is 3
      const res = calculateServiceEstimatePence(sampleHourlyService, { hoursCount: 1 });
      // 3 hrs * 2200 = 6600 pence
      expect(res.subtotalPence).toBe(6600);
    });

    it("applies weekend multiplier surcharge (+15%)", () => {
      const res = calculateServiceEstimatePence(
        samplePropertyService,
        { propertySize: "Studio", isWeekend: true },
        sampleRules
      );
      // Base: 13000 pence. Surcharge: 13000 * 0.15 = 1950 pence. Total: 14950 pence.
      expect(res.surchargesPence).toBe(1950);
      expect(res.totalPence).toBe(14950);
    });

    it("applies night emergency slot surcharge (£50)", () => {
      const res = calculateServiceEstimatePence(
        samplePropertyService,
        { propertySize: "Studio", isNightEmergency: true },
        sampleRules
      );
      // Base: 13000 pence. Surcharge: 5000 pence. Total: 18000 pence.
      expect(res.surchargesPence).toBe(5000);
      expect(res.totalPence).toBe(18000);
    });
  });

  describe("isValidServiceStatusTransition", () => {
    it("validates draft -> published and draft -> archived transitions", () => {
      expect(isValidServiceStatusTransition("draft", "published")).toBe(true);
      expect(isValidServiceStatusTransition("draft", "archived")).toBe(true);
    });

    it("validates published -> draft and published -> archived transitions", () => {
      expect(isValidServiceStatusTransition("published", "draft")).toBe(true);
      expect(isValidServiceStatusTransition("published", "archived")).toBe(true);
    });
  });
});
