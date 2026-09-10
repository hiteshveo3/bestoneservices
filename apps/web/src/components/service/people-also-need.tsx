"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";

export interface RelevantServiceOption {
  title: string;
  category: string;
  priceDisplay: string;
  description: string;
  href: string;
}

export interface PeopleAlsoNeedProps {
  title?: string;
  subtitle?: string;
  services: RelevantServiceOption[];
}

export function PeopleAlsoNeed({
  title = "Often Relevant Services",
  subtitle = "Additional property care solutions frequently booked for this service type",
  services,
}: PeopleAlsoNeedProps) {
  if (!services || services.length === 0) return null;

  return (
    <SectionReveal className="bg-[#F8F9FA] rounded-[16px] p-6 sm:p-8 border border-[#E5FBC9] space-y-6 text-start">
      <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-xs font-mono font-medium uppercase">
          <Sparkles className="w-3.5 h-3.5 text-ink-600 shrink-0" />
          <span>Complementary Care</span>
        </div>
        <h3 className="font-heading text-2xl font-medium text-ink-900">{title}</h3>
        <p className="text-base text-ink-500 font-normal">{subtitle}</p>
      </div>

      <StaggerGrid className="grid sm:grid-cols-3 gap-4" staggerDelay={0.06}>
        {services.map((item, idx) => (
          <StaggerItem key={idx}>
            <Link
              href={item.href}
              className="group p-5 rounded-[16px] bg-white border border-[#B7F56A] hover:bg-[#DCFAB7] transition-colors duration-150 text-decoration-none flex flex-col justify-between h-full space-y-3 block"
            >
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-heading text-lg font-medium text-ink-900 group-hover:text-ink-900 leading-snug">
                    {item.title}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded bg-[#F9FCF5] text-ink-600 text-xs font-mono font-medium shrink-0 border border-[#B7F56A]">
                    {item.priceDisplay}
                  </span>
                </div>
                <p className="text-sm text-ink-500 font-normal line-clamp-2">{item.description}</p>
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-ink-600 pt-1">
                <span>Explore Service</span>
                <ArrowRight className="w-4 h-4 text-ink-600" />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}
