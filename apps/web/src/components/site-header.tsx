"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Search01Icon, ChevronDownIcon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config/site";
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
        className="sticky top-0 z-50 bg-[#F9FCF5]/95 backdrop-blur-md border-b border-[#E5FBC9] relative w-full"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[56px] lg:h-[72px] flex items-center justify-between gap-2 lg:gap-4 w-full">
          
          {/* Brand Logo & Primary Navigation Group */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0 min-w-0">
            <Logo href="/" className="cursor-pointer">
              <div className="font-heading font-bold text-base sm:text-lg tracking-[-0.02em] text-[#1F3A00] flex items-center whitespace-nowrap">
                <span>{siteConfig.name}</span>
              </div>
            </Logo>

            {/* Desktop Nav - 4 Distinct Categories with Mega Menu Triggers */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm xl:text-base font-semibold text-[#1F3A00]" aria-label="Primary navigation">
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
                      className={`px-3.5 xl:px-4 py-2 rounded-full font-medium flex items-center gap-1.5 transition-colors duration-150 text-decoration-none cursor-pointer whitespace-nowrap focus-visible:outline-none ${
                        isOpen || isRouteActive
                          ? "bg-[#DCFAB7] text-[#1F3A00] font-semibold shadow-2xs"
                          : "text-[#1F3A00] hover:bg-[#DCFAB7]/40"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <HugeiconsIcon icon={ChevronDownIcon} size={14} className={`text-[#1F3A00] transition-transform duration-200 ${isOpen ? "rotate-180 text-[#1F3A00]" : ""}`} />
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
              className="grid h-10 w-10 place-items-center rounded-md bg-transparent border-0 text-[#1F3A00] cursor-pointer transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#99D055] shrink-0"
              aria-label="Search site"
              title="Search services"
            >
              <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.8} className="text-[#1F3A00] shrink-0" />
            </Link>

            {/* Primary conversion CTA */}
            <Link
              href={siteConfig.bookingEnabled ? "/booking/" : "/contact/"}
              className="hidden sm:inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer text-decoration-none whitespace-nowrap gap-2"
            >
              <span>{siteConfig.bookingEnabled ? "Book a Service" : "Contact Us"}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="stroke-[2.5] shrink-0 text-[#1F3A00]" />
            </Link>
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-primary-menu"
              aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
              className="lg:hidden grid h-10 w-10 place-items-center text-[#1F3A00] bg-transparent border-0 cursor-pointer"
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
          className="fixed inset-x-0 top-[56px] bottom-0 z-40 overflow-y-auto bg-[#F9FCF5] lg:hidden"
        >
          <nav className="border-t border-[#E5FBC9] px-4 py-5" aria-label="Mobile primary navigation">
            {megaMenuData.map((category) => (
              <Link key={category.id} href={category.href} onClick={() => setMobileMenuOpen(false)} className="flex min-h-13 items-center justify-between border-b border-[#E5FBC9] text-lg font-semibold text-[#1F3A00] no-underline">
                <span>{category.label}</span><HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-[#1F3A00]" />
              </Link>
            ))}
            <Link href="/prices/" onClick={() => setMobileMenuOpen(false)} className="flex min-h-13 items-center justify-between border-b border-[#E5FBC9] text-lg font-semibold text-[#1F3A00] no-underline">
              <span>Prices</span><HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-[#1F3A00]" />
            </Link>
            <Link href="/contact/" onClick={() => setMobileMenuOpen(false)} className="flex min-h-13 items-center justify-between border-b border-[#E5FBC9] text-lg font-semibold text-[#1F3A00] no-underline">
              <span>Contact</span><HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-[#1F3A00]" />
            </Link>
          </nav>
          <div className="p-4"><Link href={siteConfig.bookingEnabled ? "/booking/" : "/contact/"} onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#1F3A00] bg-[#1F3A00] px-6 py-2 text-base font-semibold text-[#B7F56A] no-underline">{siteConfig.bookingEnabled ? "Get a Quote" : "Contact Us"}<HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-[#B7F56A]" /></Link></div>
        </div>
      ) : null}

    </>
  );
}



