"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { getActivityLogs } from "@/lib/repositories/activity";
import { fetchBookingCounts, subscribeAdminBookings } from "@/lib/repositories/bookings";
import { type ActivityLogItem } from "@/types/dashboard";
import { type BookingItem } from "@/types/booking";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { formatUKTime, formatUKDate } from "@/lib/timezone";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { 
  Users, 
  Activity, 
  Bell, 
  Calendar, 
  PoundSterling, 
  Package, 
  CheckCircle2, 
  Key,
  Lock,
  Sparkles,
  AlertCircle,
  ChevronRight,
  Plus
} from "lucide-react";

export default function AdminOverviewPage() {
  const { user, profile } = useAuth();
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [attentionBookings, setAttentionBookings] = useState<BookingItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const adminFirstName = profile?.displayName 
    ? profile.displayName.split(" ")[0] 
    : user?.displayName 
      ? user.displayName.split(" ")[0] 
      : "Admin";

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    let active = true;

    const loadRealMetrics = async () => {
      const db = getFirebaseClientDb();
      if (!db) {
        if (active) setLoadingMetrics(false);
        return;
      }

      try {
        // 1. Customer Count
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "customer"));
        const snap = await getDocs(q);
        if (active) setCustomerCount(snap.size);

        // 2. Booking Counts & Attention Items
        const bCounts = await fetchBookingCounts();
        if (active) setBookingCounts(bCounts);

        // 3. Operational Activity Logs
        const logs = await getActivityLogs(8);
        if (active) setActivityLogs(logs);

      } catch (err) {
        console.warn("Error loading admin overview metrics:", err);
      } finally {
        if (active) setLoadingMetrics(false);
      }
    };

    loadRealMetrics();

    // Subscribe to new / awaiting_confirmation bookings for Attention Queue
    const unsubscribeNew = subscribeAdminBookings({
      status: "new",
      limitCount: 5,
    }, (items) => {
      if (active) setAttentionBookings(items);
    });

    return () => { 
      active = false; 
      unsubscribeNew();
    };
  }, []);

  return (
    <div className="space-y-6 text-start">
      
      {/* 1. Dynamic Greeting & Command Header */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Phase 3 — Operational Operations Command</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">
              {timeGreeting}, {adminFirstName}
            </h1>
            <p className="text-sm text-ink-500">
              Best One Services Live Real-Time Operations Platform
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/bookings/new"
              className="px-4 py-2.5 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] text-decoration-none inline-flex items-center gap-1.5 border border-[#E5FBC9]"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>New Enquiry</span>
            </Link>

            <div className="p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-mono hidden sm:block">
              <div className="flex items-center gap-1.5 text-ink-600 font-medium">
                <Key className="w-3.5 h-3.5 text-ink-600" />
                <span>Admin Custom Claim Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REAL OPERATIONAL METRICS CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Real Customer Count */}
        <div className="bg-white rounded-[18px] p-5 space-y-2 border border-[#E5FBC9]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-ink-500 uppercase">REGISTERED CUSTOMERS</span>
            <Users className="w-4 h-4 text-ink-600" />
          </div>
          <div className="font-heading text-2xl font-medium text-ink-900">
            {loadingMetrics ? "..." : customerCount !== null ? customerCount : 0}
          </div>
          <p className="text-xs text-ink-500">Verified accounts in Firestore</p>
        </div>

        {/* Real New Bookings Count */}
        <div className="bg-white rounded-[18px] p-5 space-y-2 border-l-4 border-l-info-500 border border-[#E5FBC9]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-ink-500 uppercase">NEW / AWAITING CONF.</span>
            <Calendar className="w-4 h-4 text-info-500" />
          </div>
          <div className="font-heading text-2xl font-medium text-ink-900">
            {loadingMetrics ? "..." : (bookingCounts.new || 0) + (bookingCounts.awaiting_confirmation || 0)}
          </div>
          <p className="text-xs text-ink-500">Require slot & scope confirmation</p>
        </div>

        {/* Real Confirmed & Scheduled Count */}
        <div className="bg-white rounded-[18px] p-5 space-y-2 border-l-4 border-l-blue-500 border border-[#E5FBC9]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-ink-500 uppercase">ACTIVE SCHEDULED</span>
            <Calendar className="w-4 h-4 text-[#1F3A00]" />
          </div>
          <div className="font-heading text-2xl font-medium text-ink-900">
            {loadingMetrics ? "..." : (bookingCounts.confirmed || 0) + (bookingCounts.scheduled || 0)}
          </div>
          <p className="text-xs text-ink-500">Confirmed service appointments</p>
        </div>

        {/* Real Audit Activity Events */}
        <div className="bg-white rounded-[18px] p-5 space-y-2 border border-[#E5FBC9]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-ink-500 uppercase">AUDIT LOG EVENTS</span>
            <Activity className="w-4 h-4 text-ink-600" />
          </div>
          <div className="font-heading text-2xl font-medium text-ink-900">
            {activityLogs.length}
          </div>
          <p className="text-xs text-ink-500">Recorded operational audit records</p>
        </div>

      </div>

      {/* 3. ATTENTION REQUIRED & RECENT ACTIVITY FEED */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Real Attention Required Queue */}
        <div className="lg:col-span-6 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-medium text-ink-900">Attention Required</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-info-50 text-info-900 text-xs font-mono font-medium">
              {attentionBookings.length} Pending Actions
            </span>
          </div>

          {attentionBookings.length > 0 ? (
            <div className="space-y-3">
              {attentionBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="p-4 rounded-[18px] bg-[#F9FCF5] hover:bg-[#DCFAB7] flex items-center justify-between text-decoration-none text-ink-600 transition-colors duration-150 block"
                >
                  <div className="space-y-0.5 text-start">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-sm text-ink-600">{b.reference}</span>
                      <span className="px-2 py-0.5 rounded-full bg-info-500 text-white text-[10px] font-mono uppercase font-medium">
                        New
                      </span>
                    </div>
                    <span className="text-xs text-ink-600 font-medium block">{b.serviceNameSnapshot}</span>
                    <span className="text-[11px] text-ink-500 block">Customer: {b.customerSnapshot?.fullName} • {b.address?.postcode}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-600 shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-[18px] bg-[#F9FCF5] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#1F3A00] mx-auto" />
              <h4 className="font-heading font-medium text-base text-ink-900">Nothing needs your attention right now</h4>
              <p className="text-xs text-ink-500">
                New website submissions and unconfirmed bookings will populate here.
              </p>
            </div>
          )}
        </div>

        {/* Recent Operational Activity Feed */}
        <div className="lg:col-span-6 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-medium text-ink-900">Recent Activity</h3>
            <span className="text-xs font-mono text-ink-500">Operational Audit</span>
          </div>

          {activityLogs.length > 0 ? (
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-[18px] bg-[#F9FCF5] flex items-center justify-between text-xs text-start">
                  <div className="space-y-0.5">
                    <span className="font-medium text-ink-600 block">{log.summary}</span>
                    <span className="text-[11px] text-ink-500">Actor: {log.actorName} ({log.actorRole})</span>
                  </div>
                  <span className="font-mono text-[10px] text-ink-500 shrink-0">
                    {log.createdAt ? formatUKTime(log.createdAt) : "Recent"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-[18px] bg-[#F9FCF5] text-center space-y-1">
              <p className="font-medium text-xs text-ink-600">System Ready</p>
              <p className="text-xs text-ink-500">Operational audit events will log here automatically.</p>
            </div>
          )}
        </div>

      </div>

      {/* 4. Functional Admin Quick Actions */}
      <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
        <h3 className="font-heading text-lg font-medium text-ink-900">Admin Quick Actions</h3>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/bookings"
            className="p-4 rounded-[18px] bg-[#F9FCF5] hover:bg-[#DCFAB7] text-decoration-none text-ink-600 space-y-2 transition-colors duration-150 block"
          >
            <Calendar className="w-5 h-5 text-ink-600" />
            <div className="font-medium text-sm">View Booking Queue</div>
            <p className="text-xs text-ink-500">Manage all active bookings</p>
          </Link>

          <Link
            href="/admin/bookings/new"
            className="p-4 rounded-[18px] bg-[#F9FCF5] hover:bg-[#DCFAB7] text-decoration-none text-ink-600 space-y-2 transition-colors duration-150 block"
          >
            <Plus className="w-5 h-5 text-ink-600" />
            <div className="font-medium text-sm">Create Manual Booking</div>
            <p className="text-xs text-ink-500">Enter enquiry over phone/email</p>
          </Link>

          <Link
            href="/admin/services"
            className="p-4 rounded-[18px] bg-[#F9FCF5] hover:bg-[#DCFAB7] text-decoration-none text-ink-600 space-y-2 transition-colors duration-150 block"
          >
            <Package className="w-5 h-5 text-ink-600" />
            <div className="font-medium text-sm">Service Catalog</div>
            <p className="text-xs text-ink-500">Phase 5 Service Scopes</p>
          </Link>

          <Link
            href="/admin/notifications"
            className="p-4 rounded-[18px] bg-[#F9FCF5] hover:bg-[#DCFAB7] text-decoration-none text-ink-600 space-y-2 transition-colors duration-150 block"
          >
            <Bell className="w-5 h-5 text-ink-600" />
            <div className="font-medium text-sm">Notification Center</div>
            <p className="text-xs text-ink-500">Real-time operational alerts</p>
          </Link>
        </div>
      </div>

    </div>
  );
}
