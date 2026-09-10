import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import { enforceRateLimit, getRequestFingerprint } from "@/lib/rate-limit";

const BookingStatusSchema = z.object({
  reference: z.string().trim().toUpperCase().regex(/^BOS-\d{4}-(?:\d{6}|[A-F0-9]{20})$/),
  email: z.string().trim().toLowerCase().email().max(254),
});

export async function POST(request: Request) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "BOOKING_SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  const parsed = BookingStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "INVALID_LOOKUP" }, { status: 400 });

  const rateLimit = await enforceRateLimit({
    namespace: "booking-status",
    fingerprint: getRequestFingerprint(request, parsed.data.email),
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const snapshot = await getFirebaseDb().collection("bookings")
    .where("reference", "==", parsed.data.reference)
    .where("emailLower", "==", parsed.data.email)
    .limit(1)
    .get();
  if (snapshot.empty) return NextResponse.json({ error: "BOOKING_NOT_FOUND" }, { status: 404 });

  const document = snapshot.docs[0];
  const data = document.data();
  return NextResponse.json({
    booking: {
      id: document.id,
      reference: data.reference,
      categoryId: data.categoryId,
      serviceNameSnapshot: data.serviceNameSnapshot,
      status: data.status,
      customerSnapshot: {
        fullName: data.customerSnapshot?.fullName,
        serviceAddress: {
          city: data.customerSnapshot?.serviceAddress?.city,
          postcode: data.customerSnapshot?.serviceAddress?.postcode,
        },
      },
      scheduling: data.scheduling,
      address: {
        addressLine1: data.customerSnapshot?.serviceAddress?.addressLine1,
        city: data.customerSnapshot?.serviceAddress?.city,
        postcode: data.customerSnapshot?.serviceAddress?.postcode,
      },
      pricing: {
        estimateMinPence: data.financials?.estimateMinPence,
        confirmedPence: data.financials?.confirmedPence,
      },
    },
  });
}
