"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { 
  subscribeUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "@/lib/repositories/notifications";
import { type NotificationItem } from "@/types/dashboard";
import { Bell, Sparkles, X, ChevronRight } from "lucide-react";

export function NotificationCenterPanel() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!user) {
      setTimeout(() => setNotifications([]), 0);
      return;
    }

    const unsubscribe = subscribeUserNotifications(user.uid, role, (items) => {
      setNotifications(items);
    });

    return () => unsubscribe();
  }, [user, role]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.readAt;
    return true;
  });

  const handleMarkItemRead = async (item: NotificationItem) => {
    if (!item.readAt) {
      await markNotificationAsRead(item.id);
    }
    if (item.actionUrl) {
      router.push(item.actionUrl);
      setPanelOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsAsRead(user.uid, role);
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Header Bell Trigger */}
      <button
        type="button"
        onClick={() => setPanelOpen(!panelOpen)}
        className="relative p-2 rounded-full text-ink-500 hover:text-ink-600 hover:bg-[#DCFAB7] border-none cursor-pointer transition-colors duration-150"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="w-5 h-5 text-ink-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-[#1F3A00] text-white font-medium text-[10px] leading-none border border-[#E5FBC9]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPanelOpen(false)} />

          <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-[16px] overflow-hidden border-none text-start flex flex-col max-h-[80vh] border border-[#E5FBC9]">
            
            {/* Panel Header */}
            <div className="p-4 border-b border-[#E5FBC9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-ink-600" />
                <h3 className="font-heading font-medium text-base text-ink-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#1F3A00] text-white text-xs font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium text-ink-600 hover:underline border-none bg-transparent cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="p-1 rounded-[16px] text-ink-500 hover:text-ink-600 border-none bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="p-2 bg-[#F9FCF5] flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`flex-1 py-1.5 rounded-[16px] font-medium border-none cursor-pointer transition-colors duration-150 ${ filter === "all" ? "bg-white text-ink-600 font-medium " : "text-ink-500 hover:text-ink-600" } border border-[#E5FBC9]`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`flex-1 py-1.5 rounded-[16px] font-medium border-none cursor-pointer transition-colors duration-150 ${ filter === "unread" ? "bg-white text-ink-600 font-medium " : "text-ink-500 hover:text-ink-600" } border border-[#E5FBC9]`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Notifications List */}
            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkItemRead(n)}
                    className={`p-3 rounded-[16px] cursor-pointer space-y-1 ${ n.readAt ? "bg-[#F9FCF5]/60 opacity-80" : "bg-white border-l-4 border-l-blue-500 " } border border-[#E5FBC9]`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-ink-600">{n.title}</span>
                      {!n.readAt && (
                        <span className="w-2 h-2 rounded-full bg-[#1F3A00]" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-ink-500 leading-snug">{n.message}</p>
                    {n.createdAt && (
                      <span className="text-[10px] font-mono text-ink-500 block">
                        {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-[#1F3A00] mx-auto" />
                  <p className="font-heading font-medium text-sm text-ink-900">You&apos;re all caught up</p>
                  <p className="text-xs text-ink-500">No unread notifications at this time.</p>
                </div>
              )}
            </div>

            {/* Footer View All Link */}
            <div className="p-3 border-t border-[#E5FBC9] text-center">
              <Link
                href={role === "admin" ? "/admin/notifications" : "/account/notifications"}
                onClick={() => setPanelOpen(false)}
                className="text-xs font-medium text-ink-600 hover:underline text-decoration-none inline-flex items-center gap-1"
              >
                <span>View Full Notification Center</span>
                <ChevronRight className="w-3.5 h-3.5 text-ink-600" />
              </Link>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
