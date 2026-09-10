import { Timestamp } from "firebase/firestore";

export type StaffRole = 
  | "lead_cleaner" 
  | "pest_technician" 
  | "gardener" 
  | "mover_driver";

export type DispatchStatus = 
  | "unassigned" 
  | "assigned" 
  | "dispatched" 
  | "on_site" 
  | "completed";

export interface StaffMemberItem {
  id: string; // e.g. STF-001
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  assignedCategory: "cleaning" | "pest" | "gardening" | "removals";
  status: "active" | "on_leave" | "inactive";
  dailyCapacityCount: number; // Max jobs per day (default 3)
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}
