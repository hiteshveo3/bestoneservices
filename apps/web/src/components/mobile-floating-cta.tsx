"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

const HIDDEN_PREFIXES = ["/booking", "/admin", "/account"];

/** Distance scrolled before the bar animates in. Roughly past the hero. */
const REVEAL_AT = 420;

/**
 * Mobile-only conversion bar that slides in on scroll and sits directly above
 * MobileBottomNav. Deliberately one action — the bottom bar already carries
 * navigation, so this stays a single lime button.
 */
export function MobileFloatingCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > REVEAL_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <div
      aria-hidden={!visible}
      className={`fixed left-0 right-0 z-30 lg:hidden px-4 transition-[opacity,transform] duration-200 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 72px)" }}
    >
      <Link
        href="/prices/#smart-calculator"
        tabIndex={visible ? undefined : -1}
        className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border border-[#99D055] shadow-sm hover:opacity-90 transition-opacity duration-200 text-decoration-none"
      >
        <span>Get Instant Quote</span>
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.2} className="text-[#1F3A00] shrink-0" />
      </Link>
    </div>
  );
}
