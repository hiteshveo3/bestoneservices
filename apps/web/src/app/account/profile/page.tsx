"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { updateUserProfileDetails } from "@/lib/user-service";
import { User as UserIcon, Phone, Mail, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || user?.phoneNumber || "");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.displayName && !displayName) {
      setTimeout(() => setDisplayName(profile.displayName || ""), 0);
    } else if (user?.displayName && !displayName) {
      setTimeout(() => setDisplayName(user.displayName || ""), 0);
    }
    if (profile?.phone && !phone) {
      setTimeout(() => setPhone(profile.phone || ""), 0);
    }
  }, [profile, user, displayName, phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSuccessMessage(null);
    setErrorMessage(null);
    setSubmitting(true);

    const success = await updateUserProfileDetails(user.uid, {
      displayName: displayName.trim(),
      phone: phone.trim(),
    });

    setSubmitting(false);

    if (success) {
      await refreshProfile();
      setSuccessMessage("Your profile details have been updated successfully.");
    } else {
      setErrorMessage("Failed to update profile details. Please try again.");
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-2 border border-[#B7F56A]">
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Profile & Security</h1>
        <p className="text-sm text-ink-500">Manage your identity and contact details</p>
      </div>

      <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-6 max-w-2xl border border-[#B7F56A]">
        {successMessage && (
          <div className="p-3.5 rounded-[18px] bg-[#F9FCF5] text-[#1F3A00] text-sm font-medium flex items-center gap-2 border-none">
            <CheckCircle2 className="w-4 h-4 text-ink-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-[18px] bg-danger-50 text-danger-500 text-sm font-medium border-none">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium uppercase text-ink-500">Full Display Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-ink-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-[18px] bg-[#F9FCF5] border-none text-base text-ink-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#99D055]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium uppercase text-ink-500">Account Email (Identity)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full pl-10 pr-4 py-3 rounded-[18px] bg-[#F9FCF5] border-none text-base text-ink-500 font-medium cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-ink-500">Email address is managed through Firebase Authentication identity.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium uppercase text-ink-500">Contact Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-ink-500 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07123 456789"
                className="w-full pl-10 pr-4 py-3 rounded-[18px] bg-[#F9FCF5] border-none text-base text-ink-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#99D055]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] transition-colors duration-150 cursor-pointer border-none border border-[#E5FBC9]"
            >
              {submitting ? "Saving changes..." : "Save Profile Details"}
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-[#E5FBC9] space-y-3">
          <h3 className="font-heading font-medium text-base text-ink-900">Security Details</h3>
          <div className="p-4 rounded-[18px] bg-[#F9FCF5] space-y-2 text-xs font-mono text-ink-500">
            <div className="flex items-center justify-between text-ink-600 font-medium">
              <span>Firebase Auth UID:</span>
              <span>{user?.uid}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Auth Provider:</span>
              <span className="capitalize text-ink-600 font-medium">{user?.providerData[0]?.providerId || "Email/Password"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Account Status:</span>
              <span className="text-success-900 font-medium uppercase">{profile?.status || "Active"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

