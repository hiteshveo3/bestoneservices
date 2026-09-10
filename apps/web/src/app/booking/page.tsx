import type { Metadata } from "next";
import { Suspense } from "react";
import { ModernBookingWizard } from "@/components/booking/modern-wizard";

export const metadata: Metadata = {
  title: "Book Property Services Online",
  description: "Secure online booking request for End of Tenancy cleaning, Pest Control, Gardening, and House Removals across Greater London.",
  alternates: { canonical: "/booking/" },
};

export default function BookingPage() {
  return (
    <main id="main-content" className="text-start min-h-screen">
      <Suspense fallback={<div className="p-12 text-center bg-[#F9FCF5] rounded-[18px] border border-[#B7F56A]">Loading booking form...</div>}>
        <ModernBookingWizard />
      </Suspense>
    </main>
  );
}
