import { requireSession } from "@/lib/session";
export default async function Layout({ children }: { children: React.ReactNode }) { await requireSession("/account/guest-link/"); return children; }
