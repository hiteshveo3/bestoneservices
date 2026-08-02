import type { Metadata } from "next";
import { LegalPolicy } from "@/components/legal-policy";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Page() { return <LegalPolicy title="Complaints Policy"><h2>How to complain</h2><p>Call or email us with your service or booking details, the concern and the outcome you would like us to consider.</p><h2>What happens next</h2><p>We will acknowledge your complaint, review the available information and explain our response or further steps.</p></LegalPolicy>; }
