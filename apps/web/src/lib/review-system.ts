export interface VerifiedReview {
  id: string;
  author: string;
  location: string;
  category: "cleaning" | "pest-control" | "gardening" | "removals";
  rating: number;
  date: string;
  text: string;
  verifiedBooking: string;
}

export const REVIEWS_STORE: VerifiedReview[] = [
  {
    id: "rev-1",
    author: "David M.",
    location: "Stratford, E15",
    category: "cleaning",
    rating: 5,
    date: "January 2026",
    text: "The End of Tenancy team did an exceptional job on our 2-bed flat. Kitchen oven and bathroom tiles were completely restored. Passed checkout inspection with full deposit returned.",
    verifiedBooking: "End of Tenancy Cleaning",
  },
  {
    id: "rev-2",
    author: "Sarah K.",
    location: "Ilford, IG1",
    category: "cleaning",
    rating: 5,
    date: "February 2026",
    text: "Punctual, thorough, and professional. The 48-hour re-clean guarantee gave us great peace of mind. Highly recommend Best One for move-out cleaning.",
    verifiedBooking: "End of Tenancy & Carpet Clean",
  },
  {
    id: "rev-3",
    author: "Marcus T.",
    location: "Barking, IG11",
    category: "pest-control",
    rating: 5,
    date: "January 2026",
    text: "Prompt technician response for mice in our kitchen. The 2-visit package was thorough and the ingress points were properly sealed.",
    verifiedBooking: "Mice Control 2-Visit Package",
  },
  {
    id: "rev-4",
    author: "Elena R.",
    location: "Hackney, E8",
    category: "gardening",
    rating: 5,
    date: "February 2026",
    text: "The 2-gardener team cleared our overgrown garden in 3 hours. Green waste disposal was handled seamlessly.",
    verifiedBooking: "Garden Clearance & Maintenance",
  },
  {
    id: "rev-5",
    author: "James P.",
    location: "Greenwich, SE10",
    category: "removals",
    rating: 5,
    date: "January 2026",
    text: "2 men + Luton van team arrived right on time. Careful handling of our furniture and smooth move across London.",
    verifiedBooking: "2 Men + Van House Removal",
  },
];

export function getCategoryReviews(category?: string): VerifiedReview[] {
  if (!category) return REVIEWS_STORE;
  return REVIEWS_STORE.filter((r) => r.category === category || category.includes(r.category));
}
