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
import { type EstimateItem, type EstimateStatus } from "@/types/estimate";

export function subscribeAdminEstimates(
  statusFilter: EstimateStatus | "all" = "all",
  callback: (estimates: EstimateItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "estimates");
  const constraints = [];
  if (statusFilter !== "all") {
    constraints.push(where("status", "==", statusFilter));
  }
  constraints.push(orderBy("updatedAt", "desc"));
  constraints.push(limit(100));

  const q = query(colRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as EstimateItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to admin estimates:", err);
    callback([]);
  });
}

export function subscribeCustomerEstimates(
  customerId: string,
  callback: (estimates: EstimateItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db || !customerId) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "estimates");
  const q = query(
    colRef,
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as EstimateItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to customer estimates:", err);
    callback([]);
  });
}

export async function fetchEstimateDetail(id: string, accessToken?: string | null): Promise<EstimateItem | null> {
  if (!id) return null;

  try {
    const response = await fetch(`/api/estimates/${encodeURIComponent(id)}`, {
      cache: "no-store",
      credentials: "same-origin",
      headers: accessToken ? { "X-Resource-Token": accessToken } : undefined,
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.estimate as EstimateItem;
  } catch (err) {
    console.warn("Error fetching estimate detail:", err);
    return null;
  }
}
