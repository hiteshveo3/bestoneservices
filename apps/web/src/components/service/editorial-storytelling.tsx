"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export interface EditorialStorytellingProps {
  categoryLabel?: string;
  sequence?: string;
  title: string;
  paragraphs: string[];
  bulletPoints?: string[];
  imageUrl: string;
  imageAlt: string;
  align?: "text-left" | "text-right";
}

export function EditorialStorytelling({
  categoryLabel,
  sequence,
  title,
  paragraphs,
  bulletPoints,
  imageUrl,
  imageAlt,
  align = "text-left",
}: EditorialStorytellingProps) {
  const isTextLeft = align === "text-left";

  return (
    <SectionReveal className="py-6 text-start">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* TEXT CONTENT BLOCK */}
        <div className={`space-y-4 ${isTextLeft ? "lg:order-1" : "lg:order-2"}`}>
          {(categoryLabel || sequence) && (
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-ink-500 uppercase tracking-wider">
              {sequence && <span className="text-ink-600 font-medium">{sequence}</span>}
              {sequence && categoryLabel && <span>/</span>}
              {categoryLabel && <span>{categoryLabel}</span>}
            </div>
          )}

          <h2 className="font-heading text-2xl sm:text-4xl font-medium text-ink-900 tracking-tight leading-tight">
            {title}
          </h2>

          <div className="space-y-3 text-base text-ink-500 leading-relaxed font-normal">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {bulletPoints && bulletPoints.length > 0 && (
            <ul className="space-y-2 pt-2 text-sm font-medium text-ink-600 list-none p-0">
              {bulletPoints.map((bp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1F3A00] text-white flex items-center justify-center font-medium shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>{bp}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* IMAGE CONTAINER (Unwrapped, Open Canvas) */}
        <div className={`relative ${isTextLeft ? "lg:order-2" : "lg:order-1"}`}>
          <div className="relative rounded-[16px] overflow-hidden border border-[#B7F56A] bg-[#F9FCF5] aspect-4/3">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </SectionReveal>
  );
}
