"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase-client";
import { subscribeBookingMessages } from "@/lib/repositories/communications";
import { fetchBookingDetail } from "@/lib/repositories/bookings";
import { type ChatMessageItem } from "@/types/communication";
import { type BookingItem } from "@/types/booking";
import { Spinner } from "@/components/ui/spinner";
import { 
  MessageSquare, 
  Send, 
  ChevronLeft, 
  AlertCircle
} from "lucide-react";

export default function CustomerBookingChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const auth = getFirebaseClientAuth();

    if (!auth) {
      setTimeout(() => {
        if (!active) return;
        setAuthLoading(false);
        setLoading(false);
      }, 0);
      return;
    }

    const unSubAuth = onAuthStateChanged(auth, async (user) => {
      if (!active) return;
      setCurrentUser(user);
      setAuthLoading(false);

      const bk = await fetchBookingDetail(bookingId);
      if (active) setBooking(bk);

      const unSubMsg = subscribeBookingMessages(bookingId, (data) => {
        if (!active) return;
        setMessages(data);
        setLoading(false);
      });

      return () => {
        unSubMsg();
      };
    });

    return () => {
      active = false;
      unSubAuth();
    };
  }, [bookingId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !booking) return;

    setSending(true);
    setSendError(null);

    try {
      const res = await fetch("/api/communications/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          bookingReference: booking.reference,
          text: inputText.trim(),
          senderRole: "customer",
          senderName: currentUser?.displayName || booking.customerSnapshot?.fullName || "Customer",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setSendError(json.error || "Failed to send message");
      } else {
        setInputText("");
      }
    } catch {
      setSendError("Network error sending chat message");
    } finally {
      setSending(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-[#F9FCF5] rounded-[18px] p-12 text-center space-y-3 border border-[#B7F56A]">
        <Spinner size={32} className="mx-auto" />
        <p className="text-sm font-medium text-ink-600">Opening direct support chat...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-start max-w-3xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="bg-[#F9FCF5] rounded-[18px] p-6 sm:p-8 space-y-3 border border-[#B7F56A]">
        <div className="flex items-center justify-between">
          <Link
            href={`/account/bookings/${bookingId}`}
            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-ink-500 hover:text-ink-600 text-decoration-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Booking Details</span>
          </Link>

          <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-white text-[10px] font-mono font-medium uppercase">
            LIVE SUPPORT CHAT
          </span>
        </div>

        <div>
          <span className="text-xs font-mono text-ink-500">DIRECT COMMUNICATION</span>
          <h1 className="font-heading text-2xl font-medium text-ink-900">
            Booking #{booking?.reference || bookingId} Support Chat
          </h1>
        </div>
      </div>

      {/* CHAT MESSAGES CARD */}
      <div className="bg-[#F9FCF5] rounded-[18px] p-6 space-y-4 flex flex-col h-[500px] border border-[#B7F56A]">
        
        {/* MESSAGES DISPLAY AREA */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.length > 0 ? (
            messages.map((msg) => {
              const isCustomer = msg.senderRole === "customer";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-[18px] text-xs font-medium space-y-1 ${ isCustomer ? "bg-[#1F3A00] text-white rounded-br-none" : "bg-[#F9FCF5] text-ink-600 rounded-bl-none border border-[#E5FBC9]" }`}
                  >
                    <span className={`text-[10px] font-mono font-medium uppercase block ${isCustomer ? "text-[#1F3A00]" : "text-ink-500"}`}>
                      {msg.senderName} ({msg.senderRole})
                    </span>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2 my-auto">
              <MessageSquare className="w-8 h-8 text-[#1F3A00] mx-auto" />
              <p className="text-xs font-medium text-ink-600">No messages in this chat conversation yet.</p>
              <p className="text-[11px] text-ink-500">Send a message below to reach our dispatch & operations team.</p>
            </div>
          )}
        </div>

        {/* FEEDBACK ALERTS */}
        {sendError && (
          <div className="p-3 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
            <span>{sendError}</span>
          </div>
        )}

        {/* INPUT FORM */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#E5FBC9]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message for Best One support..."
            className="flex-1 p-3.5 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
            required
          />

          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="px-5 py-3.5 rounded-[18px] bg-[#1F3A00] text-[#B7F56A] hover:bg-[#2d5004] text-xs font-medium cursor-pointer disabled:opacity-50 transition-colors duration-150 border-none flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </form>

      </div>

    </div>
  );
}
