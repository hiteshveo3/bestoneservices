"use client";

import { ShieldCheck, Award, CheckCircle2, MapPin } from "lucide-react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";

export function TrustProofStrip() {
  const verifiedFacts = [
    {
      title: "Fully Licensed & Insured",
      desc: "Full public liability & goods-in-transit insurance across all services.",
      icon: ShieldCheck,
    },
    {
      title: "BPCA Trained Technicians",
      desc: "Certified pest eradication and safety protocols.",
      icon: Award,
    },
    {
      title: "48-Hour Re-Clean Guarantee",
      desc: "Complimentary return visit if landlord flags any checklist items.",
      icon: CheckCircle2,
    },
    {
      title: "London & M25 Dispatch",
      desc: "Active mobile teams serving East, North, West & South London.",
      icon: MapPin,
    },
  ];

  return (
    <SectionReveal className="bg-[#F8F9FA] rounded-[16px] p-6 sm:p-8 border border-[#E5FBC9] space-y-6 text-start">
      <div className="flex items-center gap-2 border-b border-[#E5FBC9] pb-3">
        <ShieldCheck className="w-5 h-5 text-ink-600 shrink-0" />
        <span className="font-heading font-medium text-lg text-ink-900">Verified Business Accreditations</span>
      </div>

      <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.06}>
        {verifiedFacts.map((fact, idx) => {
          const Icon = fact.icon;
          return (
            <StaggerItem key={idx} className="p-4 rounded-[16px] bg-white border border-[#B7F56A] space-y-2">
              <div className="flex items-center gap-2 font-heading font-medium text-base text-ink-900">
                <Icon className="w-4 h-4 text-ink-600 shrink-0" />
                <span>{fact.title}</span>
              </div>
              <p className="text-xs text-ink-500 font-normal leading-relaxed">{fact.desc}</p>
            </StaggerItem>
          );
        })}
      </StaggerGrid>
    </SectionReveal>
  );
}
