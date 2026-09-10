import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { type NotificationItem } from "@/types/dashboard";

const NOTIFICATIONS_COLLECTION = "notifications";

export function subscribeUserNotifications(
  userId: string,
  role: "admin" | "customer",
  callback: (notifications: NotificationItem[]) => void
): () => void {
  const db = getFirebaseClientDb();
  if (!db || !userId) {
    callback([]);
    return () => {};
  }

  try {
    const colRef = collection(db, NOTIFICATIONS_COLLECTION);
    let q;

    if (role === "admin") {
      q = query(
        colRef,
        where("recipientRole", "==", "admin"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
    } else {
      q = query(
        colRef,
        where("recipientId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(20)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: NotificationItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            recipientId: data.recipientId || "",
            recipientRole: data.recipientRole || "customer",
            type: data.type || "system",
            title: data.title || "",
            message: data.message || "",
            entityType: data.entityType,
            entityId: data.entityId,
            actionUrl: data.actionUrl,
            readAt: data.readAt || null,
            createdAt: data.createdAt || null,
          };
        });
        callback(items);
      },
      (error) => {
        console.warn("Notifications subscription warning:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Error subscribing to notifications:", err);
    callback([]);
    return () => {};
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const db = getFirebaseClientDb();
  if (!db || !notificationId) return false;

  try {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(docRef, {
      readAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("Error marking notification read:", err);
    return false;
  }
}

export async function markAllNotificationsAsRead(userId: string, role: "admin" | "customer"): Promise<boolean> {
  const db = getFirebaseClientDb();
  if (!db || !userId) return false;

  try {
    const colRef = collection(db, NOTIFICATIONS_COLLECTION);
    let q;
    if (role === "admin") {
      q = query(colRef, where("recipientRole", "==", "admin"), where("readAt", "==", null));
    } else {
      q = query(colRef, where("recipientId", "==", userId), where("readAt", "==", null));
    }

    const snap = await getDocs(q);
    if (snap.empty) return true;

    const batch = writeBatch(db);
    snap.docs.forEach((docSnap) => {
      batch.update(docSnap.ref, { readAt: serverTimestamp() });
    });

    await batch.commit();
    return true;
  } catch (err) {
    console.error("Error marking all notifications read:", err);
    return false;
  }
}

export async function createNotification(
  data: Omit<NotificationItem, "id" | "createdAt" | "readAt">
): Promise<string | null> {
  const db = getFirebaseClientDb();
  if (!db) return null;

  try {
    const colRef = collection(db, NOTIFICATIONS_COLLECTION);
    const res = await addDoc(colRef, {
      ...data,
      readAt: null,
      createdAt: serverTimestamp(),
    });
    return res.id;
  } catch (err) {
    console.error("Error creating notification:", err);
    return null;
  }
}
