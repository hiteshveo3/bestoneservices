"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function AdminNewBookingPage() {
  const router = useRouter();

  const [vertical, setVertical] = useState<"cleaning" | "pest" | "gardening" | "removals">("cleaning");
  const [serviceId, setServiceId] = useState("end-of-tenancy");
  const [serviceName, setServiceName] = useState("End of Tenancy Cleaning");

  // Customer Contact
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Address
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("London");
  const [postcode, setPostcode] = useState("");

  // Schedule
  const [requestedDate, setRequestedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [requestedSlot, setRequestedSlot] = useState<"morning" | "afternoon" | "evening">("morning");

  // Category Specs
  const [propertySize, setPropertySize] = useState<"studio" | "1bed" | "2bed" | "3bed" | "4bed">("2bed");
  const [pestType, setPestType] = useState<"rodents" | "bedbugs" | "wasps">("rodents");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      const payload = {
        idempotencyKey,
        vertical,
        serviceId,
        serviceName,
        fullName,
        email,
        phone,
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        postcode,
        requestedDate,
        requestedTimeSlot: requestedSlot,
        propertySize: vertical === "cleaning" ? propertySize : undefined,
        pestType: vertical === "pest" ? pestType : undefined,
        notes: notes || undefined,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || json.error || "Failed to create booking");
      } else {
        router.push(`/admin/bookings/${json.bookingId}`);
      }
    } catch {
      setErrorMessage("Network error while creating manual booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-start max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E5FBC9] text-xs font-medium text-ink-600 hover:bg-[#DCFAB7] transition-colors duration-150 text-decoration-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-ink-600" />
          <span>Back to Bookings Queue</span>
        </Link>

        <span className="text-xs font-mono font-medium uppercase text-ink-500">MANUAL ENQUIRY FORM</span>
      </div>

      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-2 border border-[#E5FBC9]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
          <span>Admin Phone / Email Enquiry Entry</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Create Manual Booking</h1>
        <p className="text-sm text-ink-500">Enter enquiry details taken over phone or email. Uses canonical server reference generation.</p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Category & Service Selector */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
            Service Category & Name
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Vertical Category *</label>
              <select
                value={vertical}
                onChange={(e) => {
                  const v = e.target.value as "cleaning" | "pest" | "gardening" | "removals";
                  setVertical(v);
                  if (v === "cleaning") { setServiceId("end-of-tenancy"); setServiceName("End of Tenancy Cleaning"); }
                  else if (v === "pest") { setServiceId("rat-control"); setServiceName("Rat & Mice Pest Control"); }
                  else if (v === "gardening") { setServiceId("garden-clearance"); setServiceName("Overgrown Garden Clearance"); }
                  else if (v === "removals") { setServiceId("house-removals"); setServiceName("House Removals & Moving"); }
                }}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none focus:outline-none focus:ring-2 focus:ring-[#99D055]"
              >
                <option value="cleaning">Cleaning Services</option>
                <option value="pest">Pest Control</option>
                <option value="gardening">Gardening & Clearance</option>
                <option value="removals">Removals & Moving</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Service Name Snapshot *</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Customer Contact */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
            Customer Contact Information
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Jones"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900000"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>
          </div>
        </div>

        {/* 3. Address & Schedule */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <h3 className="font-heading text-lg font-medium text-ink-900 border-b border-[#E5FBC9] pb-2">
            Address & Requested Schedule
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Address Line 1 *</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="e.g. 42 High Street"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">London Postcode *</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                placeholder="e.g. IG1 1BA"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Requested Date *</label>
              <input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Time Slot *</label>
              <select
                value={requestedSlot}
                onChange={(e) => setRequestedSlot(e.target.value as "morning" | "afternoon" | "evening")}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
              >
                <option value="morning">Morning (8am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 4pm)</option>
                <option value="evening">Evening (4pm - 8pm)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Enquiry Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes from customer phone call or email..."
              rows={3}
              className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs text-ink-600 border-none resize-none"
            />
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-full bg-[#1F3A00] text-white font-heading font-medium text-base hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer border border-[#E5FBC9]"
        >
          {submitting ? "Creating Booking Record..." : "Submit Manual Booking Record"}
        </button>

      </form>
    </div>
  );
}

