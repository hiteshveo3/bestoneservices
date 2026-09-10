import type { Metadata } from "next";
import Link from "next/link";
import { masterPricingData } from "@/config/pricing-data";
import { PricePromiseBadge } from "@/components/ui/price-promise-badge";

export const metadata: Metadata = {
  title: "How We Set Our Prices | Best One Services",
  description:
    "Why our London cleaning, pest control, gardening and removals prices are lower than most quotes — no agency markup, no call centre, no franchise fees. Studio end of tenancy cleaning is £130 flat.",
  alternates: { canonical: "/about/our-pricing/" },
};

const REASONS = [
  {
    title: "No agency markup",
    body: "A lot of London quotes come from a booking agency that subcontracts the actual work and keeps a cut. You book us directly, so there is no middle layer to pay for.",
  },
  {
    title: "No call centre, no showroom",
    body: "We do not run a sales floor or an outsourced phone room. Enquiries come to the team who actually schedule the jobs, which costs us far less to run.",
  },
  {
    title: "No franchise fees",
    body: "We are one independent London operator, not a franchise paying a percentage upstream every month for the right to use a brand name.",
  },
  {
    title: "Tight scheduling",
    body: "Our teams work in clusters across Greater London rather than criss-crossing the M25 all day. Less dead travel time per job means we can charge less for the job itself.",
  },
];

export default function OurPricingPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#F9FCF5] text-[#1F3A00] text-start">
      <section className="bg-[#F9FCF5] border-b border-[#E5FBC9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#1F3A00]/80 font-medium"
          >
            <Link href="/" className="hover:underline hover:underline-offset-2 transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true" className="text-[#1F3A00]/40">/</span>
            <Link href="/about/" className="hover:underline hover:underline-offset-2 transition-colors duration-150">
              About
            </Link>
            <span aria-hidden="true" className="text-[#1F3A00]/40">/</span>
            <span className="font-semibold text-[#1F3A00]">How we set our prices</span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-5">
          <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#DCFAB7]/80 border border-[#B7F56A] text-xs font-bold uppercase tracking-wider text-[#1F3A00] w-fit">
            Pricing, explained
          </span>

          <h1 className="m-0 font-heading text-3xl sm:text-4xl lg:text-[48px] font-semibold leading-[1.08] tracking-tight text-[#1F3A00]">
            How we set our prices
          </h1>

          <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]/90 max-w-2xl font-normal">
            We publish our real prices because hidden quotes waste everyone&apos;s time — yours and ours. That
            usually prompts a fair question: if the work is the same, why is the number lower? Here is the honest
            answer.
          </p>

          <PricePromiseBadge />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-12">
        <section className="flex flex-col gap-5">
          <h2 className="m-0 font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F3A00]">
            Where the difference actually comes from
          </h2>
          <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
            The price gap is not about doing less work, using fewer people, or cutting the materials. It is about
            what sits between you and the person doing the job:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {REASONS.map((reason) => (
              <div
                key={reason.title}
                className="bg-white border border-[#E5FBC9] rounded-[18px] p-5 flex flex-col gap-2"
              >
                <strong className="text-base font-semibold text-[#1F3A00]">{reason.title}</strong>
                <span className="text-sm leading-relaxed text-[#1F3A00]">{reason.body}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="m-0 font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F3A00]">
            What we do not do
          </h2>
          <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
            {[
              "We do not quote a low number and revise it upward once the team is standing in your hallway.",
              "We do not add call-out fees, fuel surcharges, or booking fees on top of the published price.",
              "We do not run countdown timers or fake discounts to rush a decision.",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-base leading-relaxed text-[#1F3A00]"
              >
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#1F3A00] shrink-0 mt-2.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
            If a job genuinely turns out to be bigger than what you described — an extra room, a much heavier
            infestation, twice the waste — we tell you before we start and you decide. The price we agreed does not
            change on its own.
          </p>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="m-0 font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F3A00]">
            What that looks like in numbers
          </h2>
          <div className="overflow-x-auto border border-[#E5FBC9] rounded-[20px] bg-white">
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Best One Services starting rates compared with typical London market ranges
              </caption>
              <thead>
                <tr className="bg-[#DCFAB7] text-[#1F3A00]">
                  <th scope="col" className="p-3.5 sm:p-4 font-semibold">Service</th>
                  <th scope="col" className="p-3.5 sm:p-4 font-semibold">Our starting rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5FBC9] text-[#1F3A00]">
                {Object.values(masterPricingData).map((cat) => (
                  <tr key={cat.id}>
                    <th scope="row" className="p-3.5 sm:p-4 font-semibold text-start">
                      {cat.title.replace(" Pricing", "")}
                    </th>
                    <td className="p-3.5 sm:p-4 font-medium">{cat.startingRateDisplay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="m-0 text-sm leading-relaxed text-[#1F3A00]/80">
            Full package-by-package rates, add-ons and the factors that move a price are on the{" "}
            <Link
              href="/prices/"
              className="font-semibold text-[#1F3A00] hover:underline hover:underline-offset-2 transition-colors duration-150"
            >
              price list
            </Link>
            .
          </p>
        </section>

        <section className="p-6 sm:p-8 rounded-[22px] bg-white border border-[#E5FBC9] flex flex-col gap-4">
          <h2 className="m-0 font-heading text-2xl font-semibold tracking-tight text-[#1F3A00]">
            Still want it checked before you commit?
          </h2>
          <p className="m-0 text-base leading-relaxed text-[#1F3A00]">
            Build your price on the calculator and we will confirm it in writing before anyone is booked in.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/prices/#smart-calculator"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer"
            >
              Get an instant price
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
