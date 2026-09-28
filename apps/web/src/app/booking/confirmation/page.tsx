import { MessageCircle, Phone } from "lucide-react";
import { siteContact } from "@/config/site-contact";
import { Button, Eyebrow, Plaque, Stamp } from "@/components/touchstone";

interface ConfirmationPageProps {
  searchParams: Promise<{ id?: string; service?: string }>;
}

export const metadata = {
  title: "Booking received",
  robots: { index: false, follow: false },
};

/** Lab 03 S53: the stamp, where the job stands, the record, and what happens next. */
export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const resolvedParams = await searchParams;
  const bookingId = resolvedParams.id || "BOOKING-001";
  const service = resolvedParams.service || "cleaning";

  const serviceNames: Record<string, string> = {
    cleaning: "End of tenancy cleaning",
    pest: "Pest control",
    gardening: "Gardening",
    removals: "House removals",
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
  } catch {
    // No stored booking: the page still shows the reference.
  }

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const record: Array<[string, string]> = [
    ["Reference", bookingId],
    ["Service", serviceNames[service] || service],
    ["When", bookingDate || "We confirm the exact date with you"],
    ...(customerAddress ? ([["Where", customerAddress]] as Array<[string, string]>) : []),
  ];
  const next = [
    { title: "We check the details", desc: "The team reviews the property, the time and the price." },
    { title: "We confirm with you", desc: "By WhatsApp or phone, with the time window and who is coming." },
    { title: "The job, then the record", desc: "Uniformed team on the day; invoice and report afterwards." },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-[image:var(--grad-wash)] text-ink">
      <div className="mx-auto grid max-w-[760px] gap-6 px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid justify-items-start gap-4">
          <Stamp top="Received" main={today} small={`Ref ${bookingId}`} />
          <h1 className="ts-head m-0 text-[clamp(36px,5vw,52px)]">
            Booking received. <span className="ts-soft">Leave it with us.</span>
          </h1>
          <p className="m-0 text-lg text-muted">Nothing is charged now. We confirm the time and the fixed price with you before anyone comes out.</p>
        </div>

        {/* S44 B · where the job stands */}
        <div className="grid gap-2 rounded-2xl bg-white p-5">
          <div className="flex justify-between text-[13px] font-semibold">
            <span>Received</span>
            <span className="text-muted">Confirmed</span>
            <span className="text-muted">Done</span>
            <span className="text-muted">Report</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-stone" role="progressbar" aria-valuemin={0} aria-valuemax={4} aria-valuenow={1} aria-label="Booking received, step 1 of 4">
            <i className="block h-full w-1/4 rounded bg-[image:var(--grad-lime)]" />
          </div>
        </div>

        <dl className="ts-rows on-paper m-0 rounded-2xl bg-white p-2">
          {record.map(([k, v]) => (
            <div key={k} className="grid gap-1 px-3.5 py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
              <dt className="text-muted">{k}</dt>
              <dd className="m-0 font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-3">
          <Eyebrow>What happens next</Eyebrow>
          <ol className="m-0 grid list-none gap-2 p-0">
            {next.map((n, i) => (
              <li key={n.title} className="grid grid-cols-[42px_1fr] gap-3 rounded-2xl bg-white p-4">
                <Plaque n={i + 1} state={i === 0 ? "done" : undefined} />
                <span className="grid gap-0.5"><b>{n.title}</b><span className="text-[15px] text-muted">{n.desc}</span></span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button href={siteContact.getWhatsappUrl(`Hi Bestone, about my booking ${bookingId}.`)} size="lg" icon={<MessageCircle className="size-[18px]" aria-hidden="true" />}>WhatsApp about this booking</Button>
          <Button href={siteContact.phoneHref} variant="white" size="lg" icon={<Phone className="size-[18px]" aria-hidden="true" />}>{siteContact.phoneDisplay}</Button>
        </div>
        <Button href="/" variant="link" className="justify-self-start">Back to the homepage</Button>
      </div>
    </main>
  );
}
