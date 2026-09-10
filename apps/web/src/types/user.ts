import { Timestamp, FieldValue } from "firebase/firestore";

export type UserRole = "customer" | "admin";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phone?: string | null;
  role: UserRole;
  status: "active" | "disabled";
  createdAt: Timestamp | FieldValue | null;
  updatedAt: Timestamp | FieldValue | null;
  lastLoginAt?: Timestamp | FieldValue | null;
}
