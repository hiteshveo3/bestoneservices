export interface CaseStudy {
  id: string;
  title: string;
  serviceId: string;
  areaId: string;
  propertyType: string;
  challenge: string;
  workCompleted: string[];
  verifiedOutcome: string;
  date: string;
  imageUrl?: string;
}

export const VERIFIED_CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-1",
    title: "End of Tenancy Deep Clean — 2-Bed Flat",
    serviceId: "end-of-tenancy-cleaning",
    areaId: "ilford",
    propertyType: "2-Bedroom Flat",
    challenge: "Lettings inventory check required full appliance degreasing and carpet steam extraction.",
    workCompleted: [
      "Full 48-hr guaranteed inventory clean",
      "Single oven interior degreasing",
      "Living room & bedroom carpet steam sanitising",
    ],
    verifiedOutcome: "Passed estate agency inventory check on first inspection with zero deposit deductions.",
    date: "2026-01-18",
  },
  {
    id: "cs-2",
    title: "Rodent Ingress Proofing & 2-Visit Treatment",
    serviceId: "mice-control",
    areaId: "romford",
    propertyType: "Terraced House",
    challenge: "Mice activity behind kitchen base units and under sink pipework gaps.",
    workCompleted: [
      "Detailed camera inspection of pipe penetrations",
      "Wire mesh sealing and expanding foam proofing",
      "2-visit targeted baiting & monitoring",
    ],
    verifiedOutcome: "Zero rodent activity confirmed on second follow-up visit. 1-month guarantee issued.",
    date: "2026-01-24",
  },
];

export function getCaseStudiesForService(serviceId?: string): CaseStudy[] {
  if (!serviceId) return VERIFIED_CASE_STUDIES;
  return VERIFIED_CASE_STUDIES.filter((cs) => cs.serviceId === serviceId);
}
