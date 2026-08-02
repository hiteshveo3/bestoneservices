import type { Metadata } from "next";
import { LegalPolicy } from "@/components/legal-policy";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Page() { return <LegalPolicy title="Cookie Policy"><h2>How we use cookies</h2><p>Strictly necessary cookies help the website work safely and effectively. Analytics and marketing cookies remain disabled unless you choose to accept them.</p><h2>Managing cookies</h2><p>You can control cookies through browser settings. Blocking essential cookies may affect parts of the website.</p></LegalPolicy>; }
