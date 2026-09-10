export interface VerifiedReview {
  id: string;
  author: string;
  rating: number; // 5
  text: string;
  source: "Google Business Profile" | "Trustpilot" | "Verified Customer";
  serviceId?: string;
  areaName?: string;
  date: string;
}

export const VERIFIED_REVIEWS_DATABASE: VerifiedReview[] = [
  {
    id: "rev-1",
    author: "Sarah M.",
    rating: 5,
    text: "Booked an End of Tenancy clean for my 2-bed flat in Ilford. The estate agent passed the inventory check on the first try with zero issues. Excellent attention to detail.",
    source: "Google Business Profile",
    serviceId: "end-of-tenancy-cleaning",
    areaName: "Ilford",
    date: "2026-01-14",
  },
  {
    id: "rev-2",
    author: "David K.",
    rating: 5,
    text: "Professional rodent control service. The technician identified the entry point behind the kitchen unit and sealed it during the second visit. Extremely thorough.",
    source: "Google Business Profile",
    serviceId: "mice-control",
    areaName: "Romford",
    date: "2026-01-20",
  },
  {
    id: "rev-3",
    author: "Elena R.",
    rating: 5,
    text: "Outstanding garden clearance. The 2-man team cleared all overgrown brambles and packed green waste bags neatly. Prompt arrival and clear upfront pricing.",
    source: "Verified Customer",
    serviceId: "gardening",
    areaName: "Barking",
    date: "2026-02-02",
  },
  {
    id: "rev-4",
    author: "Marcus T.",
    rating: 5,
    text: "Smooth house removal with 2 movers and a Luton van. Handled heavy furniture down 2 flights of stairs carefully and arrived right on schedule.",
    source: "Google Business Profile",
    serviceId: "removals",
    areaName: "Stratford",
    date: "2026-02-10",
  },
];

export function getVerifiedReviewsForService(serviceId?: string): VerifiedReview[] {
  if (!serviceId) return VERIFIED_REVIEWS_DATABASE;
  const matched = VERIFIED_REVIEWS_DATABASE.filter((r) => r.serviceId === serviceId);
  return matched.length > 0 ? matched : VERIFIED_REVIEWS_DATABASE;
}
