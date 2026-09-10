import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateLogId, formatTriggerMessage } from "@/lib/communication-domain";
import { requireRole } from "@/lib/roles";

const TriggerSendSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  bookingReference: z.string().min(1, "Booking reference is required"),
  recipientEmail: z.string().email("Valid email is required"),
  recipientPhone: z.string().optional(),
  channel: z.enum(["email", "sms"]).default("email"),
  triggerEvent: z.enum([
    "booking_confirmation",
    "reminder_24h",
    "staff_dispatched",
    "invoice_issued",
    "re_clean_approved",
  ]),
});

export async function POST(req: Request) {
  let db;
  const adminUser = await requireRole(req, "admin");
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized: Admin auth required" }, { status: 401 });
  }

  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const parsed = TriggerSendSchema.parse(body);

    const bookingSnap = await db.collection("bookings").doc(parsed.bookingId).get();
    if (!bookingSnap.exists || bookingSnap.data()?.reference !== parsed.bookingReference) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const logId = generateLogId();
    const serverNow = FieldValue.serverTimestamp();
    const messageSnippet = formatTriggerMessage(parsed.triggerEvent, parsed.bookingReference);

    const logData = {
      id: logId,
      bookingId: parsed.bookingId,
      bookingReference: parsed.bookingReference,
      recipientEmail: parsed.recipientEmail.toLowerCase().trim(),
      recipientPhone: parsed.recipientPhone || null,
      channel: parsed.channel,
      triggerEvent: parsed.triggerEvent,
      messageSnippet,
      status: "provider_unavailable",
      attemptedAt: serverNow,
      sentAt: null,
    };

    await db.collection("communication_logs").doc(logId).set(logData);

    return NextResponse.json({
      success: false,
      log: logData,
      error: "COMMUNICATION_PROVIDER_UNAVAILABLE",
      message: `No approved ${parsed.channel.toUpperCase()} provider is configured; nothing was dispatched.`,
    }, { status: 503 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Trigger notification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
