"use client";

import { ShieldCheck, AlertCircle, Info, Clock, PoundSterling } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export type PolicyType = "guarantee" | "minimumCharge" | "surcharge" | "importantCondition" | "customQuoteRule";

export interface ServicePolicyCalloutProps {
  type: PolicyType;
  title: string;
  description: string;
  ruleTag?: string;
}

const TYPE_CONFIG: Record<PolicyType, { badgeText: string; icon: typeof ShieldCheck; style: string }> = {
  guarantee: {
    badgeText: "VERIFIED GUARANTEE",
    icon: ShieldCheck,
    style: "bg-white border-[#99D055] border-2",
  },
  minimumCharge: {
    badgeText: "MINIMUM CHARGE POLICY",
    icon: PoundSterling,
    style: "bg-white border-[#E5FBC9]",
  },
  surcharge: {
    badgeText: "SURCHARGE INFORMATION",
    icon: Clock,
    style: "bg-white border-[#E5FBC9]",
  },
  importantCondition: {
    badgeText: "SERVICE CONDITION",
    icon: AlertCircle,
    style: "bg-white border-[#E5FBC9]",
  },
  customQuoteRule: {
    badgeText: "CUSTOM ASSESSOR POLICY",
    icon: Info,
    style: "bg-white border-[#E5FBC9]",
  },
};

export function ServicePolicyCallout({ type, title, description, ruleTag }: ServicePolicyCalloutProps) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.guarantee;
  const Icon = config.icon;

  return (
    <SectionReveal className={`p-6 sm:p-8 rounded-[16px] space-y-3 text-start ${config.style} border border-[#E5FBC9]`}>
      <div className="flex items-center justify-between gap-2">
        <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
          {ruleTag || config.badgeText}
        </span>
        <Icon className="w-5 h-5 text-ink-600 shrink-0" />
      </div>

      <div className="space-y-1">
        <h3 className="font-heading text-xl sm:text-2xl font-medium text-ink-900">{title}</h3>
        <p className="text-base text-ink-500 leading-relaxed max-w-3xl">{description}</p>
      </div>
    </SectionReveal>
  );
}
