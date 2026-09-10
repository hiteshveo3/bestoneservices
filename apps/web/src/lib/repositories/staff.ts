import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  getDoc,
  type Unsubscribe 
} from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { type StaffMemberItem } from "@/types/staff";

export function subscribeAdminStaff(
  categoryFilter: "cleaning" | "pest" | "gardening" | "removals" | "all" = "all",
  callback: (staff: StaffMemberItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "staff");
  const constraints = [];
  if (categoryFilter !== "all") {
    constraints.push(where("assignedCategory", "==", categoryFilter));
  }
  constraints.push(orderBy("updatedAt", "desc"));
  constraints.push(limit(100));

  const q = query(colRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as StaffMemberItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to admin staff:", err);
    callback([]);
  });
}

export async function fetchStaffDetail(id: string): Promise<StaffMemberItem | null> {
  const db = getFirebaseClientDb();
  if (!db || !id) return null;

  try {
    const docRef = doc(db, "staff", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as StaffMemberItem;
    }
    return null;
  } catch (err) {
    console.warn("Error fetching staff detail:", err);
    return null;
  }
}
