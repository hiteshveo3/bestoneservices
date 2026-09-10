import { readFile } from "node:fs/promises";
import { cert, applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

async function run() {
  const [targetIdentifier, roleArg = "admin"] = process.argv.slice(2);

  if (!targetIdentifier) {
    console.error("Usage: node scripts/provision-role.mjs <uid-or-email> [admin|customer]");
    process.exit(1);
  }

  const role = roleArg.toLowerCase();
  if (!["admin", "customer"].includes(role)) {
    console.error("Role must be 'admin' or 'customer'.");
    process.exit(1);
  }

  const credentialPath = process.env.FIREBASE_ADMIN_CREDENTIAL_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (credentialPath) {
    const serviceAccount = JSON.parse(await readFile(credentialPath, "utf8"));
    initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
  } else {
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "best-one-services",
    });
  }

  const auth = getAuth();
  const db = getFirestore();

  let targetUser;
  if (targetIdentifier.includes("@")) {
    targetUser = await auth.getUserByEmail(targetIdentifier);
  } else {
    targetUser = await auth.getUser(targetIdentifier);
  }

  // 1. Set Firebase Auth Custom Claim
  await auth.setCustomUserClaims(targetUser.uid, { role });

  // 2. Sync Firestore user document role
  await db.collection("users").doc(targetUser.uid).set(
    {
      uid: targetUser.uid,
      email: targetUser.email || null,
      displayName: targetUser.displayName || (targetUser.email ? targetUser.email.split("@")[0] : null),
      role,
      status: "active",
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`✅ Successfully assigned role "${role}" to user ${targetUser.email} (UID: ${targetUser.uid})`);
}

run().catch((err) => {
  console.error("❌ Failed to provision role:", err);
  process.exit(1);
});
