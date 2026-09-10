"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  GridIcon,
  Calendar01Icon,
  BookOpen01Icon,
  Call02Icon,
} from "@hugeicons/core-free-icons";
import { siteContact } from "@/config/site-contact";

/** Routes that own their own chrome, or where a persistent bar gets in the way. */
const HIDDEN_PREFIXES = ["/booking", "/admin", "/account"];

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home01Icon },
  { href: "/prices/", label: "Services", icon: GridIcon },
  { href: siteContact.getWhatsappUrl("Hi, I'd like to book a service with Best One Services."), label: "Book", icon: Calendar01Icon, external: true },
  { href: "/blog/", label: "Guides", icon: BookOpen01Icon },
] as const;

/**
 * Minimal app-style bottom bar, mobile only. Four routes plus a direct call
 * action — the header hamburger still carries the full navigation, so this
 * stays deliberately small.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#F9FCF5]/95 backdrop-blur-md border-t border-[#E5FBC9] grid grid-cols-5 items-stretch"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isExternal = "external" in item && item.external;
        const active = !isExternal && isActive(item.href);
        const linkClassName = `flex flex-col items-center justify-center gap-1 py-2.5 text-decoration-none transition-opacity duration-200 ${
          active ? "text-[#1F3A00]" : "text-[#1F3A00]/60"
        }`;
        const inner = (
          <>
            <HugeiconsIcon
              icon={item.icon}
              size={22}
              strokeWidth={active ? 2.2 : 1.8}
              className="shrink-0"
            />
            <span className={`text-[11px] leading-none ${active ? "font-semibold" : "font-medium"}`}>
              {item.label}
            </span>
          </>
        );
        return isExternal ? (
          <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            {inner}
          </a>
        ) : (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={linkClassName}>
            {inner}
          </Link>
        );
      })}

      <a
        href={siteContact.phoneHref}
        className="flex flex-col items-center justify-center gap-1 py-2.5 text-decoration-none text-[#1F3A00]/60 transition-opacity duration-200"
        aria-label={`Call ${siteContact.phoneDisplay}`}
      >
        <HugeiconsIcon icon={Call02Icon} size={22} strokeWidth={1.8} className="shrink-0" />
        <span className="text-[11px] leading-none font-medium">Call</span>
      </a>
    </nav>
  );
}
