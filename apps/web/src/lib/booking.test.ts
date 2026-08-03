import { describe, expect, it } from "vitest";
import { startingPrice } from "@/lib/booking";
import { statusTransitions } from "@/lib/booking-events";
describe("booking rules", () => { it("uses approved entry pricing", () => expect(startingPrice({ serviceCategory: "pest-control", serviceSlug: "rat-control" })).toBe(109)); it("prevents completed status changes", () => expect(statusTransitions.Completed).toEqual([])); });
