import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  type Unsubscribe 
} from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { 
  type ServicePackageItem, 
  type GlobalPricingRules, 
  type ServiceStatus 
} from "@/types/service";

export function subscribeAdminServices(
  statusFilter: ServiceStatus | "all" = "all",
  callback: (services: ServicePackageItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "services");
  const constraints = [];
  if (statusFilter !== "all") {
    constraints.push(where("status", "==", statusFilter));
  }
  constraints.push(orderBy("updatedAt", "desc"));
  constraints.push(limit(100));

  const q = query(colRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServicePackageItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to admin services:", err);
    callback([]);
  });
}

export function subscribePublishedServices(
  categoryId?: "cleaning" | "pest" | "gardening" | "removals" | "all",
  callback?: (services: ServicePackageItem[]) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db || !callback) {
    if (callback) callback([]);
    return () => {};
  }

  const colRef = collection(db, "services");
  const constraints = [where("status", "==", "published")];
  if (categoryId && categoryId !== "all") {
    constraints.push(where("categoryId", "==", categoryId));
  }

  const q = query(colRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ServicePackageItem);
    callback(items);
  }, (err) => {
    console.warn("Error subscribing to published services:", err);
    callback([]);
  });
}

export function subscribeServiceDetail(
  serviceId: string,
  callback: (service: ServicePackageItem | null) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback(null);
    return () => {};
  }

  const docRef = doc(db, "services", serviceId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as ServicePackageItem);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn("Error subscribing to service detail:", err);
    callback(null);
  });
}

export function subscribeGlobalPricingRules(
  callback: (rules: GlobalPricingRules | null) => void
): Unsubscribe {
  const db = getFirebaseClientDb();
  if (!db) {
    callback(null);
    return () => {};
  }

  const docRef = doc(db, "config", "pricing_engine");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as GlobalPricingRules);
    } else {
      // Default initial fallback rules if document not created yet
      callback({
        id: "pricing_engine",
        weekendMultiplier: 1.15,
        nightEmergencySurchargePence: 5000,
        minimumDomesticChargePence: 6000,
        vatRatePercentage: 20,
      });
    }
  }, (err) => {
    console.warn("Error subscribing to global pricing rules:", err);
    callback(null);
  });
}
