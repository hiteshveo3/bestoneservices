"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bug01Icon, Calendar03Icon, Home03Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { DecorativeIcon as HugeiconsIcon } from "@/components/decorative-icon";

const links = [
  ["/", "Home", Home03Icon],
  ["/pest-control-services/", "Pest", Bug01Icon],
  ["/areas/", "Area", Location01Icon],
  ["/contact/", "Contact", Calendar03Icon],
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const accountLinks = [["/account/dashboard/", "Bookings", Calendar03Icon], ["/booking/", "Book", Home03Icon], ["/account/profile/", "Profile", Location01Icon], ["/account/guest-link/", "More", Bug01Icon]] as const;
  const activeLinks = pathname.startsWith("/account/") ? accountLinks : links;
  return (
    <nav className="mobile-bottom-nav" aria-label="Quick mobile navigation">
      {activeLinks.map(([href, label, icon]) => <Link href={href} key={href}><HugeiconsIcon icon={icon} size={20} /><span>{label}</span></Link>)}
    </nav>
  );
}
