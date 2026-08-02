import { describe, expect, it } from "vitest";
import { reviewRequestSchedule } from "@/lib/automation";
describe("review scheduling", () => { it("schedules a neutral request after completion", () => expect(reviewRequestSchedule("Completed", new Date("2026-01-01T00:00:00Z"))?.toISOString()).toBe("2026-01-01T02:00:00.000Z")); it("does not schedule before completion", () => expect(reviewRequestSchedule("Confirmed", new Date())).toBeNull()); });
