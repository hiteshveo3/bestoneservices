/**
 * The site's only loading indicator: a plain rotating ring in brand green.
 * Continuous rotation is acceptable here because it is bounded by a real
 * pending operation — it stops the moment the response lands.
 *
 * Under prefers-reduced-motion the ring stops spinning (see globals.css)
 * and the accompanying text carries the meaning, so it stays accessible.
 */
export function Spinner({
  size = 20,
  className = "",
  tone = "brand",
  label = "Loading",
}: {
  size?: number;
  className?: string;
  /** "brand" on light surfaces, "on-dark" on the dark green buttons. */
  tone?: "brand" | "on-dark";
  label?: string;
}) {
  const ring =
    tone === "on-dark"
      ? "border-[#ECEAE3]/30 border-t-[#ECEAE3]"
      : "border-[#1D201E]/25 border-t-[#1D201E]";

  return (
    <span
      role="status"
      aria-label={label}
      style={{ width: size, height: size }}
      className={`inline-block shrink-0 rounded-full border-2 ${ring} ui-spinner ${className}`}
    />
  );
}
