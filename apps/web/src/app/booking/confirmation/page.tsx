import { Suspense } from "react";
import { CheckCircle2, Mail, Phone, MapPin, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";

interface ConfirmationPageProps {
  searchParams: Promise<{ id?: string; service?: string }>;
}

export const metadata = {
  title: "Booking Confirmed | Best One Services",
};

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const resolvedParams = await searchParams;
  const bookingId = resolvedParams.id || "BOOKING-001";
  const service = resolvedParams.service || "cleaning";

  const serviceNames: Record<string, string> = {
    cleaning: "End of Tenancy Cleaning",
    pest: "Pest Control",
    gardening: "Gardening",
    removals: "House Removals",
  };

  // Attempt to fetch actual booking details from local store
  let bookingDate: string | null = null;
  let customerAddress: string | null = null;
  try {
    const { getAllStoredBookings } = await import("@/lib/booking-store");
    const stored = getAllStoredBookings();
    const found = stored.find((b) => b.id === bookingId || b.reference === bookingId);
    if (found) {
      bookingDate = found.scheduling?.requestedDate ? `${found.scheduling.requestedDate} (${found.scheduling.requestedTimeSlot || "morning"})` : null;
      customerAddress = found.address ? `${found.address.addressLine1}, ${found.address.postcode}` : null;
    }
  } catch (e) {
    // ignore
  }

  return (
    <main id="main-content" className="min-h-screen bg-[#F9FCF5] py-12 px-4 text-start">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#DCFAB7]/70 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-[#1F3A00]" />
          </div>

          <h1 className="font-heading text-4xl font-medium text-ink-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-ink-500">
            Thank you for your booking. We&apos;ll be in touch shortly.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-[#F9FCF5] rounded-[18px] border border-[#B7F56A] p-8 mb-8 space-y-6">
          {/* Reference Number */}
          <div className="border-b border-[#E5FBC9] pb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-500 mb-1">Booking Reference</p>
              <p className="font-mono font-bold text-2xl text-[#1F3A00]">
                {bookingId}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-bold font-mono">
              CONFIRMED
            </span>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#DCFAB7]/70 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-[#1F3A00]" />
              </div>
              <div>
                <p className="text-sm text-ink-500 mb-1">Service</p>
                <p className="font-medium text-ink-600">
                  {serviceNames[service] || service}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#DCFAB7]/70 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-[#1F3A00]" />
              </div>
              <div>
                <p className="text-sm text-ink-500 mb-1">Preferred Date & Window</p>
                <p className="font-medium text-ink-600">
                  {bookingDate || "We'll confirm your exact date shortly"}
                </p>
              </div>
            </div>

            {customerAddress && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[18px] bg-[#DCFAB7]/70 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#1F3A00]" />
                </div>
                <div>
                  <p className="text-sm text-ink-500 mb-1">Service Address</p>
                  <p className="font-medium text-ink-600">
                    {customerAddress}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[18px] bg-[#DCFAB7]/70 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-[#1F3A00]" />
              </div>
              <div>
                <p className="text-sm text-ink-500 mb-1">Next Step</p>
                <p className="font-medium text-ink-600">
                  Check your email for confirmation details & operations dispatch
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-[#F9FCF5] rounded-[18px] border border-[#B7F56A] p-8 mb-8">
          <h2 className="font-heading text-2xl font-medium text-ink-900 mb-6">
            What Happens Next?
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F3A00] text-white font-medium shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-ink-600">Confirmation Email</p>
                <p className="text-sm text-ink-500">
                  You&apos;ll receive an email with your booking details
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F3A00] text-white font-medium shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-ink-600">We&apos;ll Call You</p>
                <p className="text-sm text-ink-500">
                  Our team will confirm the exact time and discuss your needs
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F3A00] text-white font-medium shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-ink-600">Service Completion</p>
                <p className="text-sm text-ink-500">
                  Our team arrives and completes your service with care
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#DCFAB7]/50 rounded-[18px] border border-[#99D055]/30 p-8 mb-8">
          <h3 className="font-heading text-xl font-medium text-ink-900 mb-4">
            Need Help?
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#1F3A00]" />
              <a href="tel:+442071234567" className="text-[#1F3A00] font-medium hover:underline">
                +44 (0) 207 123 4567
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#1F3A00]" />
              <a href="mailto:support@bestoneservices.com" className="text-[#1F3A00] font-medium hover:underline">
                support@bestoneservices.com
              </a>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <ButtonLink href="/" variant="dark" className="flex-1 text-center">
            Back to Home
          </ButtonLink>
          <ButtonLink href="/booking/" variant="outline" className="flex-1 text-center">
            Make Another Booking
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
