import Link from "next/link";
import Image from "next/image";
import { Bug, Leaf, Sparkles, Truck } from "@/components/icons";
import { SECONDARY_BUTTON_CLASS } from "@/lib/ui-classes";
import { siteContact } from "@/config/site-contact";

const TRUST_POINTS = ["Clear prices before you book", "Named, insured local teams", "London-wide availability"] as const;

const SERVICES = [
  { label: "Cleaning", href: "/cleaning-services/end-of-tenancy-cleaning/", icon: Sparkles },
  { label: "Pest control", href: "/pest-control-services/mice-control/", icon: Bug },
  { label: "Gardening", href: "/gardening/", icon: Leaf },
  { label: "Removals", href: "/removals/", icon: Truck },
] as const;

export function HeroHome() {
  return (
    <section className="relative overflow-hidden border-[#ECEAE3] bg-[#F6F5F1]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,#dcfab7_0,transparent_26%),linear-gradient(to_right,#1f3a0008_1px,transparent_1px),linear-gradient(to_bottom,#1f3a0008_1px,transparent_1px)] bg-[auto,32px_32px,32px_32px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-16">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 ts-eyebrow">
            <span className="h-2 w-2 rounded-full bg-[#B7F56A]" /> Property services across London
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl font-heading text-4xl font-[650] leading-[1.04] tracking-tight text-[#1D201E] sm:text-5xl lg:text-[62px]">
              Your property, <span className="text-[#1D201E]">handled properly.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#1D201E]/85 sm:text-lg">
              Cleaning, pest control, gardening and removals from one accountable local team—with a clear price and a confirmed scope before work begins.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={siteContact.getWhatsappUrl("Hi, I'd like an instant quote from Bestone Services.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-[#B7F56A] px-6 py-3 text-base font-semibold text-[#1D201E] transition-transform hover:-translate-y-0.5 hover:bg-[#A2EA4E]">Get an instant quote</Link>
            <Link href="/prices/" className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-medium ${SECONDARY_BUTTON_CLASS}`}>View price guide</Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SERVICES.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} className="group flex min-h-20 flex-col justify-between rounded-2xl bg-white/85 p-3 text-sm font-semibold text-[#1D201E] transition-all hover:-translate-y-0.5 hover:border-[#ECEAE3] hover:bg-white">
                <Icon className="h-5 w-5 text-[#1D201E] transition-transform group-hover:scale-110" strokeWidth={1.9} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm font-medium text-[#1D201E]">
            {TRUST_POINTS.map((point) => <span key={point} className="inline-flex items-center gap-2"><span className="ts-tick" aria-hidden="true" />{point}</span>)}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[590px]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-white ">
            <Image src="/images/service/best-one-team-hero-v1.webp" alt="Bestone Services cleaning and pest-control staff ready to help across London" fill sizes="(max-width: 1024px) 100vw, 46vw" className="object-cover" priority />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 backdrop-blur">
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#1D201E]">A local team you can recognise</p><p className="mt-0.5 text-sm font-semibold text-[#1D201E]">Professional service. Clear handover.</p></div>
              <span className="shrink-0 rounded-md bg-[#B7F56A] px-3 py-1 text-xs font-bold text-[#1D201E]">London-wide</span>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 -z-10 h-32 w-32 rounded-full bg-[#B7F56A]/45 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
