/**
 * Best One Services - Master Google Business Profile Configuration
 * Centralized dataset for verified Google Business Profiles, Google Maps URLs, and Google Reviews
 */

import { siteContact } from "./site-contact";

export interface GoogleReviewItem {
  id: string;
  author: string;
  rating: number; // 5
  text: string;
  date: string;
  serviceId?: string;
  googleReviewUrl?: string;
}

export interface GoogleBusinessProfile {
  id: string;
  businessName: string;
  category: string;
  address: string;
  phone: string;
  mapsUrl: string;
  reviewUrl: string;
  rating: number;
  reviewCount: number;
  placeId?: string;
  reviews: GoogleReviewItem[];
}

export const GOOGLE_PROFILES: Record<"pestControl" | "cleaning", GoogleBusinessProfile> = {
  pestControl: {
    id: "pest-control",
    businessName: "Bestone Pest Control Services London",
    category: "Pest control & property services",
    address: "28–42 Clements Rd, Ilford IG1 1BA, United Kingdom",
    phone: siteContact.phoneDisplay,
    mapsUrl: "https://maps.google.com/?q=Bestone+Pest+Control+Services+London+28-42+Clements+Rd+Ilford+IG1+1BA",
    reviewUrl: "https://maps.google.com/?q=Bestone+Pest+Control+Services+London+28-42+Clements+Rd+Ilford+IG1+1BA#reviews",
    rating: 5.0,
    reviewCount: 16,
    reviews: [
      {
        id: "g-rev-1",
        author: "Abdullah Amjad Basra",
        rating: 5,
        text: "Great service, friendly staff, and very reasonable prices. They responded quickly and did an excellent job. I highly recommend Best One Service.",
        date: "3 weeks ago",
        serviceId: "home-inspection",
      },
      {
        id: "g-rev-2",
        author: "Ar Shanto",
        rating: 5,
        text: "I am very satisfied with the service provided by Bestone Services Ltd. The team was professional, punctual, and paid great attention to detail. The cleaning was completed to a high standard, and the entire process was smooth.",
        date: "5 months ago",
        serviceId: "end-of-tenancy-cleaning",
      },
      {
        id: "g-rev-3",
        author: "Sanjogita Prahladi",
        rating: 5,
        text: "A fab company, customer service are great, prices are very good, the quickness of getting appointment was fantastic and technician are very efficient, friendly and professional, punctual and knowledgeable and resourceful. Thank you.",
        date: "6 months ago",
        serviceId: "pest-control-services",
      },
      {
        id: "g-rev-4",
        author: "Shawn Darson",
        rating: 5,
        text: "I had a bed bug issue that was causing a lot of stress, and I’m so glad I contacted Best One Services for Pest Control. From the first call, their team was understanding and professional. They scheduled an inspection quickly and resolved it.",
        date: "a year ago",
        serviceId: "bed-bug-control",
      },
      {
        id: "g-rev-5",
        author: "Waqas Iftikhar",
        rating: 5,
        text: "This is a very good company; I booked a cleaning for my whole house and found the staff to be very professional and polite.",
        date: "6 months ago",
        serviceId: "end-of-tenancy-cleaning",
      },
      {
        id: "g-rev-6",
        author: "Waleed Iftikhar",
        rating: 5,
        text: "Great experience with them. Very professional, very polite and friendly staff.",
        date: "5 months ago",
        serviceId: "property-services",
      },
      {
        id: "g-rev-7",
        author: "Akhtar Ayub",
        rating: 5,
        text: "We had some mouse in our flat. The services are extremely good and the price they charged was very reasonable. Definitely recommended.",
        date: "a year ago",
        serviceId: "mice-control",
      },
      {
        id: "g-rev-8",
        author: "Musarat Z1",
        rating: 5,
        text: "Very good service I recently used the company, very professional.",
        date: "6 months ago",
        serviceId: "cleaning-services",
      },
      {
        id: "g-rev-9",
        author: "Nisa Talha",
        rating: 5,
        text: "I have a very pleasant experience with Best one, recommended.",
        date: "5 months ago",
        serviceId: "pest-control-services",
      },
      {
        id: "g-rev-10",
        author: "Raheem Gujjar",
        rating: 5,
        text: "Great services, very professional staff, highly recommended.",
        date: "a year ago",
        serviceId: "property-services",
      },
      {
        id: "g-rev-11",
        author: "Fatima Aziz",
        rating: 5,
        text: "Great services, very professional staff, highly recommended.",
        date: "a year ago",
        serviceId: "cleaning-services",
      },
      {
        id: "g-rev-12",
        author: "Wajeeh Ullah",
        rating: 5,
        text: "Best services. More than satisfied.",
        date: "a year ago",
        serviceId: "property-services",
      },
      {
        id: "g-rev-13",
        author: "Umer Khan Jadoon",
        rating: 5,
        text: "Best services. More than satisfied.",
        date: "a year ago",
        serviceId: "property-services",
      },
    ],
  },
  cleaning: {
    id: "cleaning",
    businessName: "Bestone Property & Cleaning Services London",
    category: "House cleaning service",
    address: "28–42 Clements Rd, Ilford IG1 1BA, United Kingdom",
    phone: siteContact.phoneDisplay,
    mapsUrl: "https://maps.google.com/?q=Bestone+Pest+Control+Services+London+28-42+Clements+Rd+Ilford+IG1+1BA",
    reviewUrl: "https://maps.google.com/?q=Bestone+Pest+Control+Services+London+28-42+Clements+Rd+Ilford+IG1+1BA#reviews",
    rating: 5.0,
    reviewCount: 16,
    reviews: [
      {
        id: "g-rev-14",
        author: "Ar Shanto",
        rating: 5,
        text: "I am very satisfied with the service provided by Bestone Services Ltd. The team was professional, punctual, and paid great attention to detail.",
        date: "5 months ago",
        serviceId: "end-of-tenancy-cleaning",
      },
      {
        id: "g-rev-15",
        author: "Waqas Iftikhar",
        rating: 5,
        text: "This is a very good company; I booked a cleaning for my whole house and found the staff to be very professional and polite.",
        date: "6 months ago",
        serviceId: "end-of-tenancy-cleaning",
      },
    ],
  },
};

export function getGoogleProfileForCategory(category?: string): GoogleBusinessProfile {
  if (category === "pest" || category === "pest-control" || category?.includes("pest") || category?.includes("mouse") || category?.includes("rat")) {
    return GOOGLE_PROFILES.pestControl;
  }
  return GOOGLE_PROFILES.cleaning;
}
