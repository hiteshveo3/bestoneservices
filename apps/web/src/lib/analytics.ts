declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type BookingEventName = 
  | "service_selected"
  | "postcode_checked"
  | "estimate_started"
  | "estimate_completed"
  | "booking_started"
  | "booking_step_completed"
  | "booking_submitted"
  | "booking_failed";

export interface BookingEventPayload {
  vertical?: string;
  serviceId?: string;
  step?: number;
  postcodeOutcode?: string;
  estimatedPriceMin?: number;
  errorMessage?: string;
}

export function trackBookingEvent(event: BookingEventName, payload?: BookingEventPayload) {
  if (typeof window === "undefined") return;
  
  // Safe console telemetry for development & analytics dispatch ready
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics Event] ${event}`, payload);
  }

  // Push to dataLayer if Google Tag Manager / Analytics is configured
  if (window.dataLayer) {
    window.dataLayer.push({
      event,
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
}
