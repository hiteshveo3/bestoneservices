import Link from "next/link";
import { siteConfig } from "@/config/site";
import { siteContact } from "@/config/site-contact";

/** Touchstone reading page for legal documents: one calm column, record-style header. */
export function LegalPolicy({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink">
      <div className="mx-auto grid max-w-[760px] gap-6 px-4 py-14 sm:px-6 sm:py-20">
        <p className="ts-eyebrow m-0">{siteContact.companyName}</p>
        <h1 className="ts-head m-0 text-[clamp(36px,4.6vw,52px)]">{title}</h1>
        <p className="m-0 rounded-xl bg-[#FCF0CF] px-4 py-3 text-[15px] text-[#6A4B00]">Draft pending UK legal review. Not yet published or legally approved.</p>
        <article className="grid gap-4 rounded-3xl bg-white p-6 text-[17px] leading-relaxed text-ink-2 sm:p-8 [&_h2]:font-[650] [&_h2]:mt-4 [&_h2]:mb-0 [&_h2]:text-[26px] [&_h2]:text-ink [&_p]:m-0 [&_ul]:m-0 [&_ul]:grid [&_ul]:gap-2 [&_ul]:pl-5 [&_a]:text-ink [&_a]:underline">
          {children}
        </article>
        <p className="m-0 text-muted">
          Contact: <a href={`mailto:${siteConfig.email}`} className="font-semibold text-ink">{siteConfig.email}</a> · <Link href="/" className="font-semibold text-ink">Back to home</Link>
        </p>
      </div>
    </main>
  );
}
