"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { getRecentlyViewedServices, trackServiceVisit, type RecentServiceItem } from "@/lib/recently-viewed";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";

export interface RecentlyViewedServicesProps {
  currentService?: {
    id: string;
    slug: string;
    title: string;
    category: string;
    price: string;
  };
}

export function RecentlyViewedServices({ currentService }: RecentlyViewedServicesProps) {
  const [items, setItems] = useState<RecentServiceItem[]>(() => getRecentlyViewedServices(currentService?.slug));

  useEffect(() => {
    if (currentService) {
      trackServiceVisit(currentService);
      setTimeout(() => {
        setItems(getRecentlyViewedServices(currentService.slug));
      }, 0);
    }
  }, [currentService]);

  if (items.length === 0) return null;

  return (
    <SectionReveal className="space-y-6 text-start pt-6 border-t border-[#E5FBC9]">
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-ink-600 text-base font-medium">
          <Clock className="w-4 h-4 text-ink-600 shrink-0" />
          <span>Recently Viewed Services</span>
        </div>
      </div>

      <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.06}>
        {items.map((item) => (
          <StaggerItem key={item.slug}>
            <Link
              href={item.slug}
              className="group p-5 rounded-[16px] bg-[#F8F9FA] border border-[#E5FBC9] space-y-3 hover:border-ink-900/30 transition-colors duration-150 flex flex-col justify-between text-decoration-none block h-full"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-heading text-lg font-medium text-ink-900 group-hover:text-ink-900 leading-snug">
                    {item.title}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] text-ink-600 border border-[#B7F56A] text-xs font-mono font-medium shrink-0">
                    {item.price}
                  </span>
                </div>
                <div className="text-xs font-mono text-ink-500">{item.category}</div>
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-ink-600 pt-1">
                <span>View Service</span>
                <ArrowRight className="w-4 h-4 text-ink-600" />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}


