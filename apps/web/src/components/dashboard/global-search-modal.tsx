"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Search, X, ChevronRight, User, Calendar, FileText, Package, Settings, ShieldCheck, MapPin, PoundSterling } from "lucide-react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";

interface NavCommand {
  label: string;
  category: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const COMMANDS: NavCommand[] = [
  { label: "Admin Overview", category: "Navigation", href: "/admin", icon: ShieldCheck, adminOnly: true },
  { label: "Booking Queue", category: "Operations", href: "/admin/bookings", icon: Calendar, adminOnly: true },
  { label: "Master Calendar", category: "Operations", href: "/admin/calendar", icon: Calendar, adminOnly: true },
  { label: "Saved Estimates", category: "Operations", href: "/admin/estimates", icon: FileText, adminOnly: true },
  { label: "Service Catalog", category: "Services", href: "/admin/services", icon: Package, adminOnly: true },
  { label: "Pricing Engine", category: "Services", href: "/admin/pricing", icon: PoundSterling, adminOnly: true },
  { label: "Coverage Areas", category: "Services", href: "/admin/areas", icon: MapPin, adminOnly: true },
  { label: "System Settings", category: "System", href: "/admin/settings", icon: Settings, adminOnly: true },
  { label: "Account Home", category: "Customer", href: "/account", icon: ShieldCheck },
  { label: "My Bookings", category: "Customer", href: "/account/bookings", icon: Calendar },
  { label: "Saved Estimates", category: "Customer", href: "/account/estimates", icon: FileText },
  { label: "My Profile", category: "Customer", href: "/account/profile", icon: User },
];

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState<{ uid: string; displayName: string; email: string; role: string }[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Admin Customer Search in Firestore
  useEffect(() => {
    let active = true;

    if (!isOpen || !isAdmin || !searchTerm.trim() || searchTerm.length < 2) {
      if (userResults.length > 0) {
        setTimeout(() => setUserResults([]), 0);
      }
      return;
    }

    const fetchUsers = async () => {
      if (active) setSearchingUsers(true);
      const db = getFirebaseClientDb();
      if (!db) return;

      try {
        const term = searchTerm.trim().toLowerCase();
        const usersRef = collection(db, "users");
        const q = query(usersRef, limit(10));
        const snap = await getDocs(q);

        if (!active) return;

        const results = snap.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              uid: docSnap.id,
              displayName: data.displayName || "Customer",
              email: data.email || "",
              role: data.role || "customer",
            };
          })
          .filter(
            (u) =>
              u.email.toLowerCase().includes(term) ||
              u.displayName.toLowerCase().includes(term)
          );

        setUserResults(results);
      } catch (err) {
        console.warn("User search query warning:", err);
      } finally {
        if (active) setSearchingUsers(false);
      }
    };

    const timer = setTimeout(fetchUsers, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isOpen, isAdmin, searchTerm, userResults.length]);

  if (!isOpen) return null;

  const filteredCommands = COMMANDS.filter((cmd) => {
    if (cmd.adminOnly && !isAdmin) return false;
    if (!searchTerm.trim()) return true;
    return cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) || cmd.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelectRoute = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Command Palette Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-[16px] overflow-hidden border-none text-start z-50 flex flex-col max-h-[80vh] border border-[#E5FBC9]">
        
        {/* Search Header Bar */}
        <div className="p-4 border-b border-[#E5FBC9] flex items-center gap-3">
          <Search className="w-5 h-5 text-ink-500 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAdmin ? "Search navigation commands or customer emails..." : "Search account navigation..."}
            autoFocus
            className="w-full bg-transparent text-base text-ink-600 placeholder:text-ink-400 focus:outline-none font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[16px] text-ink-500 hover:text-ink-600 hover:bg-[#DCFAB7] border-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          
          {/* Admin Customer Directory Search Results */}
          {isAdmin && searchTerm.trim().length >= 2 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-medium uppercase text-ink-500 px-2 block">
                CUSTOMER DIRECTORY ({searchingUsers ? "Searching..." : userResults.length})
              </span>
              {userResults.length > 0 ? (
                userResults.map((u) => (
                  <div
                    key={u.uid}
                    onClick={() => handleSelectRoute(`/admin/customers?uid=${u.uid}`)}
                    className="p-3 rounded-[16px] bg-[#F9FCF5] hover:bg-[#DCFAB7] cursor-pointer flex items-center justify-between transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1F3A00] text-white flex items-center justify-center font-medium text-xs">
                        {u.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-ink-600">{u.displayName}</div>
                        <div className="text-xs text-ink-500">{u.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-medium uppercase bg-white px-2 py-0.5 rounded text-ink-600">
                      {u.role}
                    </span>
                  </div>
                ))
              ) : (
                !searchingUsers && (
                  <p className="text-xs text-ink-500 px-2">No matching registered customers found.</p>
                )
              )}
            </div>
          )}

          {/* Navigation Commands */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-medium uppercase text-ink-500 px-2 block">
              DASHBOARD NAVIGATION
            </span>
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <div
                    key={cmd.href}
                    onClick={() => handleSelectRoute(cmd.href)}
                    className="p-3 rounded-[16px] hover:bg-[#DCFAB7] cursor-pointer flex items-center justify-between transition-colors duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[16px] bg-[#F9FCF5] group-hover:bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center transition-colors duration-150">
                        <Icon className="w-4 h-4 text-ink-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-ink-600">{cmd.label}</div>
                        <div className="text-[11px] text-ink-500 font-mono">{cmd.category}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-500" />
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-ink-500 px-2">No navigation commands matching &quot;{searchTerm}&quot;.</p>
            )}
          </div>

        </div>

        {/* Footer Shortcut Tip */}
        <div className="p-3 bg-[#F9FCF5] border-t border-[#E5FBC9] flex items-center justify-between text-xs font-mono text-ink-500">
          <span>Navigate: Click or Press Enter</span>
          <span>Close: ESC</span>
        </div>

      </div>
    </div>
  );
}
