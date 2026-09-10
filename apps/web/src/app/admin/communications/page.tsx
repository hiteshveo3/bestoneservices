"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { 
  subscribeAdminConversations, 
  subscribeBookingMessages, 
  subscribeCommLogs 
} from "@/lib/repositories/communications";
import { 
  type ConversationItem, 
  type ChatMessageItem, 
  type CommLogItem 
} from "@/types/communication";
import { 
  MessageSquare, 
  Send, 
  Mail, 
  AlertCircle
} from "lucide-react";

export default function AdminCommunicationsPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [commLogs, setCommLogs] = useState<CommLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const unSubConvs = subscribeAdminConversations((data) => {
      if (!active) return;
      setConversations(data);
      if (data.length > 0 && !selectedConvId) {
        setSelectedConvId(data[0].id);
      }
      setLoading(false);
    });

    const unSubLogs = subscribeCommLogs((data) => {
      if (active) setCommLogs(data);
    });

    return () => {
      active = false;
      unSubConvs();
      unSubLogs();
    };
  }, [selectedConvId]);

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || null;

  useEffect(() => {
    if (!selectedConvId) return;
    let active = true;

    const unSubMsgs = subscribeBookingMessages(selectedConvId, (data) => {
      if (active) setMessages(data);
    });

    return () => {
      active = false;
      unSubMsgs();
    };
  }, [selectedConvId]);

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConv) return;

    setSending(true);
    setActionError(null);

    try {
      const res = await fetch("/api/communications/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedConv.bookingId,
          bookingReference: selectedConv.bookingReference,
          text: replyText.trim(),
          senderRole: "admin",
          senderName: "Best One Support",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setActionError(json.error || "Failed to send reply");
      } else {
        setReplyText("");
      }
    } catch {
      setActionError("Network error sending admin reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER BAR */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-2 border border-[#E5FBC9]">
        <span className="text-xs font-mono font-medium uppercase text-ink-500">COMMUNICATIONS CENTER</span>
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Customer Direct Chat & Automated Triggers</h1>
        <p className="text-sm text-ink-500">Real-time customer messaging, support inbox, and SMS/Email trigger logs</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Loading communications inbox...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* CONVERSATIONS INBOX LIST (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <span className="text-xs font-mono font-medium uppercase text-ink-500">CUSTOMER INBOX</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] text-ink-500 text-[10px] font-mono font-medium">
                {conversations.length} CHATS
              </span>
            </div>

            {conversations.length > 0 ? (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full p-4 rounded-[18px] text-start transition-colors duration-200 border cursor-pointer ${ selectedConv?.id === conv.id ? "bg-[#DCFAB7]/70 border-[#99D055] " : "bg-white border-[#E5FBC9] hover:border-[#1F3A00]" }`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-medium text-ink-600">{conv.bookingReference}</span>
                      <span className="text-[10px] text-ink-500">
                        {conv.updatedAt ? new Date(conv.updatedAt as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>

                    <p className="font-heading font-medium text-sm text-ink-900 mt-1">{conv.customerName}</p>
                    <p className="text-xs text-ink-500 truncate mt-0.5">&ldquo;{conv.lastMessageText || "No messages"}&rdquo;</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-[#1F3A00] mx-auto" />
                <p className="text-xs font-medium text-ink-600">No active chat conversations.</p>
              </div>
            )}
          </div>

          {/* ACTIVE CHAT WORKSPACE (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-[18px] p-6 space-y-4 flex flex-col h-[650px] border border-[#E5FBC9]">
            {selectedConv ? (
              <>
                <div className="border-b border-[#E5FBC9] pb-3 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink-500">LIVE CHAT CHANNEL</span>
                    <h3 className="font-heading font-medium text-base text-ink-900">
                      {selectedConv.customerName} ({selectedConv.bookingReference})
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#F9FCF5] text-[10px] font-mono text-ink-500">
                    {selectedConv.customerEmail}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {messages.map((msg) => {
                    const isAdmin = msg.senderRole === "admin";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-[18px] text-xs font-medium space-y-1 ${ isAdmin ? "bg-[#1F3A00] text-white rounded-br-none" : "bg-[#F9FCF5] text-ink-600 rounded-bl-none border border-[#E5FBC9]" }`}
                        >
                          <span className={`text-[10px] font-mono font-medium uppercase block ${isAdmin ? "text-[#1F3A00]" : "text-ink-500"}`}>
                            {msg.senderName} ({msg.senderRole})
                          </span>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {actionError && (
                  <div className="p-3 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminReply} className="flex gap-2 pt-2 border-t border-[#E5FBC9]">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official admin reply..."
                    className="flex-1 p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                    required
                  />

                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="px-4 py-3 rounded-[18px] bg-[#1F3A00] text-[#B7F56A] hover:bg-[#2d5004] text-xs font-medium cursor-pointer disabled:opacity-50 transition-colors duration-150 border-none flex items-center gap-1 shrink-0"
                  >
                    <span>Reply</span>
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              </>
            ) : (
              <div className="p-12 text-center my-auto space-y-2">
                <MessageSquare className="w-8 h-8 text-[#1F3A00] mx-auto" />
                <p className="text-xs font-medium text-ink-600">Select a chat conversation from the inbox to reply.</p>
              </div>
            )}
          </div>

          {/* AUTOMATED TRIGGERS LOG FEED (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <div className="border-b border-[#E5FBC9] pb-3">
              <span className="text-xs font-mono font-medium uppercase text-ink-500">SMS & EMAIL LOGS</span>
              <h3 className="font-heading font-medium text-sm text-ink-900">Trigger Dispatches</h3>
            </div>

            {commLogs.length > 0 ? (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {commLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-[18px] bg-white border border-[#E5FBC9] space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded-full bg-success-50 text-success-900 text-[9px] font-medium uppercase">
                        {log.channel} • {log.triggerEvent.replace(/_/g, " ")}
                      </span>
                    </div>

                    <p className="font-medium text-ink-600">{log.bookingReference}</p>
                    <p className="text-[10px] text-ink-500 truncate">{log.recipientEmail}</p>
                    <p className="text-[10px] text-ink-600 italic bg-white p-2 rounded-[18px] border border-[#E5FBC9]">
                      &ldquo;{log.messageSnippet}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center space-y-2">
                <Mail className="w-6 h-6 text-[#1F3A00] mx-auto" />
                <p className="text-xs font-medium text-ink-600">No trigger logs recorded yet.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
