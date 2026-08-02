import { readFile } from "node:fs/promises";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const [uid, role, email] = process.argv.slice(2);
const credentialPath = process.env.FIREBASE_ADMIN_CREDENTIAL_PATH;
if (!uid || !role || !email || !credentialPath) throw new Error("Usage: FIREBASE_ADMIN_CREDENTIAL_PATH=... node scripts/provision-role.mjs <uid> <admin|staff> <email>");
if (!new Set(["admin", "staff"]).has(role)) throw new Error("Role must be admin or staff.");
const serviceAccount = JSON.parse(await readFile(credentialPath, "utf8"));
initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
await getAuth().setCustomUserClaims(uid, { role });
await getFirestore().collection("users").doc(uid).set({ role, email: email.toLowerCase(), active: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
console.log(`Provisioned ${role} role for ${uid}`);
