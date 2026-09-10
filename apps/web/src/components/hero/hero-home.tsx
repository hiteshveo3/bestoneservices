import Link from "next/link";
import Image from "next/image";
import { Bug, Leaf, Sparkles, Truck } from "lucide-react";
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
    <section className="relative overflow-hidden border-b border-[#E5FBC9] bg-[#F9FCF5]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,#dcfab7_0,transparent_26%),linear-gradient(to_right,#1f3a0008_1px,transparent_1px),linear-gradient(to_bottom,#1f3a0008_1px,transparent_1px)] bg-[auto,32px_32px,32px_32px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-16">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#99D055] bg-[#DCFAB7] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1F3A00] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[#4E8C16]" /> Property services across London
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl font-heading text-4xl font-semibold leading-[1.04] tracking-tight text-[#1F3A00] sm:text-5xl lg:text-[62px]">
              Your property, <span className="text-[#4E8C16]">handled properly.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#1F3A00]/85 sm:text-lg">
              Cleaning, pest control, gardening and removals from one accountable local team—with a clear price and a confirmed scope before work begins.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={siteContact.getWhatsappUrl("Hi, I'd like an instant quote from Best One Services.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-[#B7F56A] px-6 py-3 text-base font-semibold text-[#1F3A00] shadow-2xs transition-transform hover:-translate-y-0.5 hover:bg-[#a8eb58]">Get an instant quote</Link>
            <Link href="/prices/" className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-medium ${SECONDARY_BUTTON_CLASS}`}>View price guide</Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SERVICES.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} className="group flex min-h-20 flex-col justify-between rounded-2xl border border-[#D1E8B8] bg-white/85 p-3 text-sm font-semibold text-[#1F3A00] shadow-2xs transition-all hover:-translate-y-0.5 hover:border-[#99D055] hover:bg-white">
                <Icon className="h-5 w-5 text-[#4E8C16] transition-transform group-hover:scale-110" strokeWidth={1.9} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm font-medium text-[#1F3A00]">
            {TRUST_POINTS.map((point) => <span key={point} className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#DCFAB7] text-xs">✓</span>{point}</span>)}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[590px]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[#D1E8B8] bg-white shadow-[0_20px_60px_rgba(31,58,0,0.12)]">
            <Image src="/images/service/best-one-team-hero-v1.webp" alt="Best One Services cleaning and pest-control staff ready to help across London" fill sizes="(max-width: 1024px) 100vw, 46vw" className="object-cover" priority />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#4E8C16]">A local team you can recognise</p><p className="mt-0.5 text-sm font-semibold text-[#1F3A00]">Professional service. Clear handover.</p></div>
              <span className="shrink-0 rounded-full bg-[#B7F56A] px-3 py-1 text-xs font-bold text-[#1F3A00]">London-wide</span>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 -z-10 h-32 w-32 rounded-full bg-[#B7F56A]/45 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
