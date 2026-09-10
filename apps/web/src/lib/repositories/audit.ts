/**
 * Best One Services - Trusted Audit Logging Architecture
 * Handles immutable, server-side security audit events (pricing changes, admin role grants, booking cancellations)
 */

import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase-client";

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: "admin" | "system";
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp | null;
}

const AUDIT_COLLECTION = "auditLogs";

/**
 * Record a trusted security audit log event
 */
export async function logSecurityAudit(
  actorId: string,
  actorEmail: string,
  actorRole: "admin" | "system",
  action: string,
  targetEntity: string,
  targetId: string,
  details: string,
  metadata: Record<string, unknown> = {}
): Promise<string | null> {
  const db = getFirebaseClientDb();
  if (!db) return null;

  try {
    const colRef = collection(db, AUDIT_COLLECTION);
    const res = await addDoc(colRef, {
      actorId,
      actorEmail,
      actorRole,
      action,
      targetEntity,
      targetId,
      details,
      metadata,
      createdAt: serverTimestamp(),
    });
    return res.id;
  } catch (err) {
    console.error("Error logging security audit:", err);
    return null;
  }
}

/**
 * Query trusted security audit logs (Admin Console only)
 */
export async function getSecurityAuditLogs(limitCount = 20): Promise<AuditLogItem[]> {
  const db = getFirebaseClientDb();
  if (!db) return [];

  try {
    const colRef = collection(db, AUDIT_COLLECTION);
    const q = query(colRef, orderBy("createdAt", "desc"), limit(limitCount));
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        actorId: data.actorId || "system",
        actorEmail: data.actorEmail || "system@bestoneservices.co.uk",
        actorRole: data.actorRole || "system",
        action: data.action || "",
        targetEntity: data.targetEntity || "",
        targetId: data.targetId || "",
        details: data.details || "",
        metadata: data.metadata || {},
        createdAt: data.createdAt || null,
      };
    });
  } catch (err) {
    console.warn("Security audit logs fetch warning:", err);
    return [];
  }
}
