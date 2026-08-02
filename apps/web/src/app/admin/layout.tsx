import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function Layout({ children }: { children: React.ReactNode }) { await requireSession("/admin/", "admin"); return children; }
