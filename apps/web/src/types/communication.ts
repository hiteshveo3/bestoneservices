import { Timestamp } from "firebase/firestore";

export type SenderRole = "customer" | "admin" | "system";
export type CommChannel = "email" | "sms";

export type TriggerEvent = 
  | "booking_confirmation" 
  | "reminder_24h" 
  | "staff_dispatched" 
  | "invoice_issued" 
  | "re_clean_approved";

export interface ChatMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: SenderRole;
  text: string;
  createdAt?: Timestamp | string;
  read: boolean;
}

export interface ConversationItem {
  id: string; // e.g. CNV-2026-84920
  bookingId: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;

  lastMessageText?: string;
  lastMessageSender?: SenderRole;
  unreadAdminCount: number;
  unreadCustomerCount: number;

  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface CommLogItem {
  id: string; // e.g. LOG-2026-84920
  bookingId: string;
  bookingReference: string;
  recipientEmail: string;
  recipientPhone?: string;

  channel: CommChannel;
  triggerEvent: TriggerEvent;
  messageSnippet: string;
  status: "sent" | "failed" | "queued";

  sentAt?: Timestamp | string;
}
