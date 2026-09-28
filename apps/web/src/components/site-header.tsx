"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Search01Icon, ChevronDownIcon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { siteContact } from "@/config/site-contact";
import { megaMenuData } from "@/config/site-navigation";
import { DesktopMegaMenu } from "@/components/desktop-mega-menu";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"cleaning" | "pest" | "gardening" | "removals" | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Mobile menu: trap focus inside while open, close on Escape, and restore
  // focus to the toggle button on close. Body scroll is locked while open so
  // the page behind the panel can't be scrolled with it visible.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !mobileMenuRef.current) return;
      const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

  const prevPathname = useRef(pathname);

  // Close mega menu on route change
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setActiveCategory(null);
    }
  }, [pathname]);

  const handleMouseEnter = (catId: "cleaning" | "pest" | "gardening" | "removals") => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveCategory(catId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  };

  // Determine top-level active state based on route
  const isCleaningActive = pathname.startsWith("/cleaning-services");
  const isPestActive = pathname.startsWith("/pest-control-services");
  const isGardeningActive = pathname.startsWith("/gardening");
  const isRemovalsActive = pathname.startsWith("/removals");

  const isNavActive = (id: string) => {
    if (id === "cleaning") return isCleaningActive;
    if (id === "pest") return isPestActive;
    if (id === "gardening") return isGardeningActive;
    if (id === "removals") return isRemovalsActive;
    return false;
  };

  return (
    <>
      {/* HEADER CONTAINER (No overflow-hidden so absolute mega menu drops down cleanly) */}
      <header 
        className="sticky top-0 z-50 bg-[#F6F5F1] relative w-full"
        onMouseLeave={handleMouseLeave}
      >
        {/* Touchstone S13 B: slim info row above the main row (desktop) */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-8 pt-2">
            <p className="m-0 flex flex-wrap gap-x-6 gap-y-1 rounded-[10px] bg-white px-3 py-2 text-[13px] text-[#5A605C]">
              <span>Open <b className="text-[#1D201E]">Mon–Sat, 8am–8pm</b></span>
              <span>Call <a href={siteContact.phoneHref} className="font-semibold text-[#1D201E] no-underline tabular-nums">{siteContact.phoneDisplay}</a></span>
              <span>Based in <b className="text-[#1D201E]">Ilford, IG1</b></span>
              <span>Prices shown <b className="text-[#1D201E]">before you book</b></span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[56px] lg:h-[72px] flex items-center justify-between gap-2 lg:gap-4 w-full">
          
          {/* Brand Logo & Primary Navigation Group */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0 min-w-0">
            <Logo href="/" className="cursor-pointer">
              <span className="font-heading font-extrabold text-[22px] sm:text-2xl tracking-[-0.02em] text-[#1D201E] whitespace-nowrap">Bestone</span>
            </Logo>

            {/* Desktop Nav - 4 Distinct Categories with Mega Menu Triggers */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm xl:text-base font-semibold text-[#1D201E]" aria-label="Primary navigation">
              {megaMenuData.map((cat) => {
                const isOpen = activeCategory === cat.id;
                const isRouteActive = isNavActive(cat.id);

                return (
                  <div 
                    key={cat.id} 
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(cat.id)}
                  >
                    <Link
                      href={cat.href}
                      onClick={() => {
                        // Allow navigation if clicking link, but toggle menu if needed
                        if (isOpen) {
                          setActiveCategory(null);
                        }
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`mega-menu-${cat.id}`}
                      className={`px-3.5 xl:px-4 py-2 rounded-[10px] font-medium flex items-center gap-1.5 transition-colors duration-150 text-decoration-none cursor-pointer whitespace-nowrap focus-visible:outline-none ${
 isOpen || isRouteActive
 ? "bg-[#EAF8D6] text-[#1D201E] font-semibold "
 : "text-[#1D201E] hover:bg-[#EAF8D6]/40"
 }`}
                    >
                      <span>{cat.label}</span>
                      <HugeiconsIcon icon={ChevronDownIcon} size={14} className={`text-[#1D201E] transition-transform duration-200 ${isOpen ? "rotate-180 text-[#1D201E]" : ""}`} />
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Search — icon only, identical at every breakpoint */}
            <Link
              href="/search/"
              className="grid h-10 w-10 place-items-center rounded-md bg-transparent border-0 text-[#1D201E] cursor-pointer transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D201E] shrink-0"
              aria-label="Search site"
              title="Search services"
            >
              <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.8} className="text-[#1D201E] shrink-0" />
            </Link>

            <a
              href={siteContact.getWhatsappUrl("Hi Bestone, I'd like a price for a job.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp us"
              className="grid h-10 w-10 place-items-center rounded-[10px] bg-white text-[#1D201E] md:hidden"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
            </a>
            {/* Primary conversion CTA: WhatsApp (white) + Get your price (lime) */}
            <a
              href={siteContact.getWhatsappUrl("Hi Bestone, I'd like a price for a job.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex min-h-10 items-center gap-2 rounded-[10px] bg-white px-3.5 text-[15px] font-semibold text-[#1D201E] no-underline transition-colors duration-150 hover:bg-[#EAF8D6]"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <Link
              href={siteConfig.bookingEnabled ? "/booking/" : "/prices/"}
              className="hidden sm:inline-flex min-h-10 items-center rounded-[10px] bg-[#B7F56A] px-4 text-[15px] font-semibold text-[#1D201E] no-underline transition-colors duration-150 hover:bg-[#A2EA4E] whitespace-nowrap"
            >
              Get your price
            </Link>
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-primary-menu"
              aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
              className="lg:hidden grid h-10 w-10 place-items-center text-[#1D201E] bg-transparent border-0 cursor-pointer"
            >
              <HugeiconsIcon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} size={25} strokeWidth={1.8} />
            </button>
          </div>

        </div>

        {/* FULL-WIDTH DESKTOP MEGA MENU */}
        <DesktopMegaMenu
          activeCategory={activeCategory}
          onClose={() => setActiveCategory(null)}
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeave}
        />
      </header>

      {mobileMenuOpen ? (
        <div
          id="mobile-primary-menu"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          className="fixed inset-x-0 top-[56px] bottom-0 z-40 overflow-y-auto bg-[#F6F5F1] lg:hidden"
        >
          <nav className="ts-faq px-4 py-4" aria-label="Mobile primary navigation">
            {megaMenuData.map((category) => (
              <details key={category.id}>
                <summary>{category.label}</summary>
                <div className="grid gap-0.5 pb-3">
                  {category.columns[0]?.items.map((item) => (
                    <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-[15px] font-medium text-[#1D201E] no-underline hover:bg-white">
                      <span>{item.label}</span>
                      {item.price ? <span className="ts-fig text-lg"><small>from</small>{item.price}</span> : null}
                    </Link>
                  ))}
                  <Link href={category.href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-2 py-2.5 text-[15px] font-semibold text-[#1D201E] no-underline hover:bg-white">
                    All {category.label.toLowerCase()}
                  </Link>
                </div>
              </details>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/prices/" onClick={() => setMobileMenuOpen(false)} className="grid min-h-12 place-items-center rounded-xl bg-white font-semibold text-[#1D201E] no-underline">Prices</Link>
              <Link href="/contact/" onClick={() => setMobileMenuOpen(false)} className="grid min-h-12 place-items-center rounded-xl bg-white font-semibold text-[#1D201E] no-underline">Contact</Link>
            </div>
          </nav>
          <div className="p-4">
            {siteConfig.bookingEnabled ? (
              <Link href="/booking/" onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#1D201E] bg-[#B7F56A] px-6 py-2 text-base font-semibold text-[#1D201E] no-underline">Get a Quote<HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-[#1D201E]" /></Link>
            ) : (
              <a href={siteContact.getWhatsappUrl("Hi, I'd like to book a service with Bestone Services.")} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#1D201E] bg-[#B7F56A] px-6 py-2 text-base font-semibold text-[#1D201E] no-underline">Book via WhatsApp<HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-[#1D201E]" /></a>
            )}
          </div>
        </div>
      ) : null}

    </>
  );
}



