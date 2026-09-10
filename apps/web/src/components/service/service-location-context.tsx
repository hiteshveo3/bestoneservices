"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export interface LocationHub {
  name: string;
  slug: string;
}

export interface ServiceLocationContextProps {
  serviceTitle: string;
  locations?: LocationHub[];
}

const DEFAULT_HUB_LOCATIONS: LocationHub[] = [
  { name: "Ilford & Redbridge", slug: "/areas/" },
  { name: "Barking & Dagenham", slug: "/areas/" },
  { name: "Newham & Stratford", slug: "/areas/" },
  { name: "Hackney & East London", slug: "/areas/" },
  { name: "Tower Hamlets & Docklands", slug: "/areas/" },
  { name: "Waltham Forest & Chingford", slug: "/areas/" },
];

export function ServiceLocationContext({
  serviceTitle,
  locations = DEFAULT_HUB_LOCATIONS,
}: ServiceLocationContextProps) {
  return (
    <SectionReveal className="bg-[#F8F9FA] rounded-[16px] p-6 sm:p-8 border border-[#E5FBC9] space-y-6 text-start">
      <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-xs font-mono font-medium uppercase">
          <MapPin className="w-3.5 h-3.5 text-ink-600 shrink-0" />
          <span>Regional Coverage</span>
        </div>
        <h3 className="font-heading text-2xl font-medium text-ink-900">
          {serviceTitle} Across Greater London & M25
        </h3>
        <p className="text-base text-ink-500">
          Active mobile teams dispatched daily across key London hubs and surrounding postcodes.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {locations.map((loc, idx) => (
          <Link
            key={idx}
            href={loc.slug}
            className="p-3.5 rounded-[16px] bg-white border border-[#B7F56A] hover:bg-[#DCFAB7] transition-colors duration-150 text-decoration-none flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 font-heading font-medium text-base text-ink-900">
              <MapPin className="w-4 h-4 text-ink-600 shrink-0" />
              <span>{loc.name}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          </Link>
        ))}
      </div>

      <div className="pt-2 flex justify-between items-center border-t border-[#E5FBC9]">
        <span className="text-sm font-mono text-ink-500">Serving all Greater London postcodes</span>
        <Link
          href="/areas/"
          className="text-base font-medium text-ink-600 hover:underline flex items-center gap-1 text-decoration-none"
        >
          <span>View All Coverage Areas</span>
          <ArrowRight className="w-4 h-4 text-ink-600" />
        </Link>
      </div>
    </SectionReveal>
  );
}
