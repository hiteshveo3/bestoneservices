import type { Metadata } from "next";
import { CustomerShell } from "@/components/customer/customer-shell";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}
