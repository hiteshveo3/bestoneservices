import { describe, it, expect } from "vitest";
import {
  SERVICES_DIRECTORY,
  type DirectoryService,
  type ServiceCategory,
  type JobType,
  type PropertySize,
} from "@/content/service-directory";
import { matchesFilters, type FilterState } from "@/lib/use-service-filters";
import { checkPostcodeAvailability } from "@/lib/coverage-data";

describe("Service Directory Data Integrity", () => {
  it("contains services across all 4 verticals", () => {
    const categories = new Set(SERVICES_DIRECTORY.map((s) => s.category));
    expect(categories.has("cleaning")).toBe(true);
    expect(categories.has("pest-control")).toBe(true);
    expect(categories.has("gardening")).toBe(true);
    expect(categories.has("removals")).toBe(true);
  });

  it("every service has valid required metadata", () => {
    for (const service of SERVICES_DIRECTORY) {
      expect(service.id).toBeTruthy();
      expect(service.name).toBeTruthy();
      expect(service.category).toBeTruthy();
      expect(service.categoryLabel).toBeTruthy();
      expect(service.subService).toBeTruthy();
      expect(service.jobTypes.length).toBeGreaterThan(0);
      expect(service.startingPrice).toMatch(/^From/);
      expect(service.startingPriceNum).toBeGreaterThan(0);
      expect(typeof service.emergencyEligible).toBe("boolean");
      expect(service.href).toBeTruthy();
      expect(service.ctaText).toMatch(/Get Instant Quote|Book This Service/);
      expect(service.description.length).toBeGreaterThan(15);
      expect(service.imageSrc).toBeTruthy();
    }
  });

  it("cleaning and removals services have property sizes defined", () => {
    const propertySized = SERVICES_DIRECTORY.filter(
      (s) => s.category === "cleaning" || (s.category === "removals" && s.id !== "office-commercial-removals")
    );
    for (const s of propertySized) {
      expect(s.propertySizes).toBeDefined();
      expect(s.propertySizes!.length).toBeGreaterThan(0);
    }
  });
});

describe("Faceted Filter Logic (matchesFilters)", () => {
  const baseState: FilterState = {
    query: "",
    categories: [],
    jobTypes: [],
    propertySizes: [],
    urgency: "all",
    postcode: "",
    sort: "relevance",
  };

  it("matches all services when state is empty", () => {
    for (const service of SERVICES_DIRECTORY) {
      expect(matchesFilters(service, baseState)).toBe(true);
    }
  });

  it("matches free-text queries in title and aliases (e.g. 'mice')", () => {
    const miceService = SERVICES_DIRECTORY.find((s) => s.id === "mice-control")!;
    expect(matchesFilters(miceService, { ...baseState, query: "mice" })).toBe(true);
    expect(matchesFilters(miceService, { ...baseState, query: "mouse" })).toBe(true);
    expect(matchesFilters(miceService, { ...baseState, query: "droppings" })).toBe(true);

    const ovenService = SERVICES_DIRECTORY.find((s) => s.id === "oven-appliance-cleaning")!;
    expect(matchesFilters(ovenService, { ...baseState, query: "oven" })).toBe(true);
    expect(matchesFilters(ovenService, { ...baseState, query: "hob" })).toBe(true);
  });

  it("filters accurately by single and multi-categories", () => {
    const pestService = SERVICES_DIRECTORY.find((s) => s.category === "pest-control")!;
    const cleaningService = SERVICES_DIRECTORY.find((s) => s.category === "cleaning")!;
    const gardeningService = SERVICES_DIRECTORY.find((s) => s.category === "gardening")!;

    expect(matchesFilters(pestService, { ...baseState, categories: ["pest-control"] })).toBe(true);
    expect(matchesFilters(cleaningService, { ...baseState, categories: ["pest-control"] })).toBe(false);

    expect(
      matchesFilters(cleaningService, { ...baseState, categories: ["cleaning", "gardening"] })
    ).toBe(true);
    expect(
      matchesFilters(gardeningService, { ...baseState, categories: ["cleaning", "gardening"] })
    ).toBe(true);
    expect(
      matchesFilters(pestService, { ...baseState, categories: ["cleaning", "gardening"] })
    ).toBe(false);
  });

  it("filters accurately by job type", () => {
    const recurringService = SERVICES_DIRECTORY.find((s) => s.id === "domestic-regular-cleaning")!;
    expect(matchesFilters(recurringService, { ...baseState, jobTypes: ["recurring"] })).toBe(true);
    expect(matchesFilters(recurringService, { ...baseState, jobTypes: ["inspection"] })).toBe(false);
  });

  it("filters accurately by property size", () => {
    const studioService = SERVICES_DIRECTORY.find((s) => s.id === "end-of-tenancy-cleaning")!;
    expect(matchesFilters(studioService, { ...baseState, propertySizes: ["studio"] })).toBe(true);

    // Office commercial removals should not match studio
    const officeService = SERVICES_DIRECTORY.find((s) => s.id === "office-commercial-removals")!;
    expect(matchesFilters(officeService, { ...baseState, propertySizes: ["studio"] })).toBe(false);
    expect(matchesFilters(officeService, { ...baseState, propertySizes: ["commercial"] })).toBe(true);
  });

  it("filters accurately by emergency urgency", () => {
    const emergencyService = SERVICES_DIRECTORY.find((s) => s.id === "wasp-treatment")!;
    expect(emergencyService.emergencyEligible).toBe(true);
    expect(matchesFilters(emergencyService, { ...baseState, urgency: "emergency" })).toBe(true);

    const nonEmergencyService = SERVICES_DIRECTORY.find((s) => s.id === "pest-inspection-survey")!;
    expect(nonEmergencyService.emergencyEligible).toBe(false);
    expect(matchesFilters(nonEmergencyService, { ...baseState, urgency: "emergency" })).toBe(false);
  });

  it("combines multiple criteria simultaneously (e.g. Pest Control + Emergency)", () => {
    const wasp = SERVICES_DIRECTORY.find((s) => s.id === "wasp-treatment")!;
    const inspection = SERVICES_DIRECTORY.find((s) => s.id === "pest-inspection-survey")!;
    const eot = SERVICES_DIRECTORY.find((s) => s.id === "end-of-tenancy-cleaning")!;

    const combinedState: FilterState = {
      ...baseState,
      categories: ["pest-control"],
      urgency: "emergency",
    };

    expect(matchesFilters(wasp, combinedState)).toBe(true);
    expect(matchesFilters(inspection, combinedState)).toBe(false); // not emergency
    expect(matchesFilters(eot, combinedState)).toBe(false); // not pest
  });
});

describe("Postcode Coverage Integration", () => {
  it("validates covered London outcodes", () => {
    const resIG1 = checkPostcodeAvailability("IG1 1AA");
    expect(resIG1.status).toBe("AVAILABLE");
    expect(resIG1.outcode).toBe("IG1");

    const resE14 = checkPostcodeAvailability("E14 9AA");
    expect(resE14.status).toBe("AVAILABLE");
    expect(resE14.outcode).toBe("E14");

    const resSW1 = checkPostcodeAvailability("SW1A 1AA");
    expect(resSW1.status).toBe("AVAILABLE");
    expect(resSW1.outcode).toBe("SW1A");
  });

  it("flags out-of-area postcodes as NEEDS_CONFIRMATION", () => {
    const resBirm = checkPostcodeAvailability("B1 1AA");
    expect(resBirm.status).toBe("NEEDS_CONFIRMATION");
  });
});
