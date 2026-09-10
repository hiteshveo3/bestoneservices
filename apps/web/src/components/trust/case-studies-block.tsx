"use client";

import { CheckCircle2, MapPin, Calendar, Briefcase } from "lucide-react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";
import { getCaseStudiesForService } from "@/lib/case-studies-data";

export interface CaseStudiesBlockProps {
  title?: string;
  subtitle?: string;
  serviceId?: string;
}

export function CaseStudiesBlock({
  title = "Recent Verified Work & Case Studies",
  subtitle = "Documented service completions across London properties",
  serviceId,
}: CaseStudiesBlockProps) {
  const cases = getCaseStudiesForService(serviceId);

  // STRICT RULE: Do not render section if no verified case study data exists
  if (!cases || cases.length === 0) return null;

  return (
    <SectionReveal className="space-y-6 text-start">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
          <Briefcase className="w-3.5 h-3.5 text-white shrink-0" />
          <span>VERIFIED CASE STUDIES</span>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">{title}</h3>
        <p className="text-base text-ink-500">{subtitle}</p>
      </div>

      <StaggerGrid className="grid sm:grid-cols-2 gap-4" staggerDelay={0.06}>
        {cases.map((cs) => (
          <StaggerItem
            key={cs.id}
            className="bg-[#F9FCF5] rounded-[16px] p-6 border border-[#B7F56A] space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-2">
                <span className="font-heading font-medium text-lg text-ink-900">{cs.title}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-xs font-mono font-medium text-ink-500">
                  {cs.propertyType}
                </span>
              </div>

              <p className="text-sm text-ink-500 leading-relaxed">
                <strong className="text-ink-600 font-medium">Challenge: </strong>
                {cs.challenge}
              </p>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase block">Work Completed:</span>
                <ul className="space-y-1 list-none p-0 text-xs font-medium text-ink-600">
                  {cs.workCompleted.map((wc, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1F3A00] shrink-0 fill-ink-900" />
                      <span>{wc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5FBC9] flex items-center justify-between text-xs font-mono text-ink-500">
              <span className="font-medium text-ink-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-ink-600" />
                <span className="capitalize">{cs.areaId}, London</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-ink-600" />
                <span>{cs.date}</span>
              </span>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}
