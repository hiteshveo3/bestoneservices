import { Sparkles, CheckCircle2 } from "lucide-react";
import { StaggerGrid, StaggerItem, SectionReveal } from "@/components/motion";

export interface BentoItem {
  title: string;
  description: string;
  isLarge?: boolean;
  highlightIcon?: boolean;
}

export interface ServiceFeatureBentoProps {
  badge: string;
  title: string;
  items: BentoItem[];
}

export function ServiceFeatureBento({ badge, title, items }: ServiceFeatureBentoProps) {
  return (
    <SectionReveal className="space-y-6 text-start">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-base font-medium">
          <Sparkles className="w-4 h-4 text-ink-600 shrink-0" />
          <span>{badge}</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-medium text-ink-900 pt-1">
          {title}
        </h2>
      </div>

      <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.08}>
        {items.map((item, idx) => (
          <StaggerItem
            key={idx}
            className={`${ item.isLarge ? "md:col-span-2" : "md:col-span-1" } bg-[#F8F9FA] rounded-[16px] p-8 border border-[#E5FBC9] space-y-4 transition-colors duration-150`}
          >
            <div className={`w-10 h-10 rounded-[16px] flex items-center justify-center font-medium text-base ${
              item.highlightIcon 
                ? "bg-ink-900" 
                : "bg-white border border-[#E5FBC9]"
            }`}>
              <CheckCircle2 className={`w-5 h-5 ${item.highlightIcon ? "text-white" : "text-ink-600"}`} />
            </div>
            <h3 className="font-heading text-2xl font-medium text-ink-900">{item.title}</h3>
            <p className="text-base text-ink-500 leading-relaxed">
              {item.description}
            </p>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}
