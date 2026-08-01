import type { Metadata } from "next";
import Image from "next/image";
import {
  Bug01Icon,
  Certificate01Icon,
  CheckmarkCircle02Icon,
  CleanIcon,
  Clock01Icon,
  InformationCircleIcon,
  Location01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { ButtonLink } from "@/components/button-link";
import { DecorativeIcon as HugeiconsIcon } from "@/components/decorative-icon";
import { FaqList } from "@/components/faq-list";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { organisationSchema, websiteSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: "End of Tenancy Cleaning & Pest Control | Best One Services" },
  description:
    "End of tenancy cleaning and pest-control services for homes, rental properties and businesses. Tell Best One Services what the property needs and request a free quote.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: "End of Tenancy Cleaning & Pest Control | Best One Services",
    description: siteConfig.description,
    url: "/",
    images: [
      {
        url: "/images/end-of-tenancy-hero.jpg",
        width: 1693,
        height: 929,
        alt: "A professional cleaner preparing a bright rental property",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "End of Tenancy Cleaning & Pest Control | Best One Services",
    description: siteConfig.description,
    images: ["/images/end-of-tenancy-hero.jpg"],
  },
};

const homeFaqs = [
  {
    question: "Which services can I request?",
    answer:
      "Best One Services currently accepts enquiries for end of tenancy cleaning and pest control. Each service has its own page and quote path.",
  },
  {
    question: "Can I request a quote without an account?",
    answer:
      "Yes. Submit the form as a guest using your name, email address and the relevant property details. No customer account is created.",
  },
  {
    question: "What helps with an end of tenancy cleaning quote?",
    answer:
      "Share the property type, bedroom count, furniture status, postcode or area, preferred date and the rooms or add-ons that need attention.",
  },
  {
    question: "What if I am not sure which pest I have?",
    answer:
      "You can still report the problem. Describe the signs, affected rooms and when the issue began instead of guessing the pest type.",
  },
  {
    question: "How do I check whether my area is covered?",
    answer:
      "Enter the property postcode or area in the quote form. Whether that location is covered can then be confirmed.",
  },
  {
    question: "Does my preferred date confirm availability?",
    answer:
      "No. It explains the timing you need, but availability and any booking must be confirmed separately.",
  },
] as const;

const trustItems = [
  [StarIcon, `${siteConfig.googleRating} on Google`, `${siteConfig.googleReviewCount} customer reviews`],
  [Clock01Icon, "Open 24 hours", "Call when you need help"],
  [Certificate01Icon, "Licensed & insured", "Professional service standards"],
  [Location01Icon, "Based in Ilford", "Serving London properties"],
] as const;

const reviews = [
  {
    name: "ar shanto -1427",
    text: "The team was professional, punctual, and paid great attention to detail.",
    label: "Cleaning review on Google",
  },
  {
    name: "Sanjogita Prahladi",
    text: "The appointment was arranged quickly and the technician was efficient, friendly and professional.",
    label: "Pest control review on Google",
  },
  {
    name: "Akhtar Ayub",
    text: "The service was extremely good and the price was very reasonable.",
    label: "Mouse control review on Google",
  },
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    organisationSchema(),
    websiteSchema(),
    {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/#webpage`,
      url: siteConfig.url,
      name: "End of Tenancy Cleaning & Pest Control | Best One Services",
      description: siteConfig.description,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      inLanguage: "en-GB",
    },
    {
      "@type": "FAQPage",
      mainEntity: homeFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />

      <section className="shell hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Cleaning and pest control</p>
          <h1 id="home-title">End of tenancy cleaning and pest control you can rely on.</h1>
          <p className="lead">Get the property ready for handover or report a pest concern without the runaround. Tell us what needs attention, where the property is and your preferred date.</p>
          <div className="button-row">
            <ButtonLink href="/get-a-quote/">Get My Free Quote</ButtonLink>
            <ButtonLink href="/end-of-tenancy-cleaning/" secondary arrow={false}>View Cleaning Service</ButtonLink>
          </div>
          <p className="hero-note"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Open 24 hours. Call <a href={siteConfig.phoneHref}>{siteConfig.phone}</a> or request a quote online.</span></p>
        </div>
        <div className="hero-media hero-media-dual" aria-label="Cleaning and pest-control services">
          <figure>
            <Image src="/images/end-of-tenancy-hero.jpg" alt="A professional cleaner preparing a bright rental property" width={1693} height={929} preload sizes="(max-width: 1020px) 44vw, 245px" />
            <figcaption><HugeiconsIcon icon={CleanIcon} size={17} />End of tenancy cleaning</figcaption>
          </figure>
          <figure>
            <Image src="/images/pest-inspection.jpg" alt="A pest-control professional inspecting a property" width={1723} height={913} sizes="(max-width: 1020px) 44vw, 245px" />
            <figcaption><HugeiconsIcon icon={Bug01Icon} size={17} />Pest control</figcaption>
          </figure>
        </div>
      </section>

      <section className="section" aria-label="Service highlights">
        <div className="shell trust-grid">
          {trustItems.map(([icon, title, text]) => (
            <article className="trust-card" key={title}>
              <span className="icon-box"><HugeiconsIcon icon={icon} size={22} /></span>
              <strong>{title}</strong><span>{text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-white" id="services" aria-labelledby="services-title">
        <div className="shell">
          <div className="section-head">
            <div><p className="eyebrow">Choose a service</p><h2 id="services-title">What does the property need?</h2></div>
            <p>Choose the service that matches the job. Cleaning and pest-control enquiries ask for different details.</p>
          </div>
          <div className="service-grid">
            <article className="service-card">
              <div>
                <span className="icon-box"><HugeiconsIcon icon={CleanIcon} size={22} /></span>
                <h2>End of Tenancy Cleaning</h2>
                <p>Move-out cleaning for rental-property handovers, inspections and new occupants.</p>
                <ul className="clean-list service-outcome-list">
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Kitchens, bathrooms and living spaces</span></li>
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Furnished and unfurnished properties</span></li>
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Oven, carpet or upholstery requests noted separately</span></li>
                </ul>
                <ButtonLink href="/end-of-tenancy-cleaning/">View Cleaning Service</ButtonLink>
              </div>
              <Image src="/images/cleaning-service.jpg" alt="A bright, clean rental-property kitchen" width={1536} height={1024} sizes="(max-width: 760px) 90vw, 230px" />
            </article>
            <article className="service-card">
              <div>
                <span className="icon-box"><HugeiconsIcon icon={Bug01Icon} size={22} /></span>
                <h2>Pest Control</h2>
                <p>Report a pest concern at a home, rental property or business premises.</p>
                <ul className="clean-list service-outcome-list">
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Rats, mice, bed bugs, cockroaches and more</span></li>
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Describe signs when the pest type is unknown</span></li>
                  <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Residential and commercial enquiries</span></li>
                </ul>
                <ButtonLink href="/pest-control/">View Pest Control</ButtonLink>
              </div>
              <Image src="/images/pest-inspection.jpg" alt="A pest-control professional inspecting a property" width={1723} height={913} sizes="(max-width: 760px) 90vw, 230px" />
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="cleaning-detail-title">
        <div className="shell feature-split">
          <div className="feature-media">
            <Image src="/images/cleaning-service.jpg" alt="A clean, bright kitchen prepared for a property handover" width={1536} height={1024} sizes="(max-width: 1020px) 100vw, 48vw" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow"><HugeiconsIcon icon={CleanIcon} size={18} />Cleaning for handover</p>
            <h2 id="cleaning-detail-title">A detailed clean around your move-out.</h2>
            <p>Tell us the property type, bedroom count, furnishing status and the date keys need to be handed over. We use those details to understand what needs attention before the next stage of the tenancy.</p>
            <ul className="clean-list feature-list">
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Kitchens, bathrooms, bedrooms and living spaces</span></li>
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Optional oven, carpet or upholstery requirements</span></li>
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Useful notes for access, parking or inspection deadlines</span></li>
            </ul>
            <ButtonLink href="/end-of-tenancy-cleaning/">Explore Cleaning Service</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="pest-detail-title">
        <div className="shell feature-split feature-reverse">
          <div className="feature-copy">
            <p className="eyebrow"><HugeiconsIcon icon={Bug01Icon} size={18} />Pest-control support</p>
            <h2 id="pest-detail-title">Tell us what you have noticed.</h2>
            <p>You do not need to diagnose the issue first. Describe the signs, affected rooms, property type and when the problem started, and our team can discuss the right next step.</p>
            <ul className="clean-list feature-list">
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Rat, mice, bed bug, cockroach, ant, flea, wasp and squirrel enquiries</span></li>
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Homes, rental properties and business premises</span></li>
              <li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} /><span>Advice designed around the reported issue and property details</span></li>
            </ul>
            <ButtonLink href="/pest-control/">Explore Pest Control</ButtonLink>
          </div>
          <div className="feature-media">
            <Image src="/images/pest-inspection.jpg" alt="A pest-control professional inspecting a property" width={1723} height={913} sizes="(max-width: 1020px) 100vw, 48vw" />
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works" aria-labelledby="home-process-title">
        <div className="shell">
          <div className="section-head"><div><p className="eyebrow">How it works</p><h2 id="home-process-title">From property details to a quote in three steps.</h2></div></div>
          <div className="process-grid">
            <article className="process-card"><h3>Choose the service</h3><p>Select cleaning or pest control and open the relevant quote path.</p></article>
            <article className="process-card"><h3>Describe the property</h3><p>Add the property type, postcode, preferred date and the details that matter.</p></article>
            <article className="process-card"><h3>Discuss the quote</h3><p>The service requirements, availability and price can then be discussed with you.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="area-title">
        <div className="shell area-band">
          <div>
            <p className="eyebrow">Check your area</p>
            <h2 id="area-title">Tell us where the property is.</h2>
            <p>Add the postcode or area to the quote form. Coverage and availability can then be confirmed for that request.</p>
          </div>
          <ButtonLink href="/get-a-quote/#postcode">Check Availability</ButtonLink>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="reviews-title">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="eyebrow"><HugeiconsIcon icon={StarIcon} size={18} />Customer reviews</p>
              <h2 id="reviews-title">Rated {siteConfig.googleRating} from {siteConfig.googleReviewCount} Google reviews.</h2>
            </div>
            <p>Feedback from customers who used Bestone Pest Control Services London and Best One Clean Services Ltd.</p>
          </div>
          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="review-stars" aria-label="5 out of 5 stars"><HugeiconsIcon icon={StarIcon} size={17} /><HugeiconsIcon icon={StarIcon} size={17} /><HugeiconsIcon icon={StarIcon} size={17} /><HugeiconsIcon icon={StarIcon} size={17} /><HugeiconsIcon icon={StarIcon} size={17} /></div>
                <blockquote>“{review.text}”</blockquote>
                <p><strong>{review.name}</strong><span>{review.label}</span></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white" id="location" aria-labelledby="location-title">
        <div className="shell location-layout">
          <div className="location-copy">
            <p className="eyebrow"><HugeiconsIcon icon={Location01Icon} size={18} />Visit or call us</p>
            <h2 id="location-title">Based in Ilford, serving London properties.</h2>
            <p>Call our team any time, request a quote online, or use the map to find our Clements Road address.</p>
            <address>
              <strong>Bestone Pest Control Services London</strong>
              <span>{siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}, United Kingdom</span>
              <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
              <span>{siteConfig.openingHours}</span>
            </address>
            <div className="button-row">
              <ButtonLink href={siteConfig.phoneHref} arrow={false}>Call 24/7</ButtonLink>
              <ButtonLink href="/get-a-quote/" secondary arrow={false}>Request a Quote</ButtonLink>
            </div>
          </div>
          <iframe
            className="location-map"
            title="Bestone Pest Control Services London location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317716.6065126688!2d-0.431249722975234!3d51.528607004464966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a7d80d5b802f%3A0x81c2f6f8cfbc3a12!2sBestone%20Pest%20Control%20Services%20London!5e0!3m2!1sen!2s!4v1785604253745!5m2!1sen!2s"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <section className="section section-alt" id="faqs" aria-labelledby="home-faq-title">
        <div className="shell">
          <div className="faq-heading"><p className="eyebrow"><HugeiconsIcon icon={InformationCircleIcon} size={18} />FAQs</p><h2 id="home-faq-title">Questions before requesting a quote.</h2></div>
          <FaqList faqs={homeFaqs} />
        </div>
      </section>

      <section className="section section-white" aria-labelledby="home-cta-title">
        <FinalCta
          eyebrow="Start your enquiry"
          title="Tell us what the property needs."
          titleId="home-cta-title"
          description="Choose cleaning or pest control, add the postcode and share the details that matter for the job."
          buttonLabel="Get My Free Quote"
        />
      </section>
    </main>
  );
}
