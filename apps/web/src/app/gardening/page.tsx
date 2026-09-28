import type { Metadata } from "next";
import { Clock, ShieldCheck, Trees } from "lucide-react";
import { InstantEstimator } from "@/components/ui/calculator";
import { siteContact } from "@/config/site-contact";
import { ServiceHubHero, HubSection } from "@/components/service/service-hub";
import { Button, SlimCta, type PriceRow } from "@/components/touchstone";

export const metadata: Metadata = {
  title: "Gardening and Garden Clearance",
  description: "Garden maintenance, lawn mowing, hedge trimming and garden clearance across Greater London. Two-gardener team from £70 for the first hour, £50 after.",
  alternates: { canonical: "/gardening/" },
};

const PRICE_ROWS: PriceRow[] = [
    { name: "Garden care", note: "two gardeners, first hour", amount: "£70", from: false, href: "/gardening/" },
    { name: "Each extra hour", note: "same two-gardener team", amount: "£50", from: false, href: "/gardening/" },
    { name: "Green waste, standard bag", note: "taken away and disposed of", amount: "£5", from: false, href: "/gardening/" },
    { name: "Green waste, jumbo bag", note: "taken away and disposed of", amount: "£50", from: false, href: "/gardening/" },
];

const FEATURES = [
    { icon: Trees, title: "Two-gardener team", desc: "Every session has two experienced gardeners with commercial mowers, trimmers and blowers." },
    { icon: Clock, title: "Hourly, shown upfront", desc: "£70 for the first hour and £50 for each hour after, with no hidden extras." },
    { icon: ShieldCheck, title: "Waste taken away", desc: "Green waste bagged and removed: £5 a standard bag or £50 a jumbo bag." },
];

// Rates from the current price list (config/pricing-data.ts).
const RATES: Array<[string, string, string]> = [
    ["Garden care", "2 gardeners", "£70 first hour, £50 after"],
    ["Green waste", "standard bag", "£5"],
    ["Green waste", "jumbo bag", "£50"],
];

export default function GardeningPage() {
  const whatsapp = siteContact.getWhatsappUrl("Hi Bestone, I'd like to book a gardening team.");
  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink">
      <ServiceHubHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Gardening" }]}
        eyebrow="Gardening across London"
        title="A tidy garden,"
        soft="two gardeners at a time."
        lead="Maintenance, lawns, hedges, weeds and clearance from our own two-gardener team, billed by the hour with the rate shown before you book."
        rows={PRICE_ROWS}
        primary={{ label: "Book a gardening team", href: whatsapp }}
        facts={["Two gardeners", "Hourly, shown upfront", "Waste taken away"]}
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

      </HubSection>

      <HubSection tone="white" eyebrow="Estimate" title="Your price" soft="in a minute.">
        <InstantEstimator defaultVertical="gardening" />
        <SlimCta title="Rather talk it through?" soft="We reply on WhatsApp, Mon–Sat, 8am–8pm." action={<Button href={whatsapp}>Book a gardening team</Button>} />
      </HubSection>
    </main>
  );
}
