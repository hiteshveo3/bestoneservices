"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: apiKey || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "best-one-services.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "best-one-services",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "best-one-services.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "806389487920",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:806389487920:web:5a6c2df8d9e39c60e950f5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HFFBM54VD9",
};

export const isFirebaseClientConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.startsWith("AIzaSy") && 
  firebaseConfig.projectId && 
  firebaseConfig.appId
);

export function getFirebaseClientApp(): FirebaseApp | null {
  if (typeof window === "undefined" && !isFirebaseClientConfigured) return null;

  if (!isFirebaseClientConfigured) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[FATAL FIREBASE CONFIG ERROR] Missing or invalid NEXT_PUBLIC_FIREBASE_API_KEY in apps/web/.env.local. " +
        "Please configure a valid Web API key starting with 'AIzaSy'."
      );
    }
    return null;
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseClientAuth(): Auth | null {
  const app = getFirebaseClientApp();
  return app ? getAuth(app) : null;
}

export function getFirebaseClientDb(): Firestore | null {
  const app = getFirebaseClientApp();
  return app ? getFirestore(app) : null;
}

export function getFirebaseClientStorage(): FirebaseStorage | null {
  const app = getFirebaseClientApp();
  return app ? getStorage(app) : null;
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
