"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { NotificationCenterPanel } from "@/components/dashboard/notification-center-panel";
import { GlobalSearchModal } from "@/components/dashboard/global-search-modal";
import { Logo } from "@/components/logo";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Users, 
  Package, 
  PoundSterling, 
  MapPin, 
  UserCheck, 
  Clock, 
  MessageSquare, 
  HelpCircle, 
  ShieldCheck, 
  Star, 
  BarChart3, 
  Activity, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  ChevronRight
} from "lucide-react";

interface NavGroup {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const ADMIN_NAV: NavGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: Calendar },
      { label: "Calendar", href: "/admin/calendar", icon: Clock },
      { label: "Estimates", href: "/admin/estimates", icon: FileText },
      { label: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    title: "Services & Pricing",
    items: [
      { label: "Services", href: "/admin/services", icon: Package },
      { label: "Pricing Engine", href: "/admin/pricing", icon: PoundSterling },
      { label: "Coverage Areas", href: "/admin/areas", icon: MapPin },
    ],
  },
  {
    title: "Team Management",
    items: [
      { label: "Staff & Teams", href: "/admin/staff", icon: UserCheck },
      { label: "Availability", href: "/admin/availability", icon: Clock },
    ],
  },
  {
    title: "Customer Care",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
      { label: "Support Tickets", href: "/admin/support", icon: HelpCircle },
      { label: "Guarantees", href: "/admin/guarantees", icon: ShieldCheck },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Reports", href: "/admin/reports", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Audit Logs", href: "/admin/activity", icon: Activity },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

// Routes that actually exist under src/app/admin today. Nav items pointing
// anywhere else are staged for a future phase and render disabled rather
// than linking to a 404.
const BUILT_ADMIN_ROUTES = new Set([
  "/admin",
  "/admin/bookings",
  "/admin/calendar",
  "/admin/estimates",
  "/admin/customers",
  "/admin/services",
  "/admin/pricing",
  "/admin/staff",
  "/admin/reviews",
  "/admin/analytics",
  "/admin/reports",
  "/admin/disputes",
  "/admin/invoices",
  "/admin/communications",
  "/admin/notifications",
]);

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, signOutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const adminName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Admin";

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-[#F6F5F1] text-start flex flex-col font-sans">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-white border-[#ECEAE3]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-ink-600 hover:bg-[#EAF8D6] border-none cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Logo href="/admin" className="text-ink-600 font-medium">
                <div className="flex flex-col">
                  <span className="ts-head text-[22px] leading-none">Bestone</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Admin Console</span>
                </div>
              </Logo>
            </div>

            {/* Global Search Bar Trigger */}
            <div 
              onClick={() => setSearchModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F6F5F1] text-sm text-ink-500 w-64 lg:w-96 cursor-pointer hover:bg-[#EAF8D6] transition-colors duration-150"
            >
              <Search className="w-4 h-4 text-ink-500 shrink-0" />
              <span className="text-xs text-ink-500 font-medium flex-1">Search Bestone navigation or customers...</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-white text-muted">Cmd+K</span>
            </div>

            {/* Admin Actions, Notifications & Profile */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="md:hidden p-2 rounded-full text-ink-600 hover:bg-[#EAF8D6] border-none cursor-pointer"
                aria-label="Open Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <NotificationCenterPanel />

              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6F5F1] text-ink-600 text-xs font-semibold hover:bg-[#EAF8D6] text-decoration-none"
              >
                <span>Live Website</span>
                <ChevronRight className="w-3 h-3 text-ink-600" />
              </Link>

              <div className="flex items-center gap-2 pl-2  border-[#ECEAE3]">
                <div className="w-8 h-8 rounded-full bg-[#B7F56A] text-[#1D201E] flex items-center justify-center font-medium text-xs">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-start">
                  <span className="font-medium text-xs text-ink-600 leading-tight">{adminName}</span>
                  <span className="text-[11px] text-muted">Super Admin</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signOutUser()}
                className="p-2 rounded-full text-ink-500 hover:text-ink-600 hover:bg-[#EAF8D6] border-none cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </header>

        {/* Global Search Command Modal */}
        <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

        <div className="flex-1 flex max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            <div className="bg-white rounded-[16px] p-4 space-y-5 sticky top-22 max-h-[calc(100vh-7rem)] overflow-y-auto ">
              {ADMIN_NAV.map((group) => (
                <div key={group.title} className="space-y-1">
                  <span className="ts-eyebrow block px-3 pb-1">
                    {group.title}
                  </span>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                    const isBuilt = BUILT_ADMIN_ROUTES.has(item.href);
                    const Icon = item.icon;

                    if (!isBuilt) {
                      return (
                        <div
                          key={item.href}
                          aria-disabled="true"
                          title={`${item.label} is not available yet`}
                          className="flex items-center justify-between min-h-10 px-3 py-2 rounded-xl text-sm font-medium text-ink-500/50 cursor-not-allowed"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 shrink-0 text-ink-500/50" />
                            <span>{item.label}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-muted bg-[#F6F5F1] px-1.5 py-0.5 rounded-md">
                            Soon
                          </span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between min-h-10 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150 text-decoration-none ${ isActive ? "bg-[#B7F56A] text-[#1D201E] font-medium " : "text-ink-500 hover:text-[#1D201E] hover:bg-[#EAF8D6]" } `}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-ink" : "text-muted"}`} />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </aside>

          {/* MOBILE NAVIGATION DRAWER */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 lg:hidden flex">
              <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
              <div className="relative w-72 max-w-[80vw] bg-white h-full p-4 space-y-6 overflow-y-auto z-50 text-start ">
                <div className="flex items-center justify-between border-[#ECEAE3] pb-4">
                  <span className="ts-head text-xl">Admin Menu</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-xl text-ink-600 border-none bg-transparent cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {ADMIN_NAV.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <span className="ts-eyebrow block px-3 pb-1">
                        {group.title}
                      </span>
                      {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        const isBuilt = BUILT_ADMIN_ROUTES.has(item.href);
                        const Icon = item.icon;

                        if (!isBuilt) {
                          return (
                            <div
                              key={item.href}
                              aria-disabled="true"
                              title={`${item.label} is not available yet`}
                              className="flex items-center justify-between min-h-10 px-3 py-2 rounded-xl text-sm font-medium text-ink-500/50 cursor-not-allowed"
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="w-4 h-4 shrink-0 text-ink-500/50" />
                                <span>{item.label}</span>
                              </div>
                              <span className="text-[11px] font-semibold text-muted bg-[#F6F5F1] px-1.5 py-0.5 rounded-md">
                                Soon
                              </span>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center justify-between min-h-10 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150 text-decoration-none ${
 isActive
 ? "bg-[#B7F56A] text-[#1D201E] font-medium"
 : "text-ink-500 hover:text-[#1D201E] hover:bg-[#EAF8D6]"
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
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MAIN WORKSPACE CONTENT */}
          <main className="flex-1 space-y-6 min-w-0">
            {children}
          </main>

        </div>

      </div>
    </ProtectedRoute>
  );
}
