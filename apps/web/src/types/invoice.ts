import { Timestamp } from "firebase/firestore";

export type InvoicePaymentStatus = 
  | "unpaid" 
  | "partially_paid" 
  | "paid" 
  | "refunded";

export type PaymentMethod = 
  | "stripe" 
  | "bank_transfer" 
  | "cash_on_completion" 
  | "card_terminal";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPricePence: number;
  totalPence: number;
}

export interface InvoiceItem {
  id: string; // e.g. INV-2026-84920
  reference: string; // INV-2026-84920
  accessToken?: string;
  bookingId: string;
  bookingReference: string;

  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  lineItems: InvoiceLineItem[];

  subtotalPence: number;
  vatPercentage: number; // e.g. 20
  vatPence: number;
  totalPence: number;

  depositPaidPence: number;
  balanceDuePence: number;

  paymentStatus: InvoicePaymentStatus;
  paymentMethod?: PaymentMethod;

  issuedAt: Timestamp | string;
  dueDate: Timestamp | string;
  paidAt?: Timestamp | string;

  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;

  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}
