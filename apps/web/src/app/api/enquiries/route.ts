import { FieldValue } from "firebase-admin/firestore";
import { siteConfig } from "@/config/site";
import { enquirySchema } from "@/lib/enquiry-schema";
import { getFirebaseDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ ok: false, message: "Request not allowed." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 24_000) {
    return Response.json({ ok: false, message: "The enquiry is too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = {
        ...Object.fromEntries(formData.entries()),
        privacyConsent: formData.has("privacyConsent"),
      };
    }
  } catch {
    return Response.json({ ok: false, message: "Invalid enquiry data." }, { status: 400 });
  }

  const result = enquirySchema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      {
        ok: false,
        message: "Check the highlighted details and try again.",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const enquiry = result.data;
    const document = await getFirebaseDb().collection("enquiries").add({
      fullName: enquiry.fullName,
      email: enquiry.email.toLowerCase(),
      phone: enquiry.phone ?? null,
      service: enquiry.service,
      propertyType: enquiry.propertyType,
      bedrooms:
        enquiry.service === "end-of-tenancy-cleaning" ? enquiry.bedrooms : null,
      pestType: enquiry.service === "pest-control" ? enquiry.pestType ?? null : null,
      postcode: enquiry.postcode.toUpperCase(),
      preferredDate: enquiry.preferredDate ?? null,
      message: enquiry.message ?? null,
      privacyConsent: true,
      source: "website",
      sourcePath: enquiry.sourcePath,
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });

    return Response.json({
      ok: true,
      reference: document.id.slice(0, 8).toUpperCase(),
      message:
        "Thanks. Your enquiry has been received. We will review your requirements and contact you using the details provided.",
    });
  } catch (error) {
    const notConfigured =
      error instanceof Error && error.message === "FIREBASE_NOT_CONFIGURED";

    return Response.json(
      {
        ok: false,
        code: notConfigured ? "FORM_NOT_CONNECTED" : "SUBMISSION_FAILED",
        message: notConfigured
          ? `The online form is ready but Firebase is not connected yet. Please email ${siteConfig.email}.`
          : `We could not save the enquiry. Please try again or email ${siteConfig.email}.`,
      },
      { status: 503 },
    );
  }
}
