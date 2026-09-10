/**
 * The ONLY continuous/looping animation sanctioned on this site.
 *
 * Use exclusively for a genuine live-status indicator (e.g. the phone line
 * is staffed right now) on a small dot. Never on a badge, button, price or
 * any larger element, and never to manufacture urgency — no countdowns, no
 * "3 slots left" pulses. If the status is not literally live, use a static
 * dot instead.
 */
export function LiveDot({ className = "", label }: { className?: string; label?: string }) {
  return (
    <span
      className={`live-dot inline-block w-2 h-2 rounded-full bg-[#99D055] shrink-0 ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
