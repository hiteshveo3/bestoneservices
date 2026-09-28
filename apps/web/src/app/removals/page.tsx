import type { Metadata } from "next";
import { Clock, Package, Truck } from "lucide-react";
import { InstantEstimator } from "@/components/ui/calculator";
import { siteContact } from "@/config/site-contact";
import { ServiceHubHero, HubSection } from "@/components/service/service-hub";
import { Button, SlimCta, type PriceRow } from "@/components/touchstone";

export const metadata: Metadata = {
  title: "House Removals and Man and Van",
  description: "Home and office removals, man and van and packing across London. Two or three movers with a van from £80 an hour; packing from £30 an hour.",
  alternates: { canonical: "/removals/" },
};

const PRICE_ROWS: PriceRow[] = [
    { name: "Removals, two movers and a van", note: "per hour", amount: "£80", from: true, href: "/removals/" },
    { name: "Removals, three movers and a van", note: "per hour", amount: "£120", from: true, href: "/removals/" },
    { name: "Packing", note: "per packer, per hour", amount: "£30", from: true, href: "/removals/" },
];

const FEATURES = [
    { icon: Truck, title: "Movers and van", desc: "Two or three movers with a van, protective blankets and straps." },
    { icon: Clock, title: "Hourly, shown upfront", desc: "£80–£120 an hour for two movers, £120–£160 for three." },
    { icon: Package, title: "Packing if you want it", desc: "Packing from £30 an hour, or £25 for Bestone Club members." },
];

// Rates from the current price list (config/pricing-data.ts).
const RATES: Array<[string, string, string]> = [
    ["Removals", "2 movers + van", "£80–£120/hr"],
    ["Removals", "3 movers + van", "£120–£160/hr"],
    ["Packing", "per packer", "from £30/hr"],
];

export default function RemovalsPage() {
  const whatsapp = siteContact.getWhatsappUrl("Hi Bestone, I'd like to book a move.");
  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink">
      <ServiceHubHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Removals" }]}
        eyebrow="Removals across London"
        title="Moving day,"
        soft="handled by the hour."
        lead="Two or three movers with a van, blankets and transit cover, plus packing if you want it. The hourly rate is shown before you book."
        rows={PRICE_ROWS}
        primary={{ label: "Book a move", href: whatsapp }}
        facts={["Two or three movers", "Van and blankets", "Transit cover"]}
        pricesNote="Every price is confirmed before anyone arrives."
      />

      <HubSection tone="white" eyebrow="What you get" title="One team," soft="the whole job.">
        <div className="grid gap-2 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="grid content-start gap-3 rounded-2xl bg-paper p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-lime-soft"><Icon className="size-5" aria-hidden="true" /></span>
              <b className="text-[17px]">{title}</b>
              <span className="text-[15px] text-muted">{desc}</span>
            </div>
          ))}
        </div>
      </HubSection>

      <HubSection eyebrow="Rates" title="Priced by the hour," soft="shown upfront.">
        <div className="overflow-x-auto rounded-2xl bg-white p-2">
          <table className="w-full min-w-[520px] border-separate border-spacing-y-0.5 text-[15px] tabular-nums">
            <thead>
              <tr className="text-left">
                <th scope="col" className="ts-eyebrow px-3.5 py-2 font-semibold">Service</th>
                <th scope="col" className="ts-eyebrow px-3.5 py-2 font-semibold">Team</th>
                <th scope="col" className="ts-eyebrow px-3.5 py-2 text-right font-semibold">Rate</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map(([service, team, rate], i) => (
                <tr key={service + team} className={i % 2 === 0 ? "bg-paper" : ""}>
                  <td className="rounded-l-lg px-3.5 py-3 font-semibold">{service}</td>
                  <td className="px-3.5 py-3 text-muted">{team}</td>
                  <td className="rounded-r-lg px-3.5 py-3 text-right font-semibold">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="grid gap-1">
            <p className="ts-eyebrow m-0">Bestone Club</p>
            <p className="m-0 text-[17px]"><b>Packing at £25 an hour</b> <span className="text-muted">instead of £30 for club members.</span></p>
          </div>
          <Button href={siteContact.getWhatsappUrl("Hi Bestone, I'd like to join the Bestone Club.")} variant="soft">Join the club</Button>
        </div>
      </HubSection>

      <HubSection tone="white" eyebrow="Estimate" title="Your price" soft="in a minute.">
        <InstantEstimator defaultVertical="removals" />
        <SlimCta title="Rather talk it through?" soft="We reply on WhatsApp, Mon–Sat, 8am–8pm." action={<Button href={whatsapp}>Book a move</Button>} />
      </HubSection>
    </main>
  );
}
