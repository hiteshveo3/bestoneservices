"use client";

import { ReactNode } from "react";
import { SectionReveal } from "@/components/motion";

export interface EditorialSectionProps {
  sequence?: string;
  categoryLabel?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function EditorialSection({
  sequence,
  categoryLabel,
  title,
  subtitle,
  children,
  className = "",
  id,
}: EditorialSectionProps) {
  return (
    <section id={id} className={`space-y-6 text-start ${className}`}>
      <SectionReveal className="space-y-2 border-b border-[#E5FBC9] pb-4">
        {(sequence || categoryLabel) && (
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-ink-500 uppercase tracking-wider">
            {sequence && <span className="text-ink-600 font-medium">{sequence}</span>}
            {sequence && categoryLabel && <span>/</span>}
            {categoryLabel && <span>{categoryLabel}</span>}
          </div>
        )}

        <h2 className="font-heading text-2xl sm:text-4xl font-medium text-ink-900 tracking-tight">
          {title}
        </h2>

        {subtitle && (
          <p className="text-base text-ink-500 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </SectionReveal>

      <div>{children}</div>
    </section>
  );
}
