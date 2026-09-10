"use client";

import { useId, useState } from "react";
import { ChevronLeft, Clock, MapPin, User, Check, MessageCircle, Phone, AlertCircle } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";

interface BookingData {
  service: string;
  date: string;
  timeRange: string;
  address: string;
  postcode: string;
  name: string;
  email: string;
  phone: string;
  bedrooms?: string;
  notes?: string;
}

type FieldErrors = Partial<Record<keyof BookingData, string>>;

const SERVICES = [
  {
    id: "cleaning",
    name: "End of Tenancy Cleaning",
    desc: "Professional move-out cleaning",
    price: "£130+",
  },
  {
    id: "pest",
    name: "Pest Control",
    desc: "Emergency pest treatment",
    price: "£89+",
  },
  {
    id: "gardening",
    name: "Gardening",
    desc: "Garden maintenance & clearance",
    price: "£70+",
  },
  {
    id: "removals",
    name: "House Removals",
    desc: "Man & van service",
    price: "£80+/hr",
  },
];

const TIME_RANGES = [
  { id: "morning", label: "Morning", time: "8:00 AM - 12:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "12:00 PM - 4:00 PM" },
  { id: "evening", label: "Evening", time: "4:00 PM - 8:00 PM" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildWhatsappMessage(data: BookingData): string {
  const service = SERVICES.find((s) => s.id === data.service)?.name ?? "Not selected";
  const time = TIME_RANGES.find((t) => t.id === data.timeRange)?.label ?? "Not selected";
  const lines = [
    "Booking request from bestoneservices.co.uk",
    `Service: ${service}`,
    `Date: ${data.date || "Not selected"}`,
    `Time: ${time}`,
    `Address: ${data.address}, ${data.postcode}`,
    data.bedrooms ? `Bedrooms: ${data.bedrooms}` : null,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    data.notes ? `Notes: ${data.notes}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp.wa}?text=${encodeURIComponent(message)}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-danger-500">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
}

export function ModernBookingWizard() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitFailed, setSubmitFailed] = useState(false);
  const idPrefix = useId();
  const [formData, setFormData] = useState<BookingData>({
    service: "",
    date: "",
    timeRange: "",
    address: "",
    postcode: "",
    name: "",
    email: "",
    phone: "",
    bedrooms: "",
    notes: "",
  });

  const steps = ["Service", "Date & Time", "Location", "Details"];

  const set = (field: keyof BookingData) => (value: string) => {
    setFormData((f) => ({ ...f, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData({ ...formData, service: serviceId });
    setErrors((e) => ({ ...e, service: undefined }));
    setStep(1);
  };

  const handleTimeSelect = (timeRange: string) => {
    setFormData({ ...formData, timeRange });
    setErrors((e) => ({ ...e, timeRange: undefined }));
  };

  const validateStep = (currentStep: number): FieldErrors => {
    const next: FieldErrors = {};
    if (currentStep === 0 && !formData.service) {
      next.service = "Choose a service to continue.";
    }
    if (currentStep === 1) {
      if (!formData.date) next.date = "Pick a date for your service.";
      if (!formData.timeRange) next.timeRange = "Pick a time slot.";
    }
    if (currentStep === 2) {
      if (!formData.address.trim()) next.address = "Enter your street address.";
      if (!formData.postcode.trim()) next.postcode = "Enter your postcode.";
    }
    if (currentStep === 3) {
      if (!formData.name.trim()) next.name = "Enter your full name.";
      if (!formData.email.trim()) next.email = "Enter your email address.";
      else if (!EMAIL_RE.test(formData.email)) next.email = "Enter a valid email address.";
      if (!formData.phone.trim()) next.phone = "Enter a phone number we can reach you on.";
      else if (formData.phone.replace(/\D/g, "").length < 9) next.phone = "That phone number looks too short.";
    }
    return next;
  };

  const handleDetailsSubmit = async () => {
    setIsSubmitting(true);
    setSubmitFailed(false);
    try {
      const response = await fetch("/api/bookings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = `/booking/confirmation/?id=${data.id}&service=${formData.service}`;
      } else {
        setSubmitFailed(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setSubmitFailed(true);
      setIsSubmitting(false);
    }
  };

  const advance = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (step === 3) {
      handleDetailsSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const fieldId = (name: string) => `${idPrefix}-${name}`;
  const errorId = (name: string) => `${idPrefix}-${name}-error`;

  const fieldClass = (hasError: boolean) =>
    `w-full min-h-[52px] px-4 py-3.5 rounded-[14px] bg-white border-2 font-medium text-base text-[#1F3A00] placeholder:text-[#1F3A00]/40 shadow-2xs transition-all focus:outline-none ${
      hasError
        ? "border-red-500 focus:border-red-500 ring-2 ring-red-100"
        : "border-[#D1E8B8] hover:border-[#99D055] focus:border-[#1F3A00] focus:ring-4 focus:ring-[#B7F56A]/30"
    }`;

  const whatsappMessage = buildWhatsappMessage(formData);

  return (
    <div className="min-h-screen bg-[#F9FCF5] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5FBC9]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
              aria-label="Go back to previous step"
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#F9FCF5] rounded-[12px] text-[#1F3A00] disabled:opacity-30 transition-colors duration-150"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-heading text-2xl font-medium text-ink-900">
              Book Now
            </h1>
            <div className="w-9" />
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={steps.length} aria-label={`Step ${step + 1} of ${steps.length}: ${steps[step]}`}>
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full ${
                  i <= step ? "bg-[#1F3A00]" : "bg-[#E5FBC9]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content + sidebar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
        {/* Step 1: Service Selection */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-3xl font-heading font-medium text-ink-900 mb-2">
                What service do you need?
              </h2>
              <p className="text-ink-500">Choose the service that fits your needs</p>
            </div>

            <div className="grid gap-4" role="radiogroup" aria-label="Choose a service" aria-describedby={errors.service ? errorId("service") : undefined}>
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  role="radio"
                  aria-checked={formData.service === service.id}
                  className={`p-6 rounded-[20px] border transition-colors duration-200 text-start group ${ formData.service === service.id ? "border-[#99D055] bg-[#DCFAB7]/40 text-[#1F3A00] shadow-2xs" : "border-[#E5FBC9] bg-white hover:border-[#99D055] text-ink-900" }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-ink-600 text-lg">
                      {service.name}
                    </h3>
                    <span className="text-xl font-bold text-[#1F3A00]">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-sm text-ink-500">{service.desc}</p>
                </button>
              ))}
            </div>
            <FieldError id={errorId("service")} message={errors.service} />
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-heading font-medium text-ink-900 mb-2">
                When do you need it?
              </h2>
              <p className="text-ink-500">Select your preferred date and time</p>
            </div>

            {/* Custom Date Picker */}
            <div>
              <CustomDatePicker
                id={fieldId("date")}
                label="Select date"
                value={formData.date}
                onChange={set("date")}
                minDate={new Date().toISOString().split("T")[0]}
                error={errors.date}
              />
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-sm font-semibold text-[#1F3A00] mb-3" id={fieldId("time-label")}>
                <Clock className="w-4 h-4 inline mr-2 text-[#1F3A00]" aria-hidden="true" />
                Select time slot
              </label>
              <div
                className="grid grid-cols-3 gap-3"
                role="radiogroup"
                aria-labelledby={fieldId("time-label")}
                aria-describedby={errors.timeRange ? errorId("timeRange") : undefined}
              >
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => handleTimeSelect(range.id)}
                    disabled={!formData.date}
                    role="radio"
                    aria-checked={formData.timeRange === range.id}
                    className={`p-4 rounded-[14px] border-2 transition-all text-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      formData.timeRange === range.id
                        ? "border-[#1F3A00] bg-[#DCFAB7] text-[#1F3A00] shadow-sm font-bold scale-[1.02]"
                        : "border-[#D1E8B8] bg-white hover:border-[#99D055] hover:bg-[#F9FCF5]"
                    }`}
                  >
                    <p className="font-bold text-[#1F3A00] text-sm">
                      {range.label}
                    </p>
                    <p className="text-xs text-[#1F3A00]/70 mt-1 font-medium">{range.time}</p>
                  </button>
                ))}
              </div>
              <FieldError id={errorId("timeRange")} message={errors.timeRange} />
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-heading font-medium text-ink-900 mb-2">
                Where is your property?
              </h2>
              <p className="text-[#1F3A00]/70 font-medium">Help us locate your property across Greater London</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor={fieldId("address")} className="block text-sm font-semibold text-[#1F3A00] mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#1F3A00]" aria-hidden="true" />
                  <span>Property Address *</span>
                </label>
                <input
                  id={fieldId("address")}
                  type="text"
                  autoComplete="street-address"
                  placeholder="e.g. Flat 4, 28-42 Clements Road"
                  value={formData.address}
                  onChange={(e) => set("address")(e.target.value)}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? errorId("address") : undefined}
                  className={fieldClass(Boolean(errors.address))}
                />
                <FieldError id={errorId("address")} message={errors.address} />
              </div>

              <div>
                <label htmlFor={fieldId("postcode")} className="block text-sm font-semibold text-[#1F3A00] mb-2">
                  London Postcode *
                </label>
                <input
                  id={fieldId("postcode")}
                  type="text"
                  autoComplete="postal-code"
                  placeholder="e.g. IG1 1BA or E1 6AN"
                  value={formData.postcode}
                  onChange={(e) => set("postcode")(e.target.value.toUpperCase())}
                  aria-invalid={Boolean(errors.postcode)}
                  aria-describedby={errors.postcode ? errorId("postcode") : undefined}
                  className={fieldClass(Boolean(errors.postcode))}
                />
                <FieldError id={errorId("postcode")} message={errors.postcode} />
              </div>

              <div>
                <label htmlFor={fieldId("bedrooms")} className="block text-sm font-semibold text-[#1F3A00] mb-2">
                  Bedrooms (optional)
                </label>
                <input
                  id={fieldId("bedrooms")}
                  type="number"
                  min="0"
                  placeholder="e.g. 2 bedrooms"
                  value={formData.bedrooms || ""}
                  onChange={(e) => set("bedrooms")(e.target.value)}
                  className={fieldClass(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Contact Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-heading font-medium text-ink-900 mb-2">
                Almost there!
              </h2>
              <p className="text-[#1F3A00]/70 font-medium">Your contact details for booking confirmation</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor={fieldId("name")} className="block text-sm font-semibold text-[#1F3A00] mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#1F3A00]" aria-hidden="true" />
                  <span>Full Name *</span>
                </label>
                <input
                  id={fieldId("name")}
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => set("name")(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? errorId("name") : undefined}
                  className={fieldClass(Boolean(errors.name))}
                />
                <FieldError id={errorId("name")} message={errors.name} />
              </div>

              <div>
                <label htmlFor={fieldId("email")} className="block text-sm font-semibold text-[#1F3A00] mb-2">
                  Email Address *
                </label>
                <input
                  id={fieldId("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="sarah@example.com"
                  value={formData.email}
                  onChange={(e) => set("email")(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? errorId("email") : undefined}
                  className={fieldClass(Boolean(errors.email))}
                />
                <FieldError id={errorId("email")} message={errors.email} />
              </div>

              <div>
                <label htmlFor={fieldId("phone")} className="block text-sm font-semibold text-[#1F3A00] mb-2">
                  Phone Number *
                </label>
                <input
                  id={fieldId("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="07700 900123"
                  value={formData.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? errorId("phone") : undefined}
                  className={fieldClass(Boolean(errors.phone))}
                />
                <FieldError id={errorId("phone")} message={errors.phone} />
              </div>

              <div>
                <label htmlFor={fieldId("notes")} className="block text-sm font-semibold text-[#1F3A00] mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  id={fieldId("notes")}
                  value={formData.notes || ""}
                  onChange={(e) => set("notes")(e.target.value)}
                  placeholder="Any special access instructions, parking, or specific requirements..."
                  rows={4}
                  className={`${fieldClass(false)} resize-none`}
                />
              </div>

              {/* Summary — announced to screen readers as it becomes complete */}
              <div className="bg-white p-5 rounded-[20px] border border-[#E5FBC9] space-y-2" aria-live="polite">
                <p className="text-sm text-ink-500">
                  <strong>Service:</strong> {SERVICES.find(s => s.id === formData.service)?.name}
                </p>
                <p className="text-sm text-ink-500">
                  <strong>Date:</strong> {formData.date || "Not selected"}
                </p>
                <p className="text-sm text-ink-500">
                  <strong>Time:</strong> {TIME_RANGES.find(t => t.id === formData.timeRange)?.label || "Not selected"}
                </p>
                <p className="text-sm text-ink-500">
                  <strong>Location:</strong> {formData.address}, {formData.postcode}
                </p>
              </div>

              {/* Submission fallback: if the booking API fails, don't strand the
                  customer — offer WhatsApp (pre-filled) and a direct call, plus
                  the raw message so they can see exactly what would be sent. */}
              {submitFailed ? (
                <div role="alert" className="rounded-[16px] border-2 border-danger-500 bg-danger-50 p-4 space-y-3">
                  <p className="flex items-center gap-2 text-sm font-medium text-danger-900">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    We couldn&apos;t submit that automatically. Send it directly instead:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={whatsappLink(whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#25D366] text-white border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send via WhatsApp
                    </a>
                    <a
                      href={CONTACT.mobile.tel}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-white text-[#1F3A00] border border-[#E5FBC9] hover:opacity-90 transition-opacity duration-200 cursor-pointer gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call us instead
                    </a>
                  </div>
                  <details className="text-xs text-ink-500">
                    <summary className="cursor-pointer select-none">What we&apos;ll send</summary>
                    <pre className="mt-2 whitespace-pre-wrap break-words rounded-[12px] bg-[#F9FCF5] border border-[#E5FBC9] p-3 text-xs text-ink-600">
                      {whatsappMessage}
                    </pre>
                  </details>
                </div>
              ) : null}
            </div>
          </div>
        )}
        </div>

        {/* Sidebar — what happens after the customer submits, kept visible
            alongside the form on desktop rather than only shown afterward. */}
        <aside className="hidden lg:block space-y-4">
          <div className="rounded-[24px] border border-[#E5FBC9] bg-white p-6 shadow-2xs lg:sticky lg:top-32">
            <h2 className="text-base font-medium text-ink-900">What happens next</h2>
            <ol className="mt-4 space-y-3 text-sm text-ink-600">
              {[
                "We confirm availability for your date within 2 working hours.",
                "Our team calls to confirm scope and access details.",
                "You get an SMS reminder the day before your booking.",
              ].map((text, i) => (
                <li key={text} className="flex gap-3">
                  <span aria-hidden="true" className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DCFAB7] text-xs font-bold text-[#1F3A00]">
                    {i + 1}
                  </span>
                  {text}
                </li>
              ))}
            </ol>
            <a
              href={CONTACT.mobile.tel}
              className="mt-5 inline-flex w-full items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-white text-[#1F3A00] border border-[#E5FBC9] hover:opacity-90 transition-opacity duration-200 cursor-pointer gap-2"
            >
              <Phone className="w-4 h-4" />
              Prefer to call? {CONTACT.mobile.display}
            </a>
          </div>
        </aside>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E5FBC9] z-30 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={advance}
            disabled={isSubmitting}
            className="w-full px-6 py-3.5 bg-[#B7F56A] text-[#1F3A00] font-bold text-base rounded-[14px] border-none hover:bg-[#a6ec55] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-[#1F3A00]/30 border-t-[#1F3A00] rounded-full animate-spin" />
                <span>Processing Booking...</span>
              </>
            ) : step === 3 ? (
              <>
                <Check className="w-5 h-5" />
                <span>Confirm & Submit Booking</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>
          <p className="text-center text-xs text-[#1F3A00]/60 font-semibold mt-2">
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
        </div>
      </div>
    </div>
  );
}
