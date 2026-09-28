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
 * Mobile-only conversion bar that slides in on scroll and sits at the bottom of
 * the screen on phones. Deliberately one action — the bottom bar already carries
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
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 10px)" }}
    >
      <div className="flex items-center justify-between gap-2 rounded-[18px] bg-white py-2 pl-4 pr-2">
        <span className="grid leading-tight">
          <span className="text-xs text-[#5A605C]">Fixed prices from</span>
          <span className="ts-fig text-2xl">£45</span>
        </span>
        <Link
          href="/prices/"
          tabIndex={visible ? undefined : -1}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#B7F56A] px-5 text-base font-semibold text-[#1D201E] no-underline transition-colors duration-150 hover:bg-[#A2EA4E]"
        >
          <span>Get your price</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.2} className="text-[#1D201E] shrink-0" />
        </Link>
      </div>
    </div>
  );
}
