"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Bug,
  Trees,
  Truck,
  Check, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  Info
} from "lucide-react";
import { 
  loadBookingState, 
  saveBookingState, 
  clearBookingState, 
  type BookingStateData 
} from "@/lib/booking-state";
import { calculatePricing } from "@/lib/pricing-engine";
import { BookingProgressBar } from "@/components/booking/booking-progress-bar";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { trackBookingEvent } from "@/lib/analytics";

const DEFAULT_STATE: BookingStateData = {
  currentStep: 1,
  vertical: "cleaning",
  serviceId: "end-of-tenancy",
  serviceName: "End of Tenancy Cleaning",
  postcode: "",
};

const IDEMPOTENCY_STORAGE_KEY = "bos_booking_idempotency_key";

function getIdempotencyKey(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let key = sessionStorage.getItem(IDEMPOTENCY_STORAGE_KEY);
  if (!key) {
    key = crypto.randomUUID();
    sessionStorage.setItem(IDEMPOTENCY_STORAGE_KEY, key);
  }
  return key;
}

function clearIdempotencyKey() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(IDEMPOTENCY_STORAGE_KEY);
  }
}

export function BookingWizard() {
  const [state, setState] = useState<BookingStateData>(DEFAULT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [bookingRef, setBookingRef] = useState<string>("");

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      const loaded = loadBookingState();
      setState(loaded);
    }
  }, []);

  const updateState = (patch: Partial<BookingStateData>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      saveBookingState(next);
      return next;
    });
  };

  // Compute live estimate based on state
  const estimate = calculatePricing({
    vertical: state.vertical,
    cleaning: {
      subcategory: state.cleaningSubcategory || "endOfTenancy",
      propertySize: state.propertySize || "2bed",
      carpetCleaning: state.carpetCleaning || false,
      ovenCleaning: state.ovenCleaning || false,
    },
    pest: {
      pestType: state.pestType || "rodents",
      treatmentPlan: state.treatmentPlan || "2visit",
      nightEmergency: state.nightEmergency || false,
    },
    gardening: {
      gardeningType: state.gardeningType || "maintenance",
      gardeningHours: state.gardeningHours || 2,
      wasteBags: state.wasteBags || 2,
    },
    removals: {
      teamConfig: state.teamConfig || "2men",
      removalHours: state.removalHours || 2,
      packingOption: state.packingOption || "none",
    },
  });

  const nextStep = () => {
    const errors: Record<string, string> = {};

    if (state.currentStep === 2) {
      if (!state.addressLine1?.trim()) errors.addressLine1 = "Enter the service address.";
      if (!state.postcode) errors.postcode = "Enter a valid UK postcode, for example E15 2AB.";
    }

    if (state.currentStep === 4) {
      if (!state.fullName?.trim()) errors.fullName = "Please enter your full name.";
      if (!state.phone?.trim() || state.phone.length < 8) errors.phone = "Enter a valid phone number.";
      if (!state.email?.trim() || !state.email.includes("@")) errors.email = "Enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    const newStep = Math.min(state.currentStep + 1, 5);
    updateState({ currentStep: newStep });
    trackBookingEvent("booking_step_completed", { step: state.currentStep, vertical: state.vertical });
  };

  const prevStep = () => {
    setFormErrors({});
    const newStep = Math.max(state.currentStep - 1, 1);
    updateState({ currentStep: newStep });
  };

  const handleSubmitBooking = async () => {
    if (!state.termsAccepted || !state.privacyAccepted) {
      setSubmitError("Please accept the Terms and Privacy Policy before submitting.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    trackBookingEvent("booking_submitted", { vertical: state.vertical });

    try {
      const idempotencyKey = getIdempotencyKey();
      const payload = {
        idempotencyKey,
        vertical: state.vertical,
        serviceId: state.serviceId || "end-of-tenancy",
        serviceName: state.serviceName || "End of Tenancy Cleaning",
        fullName: state.fullName || "",
        email: state.email || "",
        phone: state.phone || "",
        addressLine1: state.addressLine1 || "",
        city: "London",
        postcode: state.postcode || "E15 2AB",
        requestedDate: state.preferredDate || new Date().toISOString().split("T")[0],
        requestedTimeSlot: state.timeSlot || "morning",
        cleaningSubcategory: state.cleaningSubcategory,
        propertySize: state.propertySize,
        carpetCleaning: state.carpetCleaning,
        ovenCleaning: state.ovenCleaning,
        pestType: state.pestType,
        notes: state.notes,
        termsAccepted: state.termsAccepted === true,
        privacyAccepted: state.privacyAccepted === true,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.message || json.error || "We couldn't process your booking. Please try again.");
      } else {
        setBookingRef(json.reference);
        updateState({ currentStep: 6 }); // Success step
        clearBookingState();
        clearIdempotencyKey(); // Rotate key post-success
      }
    } catch {
      setSubmitError("We couldn't send your request yet. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 text-start">
      
      {/* Step Progress Bar */}
      <BookingProgressBar
        currentStep={state.currentStep}
        onStepClick={(s) => updateState({ currentStep: s })}
      />

      {/* TRUE 2-COLUMN DESKTOP LAYOUT (8 cols form / 4 cols summary) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: BOOKING WIZARD STEPS (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: SERVICE CATEGORY SELECTION */}
          {state.currentStep === 1 && (
            <div className="bg-white rounded-[16px] p-6 sm:p-10 border border-[#E5FBC9] space-y-6">
              <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Step 1 of 5</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Select Your Required Service</h2>
                <p className="text-base text-ink-500">Choose the service vertical for your property.</p>
              </div>

              {/* 2-COLUMN DESKTOP SERVICE CARDS GRID */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: "cleaning", title: "Cleaning Services", desc: "Move-out & deep cleaning backed by 48-Hour Re-Clean Support.", icon: Sparkles },
                  { id: "pest", title: "Pest Control & Eradication", desc: "Certified technicians for mice, rats, bedbugs & wasps.", icon: Bug },
                  { id: "gardening", title: "Gardening & Clearance", desc: "2-gardener team equipped with petrol tools & waste disposal.", icon: Trees },
                  { id: "removals", title: "House Removals & Van", desc: "2 or 3 movers + Luton van teams with protective goods insurance.", icon: Truck },
                ].map((serv) => {
                  const Icon = serv.icon;
                  const isSelected = state.vertical === serv.id;

                  return (
                    <button
                      key={serv.id}
                      type="button"
                      onClick={() => updateState({ vertical: serv.id as "cleaning" | "pest" | "gardening" | "removals", serviceName: serv.title })}
                      className={`p-6 rounded-[16px] border-none text-start transition-colors duration-150 cursor-pointer space-y-3 focus:outline-none focus:ring-2 focus:ring-[#99D055] ${ isSelected ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-[#1F3A00] hover:bg-[#DCFAB7]" } border border-[#E5FBC9]`}
                    >
                      <div className="flex justify-between items-center font-heading text-lg font-medium">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-[16px] bg-white text-ink-600 flex items-center justify-center font-medium border border-transparent">
                            <Icon className="w-4 h-4 text-ink-600 shrink-0" />
                          </div>
                          <span>{serv.title}</span>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-ink-600 shrink-0" />}
                      </div>
                      <p className="text-base text-ink-500 font-normal leading-relaxed">{serv.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer flex items-center gap-2 border border-[#E5FBC9]"
                >
                  <span>Continue to Job Details</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: JOB & PROPERTY SPECIFICATIONS */}
          {state.currentStep === 2 && (
            <div className="bg-white rounded-[16px] p-6 sm:p-10 border border-[#E5FBC9] space-y-6">
              <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Step 2 of 5</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Property & Service Specifications</h2>
                <p className="text-base text-ink-500">Specify your property details for an upfront calculation.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="booking-address-field" className="text-sm font-mono text-ink-500 uppercase block font-medium">Service Address *</label>
                <input
                  id="booking-address-field"
                  type="text"
                  value={state.addressLine1 || ""}
                  onChange={(e) => updateState({ addressLine1: e.target.value })}
                  placeholder="House number and street"
                  className="w-full max-w-md p-3.5 rounded-[16px] bg-[#F9FCF5] border border-transparent text-base font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-[#99D055]"
                />
                {formErrors.addressLine1 && <p className="text-xs text-danger-500 font-mono">{formErrors.addressLine1}</p>}
              </div>

              {/* Postcode Input */}
              <div className="space-y-2">
                <label htmlFor="booking-postcode-field" className="text-sm font-mono text-ink-500 uppercase block font-medium">London Postcode *</label>
                <input
                  id="booking-postcode-field"
                  type="text"
                  value={state.postcode}
                  onChange={(e) => updateState({ postcode: e.target.value.toUpperCase() })}
                  placeholder="e.g. E15 2AB, IG1 1AA"
                  className="w-full max-w-md p-3.5 rounded-[16px] bg-[#F9FCF5] border border-transparent text-base font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-[#99D055]"
                />
                {formErrors.postcode && (
                  <p className="text-xs text-danger-500 font-mono flex items-center gap-1 pt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.postcode}</span>
                  </p>
                )}
              </div>

              {/* Category-Specific Controls */}
              {state.vertical === "cleaning" && (
                <div className="space-y-5 pt-2 border-t border-[#E5FBC9]">
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-ink-500 uppercase block font-medium">Property Size *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: "studio", label: "Studio" },
                        { id: "1bed", label: "1 Bed" },
                        { id: "2bed", label: "2 Bed" },
                        { id: "3bed", label: "3 Bed" },
                        { id: "4bed", label: "4 Bed" },
                      ].map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => updateState({ propertySize: size.id as "studio" | "1bed" | "2bed" | "3bed" | "4bed" })}
                          className={`p-3.5 rounded-[16px] text-base font-medium border-none transition-colors duration-150 cursor-pointer ${ state.propertySize === size.id ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-[#1F3A00] hover:bg-[#DCFAB7]" } border border-[#E5FBC9]`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {state.vertical === "pest" && (
                <div className="space-y-5 pt-2 border-t border-[#E5FBC9]">
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-ink-500 uppercase block font-medium">Pest Type *</label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { id: "rodents", title: "Mice / Rats" },
                        { id: "bedbugs", title: "Bed Bugs" },
                        { id: "wasps", title: "Wasps / Nest" },
                      ].map((pt) => (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => updateState({ pestType: pt.id as "rodents" | "bedbugs" | "wasps" })}
                          className={`p-4 rounded-[16px] text-base font-medium border-none text-start transition-colors duration-150 cursor-pointer ${ state.pestType === pt.id ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-[#1F3A00] hover:bg-[#DCFAB7]" } border border-[#E5FBC9]`}
                        >
                          {pt.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full bg-[#F9FCF5] border-none text-ink-600 font-medium text-base hover:bg-[#DCFAB7] transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-ink-600" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer flex items-center gap-2 border border-[#E5FBC9]"
                >
                  <span>Continue to Date & Time</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME SELECTION */}
          {state.currentStep === 3 && (
            <div className="bg-white rounded-[16px] p-6 sm:p-10 border border-[#E5FBC9] space-y-6">
              <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Step 3 of 5</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Preferred Service Date & Time</h2>
                <p className="text-base text-ink-500">Select your preferred booking slot for service delivery.</p>
              </div>

              <BookingCalendar
                selectedDate={state.preferredDate}
                selectedTimeSlot={state.timeSlot}
                onChange={(data) => updateState({ preferredDate: data.date, timeSlot: data.timeSlot })}
              />

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full bg-[#F9FCF5] border-none text-ink-600 font-medium text-base hover:bg-[#DCFAB7] transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-ink-600" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer flex items-center gap-2 border border-[#E5FBC9]"
                >
                  <span>Continue to Contact Info</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONTACT & PROPERTY ADDRESS DETAILS */}
          {state.currentStep === 4 && (
            <div className="bg-white rounded-[16px] p-6 sm:p-10 border border-[#E5FBC9] space-y-6">
              <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Step 4 of 5</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Contact & Address Details</h2>
                <p className="text-base text-ink-500">Provide contact details for service dispatch.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="full-name" className="text-sm font-mono text-ink-500 uppercase block font-medium">Full Name *</label>
                  <input
                    id="full-name"
                    type="text"
                    value={state.fullName || ""}
                    onChange={(e) => updateState({ fullName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full p-3.5 rounded-[16px] bg-[#F9FCF5] border border-transparent text-base font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-[#99D055]"
                  />
                  {formErrors.fullName && <p className="text-xs text-danger-500 font-mono pt-1">{formErrors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone" className="text-sm font-mono text-ink-500 uppercase block font-medium">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    value={state.phone || ""}
                    onChange={(e) => updateState({ phone: e.target.value })}
                    placeholder="e.g. 07700 900123"
                    className="w-full p-3.5 rounded-[16px] bg-[#F9FCF5] border border-transparent text-base font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-[#99D055]"
                  />
                  {formErrors.phone && <p className="text-xs text-danger-500 font-mono pt-1">{formErrors.phone}</p>}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="email" className="text-sm font-mono text-ink-500 uppercase block font-medium">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    value={state.email || ""}
                    onChange={(e) => updateState({ email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full p-3.5 rounded-[16px] bg-[#F9FCF5] border border-transparent text-base font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-[#99D055]"
                  />
                  {formErrors.email && <p className="text-xs text-danger-500 font-mono pt-1">{formErrors.email}</p>}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full bg-[#F9FCF5] border-none text-ink-600 font-medium text-base hover:bg-[#DCFAB7] transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-ink-600" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer flex items-center gap-2 border border-[#E5FBC9]"
                >
                  <span>Review Booking Details</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & LOCK BOOKING */}
          {state.currentStep === 5 && (
            <div className="bg-white rounded-[16px] p-6 sm:p-10 border border-[#E5FBC9] space-y-6">
              <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Step 5 of 5</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Review & Confirm Request</h2>
                <p className="text-base text-ink-500">Verify your booking details before sending.</p>
              </div>

              {submitError && (
                <div className="p-4 rounded-[16px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="p-6 rounded-[16px] bg-[#F9FCF5] space-y-4 text-start">
                <div className="flex justify-between border-b border-[#E5FBC9] pb-2 text-base font-medium text-ink-600">
                  <span>Service:</span>
                  <span className="capitalize">{state.vertical} ({state.serviceName})</span>
                </div>
                <div className="flex justify-between border-b border-[#E5FBC9] pb-2 text-base font-medium text-ink-600">
                  <span>Postcode:</span>
                  <span>{state.postcode}</span>
                </div>
                <div className="flex justify-between border-b border-[#E5FBC9] pb-2 text-base font-medium text-ink-600">
                  <span>Preferred Date:</span>
                  <span>{state.preferredDate || "As soon as possible"} ({state.timeSlot || "morning"})</span>
                </div>
                <div className="flex justify-between border-b border-[#E5FBC9] pb-2 text-base font-medium text-ink-600">
                  <span>Contact:</span>
                  <span>{state.fullName} ({state.phone})</span>
                </div>
                <div className="flex justify-between text-lg font-medium text-ink-600 pt-2">
                  <span>Estimated Total:</span>
                  <span>£{estimate.priceMin}{estimate.priceMax ? ` – £${estimate.priceMax}` : ""}</span>
                </div>
              </div>

              {/* CUSTOMER PRICING DISCLAIMER */}
              <div className="bg-white p-4 rounded-[16px] border border-[#E5FBC9] flex items-start gap-3">
                <Info className="w-5 h-5 text-ink-600 shrink-0 mt-0.5" />
                <p className="text-xs text-ink-500 leading-relaxed">
                  <strong>Pricing Disclaimer:</strong> The booking estimate is based on the information provided. The final price may change if the actual service time, scope of work, additional services, or on-site requirements differ. Any material change will be communicated before finalisation.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 text-sm text-ink-500">
                  <input
                    type="checkbox"
                    checked={state.termsAccepted === true}
                    onChange={(event) => updateState({ termsAccepted: event.target.checked })}
                    className="mt-1"
                  />
                  <span>I accept the <Link href="/terms-and-conditions/" className="underline text-ink-600">Terms and Conditions</Link>.</span>
                </label>
                <label className="flex items-start gap-3 text-sm text-ink-500">
                  <input
                    type="checkbox"
                    checked={state.privacyAccepted === true}
                    onChange={(event) => updateState({ privacyAccepted: event.target.checked })}
                    className="mt-1"
                  />
                  <span>I have read the <Link href="/privacy-policy/" className="underline text-ink-600">Privacy Policy</Link> and consent to this request being processed.</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full bg-[#F9FCF5] border-none text-ink-600 font-medium text-base hover:bg-[#DCFAB7] transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-ink-600" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || !state.termsAccepted || !state.privacyAccepted}
                  onClick={handleSubmitBooking}
                  className="px-8 py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer flex items-center gap-2 disabled:opacity-50 border border-[#E5FBC9]"
                >
                  <span>{isSubmitting ? "Submitting Request..." : "Confirm & Send Booking"}</span>
                  <Check className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: SUCCESS CONFIRMATION SCREEN */}
          {state.currentStep === 6 && (
            <div className="bg-white rounded-[16px] p-8 sm:p-12 border border-[#E5FBC9] text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#1F3A00] text-white flex items-center justify-center font-medium mx-auto">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase">BOOKING RECEIVED</span>
                <h2 className="font-heading text-3xl font-medium text-ink-900 font-mono">Reference: {bookingRef}</h2>
                <p className="text-base text-ink-500 max-w-md mx-auto">
                  We&apos;ve received your request! Our team will review your booking details and confirm your appointment slot shortly.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/account/dashboard"
                  className="px-6 py-3 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-base hover:bg-[#2d5004] text-decoration-none inline-block border border-[#E5FBC9]"
                >
                  View My Dashboard →
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full bg-[#F9FCF5] text-ink-600 font-medium text-base hover:bg-[#DCFAB7] text-decoration-none inline-block border border-[#E5FBC9]"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: STICKY BOOKING SUMMARY SIDEBAR (4 Columns on Desktop) */}
        {state.currentStep <= 5 && (
          <div className="hidden lg:block lg:col-span-4 space-y-4 sticky top-20">
            <div className="bg-white rounded-[16px] p-6 border border-[#E5FBC9] space-y-4 text-start">
              <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
                <span className="font-heading font-medium text-lg text-ink-900">Your Booking</span>
                <ShieldCheck className="w-5 h-5 text-ink-600 shrink-0" />
              </div>

              <div className="space-y-2 text-base text-ink-500">
                <div className="flex justify-between border-b border-[#E5FBC9] pb-2">
                  <span>Service:</span>
                  <span className="font-medium text-ink-600 capitalize">{state.vertical}</span>
                </div>
                {state.postcode && (
                  <div className="flex justify-between border-b border-[#E5FBC9] pb-2">
                    <span>Postcode:</span>
                    <span className="font-medium text-ink-600">{state.postcode}</span>
                  </div>
                )}
                {state.preferredDate && (
                  <div className="flex justify-between border-b border-[#E5FBC9] pb-2">
                    <span>Date:</span>
                    <span className="font-medium text-ink-600">{state.preferredDate}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-[16px] bg-[#F9FCF5] space-y-1">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase">ESTIMATED PRICE</span>
                <div className="font-heading font-medium text-3xl text-ink-900">
                  £{estimate.priceMin}{estimate.priceMax ? ` – £${estimate.priceMax}` : ""}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

