import { describe, it, expect } from "vitest";
import { formatUKDate, formatUKTime, isBST } from "./timezone";

describe("UK Timezone Architecture (Europe/London)", () => {
  it("correctly identifies BST (British Summer Time, UTC+1) in August", () => {
    const summerDate = new Date("2026-08-07T12:00:00Z");
    expect(isBST(summerDate)).toBe(true);
  });

  it("correctly identifies GMT (Standard Time, UTC+0) in January", () => {
    const winterDate = new Date("2026-01-15T12:00:00Z");
    expect(isBST(winterDate)).toBe(false);
  });

  it("formats dates explicitly in Europe/London timezone", () => {
    const date = new Date("2026-08-07T14:30:00Z");
    const formattedDate = formatUKDate(date);
    expect(formattedDate).toContain("2026");
    expect(formattedDate).toContain("Aug");
  });

  it("applies correct GMT/BST suffix to time strings", () => {
    const summerDate = new Date("2026-08-07T14:30:00Z");
    const winterDate = new Date("2026-01-15T14:30:00Z");
    expect(formatUKTime(summerDate)).toContain("BST");
    expect(formatUKTime(winterDate)).toContain("GMT");
  });
});
