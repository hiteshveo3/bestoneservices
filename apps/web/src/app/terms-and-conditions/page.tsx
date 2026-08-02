import type { Metadata } from "next";
import { LegalPolicy } from "@/components/legal-policy";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Page() { return <LegalPolicy title="Terms and Conditions"><h2>Services and quotes</h2><p>Starting prices are minimum prices for standard cases, not a binding quote. We confirm scope, availability and full price by telephone or email before a booking is finalised.</p><h2>Customer responsibilities</h2><p>Customers must provide accurate information, safe access and relevant service details. Some pest treatments require multiple visits, monitoring, preparation or aftercare.</p></LegalPolicy>; }
