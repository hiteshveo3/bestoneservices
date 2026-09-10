import { Timestamp } from "firebase/firestore";

export interface NotificationItem {
  id: string;
  recipientId: string; // Auth UID or "admin"
  recipientRole: "admin" | "customer";
  type: "account" | "booking" | "estimate" | "invoice" | "support" | "system";
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  readAt?: Timestamp | null;
  createdAt: Timestamp | null;
}

export interface ActivityLogItem {
  id: string;
  actorId?: string;
  actorName?: string;
  actorRole?: "admin" | "customer" | "system";
  type: string;
  entityType?: string;
  entityId?: string;
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp | null;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  subtext?: string;
  status: "active" | "available" | "unavailable";
}
