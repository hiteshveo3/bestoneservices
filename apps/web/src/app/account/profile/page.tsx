import Link from "next/link";
import { AccountNav } from "@/components/account-nav";

export default function Page() {
  return <main id="main-content" className="app-shell"><AccountNav current="/account/profile/" /><section className="app-main"><div className="app-topline"><div><p className="eyebrow">Customer account</p><h1>Profile & preferences</h1><p className="lead">Manage your account details and optional email preferences.</p></div></div><div className="card-grid"><article className="app-card"><h2>Contact details</h2><p>Your sign-in email is used securely to keep your account and booking access connected.</p><Link href="/account/forgot-password/">Change password</Link></article><article className="app-card"><h2>Email preferences</h2><p>Service confirmations are essential messages. Marketing updates are always optional and are not enabled by default.</p><label className="consent-field"><input type="checkbox" disabled /><span><strong>Marketing updates</strong><br />Preference controls will be available once email delivery is connected.</span></label></article></div></section></main>;
}
