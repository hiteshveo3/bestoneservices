import { randomBytes } from "crypto";
import { type Transaction, type DocumentReference } from "firebase-admin/firestore";

/**
 * Generates an immutable booking reference string e.g., BOS-2026-84920
 */
export function generateBookingReference(): string {
  const currentYear = new Date().getUTCFullYear();
  return `BOS-${currentYear}-${randomBytes(10).toString("hex").toUpperCase()}`;
}

/**
 * Atomically generates an immutable, sequential booking reference e.g., BOS-2026-000001
 * Uses Firestore transaction on `bookingCounters/global` document.
 */
export async function generateBookingReferenceTransaction(
  tx: Transaction,
  counterRef: DocumentReference
): Promise<string> {
  const counterSnap = await tx.get(counterRef);
  const currentYear = new Date().getUTCFullYear();

  let nextSequence = 1;
  if (counterSnap.exists) {
    const data = counterSnap.data();
    const lastYear = data?.year ?? currentYear;
    if (lastYear === currentYear) {
      nextSequence = (data?.lastSequence ?? 0) + 1;
    } else {
      nextSequence = 1; // Reset sequence on new calendar year
    }
  }

  tx.set(counterRef, {
    year: currentYear,
    lastSequence: nextSequence,
    updatedAt: new Date(),
  }, { merge: true });

  const paddedSequence = String(nextSequence).padStart(6, "0");
  return `BOS-${currentYear}-${paddedSequence}`;
}
