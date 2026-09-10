import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import { enforceRateLimit, getRequestFingerprint } from "@/lib/rate-limit";

const EnquirySchema = z.object({
  intent: z.enum(["existing", "guarantee", "general"]),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).optional(),
  phone: z.string().trim().min(5).max(30).optional(),
  contact: z.string().trim().min(5).max(254).optional(),
  bookingReference: z.string().trim().max(80).optional(),
  serviceCategory: z.enum(["cleaning", "pest", "gardening", "removals"]).optional(),
  message: z.string().trim().min(10).max(4000),
  privacyAccepted: z.literal(true),
}).superRefine((value, context) => {
  if (!value.email && !value.phone && !value.contact) {
    context.addIssue({ code: "custom", path: ["contact"], message: "A contact method is required" });
  }
});

export async function POST(request: Request) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "ENQUIRY_SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  try {
    const parsed = EnquirySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_ENQUIRY", issues: parsed.error.flatten() }, { status: 400 });
    }

    const input = parsed.data;
    const subject = input.email || input.phone || input.contact || input.fullName;
    const rateLimit = await enforceRateLimit({
      namespace: "contact-enquiry",
      fingerprint: getRequestFingerprint(request, subject),
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: "Too many enquiries. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const reference = `BOS-SUP-${new Date().getUTCFullYear()}-${randomBytes(8).toString("hex").toUpperCase()}`;
    const enquiry = {
      reference,
      intent: input.intent,
      fullName: input.fullName,
      email: input.email?.toLowerCase() || null,
      phone: input.phone || null,
      contact: input.contact || null,
      bookingReference: input.bookingReference?.toUpperCase() || null,
      serviceCategory: input.serviceCategory || null,
      message: input.message,
      privacyAccepted: true,
      privacyVersion: "2026-08",
      status: "new",
      source: "website",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await getFirebaseDb().collection("enquiries").doc(reference).create(enquiry);
    return NextResponse.json({ success: true, reference }, { status: 201 });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { error: "ENQUIRY_CREATION_FAILED", message: "We could not save your enquiry. Please try again." },
      { status: 503 },
    );
  }
}
