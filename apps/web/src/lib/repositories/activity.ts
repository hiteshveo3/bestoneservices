import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { type ActivityLogItem } from "@/types/dashboard";

const ACTIVITY_COLLECTION = "activityLogs";

export async function getActivityLogs(limitCount = 10): Promise<ActivityLogItem[]> {
  const db = getFirebaseClientDb();
  if (!db) return [];

  try {
    const colRef = collection(db, ACTIVITY_COLLECTION);
    const q = query(colRef, orderBy("createdAt", "desc"), limit(limitCount));
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        actorId: data.actorId,
        actorName: data.actorName || "System",
        actorRole: data.actorRole || "system",
        type: data.type || "system_event",
        entityType: data.entityType,
        entityId: data.entityId,
        summary: data.summary || "",
        metadata: data.metadata || {},
        createdAt: data.createdAt || null,
      };
    });
  } catch (err) {
    console.warn("Activity logs fetch warning:", err);
    return [];
  }
}

export async function logActivity(
  actorId: string,
  actorName: string,
  actorRole: "admin" | "customer" | "system",
  type: string,
  summary: string,
  metadata: Record<string, unknown> = {}
): Promise<string | null> {
  const db = getFirebaseClientDb();
  if (!db) return null;

  try {
    const colRef = collection(db, ACTIVITY_COLLECTION);
    const res = await addDoc(colRef, {
      actorId,
      actorName,
      actorRole,
      type,
      summary,
      metadata,
      createdAt: serverTimestamp(),
    });
    return res.id;
  } catch (err) {
    console.error("Error logging activity:", err);
    return null;
  }
}
