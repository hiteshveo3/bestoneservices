"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteContact } from "@/config/site-contact";
import { Spinner } from "@/components/ui/spinner";
import { FormError } from "@/components/ui/form-status";
import { CustomTextInput, CustomSelect } from "@/components/ui/form-controls";
import { Eyebrow } from "@/components/touchstone";

type ContactIntent = "book" | "pricing" | "existing" | "guarantee" | "general";

const FORM_INTENTS: Array<{ id: ContactIntent; label: string }> = [
  { id: "general", label: "A question" },
  { id: "existing", label: "My booking" },
  { id: "guarantee", label: "Guarantee" },
];

const TEXTAREA =
  "w-full min-h-[120px] resize-none rounded-xl border-0 bg-[#ECEAE3] p-3.5 text-base text-[#1D201E] placeholder:text-[#5A605C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D201E]";

export default function ContactPage() {
  const [selectedIntent, setSelectedIntent] = useState<ContactIntent>("general");
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [guaranteeCategory, setGuaranteeCategory] = useState("cleaning");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: selectedIntent,
          fullName: formData.get("fullName"),
          email: formData.get("email") || undefined,
          phone: formData.get("phone") || undefined,
          contact: formData.get("contact") || undefined,
          bookingReference: formData.get("bookingReference") || undefined,
          serviceCategory: formData.get("serviceCategory") || undefined,
          message: formData.get("message"),
          privacyAccepted: formData.get("privacyAccepted") === "on",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "We could not save your enquiry.");
      setSubmittedRef(result.reference);
      e.currentTarget.reset();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "We could not save your enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const tiles = [
    { icon: MessageCircle, title: "WhatsApp", detail: "Replies Mon–Sat, 8am–8pm", href: siteContact.getWhatsappUrl("Hi Bestone, I have a question."), external: true },
    { icon: Phone, title: "Call", detail: siteContact.phoneDisplay, href: siteContact.phoneHref, external: false },
    { icon: Mail, title: "Email", detail: siteContact.email, href: `mailto:${siteContact.email}`, external: false },
    { icon: MapPin, title: "Our base", detail: siteContact.address.formatted, href: "https://maps.google.com/?q=" + encodeURIComponent(siteContact.address.formatted), external: true },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink">
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <div className="grid max-w-3xl gap-4">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="ts-head m-0 text-[clamp(38px,5vw,60px)] leading-none">
              Talk to us <span className="ts-soft">the way that suits you.</span>
            </h1>
            <p className="m-0 max-w-[56ch] text-lg text-muted">For a price, WhatsApp is quickest. For anything about an existing booking or a guarantee, use the form and we come back with a reference.</p>
          </div>
          {/* S11 B · Contact tiles */}
          <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map(({ icon: Icon, title, detail, href, external }) => (
              <li key={title}>
                <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex h-full items-center gap-3 rounded-2xl bg-white p-4 no-underline transition-colors duration-150 hover:bg-lime-soft">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-lime-soft"><Icon className="size-5" aria-hidden="true" /></span>
                  <span className="grid min-w-0">
                    <b>{title}</b>
                    <span className="break-words text-sm text-muted">{detail}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="grid content-start gap-4">
            <Eyebrow>Write to us</Eyebrow>
            <h2 className="ts-head m-0 text-[clamp(28px,3.4vw,40px)]">Tell us what it&apos;s about.</h2>
            <p className="m-0 text-muted">We reply within working hours, Mon–Sat, 8am–8pm, with a reference you can quote.</p>
            <dl className="ts-rows m-0">
              {[["Open", "Mon–Sat, 8am–8pm"], ["WhatsApp", siteContact.whatsappDisplay], ["Company", `${siteContact.companyName} · 15574809`]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-3 px-3.5 py-2.5 text-[15px]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="m-0 font-semibold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/prices/" className="inline-flex items-center gap-2 font-semibold no-underline">
              Looking for a price? See every price <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-3xl bg-paper p-5 sm:p-8">
            {submittedRef ? (
              <div className="grid justify-items-start gap-4" role="status">
                <span className="ts-stamp">Received<b>{submittedRef}</b></span>
                <h3 className="ts-head m-0 text-[28px]">Thanks, we have it.</h3>
                <p className="m-0 text-muted">Quote reference <b className="tabular-nums text-ink">{submittedRef}</b> if you contact us about this. We reply within working hours.</p>
                <button type="button" onClick={() => setSubmittedRef(null)} className="inline-flex min-h-12 items-center rounded-xl bg-white px-5 font-semibold text-ink transition-colors duration-150 hover:bg-lime-soft">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div role="radiogroup" aria-label="What is it about?" className="grid grid-cols-3 gap-1 rounded-xl bg-stone p-1">
                  {FORM_INTENTS.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      role="radio"
                      aria-checked={selectedIntent === it.id}
                      onClick={() => setSelectedIntent(it.id)}
                      className={`min-h-11 rounded-[9px] text-[15px] font-semibold transition-colors duration-150 ${selectedIntent === it.id ? "bg-lime text-ink" : "text-muted hover:bg-white"}`}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
                {formError && <FormError>{formError}</FormError>}
                {selectedIntent === "existing" && (
                  <>
                    <CustomTextInput name="bookingReference" label="Booking reference" placeholder="e.g. BOS-20481" required />
                    <CustomTextInput name="fullName" label="Full name" placeholder="Your full name" required />
                    <CustomTextInput name="contact" label="Phone or email" placeholder="07123 456789 or name@example.com" required />
                    <div className="grid gap-1.5">
                      <label htmlFor="msg-existing" className="text-sm font-semibold">What would you like to change or check?</label>
                      <textarea id="msg-existing" rows={4} name="message" required placeholder="A new date, access details, a question about the visit…" className={TEXTAREA} />
                    </div>
                  </>
                )}
                {selectedIntent === "guarantee" && (
                  <>
                    <CustomSelect
                      label="Service"
                      options={[
                        { value: "cleaning", label: "End of tenancy cleaning (48-hour re-clean)" },
                        { value: "pest", label: "Pest control guarantee" },
                        { value: "gardening", label: "Gardening and clearance" },
                        { value: "removals", label: "Removals" },
                      ]}
                      value={guaranteeCategory}
                      onChange={setGuaranteeCategory}
                    />
                    <input type="hidden" name="serviceCategory" value={guaranteeCategory} />
                    <CustomTextInput name="bookingReference" label="Booking reference (if you have it)" placeholder="e.g. BOS-20481" />
                    <CustomTextInput name="fullName" label="Full name" placeholder="Your full name" required />
                    <CustomTextInput name="phone" label="Phone" placeholder="07123 456789" required />
                    <div className="grid gap-1.5">
                      <label htmlFor="msg-guarantee" className="text-sm font-semibold">What needs another look?</label>
                      <textarea id="msg-guarantee" rows={4} name="message" required placeholder="The room or area, and what was flagged…" className={TEXTAREA} />
                    </div>
                  </>
                )}
                {(selectedIntent === "general" || selectedIntent === "book" || selectedIntent === "pricing") && (
                  <>
                    <CustomTextInput name="fullName" label="Full name" placeholder="Your full name" required />
                    <CustomTextInput name="email" label="Email" type="email" placeholder="name@example.com" required />
                    <div className="grid gap-1.5">
                      <label htmlFor="msg-general" className="text-sm font-semibold">Your message</label>
                      <textarea id="msg-general" rows={4} name="message" required placeholder="How can we help?" className={TEXTAREA} />
                    </div>
                  </>
                )}
                <label className="flex items-start gap-3 text-sm text-muted">
                  <input type="checkbox" name="privacyAccepted" required className="mt-0.5 size-5 accent-[#1D201E]" />
                  <span>I have read the <Link href="/privacy-policy/" className="text-ink underline">privacy policy</Link> and agree to this enquiry being processed.</span>
                </label>
                <button type="submit" disabled={submitting} className="inline-flex min-h-14 items-center justify-center gap-2 justify-self-start rounded-[14px] bg-lime px-6 text-[17px] font-semibold text-ink transition-colors duration-150 hover:bg-lime-2 disabled:bg-stone disabled:text-faint">
                  {submitting ? (<><Spinner size={18} /><span>Sending…</span></>) : (<><span>Send message</span><ArrowRight className="size-4" aria-hidden="true" /></>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
