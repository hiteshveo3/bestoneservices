import {
  collection,
  query,
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  type Unsubscribe,
  type QueryConstraint
} from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { 
  type ReviewItem, 
  type DisputeItem, 
  type ReviewStatus, 
  type DisputeStatus 
} from "@/types/review";

export function subscribeAdminReviews(
  statusFilter: ReviewStatus | "all" = "all",
  callback: (reviews: ReviewItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "reviews");
  const constraints: QueryConstraint[] = [];
  if (statusFilter !== "all") {
    constraints.push(where("status", "==", statusFilter));
  }
  constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(100));

  const q = query(colRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ReviewItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to admin reviews:", err);
    callback([]);
  });
}

export function subscribeAdminDisputes(
  statusFilter: DisputeStatus | "all" = "all",
  callback: (disputes: DisputeItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "disputes");
  const constraints: QueryConstraint[] = [];
  if (statusFilter !== "all") {
    constraints.push(where("status", "==", statusFilter));
  }
  constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(100));

  const q = query(colRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as DisputeItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to admin disputes:", err);
    callback([]);
  });
}

export function subscribePublishedReviews(
  categoryFilter?: "cleaning" | "pest" | "gardening" | "removals" | "all",
  callback?: (reviews: ReviewItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db || !callback) {
    if (callback) callback([]);
    return () => {};
  }

  const colRef = collection(db, "reviews");
  const constraints: QueryConstraint[] = [where("status", "==", "published")];
  if (categoryFilter && categoryFilter !== "all") {
    constraints.push(where("serviceCategory", "==", categoryFilter));
  }
  constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(50));

  const q = query(colRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ReviewItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to published reviews:", err);
    callback([]);
  });
}
