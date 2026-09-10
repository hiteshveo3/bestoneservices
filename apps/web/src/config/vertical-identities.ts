import { Sparkles, Bug, Trees, Truck } from "lucide-react";

export interface VerticalIdentity {
  id: "cleaning" | "pest" | "gardening" | "removals";
  name: string;
  badgeLabel: string;
  iconName: string;
  primaryIcon: typeof Sparkles;
  imageryFocus: string;
  emphasisTopics: string[];
}

export const VERTICAL_IDENTITIES: Record<string, VerticalIdentity> = {
  cleaning: {
    id: "cleaning",
    name: "Cleaning Services",
    badgeLabel: "PROPERTY CLEANING",
    iconName: "Sparkles",
    primaryIcon: Sparkles,
    imageryFocus: "Bright property interiors, detailed checkout checklists, clean appliances.",
    emphasisTopics: ["Property Size Scope", "Add-on Options", "48-Hour Re-Clean Guarantee", "Internal Windows & Oven"],
  },

  pest: {
    id: "pest",
    name: "Pest Control Services",
    badgeLabel: "PEST CONTROL",
    iconName: "Bug",
    primaryIcon: Bug,
    imageryFocus: "Professional technician inspections, baiting stations, entry proofing.",
    emphasisTopics: ["Pest Signs Inspection", "Multi-Visit Packages", "Written Guarantee", "Safety & Proofing"],
  },

  gardening: {
    id: "gardening",
    name: "Gardening & Clearance",
    badgeLabel: "GARDEN CARE",
    iconName: "Trees",
    primaryIcon: Trees,
    imageryFocus: "Overgrown garden clearance, lawn mowing, hedge trimming, green waste bags.",
    emphasisTopics: ["2-Gardener Team", "Hourly Clearance Rates", "Green Waste Bags", "Garden Maintenance"],
  },

  removals: {
    id: "removals",
    name: "Removals & Storage",
    badgeLabel: "HOUSE REMOVALS",
    iconName: "Truck",
    primaryIcon: Truck,
    imageryFocus: "Luton van loading, furniture protection blankets, packing box assembly.",
    emphasisTopics: ["Movers Count (2 or 3)", "Luton Van Capacity", "Packing Services", "Access & Timing"],
  },
};

export function getVerticalIdentity(id: string): VerticalIdentity {
  return VERTICAL_IDENTITIES[id] || VERTICAL_IDENTITIES.cleaning;
}
