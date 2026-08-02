import Link from "next/link";
import { Bug01Icon, Calendar03Icon, Home03Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { DecorativeIcon as HugeiconsIcon } from "@/components/decorative-icon";

const links = [
  ["/", "Home", Home03Icon],
  ["/pest-control/", "Pest", Bug01Icon],
  ["/#area-title", "Area", Location01Icon],
  ["/contact/", "Contact", Calendar03Icon],
] as const;

export function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Quick mobile navigation">
      {links.map(([href, label, icon]) => <Link href={href} key={href}><HugeiconsIcon icon={icon} size={20} /><span>{label}</span></Link>)}
    </nav>
  );
}
