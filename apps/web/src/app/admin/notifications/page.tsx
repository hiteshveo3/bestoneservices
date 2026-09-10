"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { 
  subscribeUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "@/lib/repositories/notifications";
import { type NotificationItem } from "@/types/dashboard";
import { CheckCheck, Sparkles } from "lucide-react";

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeUserNotifications(user.uid, "admin", (items) => {
      setNotifications(items);
    });
    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.readAt;
    if (filter === "read") return Boolean(n.readAt);
    return true;
  });

  const handleMarkItemRead = async (id: string) => {
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsAsRead(user.uid, "admin");
  };

  return (
    <div className="space-y-6 text-start">
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">NOTIFICATION CENTER</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Admin Notifications</h1>
            <p className="text-sm text-ink-500">Real-time operational alerts, system events, and customer requests</p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] border-none cursor-pointer inline-flex items-center gap-1.5 border border-[#E5FBC9]"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E5FBC9]">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ filter === "all" ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ filter === "unread" ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("read")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ filter === "read" ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-[18px] p-5 space-y-2 flex items-start justify-between gap-4 ${ !n.readAt ? "border-l-4 border-l-blue-500" : "opacity-80" } border border-[#E5FBC9]`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-medium text-base text-ink-900">{n.title}</span>
                  {!n.readAt && (
                    <span className="px-2 py-0.5 rounded-full bg-[#1F3A00] text-white font-medium text-[10px] uppercase">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-500 leading-relaxed">{n.message}</p>
                {n.createdAt && (
                  <span className="text-xs font-mono text-ink-500 block pt-1">
                    {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : "Just now"}
                  </span>
                )}
              </div>

              {!n.readAt && (
                <button
                  type="button"
                  onClick={() => handleMarkItemRead(n.id)}
                  className="px-3 py-1.5 rounded-full bg-[#F9FCF5] text-ink-600 text-xs font-medium hover:bg-[#DCFAB7] border-none cursor-pointer shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[18px] p-10 text-center space-y-3 max-w-md mx-auto border border-[#E5FBC9]">
            <Sparkles className="w-10 h-10 text-[#1F3A00] mx-auto" />
            <h3 className="font-heading text-lg font-medium text-ink-900">No Notifications Found</h3>
            <p className="text-sm text-ink-500">
              Operational alerts and customer activity will populate here in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
