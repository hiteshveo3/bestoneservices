"use client";

import { ReactNode } from "react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";

export interface BentoCardData {
  title: string;
  description: string;
  badge?: string;
  icon?: ReactNode;
  imageUrl?: string;
}

export interface ServiceBentoProps {
  title: string;
  subtitle?: string;
  variant?: "A" | "B" | "C" | "D" | "E";
  cards: BentoCardData[];
}

export function ServiceBentoVariants({
  title,
  subtitle,
  variant = "A",
  cards,
}: ServiceBentoProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <SectionReveal className="space-y-6 text-start">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl sm:text-4xl font-medium text-ink-900">{title}</h2>
        {subtitle && <p className="text-base text-ink-500 max-w-2xl">{subtitle}</p>}
      </div>

      {/* VARIANT A: 2 Large + 2 Small */}
      {variant === "A" && (
        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const isLarge = idx === 0 || idx === 3;
            return (
              <StaggerItem
                key={idx}
                className={`bg-[#F9FCF5] rounded-[16px] p-6 border border-[#B7F56A] space-y-3 ${ isLarge ? "lg:col-span-2" : "lg:col-span-1" }`}
              >
                {card.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium">
                    {card.badge}
                  </span>
                )}
                {card.icon && <div className="w-10 h-10 rounded-[16px] bg-[#1F3A00] text-white flex items-center justify-center font-medium">{card.icon}</div>}
                <h3 className="font-heading text-xl font-medium text-ink-900">{card.title}</h3>
                <p className="text-base text-ink-500 leading-relaxed">{card.description}</p>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      )}

      {/* VARIANT B: 1 Large Left + 3 Stacked Right */}
      {variant === "B" && (
        <StaggerGrid className="grid lg:grid-cols-3 gap-4">
          {cards[0] && (
            <StaggerItem className="lg:col-span-1 bg-[#F9FCF5] rounded-[16px] p-8 border border-[#B7F56A] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                {cards[0].badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium">
                    {cards[0].badge}
                  </span>
                )}
                <h3 className="font-heading text-2xl font-medium text-ink-900">{cards[0].title}</h3>
                <p className="text-base text-ink-500 leading-relaxed">{cards[0].description}</p>
              </div>
            </StaggerItem>
          )}

          <div className="lg:col-span-2 grid sm:grid-cols-1 gap-4">
            {cards.slice(1, 4).map((card, idx) => (
              <StaggerItem key={idx} className="bg-[#F9FCF5] rounded-[16px] p-6 border border-[#B7F56A] space-y-2">
                <h4 className="font-heading text-lg font-medium text-ink-900">{card.title}</h4>
                <p className="text-base text-ink-500">{card.description}</p>
              </StaggerItem>
            ))}
          </div>
        </StaggerGrid>
      )}

      {/* VARIANT C: 3 Equal + 1 Full Width */}
      {variant === "C" && (
        <StaggerGrid className="grid md:grid-cols-3 gap-4">
          {cards.slice(0, 3).map((card, idx) => (
            <StaggerItem key={idx} className="bg-[#F9FCF5] rounded-[16px] p-6 border border-[#B7F56A] space-y-3">
              <h3 className="font-heading text-xl font-medium text-ink-900">{card.title}</h3>
              <p className="text-base text-ink-500">{card.description}</p>
            </StaggerItem>
          ))}
          {cards[3] && (
            <StaggerItem className="md:col-span-3 bg-[#F9FCF5] rounded-[16px] p-8 border border-[#B7F56A] space-y-3">
              <h3 className="font-heading text-2xl font-medium text-ink-900">{cards[3].title}</h3>
              <p className="text-base text-ink-500">{cards[3].description}</p>
            </StaggerItem>
          )}
        </StaggerGrid>
      )}

      {/* VARIANT D & E: 3 Equal grid fallback */}
      {(variant === "D" || variant === "E") && (
        <StaggerGrid className="grid sm:grid-cols-3 gap-4">
          {cards.map((card, idx) => (
            <StaggerItem key={idx} className="bg-[#F9FCF5] rounded-[16px] p-6 border border-[#B7F56A] space-y-3">
              <h3 className="font-heading text-xl font-medium text-ink-900">{card.title}</h3>
              <p className="text-base text-ink-500">{card.description}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </SectionReveal>
  );
}
