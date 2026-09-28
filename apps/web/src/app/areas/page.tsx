import type { Metadata } from "next";
import { MapPin, MessageCircle } from "lucide-react";
import { siteContact } from "@/config/site-contact";
import { locations } from "@/content/locations";
import { Button, Eyebrow, Facts, Section, SectionHead, SlimCta } from "@/components/touchstone";

export const metadata: Metadata = {
  title: "Areas We Cover Across Greater London",
  description: "Where Bestone works: cleaning, pest control, gardening and removals across Greater London from our base in Ilford, IG1.",
  alternates: { canonical: "/areas/" },
};

const PRIMARY_AREAS = [
  { name: "Ilford and Redbridge", codes: ["IG1", "IG2", "IG3", "IG4", "IG5", "IG6"], desc: "Our home ground, a short drive from the base on Clements Road." },
  { name: "Barking and Dagenham", codes: ["IG11", "RM8", "RM9", "RM10"], desc: "Cleaning, garden clearance, rodent treatment and removals." },
  { name: "Stratford and Newham", codes: ["E6", "E7", "E13", "E15", "E16", "E20"], desc: "Flat tenancy cleans, carpets and bed bug treatment." },
  { name: "Romford and Havering", codes: ["RM1", "RM2", "RM3", "RM7"], desc: "Garden maintenance, house cleaning and removals." },
  { name: "Walthamstow and Leyton", codes: ["E10", "E11", "E17"], desc: "End of tenancy cleaning, pest control and garden waste." },
  { name: "Greater London", codes: ["Inside the M25"], desc: "London-wide, subject to the service, the team and the date you need." },
];

export default function AreasPage() {
  const whatsapp = siteContact.getWhatsappUrl("Hi Bestone, can you cover my postcode?");
  const names = [...locations].map((l) => l.name).sort((a, b) => a.localeCompare(b));

  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink">
      {/* S22 · Area hero */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1240px] gap-5 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <Eyebrow>Areas we cover</Eyebrow>
          <h1 className="ts-head m-0 max-w-4xl text-[clamp(38px,5vw,60px)] leading-none">
            From Ilford <span className="ts-soft">across Greater London.</span>
          </h1>
          <p className="m-0 max-w-[58ch] text-lg text-muted">Our base is at {siteContact.address.formatted}. Send your postcode and the job, and we confirm the team and the first free slot.</p>
          <div className="flex flex-wrap gap-2">
            <Button href={whatsapp} size="lg" icon={<MessageCircle className="size-[18px]" aria-hidden="true" />}>Check my postcode</Button>
            <Button href="/prices/" variant="white" size="lg">See every price</Button>
          </div>
          <Facts items={["Own team, no subcontractors", "Mon–Sat, 8am–8pm", "Prices before you book"]} />
        </div>
      </section>

      <Section tone="white">
        <SectionHead eyebrow="Where we work most" title="Six areas," soft="one team." />
        <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {PRIMARY_AREAS.map((area) => (
            <li key={area.name} className="grid content-start gap-3 rounded-2xl bg-paper p-5">
              <div className="flex items-center justify-between gap-3">
                <b className="text-[17px]">{area.name}</b>
                <MapPin className="size-5 shrink-0 text-muted" aria-hidden="true" />
              </div>
              <p className="m-0 text-[15px] text-muted">{area.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {area.codes.map((c) => (
                  <span key={c} className="rounded-md bg-lime-soft px-2.5 py-1 text-[13px] font-semibold tabular-nums">{c}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHead eyebrow="Also covered" title={`${names.length} London areas`} soft="and counting." />
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1.5 p-0">
          {names.map((n) => (
            <li key={n} className="rounded-lg bg-white px-3 py-2.5 text-sm font-semibold">{n}</li>
          ))}
        </ul>
        <SlimCta title="Not sure we cover you?" soft="Send your postcode on WhatsApp." action={<Button href={whatsapp}>Check my postcode</Button>} />
      </Section>
    </main>
  );
}
