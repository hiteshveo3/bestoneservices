"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { siteContact } from "@/config/site-contact";

const DISMISS_KEY = "promo-banner-dismissed";

function subscribe() {
  // sessionStorage never changes from outside this component within a tab,
  // so there is nothing to subscribe to — this just satisfies the store contract.
  return () => {};
}

function getSnapshot() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

export function PromoBanner() {
  // Reads the persisted dismissal without an effect, so there's no
  // setState-in-effect cascade and no hydration mismatch.
  const dismissedInStorage = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [justDismissed, setJustDismissed] = useState(false);

  if (dismissedInStorage || justDismissed) return null;

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private browsing etc. — hiding for this render is enough */
    }
    setJustDismissed(true);
  };

  return (
    <div className="bg-[#B7F56A] text-[#1D201E] w-full flex items-center justify-center z-[60] relative font-sans border-[#ECEAE3]/40">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-4">

        {/* Compact single-line content on mobile, full copy from sm+ */}
        <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-4 sm:flex-wrap justify-center text-center">
          <span className="inline-flex items-center gap-1.5 ts-eyebrow">
            Direct Booking Offer
          </span>
          <span className="hidden sm:inline text-xs sm:text-sm font-normal text-[#1D201E]/95 tracking-tight">
            Save 20% on all property services when booking directly via WhatsApp.
          </span>
          <span className="sm:hidden text-xs font-medium text-[#1D201E]/95 tracking-tight truncate">
            Save 20% — book directly via WhatsApp
          </span>
          <Link
            href={siteContact.getWhatsappUrl("Hi, I'd like to claim the 20% direct booking discount with Bestone Services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 sm:px-3 bg-[#B7F56A] text-[#1D201E] rounded-md text-[11px] sm:text-xs font-inter font-medium hover:opacity-90 transition-opacity duration-150 text-decoration-none whitespace-nowrap cursor-pointer shrink-0"
          >
            <span className="sm:hidden">Claim</span>
            <span className="hidden sm:inline">Claim 20% Discount</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss offer banner"
          className="shrink-0 grid place-items-center w-6 h-6 rounded-full text-[#1D201E]/80 hover:text-[#1D201E] hover:bg-white/10 transition-colors duration-150 cursor-pointer"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
