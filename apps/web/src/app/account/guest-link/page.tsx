import { AccountNav } from "@/components/account-nav";
import { GuestBookingLinker } from "@/components/guest-booking-linker";

export default function Page() {
  return <main id="main-content" className="app-shell"><AccountNav current="/account/guest-link/" /><section className="app-main app-reading"><p className="eyebrow">Customer account</p><h1>Add booking reference</h1><p className="lead">Made a request before creating your account? Add the reference from your email confirmation to keep it here.</p><div className="app-card"><GuestBookingLinker /></div></section></main>;
}
