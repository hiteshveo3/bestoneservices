import { Timestamp } from "firebase/firestore";

export type EstimateStatus = 
  | "draft" 
  | "sent" 
  | "accepted" 
  | "converted_to_booking" 
  | "declined" 
  | "expired";

export interface EstimateItem {
  id: string; // e.g. EST-2026-84920
  reference: string; // EST-2026-84920
  accessToken?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  serviceId: string;
  serviceName: string;
  categoryId: "cleaning" | "pest" | "gardening" | "removals";

  // Specifications
  specifications: {
    propertySize?: string;
    hoursCount?: number;
    selectedTierId?: string;
    selectedAddOnNames?: string[];
    isWeekend?: boolean;
    isNightEmergency?: boolean;
    notes?: string;
  };

  // Financial breakdown in pence
  subtotalPence: number;
  addOnsPence: number;
  surchargesPence: number;
  totalPence: number;
  breakdown: string[];

  status: EstimateStatus;
  validUntil: Timestamp | string;

  // Conversion metadata
  convertedBookingId?: string;
  convertedBookingReference?: string;
  convertedAt?: Timestamp | string;

  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}
