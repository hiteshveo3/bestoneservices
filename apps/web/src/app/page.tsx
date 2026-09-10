import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
  Bug01Icon,
  Tick01Icon,
  Clock01Icon,
  Leaf01Icon,
  Location01Icon,
  Call02Icon,
  Invoice01Icon,
  Shield01Icon,
  SparklesIcon,
  DeliveryTruck01Icon,
} from "@hugeicons/core-free-icons";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { GoogleReviewsSection } from "@/components/trust/google-reviews-section";
import { HomeFaq } from "@/components/home/home-faq";
import { HeroHome } from "@/components/hero";
import { BLOG_POSTS } from "@/config/blog-data";
import { CONTACT } from "@/config/contact";
import { SECONDARY_BUTTON_CLASS, SIDEBAR_CALL_BUTTON_CLASS } from "@/lib/ui-classes";
import { siteConfig } from "@/config/site";
import { organisationSchema, websiteSchema } from "@/lib/structured-data";

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

  const STATS = [
    { value: "32", label: "London boroughs covered, plus M25 surrounding postcodes" },
    { value: "48hr", label: "Re-clean guarantee on every end of tenancy booking" },
    { value: "2hr", label: "Average emergency pest control dispatch time" },
    { value: "5,000+", label: "Completed London property jobs since launch" },
  ];

  const VERTICALS = [
    {
      id: "cleaning",
      icon: SparklesIcon,
      title: "Cleaning",
      desc: "Guaranteed End of Tenancy Cleaning across London, plus move-out cleans, oven restoration and carpet steam extraction.",
      href: "/cleaning-services/end-of-tenancy-cleaning/",
    },
    {
      id: "pest-control",
      icon: Bug01Icon,
      title: "Pest Control",
      desc: "Licensed local treatment for rat control, bed bugs, cockroach eradication and emergency wasp nest removal.",
      href: "/pest-control-services/",
    },
    {
      id: "gardening",
      icon: Leaf01Icon,
      title: "Gardening",
      desc: "Two-gardener clearance teams for lawn mowing, hedge cutting, overhauls and green waste disposal.",
      href: "/gardening/",
    },
    {
      id: "removals",
      icon: DeliveryTruck01Icon,
      title: "Removals",
      desc: "House removals and Man & Van with 2 or 3 man teams, transit insurance and optional full packing.",
      href: "/removals/",
    },
  ];

  const REASONS = [
    {
      num: "01",
      icon: Shield01Icon,
      title: "Written guarantees",
      desc: "A 48-hour re-clean commitment on tenancy work, and 1-month or 3-month written guarantees on pest treatment. Put in writing before the team arrives, not after a dispute.",
    },
    {
      num: "02",
      icon: Invoice01Icon,
      title: "Prices fixed upfront",
      desc: "Every rate is published before you book — no callout surcharges, no hidden materials line, no revised invoice once the work is done. What the quote says is what you pay.",
    },
    {
      num: "03",
      icon: CheckmarkBadge01Icon,
      title: "Vetted local teams",
      desc: "Licensed, insured and DBS-checked specialists working from our Ilford operations hub, so the same standards apply whether you are in Stratford or Romford.",
    },
  ];

  const PROCESS_STEPS = [
    {
      step: "1",
      title: "Tell us the property and the job",
      desc: "Pick your service and property size. The calculator returns a fixed, itemised price in under 60 seconds — no callback required to find out what it costs.",
    },
    {
      step: "2",
      title: "Confirm a slot that suits you",
      desc: "Choose your date and access arrangements. You get a named team, a confirmed arrival window, and the full scope of work in writing before anyone is dispatched.",
    },
    {
      step: "3",
      title: "Work completed and guaranteed",
      desc: "The team works to the published checklist and signs it off with you. If anything is flagged afterwards, the relevant guarantee brings them back at no extra cost.",
    },
  ];

  const PRICE_ROWS = [
    {
      service: "End of tenancy cleaning",
      from: "From £130",
      detail: "Studio through 4-bed. Agency inventory checklist, oven and carpets included.",
    },
    {
      service: "Pest control treatment",
      from: "From £90",
      detail: "Rats, mice, bed bugs, cockroaches, ants, fleas and wasp nests. Follow-up included.",
    },
    {
      service: "Gardening & clearance",
      from: "From £70",
      detail: "Two-gardener team, first hour. £50 each additional hour, green waste billed per bag.",
    },
    {
      service: "Removals & Man & Van",
      from: "From £80/hr",
      detail: "2-man team with Luton or panel van. 3-man teams and full packing available.",
    },
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

  const guides = Object.values(BLOG_POSTS).slice(0, 3);

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
        name: "Cleaning, Pest Control, Gardening & Removals | Best One Services London",
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

  return (
    <main id="main-content" className="min-h-screen bg-[#F9FCF5] text-[#1F3A00] text-start">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />

      {/* ===================================================================
          1. CLEAN EDITORIAL HERO SECTION
          =================================================================== */}
      <HeroHome />

      {/* ===================================================================
          2. KEY STATS SECTION
          =================================================================== */}
      <section className="border-b border-[#E5FBC9] bg-[#F9FCF5]">
        <div data-reveal-group className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-6 grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <span className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                {stat.value}
              </span>
              <span className="text-sm leading-snug text-[#1F3A00]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          3. MAIN EDITORIAL CONTENT + STICKY BOOKING SIDEBAR
          =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_330px] gap-12 sm:gap-16 items-start">

          {/* LEFT MAIN CONTENT COLUMN */}
          <div className="flex flex-col gap-16 min-w-0">

            {/* SECTION 1: FOUR SERVICE VERTICALS */}
            <section id="services" className="scroll-mt-24 flex flex-col gap-6">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Four property services, one accountable team
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                Most property problems arrive together — a tenancy ends, the garden is overgrown, and something has been heard in the loft. Running them through one provider means one point of contact, one standard of work, and one guarantee to hold us to.
              </p>

              <div data-reveal-group className="grid sm:grid-cols-2 gap-4">
                {VERTICALS.map((vert) => {
                  const Icon = vert.icon;
                  return (
                    <Link
                      key={vert.id}
                      href={vert.href}
                      className="group bg-white border border-[#E5FBC9] rounded-[18px] p-5 flex flex-col gap-2.5 shadow-2xs hover:border-[#1F3A00] transition-colors duration-150"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#B7F56A] text-[#1F3A00]">
                        <HugeiconsIcon icon={Icon} size={20} strokeWidth={1.8} className="text-[#1F3A00]" />
                      </span>
                      <strong className="text-base font-semibold text-[#1F3A00]">{vert.title}</strong>
                      <span className="text-sm leading-relaxed text-[#1F3A00]">
                        {vert.desc}
                      </span>
                      <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-[#1F3A00]">
                        Explore {vert.title}
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} className="text-[#1F3A00]" />
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-6 bg-[#B7F56A] rounded-[18px] font-heading font-medium text-lg sm:text-xl leading-snug text-[#1F3A00] border border-[#99D055]">
                Every service is priced upfront and backed in writing. If the work is flagged after we leave, the relevant guarantee brings the team back at no additional cost.
              </div>
            </section>

            {/* SECTION 2: WHY BEST ONE */}
            <section id="why-us" className="scroll-mt-24 flex flex-col gap-6">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Why property managers and tenants use us
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                Three things separate a dependable property contractor from a quote that unravels at handover:
              </p>

              <div className="grid sm:grid-cols-3 gap-px bg-[#99D055] rounded-[20px] overflow-hidden border border-[#99D055]">
                {REASONS.map((reason, idx) => {
                  const Icon = reason.icon;
                  return (
                    <div key={idx} className="bg-white p-6 border-t-4 border-[#B7F56A] flex flex-col gap-2.5">
                      <span className="text-xs font-bold tracking-wider text-[#1F3A00]">POINT {reason.num}</span>
                      <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#B7F56A] text-[#1F3A00]">
                        <HugeiconsIcon icon={Icon} size={20} strokeWidth={1.8} className="text-[#1F3A00]" />
                      </span>
                      <strong className="font-heading text-2xl font-semibold text-[#1F3A00]">{reason.title}</strong>
                      <span className="text-sm leading-relaxed text-[#1F3A00]">
                        {reason.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 3: HOW IT WORKS */}
            <section id="process" className="scroll-mt-24 flex flex-col gap-6">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                How booking works
              </h2>

              <div className="divide-y divide-[#E5FBC9] border-y border-[#E5FBC9]">
                {PROCESS_STEPS.map((step, idx) => (
                  <div key={idx} className="grid grid-cols-[48px_1fr] gap-5 py-5 items-start">
                    <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#B7F56A] text-[#1F3A00] font-bold text-sm border border-[#99D055]">
                      {step.step}
                    </span>
                    <div className="space-y-1">
                      <h3 className="m-0 text-lg font-semibold text-[#1F3A00]">{step.title}</h3>
                      <p className="m-0 text-base leading-relaxed text-[#1F3A00]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: PRICE SNAPSHOT TABLE */}
            <section id="prices" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                What each service starts at
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                Published starting rates across all four verticals. Final quotes depend on property size and scope, and are confirmed before you commit:
              </p>

              <div className="overflow-x-auto border border-[#E5FBC9] rounded-[20px] bg-white shadow-2xs">
                <table className="w-full min-w-[500px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-[#DCFAB7] text-[#1F3A00]">
                      <th className="p-3.5 sm:p-4 font-semibold">Service</th>
                      <th className="p-3.5 sm:p-4 font-semibold">Starting rate</th>
                      <th className="p-3.5 sm:p-4 font-semibold">What that covers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5FBC9] text-[#1F3A00]">
                    {PRICE_ROWS.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-3.5 sm:p-4 font-semibold text-[#1F3A00]">{row.service}</td>
                        <td className="p-3.5 sm:p-4 font-medium text-[#1F3A00]">{row.from}</td>
                        <td className="p-3.5 sm:p-4">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/prices/#smart-calculator"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shadow-2xs"
                >
                  Calculate My Price
                </Link>
                <Link
                  href="/prices/"
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium ${SECONDARY_BUTTON_CLASS}`}
                >
                  Full Price Guide
                </Link>
              </div>
            </section>

            {/* SECTION 5: BEFORE & AFTER */}
            <section id="standards" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                The standard we hand properties back at
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                Drag the slider to compare a kitchen before and after a full end of tenancy restoration — the condition inventory clerks assess against:
              </p>
              <BeforeAfterSlider />
            </section>

            {/* SECTION 6: COVERAGE */}
            <section id="coverage" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                London coverage
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                Teams operate from our Ilford hub across Greater London and surrounding M25 postcodes. Availability is confirmed against your postcode, service and requested timing when you book:
              </p>

              <div className="flex flex-wrap gap-2">
                {COVERAGE.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 rounded-full bg-white border border-[#E5FBC9] text-xs font-semibold text-[#1F3A00]"
                  >
                    {area}
                  </span>
                ))}
              </div>

              <p className="m-0 flex flex-wrap items-center gap-2 text-sm text-[#1F3A00]">
                <HugeiconsIcon icon={Tick01Icon} size={16} strokeWidth={2.5} className="text-[#1F3A00] shrink-0" />
                Not sure about your postcode?
                <Link href="/areas/" className="font-semibold underline underline-offset-2 text-[#1F3A00]">
                  See all covered areas →
                </Link>
              </p>
            </section>

            {/* SECTION 7: LATEST GUIDES */}
            <section id="guides" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Property guides from our specialists
              </h2>
              <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                Checklists and practical advice written by the inspectors and technicians who do the work:
              </p>

              <div data-reveal-group className="grid sm:grid-cols-3 gap-3.5">
                {guides.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}/`}
                    className="flex flex-col gap-1.5 p-5 border border-[#E5FBC9] rounded-[16px] bg-white hover:border-[#1F3A00] transition-colors duration-150"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F3A00]">
                      {post.category}
                    </span>
                    <strong className="text-base font-semibold leading-snug text-[#1F3A00]">
                      {post.title}
                    </strong>
                    <span className="text-sm leading-relaxed text-[#1F3A00]">
                      {post.description}
                    </span>
                    <span className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-[#1F3A00]">
                      <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.8} className="text-[#1F3A00] shrink-0" />
                      {post.readTime}
                    </span>
                  </Link>
                ))}
              </div>

              <p className="m-0">
                <Link href="/blog/" className="text-sm font-semibold underline underline-offset-2 text-[#1F3A00]">
                  Read all property guides →
                </Link>
              </p>
            </section>

            {/* SECTION 8: FAQS */}
            <section id="faq" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Frequently asked questions
              </h2>
              <HomeFaq items={FAQ_DATA} />
            </section>

            {/* SECTION 9: LONDON OPERATIONS HUB */}
            <section id="hub" className="scroll-mt-24 flex flex-col gap-5">
              <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Our London operations hub
              </h2>

              <div className="grid sm:grid-cols-2 gap-5 items-center p-5 bg-[#DCFAB7] rounded-[20px] border border-[#E5FBC9]">
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-base leading-relaxed text-[#1F3A00]">
                    Best One Property Services operates from Ilford, dispatching cleaning, pest control, gardening and removals teams across Greater London and the Home Counties seven days a week.
                  </p>
                  <div className="flex flex-col gap-2.5 text-sm font-medium text-[#1F3A00]">
                    <span className="flex items-start gap-2.5">
                      <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#1F3A00]" />
                      28–42 Clements Rd, Ilford IG1 1BA, London
                    </span>
                    <span className="flex items-start gap-2.5">
                      <HugeiconsIcon icon={Call02Icon} size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#1F3A00]" />
                      Office {CONTACT.landline.display} · Mobile {CONTACT.mobile.display}
                    </span>
                    <span className="flex items-start gap-2.5">
                      <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#1F3A00]" />
                      Mon–Sun 07:00–21:00, emergency support outside hours
                    </span>
                  </div>
                </div>

                <div className="h-[300px] rounded-md overflow-hidden border border-[#1F3A00]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.5761637722508!2d0.06920557551979871!3d51.557670407031175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a7d80d5b802f%3A0x81c2f6f8cfbc3a12!2sBestone%20Pest%20Control%20Services%20London!5e0!3m2!1sen!2s!4v1787314561837!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Bestone Pest Control Services London Google Map Location"
                  />
                </div>
              </div>
            </section>

          </div>

          {/* ===================================================================
              RIGHT COLUMN: STICKY BOOKING SIDEBAR
              =================================================================== */}
          <aside className="lg:sticky lg:top-28 min-w-0 flex flex-col gap-4 bg-white border border-[#E5FBC9] rounded-[22px] p-6 shadow-2xs">
            <p className="m-0 text-xs font-bold uppercase tracking-wider text-[#1F3A00]">
              Book a service
            </p>
            <h3 className="m-0 font-heading text-2xl font-semibold leading-tight text-[#1F3A00]">
              Fixed price in 60 seconds
            </h3>
            <p className="m-0 text-sm leading-relaxed text-[#1F3A00]">
              Choose your service and property size for an itemised quote with no callout fees — then pick a slot that suits you.
            </p>

            <Link
              href="/booking/"
              className="flex items-center justify-center w-full px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shadow-2xs"
            >
              Get Instant Quote
            </Link>

            <Link
              href="/contact/"
              className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-md font-inter text-base font-medium ${SIDEBAR_CALL_BUTTON_CLASS}`}
            >
              <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={1.8} className="text-[#1F3A00]" />
              <span>Call Us</span>
            </Link>

            <div className="flex flex-col gap-1 pt-1 text-xs text-[#1F3A00]">
              <span className="flex items-center gap-2">
                Last reviewed:
                <span className="px-2 py-0.5 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] font-bold uppercase text-[10px] text-[#1F3A00]">
                  September 2026
                </span>
              </span>
              <span>All 32 boroughs · 7 days a week</span>
            </div>
          </aside>

        </div>

        {/* ===================================================================
            4. VERIFIED GOOGLE BUSINESS REVIEWS (Social proof before closing CTA)
            =================================================================== */}
        <section id="reviews" className="mt-16 scroll-mt-24">
          <GoogleReviewsSection category="pest-control" />
        </section>

        {/* ===================================================================
            5. BOTTOM CALLOUT BANNER — Closing CTA
            =================================================================== */}
        <section className="mt-16 p-8 sm:p-11 rounded-[26px] bg-white border border-[#E5FBC9] grid md:grid-cols-[1fr_auto] gap-7 items-center relative overflow-hidden">
          {/* Lime accent stripe */}
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B7F56A] rounded-l-[26px]" aria-hidden="true" />
          <div className="space-y-3">
            <h2 data-reveal className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
              Everything your property needs. One trusted team.
            </h2>
            <p className="m-0 text-base leading-relaxed text-[#1F3A00]/80 max-w-xl font-normal">
              Get a transparent quote for cleaning, pest control, gardening or removals — with the guarantee written in before the team is dispatched.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/prices/#smart-calculator"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer"
            >
              Book a Service
            </Link>
            <Link
              href="/contact/"
              className={`inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium ${SECONDARY_BUTTON_CLASS}`}
            >
              Contact Support
            </Link>
          </div>
        </section>

      </div>

    </main>
  );
}
