"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Calendar, PoundSterling, Clock, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2, MessageSquare } from "lucide-react";
import { siteContact } from "@/config/site-contact";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";
import { Spinner } from "@/components/ui/spinner";
import { FormError } from "@/components/ui/form-status";
import { CustomTextInput, CustomSelect } from "@/components/ui/form-controls";
import { SitewideIllustrationGrid } from "@/components/illustrations/sitewide-illustration-grid";

type ContactIntent = "book" | "pricing" | "existing" | "guarantee" | "general";

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

  return (
    <main id="main-content" className="py-12 text-start space-y-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HERO SECTION */}
        <SectionReveal disabled className="bg-[#F9FCF5] rounded-[24px] p-8 sm:p-12 border border-[#B7F56A] shadow-2xs space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-xs font-mono font-semibold uppercase tracking-wider">
            CONTACT BEST ONE SERVICES
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-ink-900">
            How Can We Help?
          </h1>
          <p className="text-lg text-ink-500 max-w-2xl leading-relaxed">
            Choose what you need below and we&apos;ll guide you to the right team or next step immediately.
          </p>
        </SectionReveal>

        {/* INTENT ROUTING GRID */}
        <SectionReveal className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-medium text-ink-900">Select Your Enquiry Topic</h2>
            <p className="text-base text-ink-500">Pick an option to open the tailored support path</p>
          </div>

          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4" staggerDelay={0.05}>
            
            {/* 1. Book a Service */}
            <StaggerItem>
              <Link
                href="/booking/"
                className="h-full p-5 rounded-[20px] bg-white border border-[#B7F56A] shadow-2xs hover:border-[#1F3A00] transition-colors duration-200 flex flex-col justify-between space-y-4 text-decoration-none group"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-[14px] bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center font-medium">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-medium text-lg text-ink-900 group-hover:underline">Book a Service</h3>
                  <p className="text-xs text-ink-500">Request a new cleaning, pest, or removal slot online</p>
                </div>
                <div className="text-xs font-mono font-medium text-ink-600 flex items-center gap-1 pt-2">
                  <span>Go to Booking</span>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-600" />
                </div>
              </Link>
            </StaggerItem>

            {/* 2. Get Pricing Help */}
            <StaggerItem>
              <Link
                href="/prices/"
                className="h-full p-5 rounded-[20px] bg-white border border-[#B7F56A] shadow-2xs hover:border-[#1F3A00] transition-colors duration-200 flex flex-col justify-between space-y-4 text-decoration-none group"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-[14px] bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center font-medium">
                    <PoundSterling className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-medium text-lg text-ink-900 group-hover:underline">Get Pricing Help</h3>
                  <p className="text-xs text-ink-500">Calculate upfront estimates or view starting rates</p>
                </div>
                <div className="text-xs font-mono font-medium text-ink-600 flex items-center gap-1 pt-2">
                  <span>Open Pricing</span>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-600" />
                </div>
              </Link>
            </StaggerItem>

            {/* 3. Existing Booking */}
            <StaggerItem>
              <button
                type="button"
                onClick={() => { setSelectedIntent("existing"); setSubmittedRef(null); }}
                className={`w-full h-full p-5 rounded-[20px] text-start transition-colors duration-150 flex flex-col justify-between space-y-4 cursor-pointer shadow-2xs ${ selectedIntent === "existing" ? "bg-[#1F3A00] text-[#B7F56A] font-medium border-[#1F3A00]" : "bg-[#F9FCF5] text-ink-700 border-[#E5FBC9] hover:bg-[#F9FCF5]" } border border-[#B7F56A]`}
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-[14px] bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center font-medium">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-medium text-lg">Existing Booking</h3>
                  <p className="text-xs opacity-80">Change date, update details or track status</p>
                </div>
                <div className="text-xs font-mono font-medium flex items-center gap-1 pt-2">
                  <span>Select Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </StaggerItem>

            {/* 4. Guarantee Support */}
            <StaggerItem>
              <button
                type="button"
                onClick={() => { setSelectedIntent("guarantee"); setSubmittedRef(null); }}
                className={`w-full h-full p-5 rounded-[20px] text-start transition-colors duration-150 flex flex-col justify-between space-y-4 cursor-pointer shadow-2xs ${ selectedIntent === "guarantee" ? "bg-[#1F3A00] text-[#B7F56A] font-medium border-[#1F3A00]" : "bg-[#F9FCF5] text-ink-700 border-[#E5FBC9] hover:bg-[#F9FCF5]" } border border-[#B7F56A]`}
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-[14px] bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center font-medium">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-medium text-lg">Guarantee Support</h3>
                  <p className="text-xs opacity-80">48-Hour Re-Clean or Pest Warranty help</p>
                </div>
                <div className="text-xs font-mono font-medium flex items-center gap-1 pt-2">
                  <span>Select Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </StaggerItem>

            {/* 5. General Enquiry */}
            <StaggerItem>
              <button
                type="button"
                onClick={() => { setSelectedIntent("general"); setSubmittedRef(null); }}
                className={`w-full h-full p-5 rounded-[20px] text-start transition-colors duration-150 flex flex-col justify-between space-y-4 cursor-pointer shadow-2xs ${ selectedIntent === "general" ? "bg-[#1F3A00] text-[#B7F56A] font-medium border-[#1F3A00]" : "bg-[#F9FCF5] text-ink-700 border-[#E5FBC9] hover:bg-[#F9FCF5]" } border border-[#B7F56A]`}
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-[14px] bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center font-medium">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-medium text-lg">General Enquiry</h3>
                  <p className="text-xs opacity-80">General support questions or commercial enquiries</p>
                </div>
                <div className="text-xs font-mono font-medium flex items-center gap-1 pt-2">
                  <span>Select Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </StaggerItem>

          </StaggerGrid>
        </SectionReveal>

        {/* INTENT-SPECIFIC DYNAMIC FORM */}
        <SectionReveal className="bg-[#F9FCF5] rounded-[24px] p-8 sm:p-12 border border-[#B7F56A] shadow-2xs space-y-6">
          {submittedRef ? (
            <div className="form-status-in p-8 rounded-[18px] bg-[#F9FCF5] border-none space-y-4 text-center" role="status">
              <CheckCircle2 className="form-check-pop w-12 h-12 text-ink-600 mx-auto" />
              <h3 className="font-heading text-2xl font-medium text-ink-900">Support Request Received</h3>
              <p className="text-base text-ink-500">
                Reference Number: <strong className="font-mono text-ink-600">{submittedRef}</strong>. Our team will review your message and get back to you within 2 hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedRef(null)}
                className="px-6 py-2.5 rounded-full bg-[#1F3A00] text-[#B7F56A] text-sm font-semibold hover:bg-[#2d5004] cursor-pointer border-none"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="space-y-1">
                <span className="text-xs font-mono font-medium uppercase text-ink-500">TAILORED SUPPORT FORM</span>
                <h3 className="font-heading text-2xl font-medium text-ink-900">
                  {selectedIntent === "existing" && "Existing Booking Enquiry"}
                  {selectedIntent === "guarantee" && "Service Guarantee Support Request"}
                  {selectedIntent === "general" && "General Support Message"}
                </h3>
              </div>

              {formError && <FormError>{formError}</FormError>}

              {selectedIntent === "existing" && (
                <>
                  <CustomTextInput name="bookingReference" label="Booking Reference #" placeholder="e.g. BOS-20481" required />
                  <CustomTextInput name="fullName" label="Full Name" placeholder="Your full name" required />
                  <CustomTextInput name="contact" label="Contact Phone or Email" placeholder="07123 456789 or name@example.com" required />
                  <div className="space-y-1.5">
                    <label className="text-sm font-mono text-ink-500 uppercase block font-medium">Booking Request Details</label>
                    <textarea
                      rows={4}
                      name="message"
                      required
                      placeholder="Please describe what you would like to update or check regarding your booking..."
                      className="w-full p-3.5 rounded-[18px] bg-[#F9FCF5] border-none text-base font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
                    />
                  </div>
                </>
              )}

              {selectedIntent === "guarantee" && (
                <>
                  <CustomSelect
                    label="Service Category"
                    options={[
                      { value: "cleaning", label: "End of Tenancy Cleaning (48-Hr Support)" },
                      { value: "pest", label: "Pest Control Package Guarantee" },
                      { value: "gardening", label: "Gardening & Clearance" },
                      { value: "removals", label: "Removals & Moving" },
                    ]}
                    value={guaranteeCategory}
                    onChange={setGuaranteeCategory}
                  />
                  <input type="hidden" name="serviceCategory" value={guaranteeCategory} />
                  <CustomTextInput name="bookingReference" label="Booking Reference # (If Available)" placeholder="e.g. BOS-20481" />
                  <CustomTextInput name="fullName" label="Full Name" placeholder="Your full name" required />
                  <CustomTextInput name="phone" label="Contact Phone" placeholder="07123 456789" required />
                  <div className="space-y-1.5">
                    <label className="text-sm font-mono text-ink-500 uppercase block font-medium">Issue Description</label>
                    <textarea
                      rows={4}
                      name="message"
                      required
                      placeholder="Describe the area or issue requiring re-attendance or guarantee support..."
                      className="w-full p-3.5 rounded-[18px] bg-[#F9FCF5] border-none text-base font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
                    />
                  </div>
                </>
              )}

              {selectedIntent === "general" && (
                <>
                  <CustomTextInput name="fullName" label="Full Name" placeholder="Your full name" required />
                  <CustomTextInput name="email" label="Email Address" type="email" placeholder="name@example.com" required />
                  <div className="space-y-1.5">
                    <label className="text-sm font-mono text-ink-500 uppercase block font-medium">Message</label>
                    <textarea
                      rows={4}
                      name="message"
                      required
                      placeholder="How can our support team assist you today?"
                      className="w-full p-3.5 rounded-[18px] bg-[#F9FCF5] border-none text-base font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-[#1F3A00]"
                    />
                  </div>
                </>
              )}

              <label className="flex items-start gap-3 text-sm text-ink-500">
                <input type="checkbox" name="privacyAccepted" required className="mt-1" />
                <span>I have read the <Link href="/privacy-policy/" className="underline text-ink-600">Privacy Policy</Link> and consent to this enquiry being processed.</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-4 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Spinner size={18} tone="on-dark" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <ArrowRight className="w-4 h-4 text-current" />
                  </>
                )}
              </button>
            </form>
          )}
        </SectionReveal>

        {/* VERIFIED DIRECT CONTACT CHANNELS */}
        <SectionReveal className="grid sm:grid-cols-4 gap-6">
          
          {/* Telephone Action */}
          <div className="bg-[#F9FCF5] rounded-[20px] p-6 border border-[#B7F56A] shadow-2xs space-y-3 text-start">
            <div className="w-12 h-12 rounded-[14px] bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center font-medium">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-heading font-medium text-lg text-ink-900">Direct Phone</h4>
              <p className="text-sm text-ink-500">Mon–Sat 08:00–18:00</p>
            </div>
            <a
              href={siteContact.phoneHref}
              className="w-full py-2.5 px-4 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] text-decoration-none flex items-center justify-center gap-2"
            >
              <span>Call {siteContact.phoneDisplay}</span>
            </a>
          </div>

          {/* WhatsApp Action */}
          <div className="bg-[#F9FCF5] rounded-[20px] p-6 border border-[#B7F56A] shadow-2xs space-y-3 text-start">
            <div className="w-12 h-12 rounded-[14px] bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center font-medium">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-heading font-medium text-lg text-ink-900">WhatsApp Chat</h4>
              <p className="text-sm text-ink-500">Instant messenger response</p>
            </div>
            <a
              href={siteContact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20b858] text-decoration-none flex items-center justify-center gap-2"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Email Dispatch */}
          <div className="bg-[#F9FCF5] rounded-[20px] p-6 border border-[#B7F56A] shadow-2xs space-y-3 text-start">
            <div className="w-12 h-12 rounded-[14px] bg-[#F9FCF5] text-[#1F3A00] border border-[#E5FBC9] flex items-center justify-center font-medium">
              <Mail className="w-5 h-5 text-ink-600" />
            </div>
            <div>
              <h4 className="font-heading font-medium text-lg text-ink-900">Email Dispatch</h4>
              <p className="text-sm text-ink-500">Response within 2 hours</p>
            </div>
            <a
              href={`mailto:${siteContact.email}`}
              className="w-full py-2.5 px-4 rounded-full bg-[#F9FCF5] text-ink-600 font-medium text-sm hover:bg-[#DCFAB7] text-decoration-none flex items-center justify-center gap-2"
            >
              <span>{siteContact.email}</span>
            </a>
          </div>

          {/* Registered Office */}
          <div className="bg-[#F9FCF5] rounded-[20px] p-6 border border-[#B7F56A] shadow-2xs space-y-3 text-start">
            <div className="w-12 h-12 rounded-[14px] bg-[#F9FCF5] text-[#1F3A00] border border-[#E5FBC9] flex items-center justify-center font-medium">
              <MapPin className="w-5 h-5 text-ink-600" />
            </div>
            <div>
              <h4 className="font-heading font-medium text-lg text-ink-900">Registered Office</h4>
              <p className="text-sm text-ink-500">Greater London Base</p>
            </div>
            <span className="text-sm font-medium text-ink-600 block">
              {siteContact.address.formatted}
            </span>
          </div>

        </SectionReveal>

      </div>

      <SitewideIllustrationGrid
        eyebrow="Support when you need it"
        title="Speak to the right property-service team"
        cards={[
          { slug: "contact-support", title: "Helpful Booking Support", description: "Share your service, property and timing details for clear next-step guidance.", imageSrc: "/images/feature-customer-support-blue-v1.png", imageAlt: "Customer-support specialist with phone and booking checklist cards" },
        ]}
      />
    </main>
  );
}

