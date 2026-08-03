import Link from "next/link";
import { AccountSignOut } from "@/components/account-sign-out";

const items = [["/account/dashboard/", "Bookings"], ["/account/guest-link/", "Add booking reference"], ["/account/profile/", "Profile & preferences"]] as const;

export function AccountNav({ current }: { current: (typeof items)[number][0] }) {
  return <aside className="app-sidebar"><div className="app-sidebar-heading"><span>Customer account</span><strong>My account</strong></div><nav aria-label="Account navigation">{items.map(([href, label]) => <Link href={href} aria-current={href === current ? "page" : undefined} key={href}>{label}</Link>)}</nav><AccountSignOut /></aside>;
}
