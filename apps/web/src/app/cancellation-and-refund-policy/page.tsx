import type { Metadata } from "next";
import { LegalPolicy } from "@/components/legal-policy";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Page() { return <LegalPolicy title="Cancellation and Refund Policy"><h2>Cancelling or changing a booking</h2><p>Please call or email us as soon as possible with your name, property address, booking date and service booked.</p><h2>Consumer rights and refunds</h2><p>Eligible consumers may have a 14-day cancellation right. If you ask us to begin a service during that period, you may need to pay for work already provided.</p></LegalPolicy>; }
