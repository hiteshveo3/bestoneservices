/**
 * Reusable trust pill shown next to any price display site-wide.
 * Keep the wording identical everywhere — consistent phrasing is what makes
 * the "fixed price" positioning read as a policy rather than as page copy.
 */
export interface PricePromiseBadgeProps {
  /** Range-based pricing (hourly, per-incident) can't promise a single flat number. */
  variant?: "fixed" | "range";
  className?: string;
}

export function PricePromiseBadge({ variant = "fixed", className = "" }: PricePromiseBadgeProps) {
  const label =
    variant === "fixed"
      ? "Fixed price · No hidden fees · Confirmed before we arrive"
      : "Quoted upfront · No hidden fees · Confirmed before we arrive";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EAF8D6] text-[#1D201E] text-xs font-semibold ${className}`}
    >
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#B7F56A] shrink-0" />
      <span>{label}</span>
    </span>
  );
}
