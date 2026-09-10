import { describe, expect, it } from "vitest";
import { actorOwnsResource, resourceTokenMatches, type ApiActor } from "./access-control";

const customer: ApiActor = {
  uid: "customer-a",
  email: "owner@example.com",
  role: "customer",
};

describe("resource authorization boundary", () => {
  it("allows the authenticated owner by canonical uid", () => {
    expect(actorOwnsResource(customer, { customerId: "customer-a" })).toBe(true);
  });

  it("allows a legacy owner email case-insensitively", () => {
    expect(actorOwnsResource(customer, { customerSnapshot: { email: " Owner@Example.com " } })).toBe(true);
  });

  it("denies anonymous and cross-customer access", () => {
    expect(actorOwnsResource(null, { customerId: "customer-a" })).toBe(false);
    expect(actorOwnsResource(customer, { customerId: "customer-b", customerEmail: "other@example.com" })).toBe(false);
  });

  it("allows an administrator without weakening customer checks", () => {
    expect(actorOwnsResource({ uid: "admin-a", role: "admin" }, { customerId: "customer-b" })).toBe(true);
    expect(actorOwnsResource({ uid: "staff-a", role: "staff" }, { customerId: "customer-b" })).toBe(false);
  });

  it("accepts only an exact resource capability token", () => {
    const resource = { accessToken: "secret-capability-token" };
    expect(resourceTokenMatches(resource, "secret-capability-token")).toBe(true);
    expect(resourceTokenMatches(resource, "secret-capability-tokeN")).toBe(false);
    expect(resourceTokenMatches(resource, "short"),).toBe(false);
    expect(resourceTokenMatches(resource, null)).toBe(false);
  });
});
