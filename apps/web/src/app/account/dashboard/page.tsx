import Link from "next/link";
import { AccountNav } from "@/components/account-nav";
import { ButtonLink } from "@/components/button-link";
import { ServiceBadge } from "@/components/ui/service-badge";
import { getCustomerBookings, serviceLabel } from "@/lib/customer-bookings";
import { requireSession } from "@/lib/session";

export default async function Page() {
  const user = await requireSession("/account/dashboard/");
  const bookings = await getCustomerBookings(user.uid, user.email);
  const completed = bookings.filter((booking) => booking.status === "Completed").length;
  const upcoming = bookings.filter((booking) => !["Completed", "Cancelled"].includes(booking.status)).length;
  return <main id="main-content" className="app-shell"><AccountNav current="/account/dashboard/" /><section className="app-main"><div className="app-topline"><div><p className="eyebrow">Customer account</p><h1>Bookings</h1><p className="lead">Check your requested services and any confirmed updates.</p></div><ButtonLink href="/booking/" variant="dark" showArrow={false}>Book a service</ButtonLink></div><div className="metric-grid"><article className="metric-card"><span>Upcoming services</span><strong>{upcoming}</strong></article><article className="metric-card"><span>Completed services</span><strong>{completed}</strong></article></div><div className="app-card"><div className="app-card-header"><h2>Your bookings</h2><ServiceBadge variant="status" className="status-pill">{bookings.length} total</ServiceBadge></div>{bookings.length ? <div className="booking-list">{bookings.map((booking) => <article className="booking-row" key={booking.id}><div><strong>{serviceLabel(booking)}</strong><span>{booking.reference}</span></div><div><span className="booking-label">Preferred date</span><strong>{booking.preferredDate ?? "To be confirmed"}</strong></div><ServiceBadge variant="status" className="status-pill">{booking.status}</ServiceBadge></article>)}</div> : <div className="empty-app-state"><div><strong>No bookings in this account yet</strong><p>If you requested a service as a guest, add its reference here. Otherwise, start a new booking.</p><Link href="/account/guest-link/">Add booking reference</Link></div></div>}</div></section></main>;
}
