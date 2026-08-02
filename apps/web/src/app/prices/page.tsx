import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { pricingNotice } from "@/content/pest-control";
import { endOfTenancyContent } from "@/content/end-of-tenancy";
import { pestControlContent } from "@/content/pest-control";

export const metadata: Metadata = { title: "Starting Prices", description: "Approved starting prices for Bestone Services cleaning and pest control services.", alternates: { canonical: "/prices/" } };
export default function PricesPage() { return <main id="main-content"><section className="section"><div className="shell"><p className="eyebrow">Starting prices</p><h1>Clear starting prices for core services.</h1><p className="lead">The final price is confirmed before work is booked.</p><h2>End of tenancy cleaning</h2><div className="pricing-grid">{endOfTenancyContent.startingPrices.map(([name, price]) => <article className="price-card" key={name}><h3>{name}</h3><strong>{price}</strong></article>)}</div><h2>Pest control</h2><div className="pricing-grid">{pestControlContent.startingPrices.map(([name, price]) => <article className="price-card" key={name}><h3>{name}</h3><strong>{price}</strong></article>)}</div><div className="pricing-notice"><p>{pricingNotice[0]}</p><p>{pricingNotice[1]}</p></div><p><ButtonLink href="/contact/">Contact Us</ButtonLink></p></div></section></main>; }
