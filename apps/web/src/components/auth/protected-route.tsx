"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { ShieldAlert, Loader2, ArrowLeft } from "@/components/icons";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCustomer?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireCustomer = false,
}: ProtectedRouteProps) {
  const { user, isAdmin, loading, signOutUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if ((requireAdmin || requireCustomer) && !user) {
      router.replace(`/account/login/?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, requireAdmin, requireCustomer, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <Loader2 className="w-8 h-8 text-[#1D201E] animate-spin" />
        <p className="text-sm font-mono text-ink-500">Verifying secure authentication state...</p>
      </div>
    );
  }

  if ((requireAdmin || requireCustomer) && !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <Loader2 className="w-8 h-8 text-[#1D201E] animate-spin" />
        <p className="text-sm font-mono text-ink-500">Redirecting to secure login...</p>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-danger-50 text-danger-500 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-[650] text-ink-900">Admin Access Denied</h1>
          <p className="text-sm text-ink-500 leading-relaxed">
            Your account ({user?.email}) does not have administrative permissions for Bestone Services.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/account"
            className="flex-1 py-3 px-4 rounded-xl bg-[#B7F56A] text-[#1D201E] text-sm font-medium text-center hover:bg-[#A2EA4E] text-decoration-none"
          >
            Customer Account
          </Link>
          <button
            type="button"
            onClick={() => signOutUser()}
            className="flex-1 py-3 px-4 rounded-xl bg-[#F6F5F1] text-ink-600 text-sm font-medium hover:bg-[#EAF8D6] border-none cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
