"use client";

import { HelpCircle, Check } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export interface DecisionQuestion {
  question: string;
  answer: string;
}

export interface BookingDecisionSupportProps {
  title?: string;
  subtitle?: string;
  questions: DecisionQuestion[];
}

export function BookingDecisionSupport({
  title = "Things to Know Before Booking",
  subtitle = "Key operational details to help you prepare for a smooth service delivery",
  questions,
}: BookingDecisionSupportProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <SectionReveal className="bg-[#F8F9FA] rounded-[16px] p-6 sm:p-8 border border-[#E5FBC9] space-y-6 text-start">
      <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-xs font-mono font-medium uppercase">
          <HelpCircle className="w-3.5 h-3.5 text-ink-600 shrink-0" />
          <span>Decision Support</span>
        </div>
        <h3 className="font-heading text-2xl font-medium text-ink-900">{title}</h3>
        <p className="text-base text-ink-500 font-normal">{subtitle}</p>
      </div>

      <div className="space-y-4">
        {questions.map((item, idx) => (
          <div key={idx} className="p-4 rounded-[16px] bg-white border border-[#B7F56A] space-y-1.5">
            <div className="font-heading font-medium text-base text-ink-900 flex items-center gap-2">
              <Check className="w-4 h-4 text-ink-600 shrink-0" />
              <span>{item.question}</span>
            </div>
            <p className="text-sm text-ink-500 font-normal leading-relaxed pl-6">{item.answer}</p>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
