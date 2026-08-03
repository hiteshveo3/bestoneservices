import "server-only";

import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import type { BookingStatus } from "@/lib/booking";

export type CustomerBooking = {
  id: string;
  reference: string;
  serviceCategory: string;
  serviceSlug: string;
  status: BookingStatus;
  preferredDate?: string;
  preferredTime?: string;
  createdAt?: { toDate?: () => Date } | Date;
};

export async function getCustomerBookings(uid: string, email?: string | null) {
  if (!isFirebaseConfigured()) return [] as CustomerBooking[];
  const db = getFirebaseDb();
  const byAccount = await db.collection("bookings").where("customerUid", "==", uid).get();
  const legacy = email ? await db.collection("bookings").where("email", "==", email.toLowerCase()).get() : null;
  const rows = new Map<string, CustomerBooking>();
  for (const snapshot of [byAccount, legacy].filter(Boolean)) for (const doc of snapshot!.docs) rows.set(doc.id, { id: doc.id, ...(doc.data() as Omit<CustomerBooking, "id">) });
  return [...rows.values()].sort((a, b) => {
    const left = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt?.toDate?.().getTime() ?? 0;
    const right = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt?.toDate?.().getTime() ?? 0;
    return right - left;
  });
}

export function serviceLabel(booking: Pick<CustomerBooking, "serviceCategory" | "serviceSlug">) {
  if (booking.serviceCategory === "end-of-tenancy-cleaning") return "End of tenancy cleaning";
  return booking.serviceSlug.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}
