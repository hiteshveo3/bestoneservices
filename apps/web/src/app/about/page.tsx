import type { Metadata } from "next";
import Image from "next/image";
import { siteContact } from "@/config/site-contact";
import { BigFacts, Button, Eyebrow, Facts, Hallmarks, Plaque, Section, SectionHead, SlimCta } from "@/components/touchstone";

export const metadata: Metadata = {
  title: "About Us | Property Services from Our Own Team",
  description: "Bestone Services Ltd: cleaning, pest control, gardening and removals across London from our own uniformed team, based in Ilford.",
  alternates: { canonical: "/about/" },
};

const PROMISES = [
  { title: "Priced before", desc: "Every rate is published before you book, and the price we confirm is the price you pay." },
  { title: "Our own team", desc: "Cleaners and technicians employed by Bestone, in uniform, with photo ID. No franchise, no agency staff." },
  { title: "On record", desc: "An invoice for every job, with photos or a treatment report where the work calls for one." },
  { title: "Put right", desc: "A 48-hour re-clean on tenancy work and 1 to 3 month written guarantees on pest treatment." },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink">
      {/* S40 · Our team, as the opening */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="grid content-start gap-5">
            <Eyebrow>About Bestone</Eyebrow>
            <h1 className="ts-head m-0 text-[clamp(38px,5vw,60px)] leading-none">
              One team <span className="ts-soft">for the whole property.</span>
            </h1>
            <p className="m-0 max-w-[56ch] text-lg text-muted">
              Bestone looks after London homes and rental properties from a base in Ilford: end of tenancy and specialist cleaning, pest control, gardening and removals, all carried out by our own uniformed team.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button href="/prices/" size="lg">See every price</Button>
              <Button href="/contact/" variant="white" size="lg">Contact us</Button>
            </div>
            <Facts items={[<><b>5,000+</b> jobs completed</>, "Own staff, no franchise", "Based in Ilford, IG1"]} />
          </div>
          <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-stone max-lg:aspect-[4/3] max-lg:min-h-0">
            <Image src="/images/service/best-one-team-hero-v1.webp" alt="Bestone cleaner and pest technician in charcoal uniforms with lime piping" fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover object-top" />
          </div>
        </div>
      </section>

      <Section tone="white">
        <SectionHead eyebrow="What we stand behind" title="Four promises," soft="kept in writing." />
        <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <li key={p.title} className="grid content-start gap-3 rounded-2xl bg-paper p-5">
              <Plaque n={i + 1} />
              <b className="text-[17px]">{p.title}</b>
              <span className="text-[15px] text-muted">{p.desc}</span>
            </li>
          ))}
        </ol>
        <BigFacts
          tone="paper"
          items={[
            { figure: "5,000+", label: "jobs completed across London" },
            { figure: "4", label: "services from one accountable team" },
            { figure: "48h", label: "free re-clean on tenancy work" },
            { figure: "1–3", label: "month written pest guarantees" },
          ]}
        />
      </Section>

      {/* Company record with the hallmark set (S01) */}
      <Section>
        <div className="grid gap-6 rounded-3xl bg-white p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center">
          <Hallmarks marks={["B1", "£", "IG1", "26"]} />
          <div className="grid gap-3">
            <Eyebrow>Company record</Eyebrow>
            <dl className="ts-rows m-0 grid">
              {[
                ["Registered name", siteContact.companyName],
                ["Company number", "15574809"],
                ["Registered office", siteContact.address.formatted],
                ["Phone", siteContact.phoneDisplay],
                ["Email", siteContact.email],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 px-3.5 py-2.5 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="m-0 font-semibold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <SlimCta title="Need something looked after?" soft="Your price in a minute." action={<Button href="/prices/">Get your price</Button>} />
      </Section>
    </main>
  );
}
