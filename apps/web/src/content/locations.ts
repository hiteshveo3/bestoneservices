export type LocationEntry = {
  slug: string;
  name: string;
  existingKeyword?: string;
  existingPosition?: number;
  volume?: number;
  cpc?: number;
  kd?: number;
};

export const locations: readonly LocationEntry[] = [
  { slug: "acton", name: "Acton", existingKeyword: "pest control acton", existingPosition: 1, volume: 170, cpc: 7.29, kd: 8 },
  { slug: "balham", name: "Balham", existingKeyword: "pest control balham", existingPosition: 1, volume: 260, cpc: 6.63, kd: 11 },
  { slug: "barking", name: "Barking", existingKeyword: "pest control barking", existingPosition: 2, volume: 480, cpc: 4.54, kd: 15 },
  { slug: "barnet", name: "Barnet", existingKeyword: "pest control barnet", existingPosition: 1, volume: 390, cpc: 6.53, kd: 17 },
  { slug: "beckenham", name: "Beckenham", existingKeyword: "pest control beckenham", existingPosition: 3, volume: 320, cpc: 4.52, kd: 10 },
  { slug: "bermondsey", name: "Bermondsey" },
  { slug: "bexleyheath", name: "Bexleyheath", existingKeyword: "pest control bexleyheath", existingPosition: 1, volume: 260, cpc: 4.61, kd: 11 },
  { slug: "bromley", name: "Bromley", existingKeyword: "bromley pest control", existingPosition: 10, volume: 170, cpc: 4.22, kd: 18 },
  { slug: "camberwell", name: "Camberwell", existingKeyword: "pest control camberwell", existingPosition: 1, volume: 140, cpc: 7.27, kd: 9 },
  { slug: "camden", name: "Camden", existingKeyword: "pest control camden", existingPosition: 1, volume: 480, cpc: 6.18, kd: 17 },
  { slug: "canary-wharf", name: "Canary Wharf", existingKeyword: "pest control canary wharf", existingPosition: 1, volume: 210, cpc: 9.41, kd: 9 },
  { slug: "city-of-london", name: "City of London", existingKeyword: "city of london pest control", existingPosition: 4, volume: 140, cpc: 0, kd: 15 },
  { slug: "clapham", name: "Clapham", existingKeyword: "pest control clapham", existingPosition: 8, volume: 390, cpc: 7.33, kd: 10 },
  { slug: "croydon", name: "Croydon", existingKeyword: "pest control croydon", existingPosition: 1, volume: 880, cpc: 7.57, kd: 17 },
  { slug: "dagenham", name: "Dagenham", existingKeyword: "pest control dagenham", existingPosition: 10, volume: 390, cpc: 6.82, kd: 11 },
  { slug: "dulwich", name: "Dulwich", existingKeyword: "pest control dulwich", existingPosition: 1, volume: 140, cpc: 7.8, kd: 9 },
  { slug: "ealing", name: "Ealing", existingKeyword: "pest control ealing", existingPosition: 1, volume: 720, cpc: 6.95, kd: 11 },
  { slug: "earls-court", name: "Earl's Court" },
  { slug: "edgware", name: "Edgware", existingKeyword: "pest control edgware", existingPosition: 1, volume: 480, cpc: 5.57, kd: 11 },
  { slug: "enfield", name: "Enfield", existingKeyword: "pest control enfield", existingPosition: 1, volume: 720, cpc: 5.1, kd: 11 },
  { slug: "erith", name: "Erith", existingKeyword: "pest control erith", existingPosition: 1, volume: 90, cpc: 5.43, kd: -1 },
  { slug: "feltham", name: "Feltham", existingKeyword: "pest control feltham", existingPosition: 1, volume: 140, cpc: 5.36, kd: 10 },
  { slug: "finsbury-park", name: "Finsbury Park", existingKeyword: "pest control finsbury park", existingPosition: 1, volume: 210, cpc: 7.41, kd: 19 },
  { slug: "hackney", name: "Hackney", existingKeyword: "pest control hackney", existingPosition: 1, volume: 590, cpc: 6.49, kd: 12 },
  { slug: "hampstead", name: "Hampstead", existingKeyword: "pest control hampstead", existingPosition: 1, volume: 210, cpc: 8.34, kd: 10 },
  { slug: "harrow", name: "Harrow", existingKeyword: "harrow pest control", existingPosition: 1, volume: 140, cpc: 6.35, kd: 12 },
  { slug: "hornchurch", name: "Hornchurch", existingKeyword: "pest control hornchurch", existingPosition: 6, volume: 390, cpc: 5.42, kd: 11 },
  { slug: "hounslow", name: "Hounslow", existingKeyword: "pest control hounslow", existingPosition: 1, volume: 480, cpc: 6.9, kd: 17 },
  { slug: "ilford", name: "Ilford", existingKeyword: "pest control ilford", existingPosition: 15, volume: 590, cpc: 5.61, kd: 12 },
  { slug: "islington", name: "Islington", existingKeyword: "islington council pest control", existingPosition: 11, volume: 140, cpc: 3.44, kd: 14 },
  { slug: "kensington", name: "Kensington", existingKeyword: "pest control kensington", existingPosition: 12, volume: 320, cpc: 7.44, kd: 13 },
  { slug: "kingston-upon-thames", name: "Kingston upon Thames", existingKeyword: "pest control kingston upon thames", existingPosition: 5, volume: 90, cpc: 8.19, kd: -1 },
  { slug: "leicester-square", name: "Leicester Square" },
  { slug: "lewisham", name: "Lewisham", existingKeyword: "lewisham pest control", existingPosition: 1, volume: 90, cpc: 4.33, kd: 17 },
  { slug: "marylebone", name: "Marylebone" },
  { slug: "mayfair", name: "Mayfair", existingKeyword: "pest control mayfair", existingPosition: 7, volume: 110, cpc: 0, kd: 9 },
  { slug: "north-finchley", name: "North Finchley" },
  { slug: "northolt", name: "Northolt", existingKeyword: "pest control northolt", existingPosition: 1, volume: 170, cpc: 5.13, kd: 8 },
  { slug: "northwood", name: "Northwood", existingKeyword: "pest control northwood", existingPosition: 1, volume: 140, cpc: 6.2, kd: 10 },
  { slug: "orpington", name: "Orpington", existingKeyword: "pest control orpington", existingPosition: 3, volume: 210, cpc: 6.8, kd: 10 },
  { slug: "paddington", name: "Paddington", existingKeyword: "pest control paddington", existingPosition: 3, volume: 170, cpc: 6.47, kd: 4 },
  { slug: "putney", name: "Putney", existingKeyword: "pest control putney", existingPosition: 1, volume: 320, cpc: 9.68, kd: 10 },
  { slug: "rainham", name: "Rainham", existingKeyword: "pest control rainham", existingPosition: 1, volume: 260, cpc: 3.92, kd: 10 },
  { slug: "richmond", name: "Richmond", existingKeyword: "pest control richmond", existingPosition: 5, volume: 320, cpc: 6.68, kd: 23 },
  { slug: "romford", name: "Romford", existingKeyword: "pest control romford", existingPosition: 14, volume: 880, cpc: 5.54, kd: 18 },
  { slug: "shepherds-bush", name: "Shepherd's Bush" },
  { slug: "sidcup", name: "Sidcup", existingKeyword: "pest control sidcup", existingPosition: 1, volume: 170, cpc: 4.97, kd: 10 },
  { slug: "southall", name: "Southall", existingKeyword: "pest control southall", existingPosition: 1, volume: 320, cpc: 6.21, kd: 13 },
  { slug: "st-johns-wood", name: "St John's Wood" },
  { slug: "stratford", name: "Stratford", existingKeyword: "pest control stratford", existingPosition: 1, volume: 260, cpc: 7.6, kd: 21 },
  { slug: "surbiton", name: "Surbiton", existingKeyword: "pest control surbiton", existingPosition: 3, volume: 260, cpc: 9.06, kd: 3 },
  { slug: "sutton", name: "Sutton", existingKeyword: "pest control sutton", existingPosition: 7, volume: 590, cpc: 6.97, kd: 11 },
  { slug: "teddington", name: "Teddington", existingKeyword: "pest control teddington", existingPosition: 4, volume: 110, cpc: 5.17, kd: 15 },
  { slug: "tottenham", name: "Tottenham", existingKeyword: "pest control tottenham", existingPosition: 1, volume: 260, cpc: 9.33, kd: 8 },
  { slug: "twickenham", name: "Twickenham", existingKeyword: "pest control twickenham", existingPosition: 11, volume: 260, cpc: 6.32, kd: 5 },
  { slug: "upminster", name: "Upminster", existingKeyword: "pest control upminster", existingPosition: 5, volume: 320, cpc: 5.48, kd: 12 },
  { slug: "uxbridge", name: "Uxbridge", existingKeyword: "pest control uxbridge", existingPosition: 2, volume: 210, cpc: 6.35, kd: 10 },
  { slug: "walthamstow", name: "Walthamstow", existingKeyword: "pest control walthamstow", existingPosition: 1, volume: 480, cpc: 6, kd: 15 },
  { slug: "wandsworth", name: "Wandsworth", existingKeyword: "pest control wandsworth", existingPosition: 1, volume: 480, cpc: 6.24, kd: 11 },
  { slug: "welling", name: "Welling", existingKeyword: "pest control welling", existingPosition: 1, volume: 260, cpc: 3.9, kd: 5 },
  { slug: "wembley", name: "Wembley", existingKeyword: "pest control wembley", existingPosition: 1, volume: 480, cpc: 7.13, kd: 11 },
  { slug: "westminster", name: "Westminster", existingKeyword: "westminster pest control", existingPosition: 2, volume: 110, cpc: 5.12, kd: 20 },
  { slug: "willesden", name: "Willesden" },
  { slug: "wimbledon", name: "Wimbledon", existingKeyword: "pest control wimbledon", existingPosition: 13, volume: 480, cpc: 7.07, kd: 10 },
  { slug: "woodford-green", name: "Woodford Green" },
  { slug: "woolwich", name: "Woolwich", existingKeyword: "pest control woolwich", existingPosition: 1, volume: 140, cpc: 6.47, kd: 10 },
  { slug: "worcester-park", name: "Worcester Park" },
] as const;

export function getLocation(slug: string): LocationEntry | undefined {
  return locations.find((l) => l.slug === slug);
}
