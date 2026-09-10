import { describe, it, expect } from "vitest";
import { generateBookingReferenceTransaction } from "./booking-reference";
import { type Transaction } from "firebase-admin/firestore";

describe("Booking Reference Generation Concurrency & Atomicity", () => {
  it("formats reference strings correctly with year and 6-digit sequence padding", async () => {
    const currentYear = new Date().getUTCFullYear();
    let mockSequence = 42;

    const mockTx = {
      get: async () => ({
        exists: true,
        data: () => ({ year: currentYear, lastSequence: mockSequence }),
      }),
      set: (_ref: unknown, data: { year: number; lastSequence: number }) => {
        mockSequence = data.lastSequence;
      },
    } as unknown as Transaction;

    const mockCounterRef = {} as unknown as Parameters<typeof generateBookingReferenceTransaction>[1];

    const ref = await generateBookingReferenceTransaction(mockTx, mockCounterRef);
    expect(ref).toBe(`BOS-${currentYear}-000043`);
    expect(mockSequence).toBe(43);
  });

  it("resets sequence to 1 on calendar year change", async () => {
    const currentYear = new Date().getUTCFullYear();
    let mockSequence = 999;

    const mockTx = {
      get: async () => ({
        exists: true,
        data: () => ({ year: 2025, lastSequence: mockSequence }),
      }),
      set: (_ref: unknown, data: { year: number; lastSequence: number }) => {
        mockSequence = data.lastSequence;
      },
    } as unknown as Transaction;

    const mockCounterRef = {} as unknown as Parameters<typeof generateBookingReferenceTransaction>[1];

    const ref = await generateBookingReferenceTransaction(mockTx, mockCounterRef);
    expect(ref).toBe(`BOS-${currentYear}-000001`);
    expect(mockSequence).toBe(1);
  });
});
