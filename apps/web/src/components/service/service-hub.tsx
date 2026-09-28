import type { ReactNode } from "react";
import Link from "next/link";
import { MessageCircle } from "@/components/icons";
import { siteContact } from "@/config/site-contact";
import { Button, Eyebrow, Facts, Petals, PriceList, type PriceRow } from "@/components/touchstone";

/**
 * Lab 03 S18: the hub hero for a whole service line. A soft lime wash, the
 * two-weight title, and the prices for that line in a white card beside it.
 */
export function ServiceHubHero({
  crumbs,
  eyebrow,
  title,
  soft,
  lead,
  rows,
  primary,
  facts,
  pricesNote,
}: {
  crumbs?: Array<{ label: string; href?: string }>;
  eyebrow: string;
  title: string;
  soft?: string;
  lead: string;
  rows: PriceRow[];
  primary: { label: string; href: string };
  facts?: ReactNode[];
  pricesNote?: string;
}) {
  return (
    <section className="bg-[image:var(--grad-wash)]">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 pb-14 pt-6 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div className="grid content-start gap-5">
          {crumbs ? (
            <nav aria-label="Breadcrumb">
              <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0 text-[13px] text-muted">
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex gap-1.5">
                    {i > 0 ? <span aria-hidden="true">/</span> : null}
                    {c.href ? <Link href={c.href} className="no-underline hover:underline">{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="ts-head m-0 text-[clamp(38px,5vw,60px)] leading-none">
            {title}
            {soft ? <> <span className="ts-soft">{soft}</span></> : null}
          </h1>
          <p className="m-0 max-w-[56ch] text-lg text-muted">{lead}</p>
          <div className="flex flex-wrap gap-2">
            <Button href={primary.href} size="lg">{primary.label}</Button>
            <Button href={siteContact.getWhatsappUrl("Hi Bestone, I have a question.")} variant="white" size="lg" icon={<MessageCircle className="size-[18px]" aria-hidden="true" />}>WhatsApp us</Button>
          </div>
          {facts ? <Facts items={facts} /> : null}
        </div>
        <div className="relative grid content-start gap-3 overflow-hidden rounded-3xl bg-white p-4 sm:p-5">
          <Petals className="pointer-events-none absolute -right-7 -top-7" size={120} />
          <Eyebrow className="px-1.5">Prices, before you ask</Eyebrow>
          <PriceList rows={rows} />
          {pricesNote ? <p className="m-0 px-1.5 text-[13px] text-muted">{pricesNote}</p> : null}
        </div>
      </div>
    </section>
  );
}

/** A plain Touchstone section wrapper with a two-weight heading. */
export function HubSection({
  id,
  tone = "paper",
  eyebrow,
  title,
  soft,
  children,
}: {
  id?: string;
  tone?: "paper" | "white";
  eyebrow?: string;
  title?: string;
  soft?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${tone === "white" ? "bg-white" : "bg-paper"}`}>
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {title ? (
          <div className="grid max-w-3xl gap-3">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h2 className="ts-head m-0 text-[clamp(28px,3.4vw,40px)]">
              {title}
              {soft ? <> <span className="ts-soft">{soft}</span></> : null}
            </h2>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
