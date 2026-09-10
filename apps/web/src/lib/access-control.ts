import { timingSafeEqual } from "crypto";

export type AppRole = "admin" | "staff" | "customer";

export interface ApiActor {
  uid: string;
  email?: string;
  role: AppRole;
}

export type OwnedResource = {
  customerId?: unknown;
  customerUid?: unknown;
  userId?: unknown;
  customerEmail?: unknown;
  email?: unknown;
  emailLower?: unknown;
  customerSnapshot?: { email?: unknown } | null;
  accessToken?: unknown;
};

export function actorOwnsResource(actor: ApiActor | null, resource: OwnedResource | undefined): boolean {
  if (!actor || !resource) return false;
  if (actor.role === "admin") return true;

  const ownerIds = [resource.customerId, resource.customerUid, resource.userId]
    .filter((value): value is string => typeof value === "string");
  if (ownerIds.includes(actor.uid)) return true;

  if (!actor.email) return false;
  const ownerEmails = [
    resource.customerEmail,
    resource.email,
    resource.emailLower,
    resource.customerSnapshot?.email,
  ]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().toLowerCase());
  return ownerEmails.includes(actor.email.toLowerCase());
}

export function resourceTokenMatches(resource: OwnedResource | undefined, suppliedToken: string | null): boolean {
  if (!resource || typeof resource.accessToken !== "string" || !suppliedToken) return false;
  const expected = Buffer.from(resource.accessToken);
  const supplied = Buffer.from(suppliedToken);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
