export interface UserAuthContext {
  uid: string;
  role: string;
}

export interface BookingResourceData {
  id: string;
  customerId?: string | null;
  status: string;
  pricing: Record<string, unknown>;
}

export interface NotificationResourceData {
  id: string;
  recipientId: string;
}

export const fsRulesMatrixValidator = {
  canReadBooking(auth: UserAuthContext | null, resource: BookingResourceData): { allowed: boolean; reason?: string } {
    if (!auth) return { allowed: false, reason: "UNAUTHENTICATED_READ_DENIED" };
    if (auth.role === "admin") return { allowed: true };
    if (resource.customerId === auth.uid) return { allowed: true };
    return { allowed: false, reason: "CROSS_CUSTOMER_READ_DENIED" };
  },

  canWriteBooking(auth: UserAuthContext | null): { allowed: boolean; reason?: string } {
    if (!auth) return { allowed: false, reason: "UNAUTHENTICATED_WRITE_DENIED" };
    if (auth.role === "admin") return { allowed: true };
    return { allowed: false, reason: "CUSTOMER_DIRECT_WRITE_DENIED" };
  },

  canReadInternalNotes(auth: UserAuthContext | null): { allowed: boolean; reason?: string } {
    if (auth && auth.role === "admin") return { allowed: true };
    return { allowed: false, reason: "ADMIN_ONLY_SUBCOLLECTION" };
  },

  canReadAuditLogs(auth: UserAuthContext | null): { allowed: boolean; reason?: string } {
    if (auth && auth.role === "admin") return { allowed: true };
    return { allowed: false, reason: "ADMIN_ONLY_COLLECTION" };
  },

  canReadNotification(auth: UserAuthContext | null, resource: NotificationResourceData): { allowed: boolean; reason?: string } {
    if (!auth) return { allowed: false, reason: "UNAUTHENTICATED_READ_DENIED" };
    if (auth.role === "admin") return { allowed: true };
    if (resource.recipientId === auth.uid) return { allowed: true };
    return { allowed: false, reason: "RECIPIENT_MISMATCH_DENIED" };
  },
};
