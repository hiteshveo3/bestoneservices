import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { serviceCatalog, type ServiceCategory } from "@/content/service-catalog";
import { allApprovedServicePages } from "@/content/approved-service-pages";
import { InstantEstimator } from "@/components/ui/calculator";
import { siteContact } from "@/config/site-contact";
import { ServiceHubHero, HubSection } from "@/components/service/service-hub";
import { Button, Plaque, SlimCta, type PriceRow } from "@/components/touchstone";

export function generateStaticParams() {
  return Object.keys(serviceCatalog).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const item = serviceCatalog[category as ServiceCategory];
  return {
    title: item?.label ?? "Services",
    description: item?.intro,
    alternates: { canonical: `/${category}/` },
  };
}

/** The approved "Starting from £X" line for a service, as a figure. */
function startingPrice(category: string, slug: string): string | null {
  const price = allApprovedServicePages[`${category}/${slug}`]?.price;
  const m = price?.match(/£\s?(\d[\d,]*)/);
  return m ? `£${m[1]}` : null;
}

const HUB_COPY: Record<string, { eyebrow: string; title: string; soft: string; lead: string; facts: string[]; cta: string }> = {
  "pest-control-services": {
    eyebrow: "Pest control across London",
    title: "Found something?",
    soft: "Leave it with us.",
    lead: "Our own technicians inspect first, treat what they find and show you where pests get in. Every plan comes with a written guarantee and a treatment report.",
    facts: ["Inspection first", "1–3 month guarantee", "Treatment report"],
    cta: "Book an inspection",
  },
  "cleaning-services": {
    eyebrow: "Cleaning across London",
    title: "Checkout-ready,",
    soft: "to the agency checklist.",
    lead: "End of tenancy, deep, after-builders and specialist cleaning from our own uniformed team, with a fixed price before you book.",
    facts: ["48-hour re-clean", "Agency checklist", "Fixed price"],
    cta: "Get your price",
  },
};

/** Grid tails fill their row: the last card stretches over any empty columns. */
function tailSpan(index: number, count: number) {
  if (index !== count - 1) return "";
  const two = count % 2 === 1 ? "sm:col-span-2" : "";
  const three = count % 3 === 1 ? "lg:col-span-3" : count % 3 === 2 ? "lg:col-span-2" : "lg:col-span-1";
  return `${two} ${three}`;
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const item = serviceCatalog[category as ServiceCategory];
  if (!item) notFound();

  const copy = HUB_COPY[category] ?? {
    eyebrow: item.label,
    title: item.label,
    soft: "",
    lead: item.intro,
    facts: ["Fixed price", "Own team", "Written scope"],
    cta: "Get your price",
  };
  const whatsapp = siteContact.getWhatsappUrl(`Hi Bestone, I'd like a price for ${item.label.toLowerCase()}.`);
  const services = item.services.map(([slug, label]) => ({ slug, label, price: startingPrice(category, slug) }));
  const priced = services.filter((s) => s.price);
  const rows: PriceRow[] = priced.slice(0, 5).map((s) => ({ name: s.label, note: "starting price, confirmed before booking", amount: s.price as string, from: true, href: `/${category}/${s.slug}/` }));

  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink">
      <ServiceHubHero
        crumbs={[{ label: "Home", href: "/" }, { label: item.label }]}
        eyebrow={copy.eyebrow}
        title={copy.title}
        soft={copy.soft}
        lead={copy.lead}
        rows={rows}
        primary={{ label: copy.cta, href: whatsapp }}
        facts={copy.facts}
        pricesNote="Every price is confirmed before anyone arrives."
      />

      {/* S23 C · Priced services as compact cards, then every treatment as a scannable list */}
      <HubSection tone="white" eyebrow={`${services.length} services`} title="Pick the job," soft="see the price.">
        {priced.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {priced.map((s, index) => (
              <Link key={s.slug} href={`/${category}/${s.slug}/`} className={`group grid gap-3 rounded-2xl bg-paper p-5 no-underline transition-colors duration-150 hover:bg-lime-soft ${tailSpan(index, priced.length)}`}>
                <div className="flex items-center justify-between">
                  <Plaque n={index + 1} />
                  <span className="grid size-10 place-items-center rounded-[10px] bg-white transition-colors duration-150 group-hover:bg-lime">
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <h2 className="ts-head m-0 text-[26px]">{s.label}</h2>
                <span className="ts-fig text-[30px]"><small>from</small>{s.price}</span>
              </Link>
            ))}
          </div>
        ) : null}
        <div className="grid gap-3">
          <p className="ts-eyebrow m-0">{priced.length > 0 ? "Every other service, priced on inspection" : "Every service"}</p>
          <ul className="m-0 grid list-none gap-1 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {services.filter((s) => !s.price).map((s) => (
              <li key={s.slug}>
                <Link href={`/${category}/${s.slug}/`} className="flex items-center justify-between gap-3 rounded-lg bg-paper px-3.5 py-3 text-[15px] font-semibold no-underline transition-colors duration-150 hover:bg-lime-soft">
                  <span>{s.label}</span>
                  <ArrowRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </HubSection>

      {category === "pest-control-services" ? (
        <HubSection eyebrow="Estimate" title="Your price" soft="in a minute.">
          <InstantEstimator defaultVertical="pest" />
        </HubSection>
      ) : null}

      <HubSection tone={category === "pest-control-services" ? "white" : "paper"}>
        <SlimCta title="Not sure which service you need?" soft="Send us a photo on WhatsApp." action={<Button href={whatsapp}>Ask us</Button>} />
      </HubSection>
    </main>
  );
}
