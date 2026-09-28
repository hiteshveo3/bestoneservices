"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import type { DirectoryService } from "@/content/service-directory";
import { ServiceCardMotion } from "@/components/service/service-card-motion";

interface ServiceResultCardProps {
  service: DirectoryService;
  highlightEmergency?: boolean;
}

export function ServiceResultCard({
  service,
  highlightEmergency = false,
}: ServiceResultCardProps) {
  const isEmergency = highlightEmergency && service.emergencyEligible;

  return (
    <article className="group bg-white rounded-[18px] hover:bg-[#EAF8D6] transition-colors duration-200 p-5 sm:p-6 flex flex-col justify-between text-start">
      <div className="space-y-4">
        {/* Service Image */}
        <div className="relative w-full aspect-[16/10] rounded-[14px] overflow-hidden bg-white ">
          <ServiceCardMotion category={service.category} serviceName={service.name} serviceId={service.id} />
          {service.popular && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#B7F56A] text-[#1D201E] ">
              Popular
            </span>
          )}
          {service.emergencyEligible && (
            <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md text-xs font-semibold bg-white/95 text-[#1D201E] flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#1D201E]" />
              <span>Same-Day</span>
            </span>
          )}
        </div>

        {/* Category & Badge Meta Row */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#EAF8D6]/70 text-[#1D201E] ">
            {service.categoryLabel}
          </span>
          <span className="text-xs text-[#1D201E]/50">•</span>
          <span className="text-xs text-[#1D201E]/80 font-medium">
            {service.subService}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1D201E] leading-snug group-hover:underline group-hover:underline-offset-2">
            <Link href={service.href} className="text-inherit">
              {service.name}
            </Link>
          </h3>
          <p className="text-sm text-[#1D201E]/75 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>

      {/* Pricing & CTA Action Footer */}
      <div className="pt-5 mt-5 border-[#ECEAE3] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1D201E]/60">
            Transparent Pricing
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-[#1D201E]">
            {service.startingPrice}
          </span>
        </div>

        <Link
          href={service.href}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#B7F56A] hover:bg-[#A2EA4E] text-[#1D201E] text-sm font-semibold transition-colors duration-150 "
        >
          <span>{service.ctaText}</span>
          <ArrowRight className="w-4 h-4 text-[#1D201E] transition-transform duration-150" />
        </Link>
      </div>
    </article>
  );
}

export function ServiceResultCardSkeleton() {
  return (
    <div className="bg-white rounded-[18px] p-5 sm:p-6 space-y-4 animate-pulse text-start ">
      <div className="w-full aspect-[16/10] rounded-[14px] bg-[#EAF8D6]/30" />
      <div className="flex gap-2">
        <div className="h-5 w-20 rounded-full bg-[#EAF8D6]/40" />
        <div className="h-5 w-24 rounded-full bg-[#EAF8D6]/30" />
      </div>
      <div className="h-6 w-3/4 rounded-md bg-[#EAF8D6]/40" />
      <div className="space-y-1.5">
        <div className="h-4 w-full rounded bg-[#EAF8D6]/20" />
        <div className="h-4 w-2/3 rounded bg-[#EAF8D6]/20" />
      </div>
      <div className="pt-4 border-[#ECEAE3] flex items-center justify-between">
        <div className="h-6 w-24 rounded bg-[#EAF8D6]/30" />
        <div className="h-9 w-32 rounded-[12px] bg-[#EAF8D6]/40" />
      </div>
    </div>
  );
}
