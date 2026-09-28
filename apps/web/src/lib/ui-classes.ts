/**
 * Shared secondary-button treatment for white/near-white "outline" CTAs
 * (e.g. "Call Us" next to a primary lime CTA) that would otherwise sit
 * white-on-white against a white card/section. Border strengthened to the
 * on-brand lime (#B7F56A), which defines the control on its own. No shadow:
 * buttons on this site are flat, and hover is an opacity shift only.
 */
export const SECONDARY_BUTTON_CLASS =
  "bg-white border border-[#ECEAE3] text-[#1D201E] hover:opacity-90 transition-opacity duration-150 cursor-pointer";

/**
 * Sidebar secondary Call Us button style across the entire site:
 * Soft mint-lime background (#EAF8D6) with lime border (#B7F56A) and dark green text (#1D201E).
 */
export const SIDEBAR_CALL_BUTTON_CLASS =
  "bg-[#EAF8D6] border border-[#ECEAE3] text-[#1D201E] hover:bg-[#A2EA4E] transition-colors duration-150 cursor-pointer";
