import "server-only";

import { createHash } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { getFirebaseDb } from "@/lib/firebase-admin";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function getRequestFingerprint(request: Request, subject: string): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const platformIp = request.headers.get("x-real-ip")?.trim();
  return `${forwardedFor || platformIp || "unknown"}:${subject.trim().toLowerCase()}`;
}

export async function enforceRateLimit(input: {
  namespace: string;
  fingerprint: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const now = Date.now();
  const key = createHash("sha256")
    .update(`${input.namespace}:${input.fingerprint}`)
    .digest("hex");
  const ref = getFirebaseDb().collection("rateLimits").doc(key);

  return getFirebaseDb().runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const data = snapshot.data();
    const windowStartedAt = Number(data?.windowStartedAtMs || 0);
    const expired = !snapshot.exists || now - windowStartedAt >= input.windowMs;

    if (expired) {
      tx.set(ref, {
        namespace: input.namespace,
        count: 1,
        windowStartedAtMs: now,
        expiresAt: Timestamp.fromMillis(now + input.windowMs),
      });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    const count = Number(data?.count || 0);
    const retryAfterSeconds = Math.max(1, Math.ceil((input.windowMs - (now - windowStartedAt)) / 1000));
    if (count >= input.limit) return { allowed: false, retryAfterSeconds };

    tx.update(ref, { count: count + 1 });
    return { allowed: true, retryAfterSeconds: 0 };
  });
}
