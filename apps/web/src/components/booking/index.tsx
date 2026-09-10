"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, MapPin, Calendar, User, ClipboardList } from "lucide-react";

interface BookingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const STEPS: BookingStep[] = [
  { id: "service", label: "Service", icon: <ClipboardList className="w-5 h-5" /> },
  { id: "date", label: "Date", icon: <Calendar className="w-5 h-5" /> },
  { id: "address", label: "Address", icon: <MapPin className="w-5 h-5" /> },
  { id: "contact", label: "Contact", icon: <User className="w-5 h-5" /> },
];

const SERVICES = [
  {
    id: "cleaning",
    name: "End of Tenancy Cleaning",
    desc: "Professional move-out cleaning",
    price: "From £130",
  },
  {
    id: "pest",
    name: "Pest Control",
    desc: "Emergency pest treatment",
    price: "From £89",
  },
  {
    id: "gardening",
    name: "Gardening",
    desc: "Garden maintenance & clearance",
    price: "From £70",
  },
  {
    id: "removals",
    name: "House Removals",
    desc: "Man & van service",
    price: "From £80/hr",
  },
];

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    address: "",
    postcode: "",
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleServiceSelect = (serviceId: string) => {
    setFormData({ ...formData, service: serviceId });
    setStep(1);
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date });
  };

  const handleTimeChange = (time: string) => {
    setFormData({ ...formData, time });
  };

  const handleAddressChange = (address: string, postcode: string) => {
    setFormData({ ...formData, address, postcode });
  };

  const handleContactChange = (name: string, email: string, phone: string) => {
    setFormData({ ...formData, name, email, phone });
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = `/booking/status?id=${data.id}`;
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setSubmitted(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`flex flex-col items-center cursor-pointer ${
                i <= step ? "text-[#1F3A00]" : "text-ink-300"
              }`}
              onClick={() => i <= step && setStep(i)}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 ${
                  i <= step
                    ? "bg-[#1F3A00] text-white border-[#99D055]"
                    : "bg-white border-[#E5FBC9]"
                }`}
              >
                {s.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium mt-2 text-center">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-[#F9FCF5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1F3A00] duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#F9FCF5] rounded-[16px] border border-[#B7F56A] p-6 sm:p-8 mb-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-heading font-medium text-ink-900">
              Select Service
            </h2>
            <p className="text-ink-500 mb-6">What service do you need?</p>
            <div className="grid gap-4">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-4 sm:p-6 rounded-[16px] border-2 transition-colors duration-200 text-start ${
                    formData.service === service.id
                      ? "border-[#99D055] bg-[#DCFAB7]/50"
                      : "border-[#E5FBC9] hover:border-[#99D055]"
                  }`}
                >
                  <h3 className="font-medium text-ink-600 mb-1">{service.name}</h3>
                  <p className="text-sm text-ink-500 mb-2">{service.desc}</p>
                  <p className="text-lg font-medium text-[#1F3A00]">{service.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-heading font-medium text-ink-900">
              Choose Date & Time
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-3 border border-[#E5FBC9] rounded-[16px] focus:ring-2 focus:ring-[#99D055] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full p-3 border border-[#E5FBC9] rounded-[16px] focus:ring-2 focus:ring-[#99D055] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-heading font-medium text-ink-900">
              Property Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => handleAddressChange(e.target.value, formData.postcode)}
                  className="w-full p-3 border border-[#E5FBC9] rounded-[16px] focus:ring-2 focus:ring-[#99D055] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  placeholder="E1 6AN"
                  value={formData.postcode}
                  onChange={(e) => handleAddressChange(formData.address, e.target.value)}
                  className="w-full p-3 border border-[#E5FBC9] rounded-[16px] focus:ring-2 focus:ring-[#99D055] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-heading font-medium text-ink-900">
              Your Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleContactChange(e.target.value, formData.email, formData.phone)}
                  className="w-full p-3 border border-[#E5FBC9] rounded-[16px] focus:ring-2 focus:ring-[#99D055] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleContactChange(formData.name, e.target.value, formData.phone)}
                  className="w-full p-3 border border-[#E5FBC9] rounded-[16px] focus:ring-2 focus:ring-[#99D055] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleContactChange(formData.name, formData.email, e.target.value)}
                  className="w-full p-3 border border-[#E5FBC9] rounded-[16px] focus:ring-2 focus:ring-[#99D055] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className="flex-1 sm:flex-none px-6 py-3 rounded-full border border-[#E5FBC9] text-ink-600 font-medium hover:bg-[#DCFAB7] disabled:opacity-50 transition-colors duration-150 flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <button
          onClick={handleNext}
          disabled={submitted}
          className="flex-1 px-6 py-3 rounded-full bg-[#1F3A00] text-white font-medium hover:bg-[#1F3A00] disabled:opacity-50 transition-colors duration-150 flex items-center justify-center gap-2"
        >
          {step === STEPS.length - 1 ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitted ? "Booking..." : "Confirm"}</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
