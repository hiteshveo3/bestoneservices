import { describe, it, expect } from "vitest";
import { 
  generateConversationId, 
  generateLogId, 
  formatTriggerMessage 
} from "./communication-domain";

describe("Phase 10 Communications & Notification Domain Rules", () => {

  describe("generateConversationId & generateLogId", () => {
    it("generates a cryptographically strong conversation ID", () => {
      const id = generateConversationId();
      expect(id).toMatch(/^CNV-\d{4}-[A-F0-9]{20}$/);
    });

    it("generates a cryptographically strong log ID", () => {
      const id = generateLogId();
      expect(id).toMatch(/^LOG-\d{4}-[A-F0-9]{20}$/);
    });
  });

  describe("formatTriggerMessage", () => {
    it("generates correct template text for booking_confirmation", () => {
      const text = formatTriggerMessage("booking_confirmation", "BOS-2026-88990");
      expect(text).toContain("BOS-2026-88990");
      expect(text).toContain("confirmed");
    });

    it("generates correct template text for staff_dispatched", () => {
      const text = formatTriggerMessage("staff_dispatched", "BOS-2026-88990");
      expect(text).toContain("BOS-2026-88990");
      expect(text).toContain("en route");
    });

    it("generates correct template text for re_clean_approved", () => {
      const text = formatTriggerMessage("re_clean_approved", "BOS-2026-88990");
      expect(text).toContain("BOS-2026-88990");
      expect(text).toContain("Re-Clean Guarantee");
    });
  });

});
