import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fsRulesMatrixValidator } from "./firestore-rules-matrix";

const projectRoot = resolve(process.cwd(), "..", "..");
const deployedRules = readFileSync(resolve(projectRoot, "firestore.rules"), "utf8");
const firebaseConfig = JSON.parse(readFileSync(resolve(projectRoot, "firebase.json"), "utf8")) as {
  firestore?: { rules?: string };
};

describe("Firestore Security Rules A/B/Admin/Anonymous Authorization Matrix", () => {
  const customerA = { uid: "user_a_123", role: "customer" };
  const customerB = { uid: "user_b_456", role: "customer" };
  const adminUser = { uid: "admin_789", role: "admin" };
  const anonymous = null;

  const bookingDocA = {
    id: "booking_101",
    customerId: "user_a_123",
    status: "new",
    pricing: { estimateMinPence: 18000 },
  };

  it("permits Customer A to read their own booking document", () => {
    const res = fsRulesMatrixValidator.canReadBooking(customerA, bookingDocA);
    expect(res.allowed).toBe(true);
  });

  it("denies Customer B from reading Customer A booking document", () => {
    const res = fsRulesMatrixValidator.canReadBooking(customerB, bookingDocA);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("CROSS_CUSTOMER_READ_DENIED");
  });

  it("denies Anonymous caller from reading any booking document", () => {
    const res = fsRulesMatrixValidator.canReadBooking(anonymous, bookingDocA);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("UNAUTHENTICATED_READ_DENIED");
  });

  it("denies Customer A from writing/updating direct status or pricing on booking", () => {
    const res = fsRulesMatrixValidator.canWriteBooking(customerA);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("CUSTOMER_DIRECT_WRITE_DENIED");
  });

  it("strictly denies Customer A from reading internalNotes subcollection", () => {
    const res = fsRulesMatrixValidator.canReadInternalNotes(customerA);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("ADMIN_ONLY_SUBCOLLECTION");
  });

  it("strictly denies Customer A from reading auditLogs collection", () => {
    const res = fsRulesMatrixValidator.canReadAuditLogs(customerA);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("ADMIN_ONLY_COLLECTION");
  });

  it("denies Customer A from reading Customer B notifications", () => {
    const notificationB = { id: "notif_1", recipientId: "user_b_456" };
    const res = fsRulesMatrixValidator.canReadNotification(customerA, notificationB);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("RECIPIENT_MISMATCH_DENIED");
  });

  it("allows Admin to read and write any booking, internal notes, and audit logs", () => {
    expect(fsRulesMatrixValidator.canReadBooking(adminUser, bookingDocA).allowed).toBe(true);
    expect(fsRulesMatrixValidator.canWriteBooking(adminUser).allowed).toBe(true);
    expect(fsRulesMatrixValidator.canReadInternalNotes(adminUser).allowed).toBe(true);
    expect(fsRulesMatrixValidator.canReadAuditLogs(adminUser).allowed).toBe(true);
  });

  it("points Firebase deployment at the audited fail-closed ruleset", () => {
    expect(firebaseConfig.firestore?.rules).toBe("firestore.rules");
    expect(deployedRules).toContain("match /{document=**} { allow read, write: if false; }");
  });

  it("keeps sensitive client writes server-only in the deployed rules", () => {
    expect(deployedRules).toContain("match /bookings/{bookingId}");
    expect(deployedRules).toContain("match /invoices/{invoiceId}");
    expect(deployedRules).toContain("match /estimates/{estimateId}");
    expect(deployedRules).toContain("match /disputes/{disputeId}");
    expect(deployedRules.match(/allow write: if false;/g)?.length ?? 0).toBeGreaterThanOrEqual(8);
  });
});
