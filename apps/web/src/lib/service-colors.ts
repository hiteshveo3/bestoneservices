/**
 * Service line colours. Each trio is scoped to exactly one service and must never
 * appear outside that service's own context — never as a general button, a global
 * link colour, or a footer accent. Buttons inside a service card stay blue-500.
 *
 *   base (500) = icon fill, page eyebrow, quote line-item marker
 *   tint  (50) = service card background, hero band on that service's page
 *   ink  (900) = text placed on the tint
 */
export type ServiceLine = "cleaning" | "pest-control" | "gardening" | "removals";

export interface ServiceTrio {
  /** icon fill, eyebrow, line-item marker */
  base: string;
  /** card background, hero band */
  tint: string;
  /** text on the tint */
  ink: string;
  /** hairline on the tint */
  border: string;
}

const TRIOS: Record<ServiceLine, ServiceTrio> = {
  cleaning:      { base: "bg-clean-500",  tint: "bg-clean-50",  ink: "text-clean-900",  border: "border-clean-500" },
  "pest-control":{ base: "bg-pest-500",   tint: "bg-pest-50",   ink: "text-pest-900",   border: "border-pest-500" },
  gardening:     { base: "bg-garden-500", tint: "bg-garden-50", ink: "text-garden-900", border: "border-garden-500" },
  removals:      { base: "bg-move-500",   tint: "bg-move-50",   ink: "text-move-900",   border: "border-move-500" },
};

/** Neutral fallback for anything that is not one of the four service lines. */
const NEUTRAL: ServiceTrio = {
  base: "bg-ink-900", tint: "bg-white", ink: "text-ink-900", border: "border-[#E5FBC9]",
};

/**
 * Resolve a trio from any service or category slug. Pest control has no dedicated
 * route — it is reached through /[category]/[service] — so it is matched on the
 * slug rather than scoped to a folder.
 */
export function serviceTrio(slug: string | undefined | null): ServiceTrio {
  if (!slug) return NEUTRAL;
  const s = slug.toLowerCase();
  if (s.includes("pest") || s.includes("rat") || s.includes("mouse") || s.includes("bed-bug")
      || s.includes("cockroach") || s.includes("wasp")) return TRIOS["pest-control"];
  if (s.includes("clean")) return TRIOS.cleaning;
  if (s.includes("garden") || s.includes("lawn") || s.includes("hedge")) return TRIOS.gardening;
  if (s.includes("removal") || s.includes("move") || s.includes("man-and-van")) return TRIOS.removals;
  return NEUTRAL;
}
