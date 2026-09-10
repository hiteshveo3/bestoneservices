import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { type User } from "firebase/auth";
import { getFirebaseClientDb } from "@/lib/firebase-client";
import { type UserProfile, type UserRole } from "@/types/user";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseClientDb();
  if (!db) return null;

  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
}

export async function reconcileUserProfile(
  authUser: User, 
  requestedRole: UserRole = "customer"
): Promise<UserProfile> {
  const db = getFirebaseClientDb();
  
  // Basic in-memory fallback if Firestore is unreachable
  const fallbackProfile: UserProfile = {
    uid: authUser.uid,
    email: authUser.email,
    displayName: authUser.displayName || (authUser.email ? authUser.email.split("@")[0] : "Customer"),
    photoURL: authUser.photoURL || null,
    phone: authUser.phoneNumber || null,
    role: requestedRole,
    status: "active",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    lastLoginAt: Timestamp.now(),
  };

  if (!db) return fallbackProfile;

  try {
    const tokenResult = await authUser.getIdTokenResult();
    const isCustomClaimAdmin = tokenResult.claims.role === "admin";

    const userDocRef = doc(db, "users", authUser.uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const existingData = snap.data() as UserProfile;
      const finalRole: UserRole = isCustomClaimAdmin ? "admin" : existingData.role || "customer";

      const updates = {
        email: authUser.email || existingData.email,
        displayName: existingData.displayName || authUser.displayName,
        photoURL: authUser.photoURL || existingData.photoURL || null,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: finalRole,
      };

      await updateDoc(userDocRef, updates);

      return {
        ...existingData,
        ...updates,
        role: finalRole,
      };
    } else {
      const initialRole: UserRole = isCustomClaimAdmin ? "admin" : requestedRole;

      const newProfileData: UserProfile = {
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName || (authUser.email ? authUser.email.split("@")[0] : "Customer"),
        photoURL: authUser.photoURL || null,
        phone: authUser.phoneNumber || null,
        role: initialRole,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };

      await setDoc(userDocRef, newProfileData);
      return newProfileData;
    }
  } catch (err) {
    console.warn("Firestore user profile sync warning (falling back to memory profile):", err);
    return fallbackProfile;
  }
}

export async function updateUserProfileDetails(
  uid: string,
  details: { displayName?: string; phone?: string }
): Promise<boolean> {
  const db = getFirebaseClientDb();
  if (!db) return false;

  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      ...details,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("Error updating profile details:", err);
    return false;
  }
}
