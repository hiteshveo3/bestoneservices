import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
export const metadata: Metadata = { title: "Booking", description: "Bestone Services secure guest booking journey.", alternates: { canonical: "/booking/" }, robots: { index: false, follow: false } };
export default function BookingPage() { return <main id="main-content"><section className="section"><div className="shell quote-band"><div><p className="eyebrow">Secure booking</p><h1>Guest booking journey is being prepared.</h1><p>Online booking will open in M2 after secure validation, pricing, consent and confirmation workflows are configured. Until then, contact the team by email.</p></div><ButtonLink href="/contact/">Contact Us</ButtonLink></div></section></main>; }
