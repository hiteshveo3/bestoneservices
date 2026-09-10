import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  type Unsubscribe 
} from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { 
  type ConversationItem, 
  type ChatMessageItem, 
  type CommLogItem 
} from "@/types/communication";

export function subscribeAdminConversations(
  callback: (conversations: ConversationItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "conversations");
  const q = query(colRef, orderBy("updatedAt", "desc"), limit(100));

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ConversationItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to admin conversations:", err);
    callback([]);
  });
}

export function subscribeBookingMessages(
  conversationId: string,
  callback: (messages: ChatMessageItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db || !conversationId) {
    callback([]);
    return () => {};
  }

  const msgColRef = collection(db, "conversations", conversationId, "messages");
  const q = query(msgColRef, orderBy("createdAt", "asc"), limit(200));

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatMessageItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to booking chat messages:", err);
    callback([]);
  });
}

export function subscribeCommLogs(
  callback: (logs: CommLogItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "communication_logs");
  const q = query(colRef, orderBy("sentAt", "desc"), limit(100));

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as CommLogItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to communication logs:", err);
    callback([]);
  });
}
