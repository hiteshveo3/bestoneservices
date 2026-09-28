"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export interface SectionNextActionProps {
  prompt: string;
  buttonText: string;
  href: string;
}

export function SectionNextAction({ prompt, buttonText, href }: SectionNextActionProps) {
  return (
    <SectionReveal className="p-4 rounded-[16px] bg-[#EAF8D6] border border-[#ECEAE3] flex flex-col sm:flex-row items-center justify-between gap-3 text-start">
      <span className="font-heading font-medium text-base text-[#1D201E]">{prompt}</span>
      <Link
        href={href}
        className="px-4 py-2 rounded-full bg-[#B7F56A] text-[#1D201E] text-sm font-semibold hover:bg-[#A2EA4E] transition-colors duration-150 text-decoration-none shrink-0 flex items-center gap-1.5"
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-4 h-4 text-[#1D201E]" />
      </Link>
    </SectionReveal>
  );
}

