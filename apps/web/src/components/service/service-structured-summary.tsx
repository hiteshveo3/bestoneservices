"use client";

import { FileText, ShieldCheck, CheckCircle2, MapPin } from "lucide-react";
import { SectionReveal } from "@/components/motion";
import type { ServiceEntity } from "@/lib/service-entity-registry";

export interface ServiceStructuredSummaryProps {
  service: ServiceEntity;
}

export function ServiceStructuredSummary({ service }: ServiceStructuredSummaryProps) {
  if (!service) return null;

  return (
    <SectionReveal className="bg-[#F8F9FA] rounded-[16px] p-6 sm:p-8 border border-[#E5FBC9] space-y-6 text-start">
      <div className="flex items-center gap-2 border-b border-[#E5FBC9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-xs font-mono font-medium uppercase">
          <FileText className="w-3.5 h-3.5 text-ink-600 shrink-0" />
          <span>Structured Summary</span>
        </div>
        <h3 className="font-heading text-2xl font-medium text-ink-900">
          {service.canonicalName} Key Specifications
        </h3>
      </div>

      <dl className="grid sm:grid-cols-2 gap-4 text-base">
        <div className="p-4 rounded-[16px] bg-white border border-[#B7F56A] space-y-1">
          <dt className="text-xs font-mono text-ink-500 uppercase">Service Provider</dt>
          <dd className="font-heading font-medium text-ink-900 text-lg">Best One Services Ltd</dd>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#B7F56A] space-y-1">
          <dt className="text-xs font-mono text-ink-500 uppercase">Service Coverage</dt>
          <dd className="font-heading font-medium text-ink-900 text-lg flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-ink-600 shrink-0" />
            <span>{service.coverage}</span>
          </dd>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#B7F56A] space-y-1">
          <dt className="text-xs font-mono text-ink-500 uppercase">Starting Price & Pricing Model</dt>
          <dd className="font-heading font-medium text-ink-900 text-lg">
            {service.startingPrice} ({service.pricingType})
          </dd>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#B7F56A] space-y-1">
          <dt className="text-xs font-mono text-ink-500 uppercase">Service Guarantee</dt>
          <dd className="font-heading font-medium text-ink-900 text-lg flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-ink-600 shrink-0" />
            <span>{service.guarantee}</span>
          </dd>
        </div>
      </dl>

      <div className="p-5 rounded-[16px] bg-white border border-[#B7F56A] space-y-3">
        <div className="text-xs font-mono text-ink-500 uppercase font-medium">Included Scope</div>
        <ul className="grid sm:grid-cols-2 gap-2 text-base text-ink-600 list-none p-0">
          {service.includes.map((inc, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-ink-600 shrink-0 mt-1" />
              <span>{inc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-xs font-mono text-ink-500 pt-1">
        * Note: {service.minimumCharge}. Properties with extreme neglect or specialized requirements will be quoted before work commences.
      </div>
    </SectionReveal>
  );
}
