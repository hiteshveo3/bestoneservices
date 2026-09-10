"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PromoBanner } from "@/components/promo-banner";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { MobileFloatingCta } from "@/components/mobile-floating-cta";

const APP_ROUTE_PREFIXES = ["/admin", "/account"];

/**
 * AdminShell and CustomerShell render their own header/footer chrome, so the
 * marketing SiteHeader/SiteFooter must not also render on /admin or /account
 * routes (previously they stacked on top of each other).
 */
export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = APP_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isAppRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoBanner />
      <SiteHeader />
      {children}
      <SiteFooter />
      {/* Mobile-only chrome. The spacer keeps the fixed bar from covering
          the end of the footer on short pages. */}
      <div className="h-[72px] lg:hidden" aria-hidden="true" />
      <MobileFloatingCta />
      <MobileBottomNav />
    </>
  );
}
