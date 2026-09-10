import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  type Unsubscribe 
} from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { type InvoiceItem, type InvoicePaymentStatus } from "@/types/invoice";

export function subscribeAdminInvoices(
  statusFilter: InvoicePaymentStatus | "all" = "all",
  callback: (invoices: InvoiceItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "invoices");
  const constraints = [];
  if (statusFilter !== "all") {
    constraints.push(where("paymentStatus", "==", statusFilter));
  }
  constraints.push(orderBy("updatedAt", "desc"));
  constraints.push(limit(100));

  const q = query(colRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as InvoiceItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to admin invoices:", err);
    callback([]);
  });
}

export function subscribeCustomerInvoices(
  customerId: string,
  callback: (invoices: InvoiceItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db || !customerId) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "invoices");
  const q = query(
    colRef,
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as InvoiceItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to customer invoices:", err);
    callback([]);
  });
}

export async function fetchInvoiceDetail(id: string, accessToken?: string | null): Promise<InvoiceItem | null> {
  if (!id) return null;

  try {
    const response = await fetch(`/api/invoices/${encodeURIComponent(id)}`, {
      cache: "no-store",
      credentials: "same-origin",
      headers: accessToken ? { "X-Resource-Token": accessToken } : undefined,
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.invoice as InvoiceItem;
  } catch (err) {
    console.warn("Error fetching invoice detail:", err);
    return null;
  }
}
