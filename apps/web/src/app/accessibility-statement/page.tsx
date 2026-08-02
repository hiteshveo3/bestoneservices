import type { Metadata } from "next";
import { LegalPolicy } from "@/components/legal-policy";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Page() { return <LegalPolicy title="Accessibility Statement"><h2>Our commitment</h2><p>We aim to make this website usable for as many people as possible, including people using assistive technology, keyboard navigation or mobile devices.</p><h2>Contact us</h2><p>If you have difficulty using any part of this website or need information in another format, call or email us and tell us how we can help.</p></LegalPolicy>; }
