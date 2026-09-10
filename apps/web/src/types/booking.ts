import { Timestamp } from "firebase/firestore";

export type BookingStatus = 
  | "new" 
  | "awaiting_confirmation" 
  | "confirmed" 
  | "scheduled" 
  | "in_progress" 
  | "completed" 
  | "cancelled";

export type BookingCategory = "cleaning" | "pest" | "gardening" | "removals";

export interface BookingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  normalizedPostcode: string;
  instructions?: string;
}

export interface BookingCustomerSnapshot {
  fullName: string;
  email: string;
  phone: string;
  serviceAddress: BookingAddress;
}

export interface BookingSchedule {
  requestedDate: string;
  requestedTimeSlot: "morning" | "afternoon" | "evening";
  confirmedDate?: string;
  confirmedTimeSlot?: "morning" | "afternoon" | "evening";
  confirmedTimeExact?: string;
  timezone: "Europe/London";
}

export type PriceChangeReason = 
  | "additional_time"
  | "reduced_time"
  | "additional_work"
  | "customer_requested_extras"
  | "scope_differed_from_booking"
  | "discount_goodwill"
  | "correction"
  | "other";

export interface PriceAdjustmentRecord {
  oldPence: number;
  newPence: number;
  reason: PriceChangeReason;
  reasonDetails?: string;
  actorUid: string;
  actorName: string;
  actorRole: string;
  timestamp: Timestamp | string;
}

export interface BookingPricing {
  estimateMinPence: number;
  estimateMaxPence?: number;
  confirmedPence?: number;
  proposedAdjustmentPence?: number;
  adjustmentApprovalStatus?: "pending" | "approved" | "rejected";
  finalPence?: number;
  minimumChargeRule: string;
  priceHistory?: PriceAdjustmentRecord[];
}

export interface BookingHours {
  estimatedHours?: number;
  actualHours?: number;
  billableHours?: number;
}

export type BookingSource = "website" | "admin" | "mobile_app";

export interface BookingItem {
  id: string;
  reference: string;
  version: number;

  customerId?: string | null;
  customerSnapshot: BookingCustomerSnapshot;

  // Normalized search indexing fields
  emailLower: string;
  phoneNormalized: string;
  postcodeNormalized: string;

  categoryId: BookingCategory;
  serviceId: string;
  serviceNameSnapshot: string;

  status: BookingStatus;
  statusReason?: string;

  serviceDetails: Record<string, unknown>;

  address: BookingAddress;
  scheduling: BookingSchedule;
  pricing: BookingPricing;
  hours?: BookingHours;

  notes?: string;

  assignedStaffId?: string;
  assignedStaffName?: string;
  dispatchStatus?: "unassigned" | "assigned" | "dispatched" | "on_site" | "completed";

  source: BookingSource;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type BookingEventType = 
  | "created"
  | "status_changed"
  | "schedule_changed"
  | "pricing_adjusted"
  | "details_updated"
  | "cancelled";

export interface BookingEventItem {
  id: string;
  bookingId: string;
  type: BookingEventType;
  fromStatus?: BookingStatus;
  toStatus?: BookingStatus;
  actorUid: string;
  actorName: string;
  actorRole: "customer" | "admin" | "system";
  visibility: "internal" | "customer";
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp | string;
}

export interface InternalNoteItem {
  id: string;
  bookingId: string;
  authorUid: string;
  authorName: string;
  note: string;
  createdAt: Timestamp | string;
}
