import { Timestamp } from "firebase/firestore";

export type ReviewStatus = 
  | "pending_approval" 
  | "published" 
  | "flagged";

export type DisputeStatus = 
  | "open" 
  | "under_review" 
  | "re_clean_scheduled" 
  | "resolved" 
  | "rejected";

export type DisputeType = 
  | "re_clean_guarantee_claim" 
  | "quality_issue" 
  | "pricing_dispute" 
  | "damage_claim";

export interface ReviewItem {
  id: string; // e.g. REV-2026-84920
  bookingId: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;

  staffId?: string;
  staffName?: string;
  serviceCategory: "cleaning" | "pest" | "gardening" | "removals";

  rating: number; // 1 to 5 stars
  reviewText: string;
  status: ReviewStatus;

  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface DisputeItem {
  id: string; // e.g. DSP-2026-84920
  bookingId: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  disputeType: DisputeType;
  description: string;
  photoUrls?: string[];

  status: DisputeStatus;
  resolutionNotes?: string;
  reCleanBookingReference?: string;

  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}
