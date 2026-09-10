"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User 
} from "firebase/auth";
import { getFirebaseClientAuth, googleProvider } from "@/lib/firebase-client";
import { reconcileUserProfile } from "@/lib/user-service";
import { type UserProfile, type UserRole } from "@/types/user";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginWithGoogle: () => Promise<User | null>;
  loginWithEmail: (email: string, pass: string) => Promise<User | null>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<User | null>;
  sendPasswordReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function formatAuthError(code: string): string {
  switch (code) {
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
      console.error("[Firebase Auth Config Error] Invalid Firebase Web API key configured.");
      return "Account services are temporarily undergoing maintenance. Please try again shortly.";
    case "auth/unauthorized-domain":
      console.error("[Firebase Auth Config Error] Authorized domain restriction error on Firebase Console.");
      return "Authentication is not authorized for this domain. Please contact support.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password. If you haven't created an account yet, please click 'Create account' below.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please log in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing.";
    case "auth/popup-blocked":
      return "Google sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Access temporarily disabled. Try again later.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection and try again.";
    default:
      return "An unexpected authentication error occurred. Please check your details and try again.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>("customer");
  const [isAdminClaim, setIsAdminClaim] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const verifyAdminClaim = async (authUser: User): Promise<boolean> => {
    try {
      const tokenResult = await authUser.getIdTokenResult();
      return tokenResult.claims.role === "admin";
    } catch {
      return false;
    }
  };

  const syncSession = async (authUser: User) => {
    try {
      const idToken = await authUser.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    } catch {
      // Session sync optional fallback
    }
  };

  const clearSession = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Logout session clear fallback
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    const prof = await reconcileUserProfile(user);
    const hasAdminClaim = await verifyAdminClaim(user);
    setProfile(prof);
    setIsAdminClaim(hasAdminClaim);
    setRole(hasAdminClaim ? "admin" : "customer");
  };

  useEffect(() => {
    const auth = getFirebaseClientAuth();
    if (!auth) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          await syncSession(authUser);
          const prof = await reconcileUserProfile(authUser);
          const hasAdminClaim = await verifyAdminClaim(authUser);
          setProfile(prof);
          setIsAdminClaim(hasAdminClaim);
          setRole(hasAdminClaim ? "admin" : "customer");
        } catch (e) {
          console.error("Failed to load user profile:", e);
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole("customer");
        setIsAdminClaim(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<User | null> => {
    setError(null);
    const auth = getFirebaseClientAuth();
    if (!auth) {
      setError("Firebase auth is not initialized.");
      return null;
    }

    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncSession(res.user);
      const prof = await reconcileUserProfile(res.user);
      const hasAdminClaim = await verifyAdminClaim(res.user);
      setUser(res.user);
      setProfile(prof);
      setIsAdminClaim(hasAdminClaim);
      setRole(hasAdminClaim ? "admin" : "customer");
      return res.user;
    } catch (err: unknown) {
      const errorObj = err as { code?: string };
      console.error("Google login error:", err);
      setError(formatAuthError(errorObj.code || ""));
      return null;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setError(null);
    const auth = getFirebaseClientAuth();
    if (!auth) {
      setError("Firebase auth is not initialized.");
      return null;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      await syncSession(res.user);
      const prof = await reconcileUserProfile(res.user);
      const hasAdminClaim = await verifyAdminClaim(res.user);
      setUser(res.user);
      setProfile(prof);
      setIsAdminClaim(hasAdminClaim);
      setRole(hasAdminClaim ? "admin" : "customer");
      return res.user;
    } catch (err: unknown) {
      const errorObj = err as { code?: string };
      console.error("Email login error:", err);
      setError(formatAuthError(errorObj.code || ""));
      return null;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string): Promise<User | null> => {
    setError(null);
    const auth = getFirebaseClientAuth();
    if (!auth) {
      setError("Firebase auth is not initialized.");
      return null;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (name.trim()) {
        await updateProfile(res.user, { displayName: name.trim() });
      }
      await syncSession(res.user);
      const prof = await reconcileUserProfile(res.user, "customer");
      setUser(res.user);
      setProfile(prof);
      setIsAdminClaim(false);
      setRole("customer");
      return res.user;
    } catch (err: unknown) {
      const errorObj = err as { code?: string };
      console.error("Registration error:", err);
      setError(formatAuthError(errorObj.code || ""));
      return null;
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setError(null);
    const auth = getFirebaseClientAuth();
    if (!auth) {
      setError("Firebase auth is not initialized.");
      return false;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err: unknown) {
      const errorObj = err as { code?: string };
      console.error("Password reset error:", err);
      setError(formatAuthError(errorObj.code || ""));
      return false;
    }
  };

  const signOutUser = async () => {
    setError(null);
    const auth = getFirebaseClientAuth();
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
    await clearSession();
    setUser(null);
    setProfile(null);
    setRole("customer");
    setIsAdminClaim(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin: isAdminClaim,
        loading,
        error,
        clearError,
        signOutUser,
        refreshProfile,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
