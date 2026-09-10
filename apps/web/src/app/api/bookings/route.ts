import { NextRequest, NextResponse } from "next/server";
import { saveStoredBooking, getAllStoredBookings } from "@/lib/booking-store";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import { type BookingItem, type BookingCategory } from "@/types/booking";

interface BookingPayload {
  service: string;
  date: string;
  timeRange: string;
  address: string;
  postcode: string;
  name: string;
  email: string;
  phone: string;
  bedrooms?: string;
  notes?: string;
}

const SERVICE_LABELS: Record<string, { name: string; category: BookingCategory; minPricePence: number }> = {
  cleaning: { name: "End of Tenancy Cleaning", category: "cleaning", minPricePence: 13000 },
  pest: { name: "Pest Control Emergency", category: "pest", minPricePence: 8900 },
  gardening: { name: "Garden Maintenance & Clearance", category: "gardening", minPricePence: 7000 },
  removals: { name: "House Removals (Man & Van)", category: "removals", minPricePence: 8000 },
};

export async function GET() {
  try {
    const bookings = getAllStoredBookings();
    return NextResponse.json({ bookings, count: bookings.length });
  } catch (err) {
    console.error("Error retrieving stored bookings:", err);
    return NextResponse.json({ bookings: [], count: 0 }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json();

    if (
      !body.service ||
      !body.date ||
      !body.timeRange ||
      !body.address ||
      !body.postcode ||
      !body.name ||
      !body.email ||
      !body.phone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const bookingId = `BOS-${timestamp}-${randomSuffix}`;
    const reference = `BOS-${timestamp.toString().slice(-6).toUpperCase()}`;

    const serviceInfo = SERVICE_LABELS[body.service] || {
      name: body.service,
      category: "cleaning" as BookingCategory,
      minPricePence: 10000,
    };

    const bookingItem: BookingItem = {
      id: bookingId,
      reference,
      version: 1,
      customerId: null,
      customerSnapshot: {
        fullName: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        serviceAddress: {
          addressLine1: body.address.trim(),
          city: "London",
          postcode: body.postcode.trim().toUpperCase(),
          normalizedPostcode: body.postcode.replace(/\s+/g, "").toUpperCase(),
          instructions: body.notes?.trim(),
        },
      },
      emailLower: body.email.trim().toLowerCase(),
      phoneNormalized: body.phone.replace(/\D/g, ""),
      postcodeNormalized: body.postcode.replace(/\s+/g, "").toUpperCase(),
      categoryId: serviceInfo.category,
      serviceId: body.service,
      serviceNameSnapshot: serviceInfo.name,
      status: "new",
      serviceDetails: {
        bedrooms: body.bedrooms || "N/A",
        timeRange: body.timeRange,
      },
      address: {
        addressLine1: body.address.trim(),
        city: "London",
        postcode: body.postcode.trim().toUpperCase(),
        normalizedPostcode: body.postcode.replace(/\s+/g, "").toUpperCase(),
        instructions: body.notes?.trim(),
      },
      scheduling: {
        requestedDate: body.date,
        requestedTimeSlot: (body.timeRange as "morning" | "afternoon" | "evening") || "morning",
        timezone: "Europe/London",
      },
      pricing: {
        estimateMinPence: serviceInfo.minPricePence,
        estimateMaxPence: serviceInfo.minPricePence + 5000,
        minimumChargeRule: "Standard London service baseline",
      },
      notes: body.notes?.trim() || "",
      source: "website",
      createdAt: { seconds: Math.floor(timestamp / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(timestamp / 1000), nanoseconds: 0 } as any,
    };

    // 1. Persist to local JSON store (Guarantees local persistence on disk)
    saveStoredBooking(bookingItem);

    // 2. Persist to Firestore if configured
    if (isFirebaseConfigured()) {
      try {
        const db = getFirebaseDb();
        await db.collection("bookings").doc(bookingId).set(bookingItem);
      } catch (dbErr) {
        console.warn("[FIRESTORE_WRITE_WARNING] Could not write to remote Firestore:", dbErr);
      }
    }

    // 3. Email Dispatch Simulation & Server Log
    console.log(`
======================================================
[ADMIN BOOKING NOTIFICATION RECEIVED]
Reference: ${reference} (${bookingId})
Customer: ${bookingItem.customerSnapshot.fullName}
Email: ${bookingItem.customerSnapshot.email}
Phone: ${bookingItem.customerSnapshot.phone}
Service: ${bookingItem.serviceNameSnapshot}
Date: ${bookingItem.scheduling.requestedDate} (${bookingItem.scheduling.requestedTimeSlot})
Address: ${bookingItem.address.addressLine1}, ${bookingItem.address.postcode}
Bedrooms: ${body.bedrooms || "Not specified"}
Notes: ${body.notes || "None"}
Status: NEW -> Visible in Operations Dashboard at /admin/bookings
======================================================
`);

    return NextResponse.json(
      {
        id: bookingId,
        reference,
        message: "Booking received successfully and saved to operations queue.",
        status: "new",
        booking: bookingItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
