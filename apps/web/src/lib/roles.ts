import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { getFirebaseAdminAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import {
  actorOwnsResource,
  resourceTokenMatches,
  type ApiActor,
  type AppRole,
  type OwnedResource,
} from "@/lib/access-control";

export { actorOwnsResource, resourceTokenMatches } from "@/lib/access-control";
export type { ApiActor, AppRole, OwnedResource } from "@/lib/access-control";

function normalizeRole(value: unknown): AppRole | null {
  return value === "admin" || value === "staff" || value === "customer" ? value : null;
}

function readCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) {
      const value = rawValue.join("=");
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return null;
}

async function resolveRole(decoded: DecodedIdToken): Promise<AppRole> {
  const claimRole = normalizeRole(decoded.role);
  if (claimRole) return claimRole;

  const userSnapshot = await getFirebaseDb().collection("users").doc(decoded.uid).get();
  return normalizeRole(userSnapshot.data()?.role) ?? "customer";
}

export async function getRequestActor(request: Request): Promise<ApiActor | null> {
  if (!isFirebaseConfigured()) return null;

  const authorization = request.headers.get("authorization");
  const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/i);
  const bearerToken = bearerMatch?.[1]?.trim();
  const sessionCookie = readCookie(request, "bos_session");
  if (!bearerToken && !sessionCookie) return null;

  try {
    const auth = getFirebaseAdminAuth();
    const decoded = bearerToken
      ? await auth.verifyIdToken(bearerToken, true)
      : await auth.verifySessionCookie(sessionCookie as string, true);
    return {
      uid: decoded.uid,
      email: decoded.email?.toLowerCase(),
      role: await resolveRole(decoded),
    };
  } catch {
    return null;
  }
}

export async function requireAuthenticated(request: Request): Promise<ApiActor | null> {
  return getRequestActor(request);
}

export async function requireRole(request: Request, role: "admin" | "staff"): Promise<ApiActor | null> {
  const actor = await getRequestActor(request);
  if (!actor) return null;
  if (actor.role === "admin" || (role === "staff" && actor.role === "staff")) return actor;
  return null;
}

export function getResourceToken(request: Request): string | null {
  const headerToken = request.headers.get("x-resource-token")?.trim();
  if (headerToken) return headerToken;
  try {
    return new URL(request.url).searchParams.get("token")?.trim() || null;
  } catch {
    return null;
  }
}

export async function canAccessOwnedResource(request: Request, resource: OwnedResource | undefined): Promise<boolean> {
  const actor = await getRequestActor(request);
  return actorOwnsResource(actor, resource) || resourceTokenMatches(resource, getResourceToken(request));
}
