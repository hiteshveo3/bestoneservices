export interface AreaEntity {
  slug: string;
  name: string;
  postcodeOutcodes: string[];
  nearbySlugs: string[];
}

export const AREA_MAP: Record<string, AreaEntity> = {
  ilford: {
    slug: "/areas/",
    name: "Ilford",
    postcodeOutcodes: ["IG1", "IG2", "IG3", "IG4", "IG5", "IG6"],
    nearbySlugs: ["barking", "newham", "redbridge", "romford"],
  },
  barking: {
    slug: "/areas/",
    name: "Barking",
    postcodeOutcodes: ["IG11"],
    nearbySlugs: ["ilford", "dagenham", "newham"],
  },
  newham: {
    slug: "/areas/",
    name: "Newham & Stratford",
    postcodeOutcodes: ["E15", "E13", "E6", "E7", "E12"],
    nearbySlugs: ["ilford", "hackney", "barking", "tower-hamlets"],
  },
  redbridge: {
    slug: "/areas/",
    name: "Redbridge & Woodford",
    postcodeOutcodes: ["IG8", "E18", "IG7"],
    nearbySlugs: ["ilford", "waltham-forest", "chingford"],
  },
};

export function getNearbyAreas(currentAreaKey: string): Array<{ name: string; href: string }> {
  const current = AREA_MAP[currentAreaKey] || AREA_MAP["ilford"];
  return current.nearbySlugs.map((key) => {
    const area = AREA_MAP[key];
    return {
      name: area ? area.name : key.replace("-", " "),
      href: "/areas/",
    };
  });
}
