"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/motion";
import { getNearbyAreas } from "@/lib/internal-linking-engine";

export interface NearbyAreasProps {
  areaKey?: string;
  currentAreaName?: string;
}

export function NearbyAreas({ areaKey = "ilford", currentAreaName = "Ilford" }: NearbyAreasProps) {
  const nearbyList = getNearbyAreas(areaKey);

  return (
    <SectionReveal className="bg-white rounded-[16px] p-6 sm:p-8 space-y-6 text-start">
      <div className="space-y-1 border-[#ECEAE3] pb-4">
        <div className="inline-flex items-center gap-1.5 ts-eyebrow">
          <MapPin className="w-3.5 h-3.5 text-[#1D201E] shrink-0" />
          <span>Local Area Network</span>
        </div>
        <h3 className="font-heading text-2xl font-medium text-ink-900">
          Nearby Areas We Also Serve Around {currentAreaName}
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {nearbyList.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="p-4 rounded-[16px] bg-white hover:bg-[#EAF8D6]/20 transition-colors duration-150 text-decoration-none flex items-center justify-between group"
          >
            <span className="font-heading font-medium text-base text-ink-900">{item.name}</span>
            <ArrowRight className="w-4 h-4 text-ink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          </Link>
        ))}
      </div>
    </SectionReveal>
  );
}
