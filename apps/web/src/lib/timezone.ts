/**
 * Best One Services - Centralized Timezone Utility
 * Canonical business timezone: Europe/London (GMT/BST)
 */

import { Timestamp } from "firebase/firestore";

export const BUSINESS_TIMEZONE = "Europe/London";

/**
 * Converts a Timestamp, Date, or millisecond timestamp into a Date object
 */
export function parseToDate(input: Timestamp | Date | number | null | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === "number") return new Date(input);
  if (typeof (input as Timestamp).toDate === "function") {
    return (input as Timestamp).toDate();
  }
  return null;
}

/**
 * Determines whether British Summer Time (BST, UTC+1) is active for a given date
 */
export function isBST(date: Date = new Date()): boolean {
  const d = parseToDate(date) || new Date();
  const year = d.getUTCFullYear();

  // Last Sunday of March (BST Starts at 01:00 UTC)
  const bstStart = new Date(Date.UTC(year, 2, 31));
  bstStart.setUTCDate(31 - bstStart.getUTCDay());
  bstStart.setUTCHours(1, 0, 0, 0);

  // Last Sunday of October (BST Ends at 01:00 UTC)
  const bstEnd = new Date(Date.UTC(year, 9, 31));
  bstEnd.setUTCDate(31 - bstEnd.getUTCDay());
  bstEnd.setUTCHours(1, 0, 0, 0);

  return d >= bstStart && d < bstEnd;
}

/**
 * Formats a timestamp into human-readable UK business time string
 */
export function formatUKDateTime(
  input: Timestamp | Date | number | null | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const date = parseToDate(input);
  if (!date) return "N/A";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: BUSINESS_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...options,
  };

  return new Intl.DateTimeFormat("en-GB", defaultOptions).format(date);
}

/**
 * Formats a date for UK business time only (e.g. "7 Aug 2026")
 */
export function formatUKDate(input: Timestamp | Date | number | null | undefined): string {
  return formatUKDateTime(input, { hour: undefined, minute: undefined, hour12: undefined });
}

/**
 * Formats a timestamp for UK business time only (e.g. "02:30 PM BST")
 */
export function formatUKTime(input: Timestamp | Date | number | null | undefined): string {
  const formatted = formatUKDateTime(input, { day: undefined, month: undefined, year: undefined });
  const date = parseToDate(input);
  const tzSuffix = date ? (isBST(date) ? "BST" : "GMT") : "";
  return `${formatted} ${tzSuffix}`.trim();
}
