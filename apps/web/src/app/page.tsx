import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, FileText, MessageCircle, Phone, ShieldCheck, Stars } from "@/components/icons";
import { siteContact } from "@/config/site-contact";
import { siteConfig } from "@/config/site";
import { BLOG_POSTS } from "@/config/blog-data";
import { GOOGLE_PROFILES } from "@/config/google-business-profiles";
import { organisationSchema, websiteSchema } from "@/lib/structured-data";
import {
  BigFacts,
  Button,
  Eyebrow,
  Facts,
  FaqSplit,
  FloorPlan,
  Petals,
  Plaque,
  PriceList,
  PriceTile,
  Section,
  SectionHead,
  SlimCta,
  type PriceRow,
} from "@/components/touchstone";

// Explicit rather than relying on the root layout's inherited defaults —
// keeps the homepage's canonical self-referencing even if that default
// ever changes.
export const metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {

  const FAQ_DATA = [
    {
      q: "What is included in your End of Tenancy Cleaning & Move-Out Cleaning service?",
      a: "Our End of Tenancy Cleaning service strictly adheres to official agency inventory checklists. As an established London cleaning company, our move-out cleaning includes deep kitchen sanitising, oven steam cleaning, carpet refresh, and bathroom scale removal. If your landlord flags any item within 48 hours, our dedicated team returns to re-clean for free.",
    },
    {
      q: "How fast can your local London pest control team handle rat control, bed bug treatment, or wasp nest removal?",
      a: "Our emergency local dispatch team arrives within 2 hours across all 32 London boroughs. We provide licensed pest control services for rat control, mice eradication, bed bug treatment, cockroach control, ant control, flea exterminator services, and wasp nest removal with 1-month and 3-month written guarantees.",
    },
    {
      q: "Do you offer commercial pest control & transparent cleaning prices upfront?",
      a: "Yes! All End of Tenancy cleaning prices and pest control rates are displayed 100% upfront with zero hidden fees. We cater to domestic tenants and offer dedicated commercial pest control packages for restaurants, offices, estate agencies, and property management companies across London.",
    },
    {
      q: "How are gardening and clearance services billed?",
      a: "Our experienced 2-gardener maintenance team is billed at £70 for the first hour and £50 for each additional hour. Green waste clearance is billed transparently at £5 per standard bag or £50 per jumbo bag, providing complete pricing clarity for lawn mowing, hedge trimming, and garden overhauls.",
    },
    {
      q: "What is included in your Removals & Man & Van service?",
      a: "Our professional house removals service includes fully equipped Luton or panel vans with experienced 2-men (£80–£120/hr) or 3-men (£120–£160/hr) moving teams, complete with transit insurance, protective blankets, and strapping equipment. Optional full packing services are available from £30/hr.",
    },
    {
      q: "Why is your price lower than other companies?",
      a: "Because there is less between you and the team doing the work. You book us directly, so there is no agency taking a cut, no outsourced call centre, and no franchise fee going upstream every month. We also cluster jobs by area, so our teams spend less of the day travelling. The work, the equipment and the insurance are the same — the overhead is not. You can read the full breakdown on our How we set our prices page.",
    },
  ];

  const whatsapp = siteContact.getWhatsappUrl("Hi Bestone, I'd like a price for a job.");
  const priceHref = siteConfig.bookingEnabled ? "/booking/" : "/prices/";

  // Lab 03 S24 A — prices from the current price list only.
  const PRICE_ROWS: PriceRow[] = [
    { name: "Mice control", note: "per species, written guarantee", amount: "£99", from: true, href: "/pest-control-services/mice-control/" },
    { name: "End of tenancy cleaning", note: "studio flat, 48-hour re-clean", amount: "£130", from: true, href: "/cleaning-services/end-of-tenancy-cleaning/" },
    { name: "Garden care", note: "two gardeners, first hour, then £50/hr", amount: "£70", href: "/gardening/" },
    { name: "Removals", note: "two movers and a van, per hour", amount: "£80", from: true, href: "/removals/" },
  ];

  // Priorities from the business: pest control first, end of tenancy second.
  const LEAD_SERVICES = [
    {
      title: "Pest control",
      desc: "Mice, rats, bed bugs, wasps and cockroaches, treated by our own technicians with a written guarantee.",
      chips: ["Inspection", "Treatment plan", "Report"],
      amount: "£90",
      unit: "single visit, 1 bed",
      href: "/pest-control-services/",
      image: "/images/service/best-one-pest-technician-hero-v1.webp",
      alt: "Bestone pest technician in uniform inside a London home",
    },
    {
      title: "End of tenancy",
      desc: "An agency-checklist clean with a free re-clean if the agent flags anything within 48 hours.",
      chips: ["Checklist", "Oven", "48h re-clean"],
      amount: "£130",
      unit: "studio flat",
      href: "/cleaning-services/end-of-tenancy-cleaning/",
      image: "/images/service/best-one-cleaner-kitchen-v1.webp",
      alt: "Bestone cleaner cleaning a kitchen",
    },
  ];
  const MORE_SERVICES = [
    { title: "Garden care", desc: "Two-gardener team for maintenance, clearance, lawns and hedges.", amount: "£70", unit: "first hour", href: "/gardening/" },
    { title: "Removals", desc: "Two or three movers with a van, blankets and transit cover.", amount: "£80", unit: "per hour", href: "/removals/" },
  ];

  const STEPS = [
    { title: "Get your price", desc: "Pick the service and property size." },
    { title: "Choose a time", desc: "Two-hour arrival windows, Mon–Sat." },
    { title: "Meet your technician", desc: "Uniformed, carrying photo ID." },
    { title: "Get your record", desc: "Report, photos and invoice." },
  ];

  const COVERAGE = [
    "Ilford & Redbridge",
    "Barking & Dagenham",
    "Stratford & Newham",
    "Romford & Havering",
    "Walthamstow & Forest",
    "Hackney",
    "Tower Hamlets",
    "Greenwich",
    "Croydon",
    "Greater London M25",
  ];


  // Homepage is the site's primary entity anchor, but previously carried no
  // structured data at all — Organization/WebSite/FAQPage schema were only
  // wired into service pages via servicePageSchema().
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organisationSchema(),
      websiteSchema(),
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/#webpage`,
        url: siteConfig.url,
        name: "Cleaning, Pest Control, Gardening & Removals | Bestone London",
        description: siteConfig.description,
        inLanguage: "en-GB",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_DATA.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  const guides = Object.values(BLOG_POSTS).slice(0, 3);
  const google = GOOGLE_PROFILES.pestControl;

  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />

      {/* S17 · Home hero, two-weight headline (Lab 04 R3 B), prices before you ask */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
            <div className="grid content-start gap-5">
              <Eyebrow>London property services</Eyebrow>
              <h1 className="ts-head m-0 text-[clamp(40px,5.6vw,68px)] leading-none">
                Priced before we arrive. <span className="ts-soft">Proven after we leave.</span>
              </h1>
              <p className="m-0 max-w-[56ch] text-lg text-muted">
                Pest control, end of tenancy cleaning, gardening and removals from our own uniformed team. A fixed price before you book, and a written record after every job.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button href={priceHref} size="lg">Get your price</Button>
                <Button href={whatsapp} variant="white" size="lg" icon={<MessageCircle className="size-[18px]" aria-hidden="true" />}>WhatsApp us</Button>
              </div>
              <Facts items={[<><b>5,000+</b> jobs completed</>, "Written guarantees", "Own staff, no franchise"]} />
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-stone max-lg:aspect-[4/3] max-lg:min-h-0">
              <Image src="/images/service/best-one-team-hero-v1.webp" alt="Bestone cleaner and pest technician in charcoal uniforms with lime piping" fill priority sizes="(max-width: 1024px) 100vw, 46vw" className="object-cover object-top" />
            </div>
          </div>
          <div className="grid gap-2.5">
            <Eyebrow>Prices, before you ask</Eyebrow>
            <div className="rounded-2xl bg-white p-2">
              <PriceList rows={PRICE_ROWS} />
            </div>
          </div>
        </div>
      </section>

      {/* S23 A · Services, weighted by what the business does most */}
      <Section id="services" tone="white">
        <SectionHead eyebrow="Four services" title="One team" soft="for the whole property." action={<Button href="/prices/" variant="link">See every price</Button>} />
        <div className="grid gap-3 md:grid-cols-2">
          {LEAD_SERVICES.map((svc) => (
            <article key={svc.title} className="grid overflow-hidden rounded-2xl bg-paper">
              <div className="relative aspect-[16/9] bg-stone">
                <Image src={svc.image} alt={svc.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-[50%_30%]" />
              </div>
              <div className="grid gap-3 p-5">
                <h3 className="ts-head m-0 text-[28px]">{svc.title}</h3>
                <p className="m-0 text-muted">{svc.desc}</p>
                <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                  {svc.chips.map((c) => (
                    <li key={c} className="rounded-md bg-lime-soft px-2.5 py-1 text-[13px] font-semibold">{c}</li>
                  ))}
                </ul>
                <PriceTile amount={svc.amount} unit={svc.unit} action={<Button href={svc.href} variant="white" size="sm">See {svc.title.toLowerCase()}</Button>} />
              </div>
            </article>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {MORE_SERVICES.map((svc) => (
            <article key={svc.title} className="relative grid gap-3 overflow-hidden rounded-2xl bg-paper p-5">
              <Petals className="pointer-events-none absolute -right-6 -top-6" size={110} />
              <h3 className="ts-head m-0 text-[28px]">{svc.title}</h3>
              <p className="m-0 max-w-[40ch] text-muted">{svc.desc}</p>
              <PriceTile amount={svc.amount} unit={svc.unit} action={<Button href={svc.href} variant="white" size="sm">See {svc.title.toLowerCase()}</Button>} />
            </article>
          ))}
        </div>
      </Section>

      {/* S35 B · Facts as figures */}
      <Section>
        <SectionHead eyebrow="In numbers" title="What we stand behind" soft="in writing." />
        <BigFacts
          items={[
            { figure: "5,000+", label: "jobs completed across London" },
            { figure: "48h", label: "free re-clean if the agent flags anything" },
            { figure: "1–3", label: "month written pest guarantees" },
            { figure: "0", label: "franchises between you and the team" },
          ]}
        />
      </Section>

      {/* S42 · How a job works */}
      <Section tone="white">
        <SectionHead eyebrow="How it works" title="Four steps," soft="nothing hidden." />
        <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="grid content-start gap-3 rounded-2xl bg-paper p-5">
              <Plaque n={i + 1} state={i === STEPS.length - 1 ? "done" : undefined} />
              <b className="text-[17px]">{step.title}</b>
              <span className="text-[15px] text-muted">{step.desc}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* S40 · Our own team, with the uniform piping */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-stone max-lg:aspect-[4/3] max-lg:min-h-0">
            <Image src="/images/service/best-one-cleaner-handover-v1.webp" alt="Bestone cleaner at a property handover" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="ts-piped grid content-start gap-4 rounded-2xl bg-white py-7 pl-8 pr-6">
            <Eyebrow>Our team</Eyebrow>
            <h2 className="ts-head m-0 text-[clamp(28px,3.4vw,40px)]">The people at your door <span className="ts-soft">work for us.</span></h2>
            <p className="m-0 text-lg text-muted">No franchise, no marketplace, no agency staff. Every cleaner and technician is employed by Bestone, wears our uniform and carries photo ID.</p>
            <Facts items={["Uniformed", "Photo ID", "Branded vans"]} />
          </div>
        </div>
      </Section>

      {/* S21 · Landlords and agents */}
      <Section id="landlords" tone="white">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="grid content-start gap-5">
            <Eyebrow>For landlords and letting agents</Eyebrow>
            <h2 className="ts-head m-0 text-[clamp(30px,4vw,48px)]">Every property you let, <span className="ts-soft">on record.</span></h2>
            <p className="m-0 max-w-[56ch] text-lg text-muted">Book cleaning, pest control and garden work for one flat or fifty. Every job comes back with an invoice, photos and a report you can forward to a tenant or a deposit scheme.</p>
            <ul className="ts-rows m-0 list-none p-0">
              {[
                { icon: FileText, text: "Invoice per property" },
                { icon: Camera, text: "Before and after photo report" },
                { icon: ShieldCheck, text: "Pest treatment report and guarantee" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="grid size-9 place-items-center rounded-[10px] bg-lime-soft"><Icon className="size-5" aria-hidden="true" /></span>
                  {text}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button href={siteContact.getWhatsappUrl("Hi Bestone, I manage rental properties and would like to set up an account.")} size="lg">Talk to us about your properties</Button>
            </div>
          </div>
          <div className="grid place-items-center rounded-2xl bg-paper p-5">
            <FloorPlan className="h-auto w-full max-w-[520px]" label="Illustration: a flat's floor plan with the kitchen, living room and bathroom signed off" />
          </div>
        </div>
      </Section>

      {/* S38 · Rating, S56 · Areas */}
      <Section>
        <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid content-start gap-3 rounded-2xl bg-white p-6">
            <Eyebrow>Google reviews</Eyebrow>
            <div className="flex flex-wrap items-center gap-4">
              <span className="ts-fig text-[64px]">{google.rating.toFixed(1)}</span>
              <div>
                <p className="m-0 text-lg"><Stars label={`${google.rating.toFixed(1)} out of 5 stars`} /></p>
                <p className="m-0 text-sm text-muted">{google.reviewCount} Google reviews</p>
              </div>
            </div>
            <Button href={google.reviewUrl} variant="link" className="justify-self-start">Read them on Google</Button>
          </div>
          <div className="grid content-start gap-4 rounded-2xl bg-white p-6">
            <Eyebrow>Areas we cover</Eyebrow>
            <p className="m-0 text-muted">From our base at {siteContact.address.street}, {siteContact.address.locality} {siteContact.address.postcode}, across Greater London.</p>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1.5 p-0">
              {COVERAGE.map((area) => (
                <li key={area} className="rounded-lg bg-paper px-3 py-2.5 text-sm font-semibold">{area}</li>
              ))}
            </ul>
            <Button href="/areas/" variant="link" className="justify-self-start">See all areas</Button>
          </div>
        </div>
      </Section>

      {/* S57 · Guides */}
      <Section tone="white">
        <SectionHead eyebrow="Guides" title="Know before" soft="you book." action={<Button href="/blog/" variant="link">All guides</Button>} />
        <div className="grid gap-3 md:grid-cols-3">
          {guides.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}/`} className="grid content-start gap-2 rounded-2xl bg-paper p-5 no-underline transition-colors duration-150 hover:bg-lime-soft">
              <span className="ts-eyebrow">{post.category}</span>
              <b className="text-[17px] leading-snug">{post.title}</b>
              <span className="text-sm text-muted">{post.readTime}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* S55 B · Questions, S58 A · slim close */}
      <Section>
        <FaqSplit
          items={FAQ_DATA.map((f) => ({ q: f.q, a: f.a }))}
          help={
            <>
              <p className="m-0 text-muted">Can&apos;t see yours? Ask us on WhatsApp, Mon–Sat, 8am–8pm.</p>
              <div className="flex flex-wrap gap-2">
                <Button href={whatsapp} variant="white" size="sm" icon={<MessageCircle className="size-4" aria-hidden="true" />}>Ask us</Button>
                <Button href={siteContact.phoneHref} variant="white" size="sm" icon={<Phone className="size-4" aria-hidden="true" />}>{siteContact.phoneDisplay}</Button>
              </div>
            </>
          }
        />
        <SlimCta title="Your price in a minute." soft="No call needed." action={<Button href={priceHref} iconEnd={<ArrowRight className="size-4" aria-hidden="true" />}>Get your price</Button>} />
      </Section>
    </main>
  );
}
