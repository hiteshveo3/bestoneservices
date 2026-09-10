export interface CoverageCheckResult {
  status: "AVAILABLE" | "NEEDS_CONFIRMATION";
  postcode: string;
  outcode: string;
  message: string;
}

// Configured London & M25 Outcode Hubs
export const COVERED_OUTCODES = new Set([
  // EAST & ESSEX BORDERS (Ilford, Barking, Newham, Redbridge)
  "E1", "E2", "E3", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18", "E20",
  "IG1", "IG2", "IG3", "IG4", "IG5", "IG6", "IG7", "IG8", "IG9", "IG11",
  "RM1", "RM2", "RM3", "RM4", "RM5", "RM6", "RM7", "RM8", "RM9", "RM10", "RM11", "RM12", "RM13", "RM14",
  // NORTH LONDON
  "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10", "N11", "N12", "N13", "N14", "N15", "N16", "N17", "N18", "N19", "N20", "N21", "N22",
  "EN1", "EN2", "EN3", "EN4", "EN5",
  // SOUTH LONDON & KENT BORDERS
  "SE1", "SE3", "SE4", "SE5", "SE6", "SE7", "SE8", "SE9", "SE10", "SE11", "SE12", "SE13", "SE14", "SE15", "SE16", "SE17", "SE18", "SE19", "SE20", "SE21", "SE22", "SE23", "SE24", "SE25", "SE26", "SE27", "SE28",
  "DA1", "DA5", "DA6", "DA7", "DA8", "DA14", "DA15", "DA16",
  // WEST & CENTRAL LONDON
  "W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12", "W14",
  "WC1", "WC2", "EC1", "EC2", "EC3", "EC4",
  "SW1", "SW2", "SW3", "SW4", "SW5", "SW6", "SW7", "SW8", "SW9", "SW10", "SW11", "SW12", "SW13", "SW14", "SW15", "SW16", "SW17", "SW18", "SW19", "SW20",
  "NW1", "NW2", "NW3", "NW4", "NW5", "NW6", "NW7", "NW8", "NW9", "NW10", "NW11",
  "HA0", "HA1", "HA2", "HA3", "HA8", "HA9",
  "UB1", "UB2", "UB3", "UB4", "UB5", "UB6", "UB7", "UB8", "UB10",
  "TW1", "TW2", "TW3", "TW7", "TW8", "TW9", "TW10"
]);

/**
 * Normalizes UK postcode input: "e15 2ab" -> "E15 2AB", "sw1a1aa" -> "SW1A 1AA"
 */
export function normalizePostcode(raw: string): string {
  const clean = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (clean.length < 5) return clean;
  // Standard UK outward (3-4 chars) + inward (3 chars)
  const inward = clean.slice(-3);
  const outward = clean.slice(0, -3);
  return `${outward} ${inward}`;
}

/**
 * Extracts Outcode (e.g. "E15" from "E15 2AB" or "IG1" from "IG1 1AA")
 */
export function getOutcode(postcode: string): string {
  const normalized = normalizePostcode(postcode);
  const parts = normalized.split(" ");
  return parts[0] || normalized;
}

/**
 * Check service availability against centralized coverage data
 */
export function checkPostcodeAvailability(rawPostcode: string, serviceName = "Best One Services"): CoverageCheckResult {
  const normalized = normalizePostcode(rawPostcode);
  const outcode = getOutcode(normalized);

  if (COVERED_OUTCODES.has(outcode)) {
    return {
      status: "AVAILABLE",
      postcode: normalized,
      outcode,
      message: `${serviceName} is available in ${outcode}`,
    };
  }

  return {
    status: "NEEDS_CONFIRMATION",
    postcode: normalized,
    outcode,
    message: `We currently need to confirm availability for ${outcode}`,
  };
}
