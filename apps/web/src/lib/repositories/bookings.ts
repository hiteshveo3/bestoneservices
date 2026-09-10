import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot, 
  getDocs,
  getDoc,
  type Unsubscribe,
  type QueryDocumentSnapshot
} from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { 
  type BookingItem, 
  type BookingStatus, 
  type BookingCategory,
  type BookingEventItem,
  type InternalNoteItem 
} from "@/types/booking";

export interface BookingFilterOptions {
  status?: BookingStatus | "all";
  category?: BookingCategory | "all";
  limitCount?: number;
}

export function subscribeAdminBookings(
  options: BookingFilterOptions,
  callback: (bookings: BookingItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const { status, category, limitCount = 50 } = options;
  const colRef = collection(db, "bookings");
  
  const constraints = [];
  if (status && status !== "all") {
    constraints.push(where("status", "==", status));
  }
  if (category && category !== "all") {
    constraints.push(where("categoryId", "==", category));
  }
  
  constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(limitCount));

  const q = query(colRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as BookingItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to admin bookings:", err);
    callback([]);
  });
}

export function subscribeCustomerBookings(
  customerId: string,
  callback: (bookings: BookingItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db || !customerId) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "bookings");
  const q = query(
    colRef,
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as BookingItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to customer bookings:", err);
    callback([]);
  });
}

export async function fetchGuestBookingByRefAndEmail(
  reference: string,
  email: string
): Promise<BookingItem | null> {
  if (!reference || !email) return null;

  try {
    const response = await fetch("/api/bookings/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, email }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.booking as BookingItem;
  } catch (err) {
    console.warn("Error fetching guest booking by ref and email:", err);
    return null;
  }
}

export async function fetchAdminBookingsPage(
  options: BookingFilterOptions & { lastDoc?: QueryDocumentSnapshot | null }
): Promise<{ bookings: BookingItem[]; lastDoc: QueryDocumentSnapshot | null }> {
  const { status, category, limitCount = 25, lastDoc } = options;
  const db = getFirebaseClientDb();

  if (db) {
    const colRef = collection(db, "bookings");
    const constraints = [];
    if (status && status !== "all") {
      constraints.push(where("status", "==", status));
    }
    if (category && category !== "all") {
      constraints.push(where("categoryId", "==", category));
    }
    constraints.push(orderBy("createdAt", "desc"));
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    constraints.push(limit(limitCount));

    try {
      const snap = await getDocs(query(colRef, ...constraints));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BookingItem);
      if (items.length > 0) {
        const newLastDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
        return { bookings: items, lastDoc: newLastDoc };
      }
    } catch (err) {
      console.warn("Error fetching paginated admin bookings from Firestore, checking local API:", err);
    }
  }

  // Fallback to local store API so bookings submitted in dev/production always display
  try {
    const res = await fetch("/api/bookings/");
    if (res.ok) {
      const data = await res.json();
      let list: BookingItem[] = data.bookings || [];
      if (status && status !== "all") {
        list = list.filter((b) => b.status === status);
      }
      if (category && category !== "all") {
        list = list.filter((b) => b.categoryId === category);
      }
      return { bookings: list.slice(0, limitCount), lastDoc: null };
    }
  } catch (apiErr) {
    console.warn("Fallback fetch error:", apiErr);
  }

  return { bookings: [], lastDoc: null };
}

export function subscribeBookingDetail(
  bookingId: string,
  callback: (booking: BookingItem | null) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback(null);
    return () => {};
  }

  const docRef = doc(db, "bookings", bookingId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as BookingItem);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn("Error subscribing to booking detail:", err);
    callback(null);
  });
}

export function subscribeBookingEvents(
  bookingId: string,
  userRole: "admin" | "customer",
  callback: (events: BookingEventItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "bookings", bookingId, "events");
  const q = query(
    colRef,
    ...(userRole !== "admin" ? [where("visibility", "==", "customer")] : []),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as BookingEventItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to booking events:", err);
    callback([]);
  });
}

export function subscribeInternalNotes(
  bookingId: string,
  callback: (notes: InternalNoteItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "bookings", bookingId, "internalNotes");
  const q = query(colRef, orderBy("createdAt", "desc"), limit(50));

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as InternalNoteItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to internal notes:", err);
    callback([]);
  });
}

export async function fetchBookingCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {
    total: 0,
    new: 0,
    awaiting_confirmation: 0,
    confirmed: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  };

  const db = getFirebaseClientDb();
  if (db) {
    try {
      const colRef = collection(db, "bookings");
      const snap = await getDocs(query(colRef, limit(200)));
      if (snap.size > 0) {
        counts.total = snap.size;
        snap.docs.forEach((d) => {
          const data = d.data();
          const st = data.status as string;
          if (counts[st] !== undefined) {
            counts[st] += 1;
          }
        });
        return counts;
      }
    } catch (err) {
      console.warn("Error fetching booking counts from Firestore, checking local API:", err);
    }
  }

  // Fallback to local store API
  try {
    const res = await fetch("/api/bookings/");
    if (res.ok) {
      const data = await res.json();
      const list: BookingItem[] = data.bookings || [];
      counts.total = list.length;
      list.forEach((b) => {
        if (counts[b.status] !== undefined) {
          counts[b.status] += 1;
        }
      });
    }
  } catch (err) {
    // ignore
  }

  return counts;
}

export async function fetchBookingDetail(id: string): Promise<BookingItem | null> {
  const db = getFirebaseClientDb();
  if (db && id) {
    try {
      const docRef = doc(db, "bookings", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as BookingItem;
      }
    } catch (err) {
      console.warn("Error fetching booking detail from Firestore, checking local API:", err);
    }
  }

  // Fallback to local store API
  try {
    const res = await fetch("/api/bookings/");
    if (res.ok) {
      const data = await res.json();
      const list: BookingItem[] = data.bookings || [];
      const match = list.find((b) => b.id === id || b.reference === id);
      if (match) return match;
    }
  } catch (err) {
    // ignore
  }

  return null;
}
