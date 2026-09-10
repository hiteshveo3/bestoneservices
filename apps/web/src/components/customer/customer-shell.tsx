"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { NotificationCenterPanel } from "@/components/dashboard/notification-center-panel";
import { Logo } from "@/components/logo";
import {
  Home, 
  Calendar, 
  FileText, 
  Receipt, 
  Bell, 
  HelpCircle, 
  MapPin, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight
} from "lucide-react";

const CUSTOMER_NAV = [
  { label: "Overview", href: "/account", icon: Home },
  { label: "My Bookings", href: "/account/bookings", icon: Calendar, phase: 4 },
  { label: "Estimates", href: "/account/estimates", icon: FileText, phase: 6 },
  { label: "Invoices", href: "/account/invoices", icon: Receipt, phase: 8 },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Support", href: "/account/support", icon: HelpCircle, phase: 9 },
  { label: "Addresses", href: "/account/addresses", icon: MapPin, phase: 9 },
  { label: "Profile", href: "/account/profile", icon: UserIcon },
];

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, signOutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthRoute = pathname?.includes("/login") || pathname?.includes("/register") || pathname?.includes("/forgot-password");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  const customerName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Customer";
  const customerEmail = profile?.email || user?.email || "";

  return (
    <ProtectedRoute requireCustomer>
      <div className="min-h-screen bg-[#F9FCF5] text-start flex flex-col font-sans">
        
        {/* CUSTOMER TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E5FBC9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-[16px] text-ink-600 hover:bg-[#DCFAB7] border-none cursor-pointer"
                aria-label="Toggle Account Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Logo href="/account" className="text-ink-600 font-medium">
                <div className="flex flex-col">
                  <span className="font-heading font-medium text-base leading-none">Best One</span>
                  <span className="text-[11px] font-mono font-medium text-ink-500 uppercase tracking-wider">Customer Portal</span>
                </div>
              </Logo>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-3">
              <NotificationCenterPanel />

              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F9FCF5] text-ink-600 text-xs font-medium hover:bg-[#DCFAB7] text-decoration-none"
              >
                <span>Public Website</span>
                <ChevronRight className="w-3 h-3 text-ink-600" />
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-[#E5FBC9]">
                <div className="w-8 h-8 rounded-full bg-[#1F3A00] text-white flex items-center justify-center font-medium text-xs">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-start">
                  <span className="font-medium text-xs text-ink-600 leading-tight">{customerName}</span>
                  <span className="text-[10px] font-mono font-medium text-ink-500">{customerEmail}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signOutUser()}
                className="p-2 rounded-full text-ink-500 hover:text-ink-600 hover:bg-[#DCFAB7] border-none cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </header>

        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          
          {/* DESKTOP CUSTOMER SIDEBAR */}
          <aside className="hidden lg:block w-56 shrink-0 space-y-4">
            <div className="bg-white rounded-[16px] p-4 space-y-2 sticky top-22 border border-[#E5FBC9]">
              <span className="text-[10px] font-mono font-medium uppercase text-ink-500 px-3 tracking-wider block mb-2">
                MY ACCOUNT
              </span>
              {CUSTOMER_NAV.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-[16px] text-xs font-medium transition-colors duration-150 text-decoration-none ${ isActive ? "bg-[#1F3A00] text-white font-medium " : "text-ink-500 hover:text-[#1F3A00] hover:bg-[#DCFAB7]" } border border-[#E5FBC9]`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-ink-600" : "text-ink-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.phase && !isActive && (
                      <span className="text-[9px] font-mono text-ink-500 bg-[#F9FCF5] px-1.5 py-0.5 rounded">
                        P{item.phase}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* MOBILE NAVIGATION SHEET */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 lg:hidden flex">
              <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
              <div className="relative w-64 max-w-[75vw] bg-white h-full p-4 space-y-6 overflow-y-auto z-50 text-start border border-[#E5FBC9]">
                <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-4">
                  <span className="font-heading font-medium text-lg text-ink-900">Account Menu</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-[16px] text-ink-600 border-none bg-transparent cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {CUSTOMER_NAV.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-[16px] text-xs font-medium transition-colors duration-150 text-decoration-none ${
                          isActive
                            ? "bg-[#1F3A00] text-white font-medium"
                            : "text-ink-500 hover:text-[#1F3A00] hover:bg-[#DCFAB7]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-ink-600 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MAIN ACCOUNT WORKSPACE */}
          <main className="flex-1 space-y-6 min-w-0">
            {children}
          </main>

        </div>

      </div>
    </ProtectedRoute>
  );
}
