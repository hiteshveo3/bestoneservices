import "server-only";

import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export function isFirebaseConfigured() {
  const hasServiceAccount = Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );

  return Boolean(
    hasServiceAccount ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.FIREBASE_CONFIG ||
      process.env.GOOGLE_CLOUD_PROJECT,
  );
}

export function getFirebaseApp() {
  const currentApp = getApps()[0];
  if (currentApp) return currentApp;

  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    ...(projectId ? { projectId } : {}),
  });
}

export function getFirebaseDb() {
  if (!isFirebaseConfigured()) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }

  return getFirestore(getFirebaseApp());
}

export function getFirebaseAdminAuth() {
  if (!isFirebaseConfigured()) throw new Error("FIREBASE_NOT_CONFIGURED");
  return getAuth(getFirebaseApp());
}
