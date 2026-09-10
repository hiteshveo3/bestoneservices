export type AvailabilityMode = "preferred" | "live";

export interface AvailabilityRequest {
  serviceId: string;
  postcode?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  estimatedDurationHours?: number;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  timeWindow: "morning" | "afternoon" | "evening";
  windowLabel: string;
  isPreferredOnly: boolean;
}

export interface AvailabilityResponse {
  mode: AvailabilityMode;
  slots: AvailabilitySlot[];
  notice: string;
}

/** Current Mode: "preferred" (No fake live slots generated) */
export const CURRENT_AVAILABILITY_MODE: AvailabilityMode = "preferred";

/** Central Scheduling Provider Abstraction */
export async function getAvailability(_request: AvailabilityRequest): Promise<AvailabilityResponse> {
  if (CURRENT_AVAILABILITY_MODE === "live") {
    // Future integration with Google Calendar / Staff Dispatch API
    return {
      mode: "live",
      slots: [],
      notice: "Live technician allocation active.",
    };
  }

  // Preferred Mode (Accurate for current business operations)
  return {
    mode: "preferred",
    slots: [
      { id: "pref-morn", date: "", timeWindow: "morning", windowLabel: "Morning (08:00 - 12:00)", isPreferredOnly: true },
      { id: "pref-aft", date: "", timeWindow: "afternoon", windowLabel: "Afternoon (12:00 - 16:00)", isPreferredOnly: true },
      { id: "pref-eve", date: "", timeWindow: "evening", windowLabel: "Evening (16:00 - 20:00)", isPreferredOnly: true },
    ],
    notice: "Your requested date and arrival window are recorded as preferred choices. Dispatch will confirm team allocation within 2 hours.",
  };
}
