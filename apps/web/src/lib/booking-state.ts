export interface BookingStateData {
  vertical: "cleaning" | "pest" | "gardening" | "removals";
  serviceId: string;
  serviceName: string;
  postcode: string;
  addressLine1?: string;
  destinationPostcode?: string;
  
  // Cleaning
  cleaningSubcategory?: "endOfTenancy" | "domestic";
  propertySize?: "studio" | "1bed" | "2bed" | "3bed" | "4bed";
  carpetCleaning?: boolean;
  ovenCleaning?: boolean;

  // Pest
  pestType?: "rodents" | "bedbugs" | "wasps";
  treatmentPlan?: "single" | "2visit" | "3visit";
  nightEmergency?: boolean;

  // Gardening
  gardeningType?: "maintenance" | "clearance";
  gardeningHours?: number;
  wasteBags?: number;

  // Removals
  teamConfig?: "2men" | "3men";
  removalHours?: number;
  packingOption?: "none" | "standard" | "club";

  // Date & Time
  preferredDate?: string;
  timeSlot?: "morning" | "afternoon" | "evening";

  // Contact Info
  fullName?: string;
  phone?: string;
  email?: string;
  notes?: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;

  // Pricing
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  priceLabel?: string;

  currentStep: number;
}

const STORAGE_KEY = "bestone_booking_session_v1";

export const DEFAULT_BOOKING_STATE: BookingStateData = {
  vertical: "cleaning",
  serviceId: "end-of-tenancy",
  serviceName: "End of Tenancy Cleaning",
  postcode: "",
  propertySize: "2bed",
  carpetCleaning: false,
  ovenCleaning: false,
  preferredDate: "",
  timeSlot: "morning",
  currentStep: 1,
};

export function loadBookingState(): BookingStateData {
  if (typeof window === "undefined") return DEFAULT_BOOKING_STATE;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BOOKING_STATE;
    return { ...DEFAULT_BOOKING_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_BOOKING_STATE;
  }
}

export function saveBookingState(data: Partial<BookingStateData>): BookingStateData {
  const current = loadBookingState();
  const updated = { ...current, ...data };
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save booking state to sessionStorage", e);
    }
  }
  return updated;
}

export function clearBookingState(): void {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}
