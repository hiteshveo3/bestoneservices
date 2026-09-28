"use client";

import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";

export interface GuideClusterCard {
  title: string;
  excerpt: string;
  readTime: string;
  href: string;
}

export interface ServiceGuideClusterProps {
  title?: string;
  guides: GuideClusterCard[];
}

export function ServiceGuideCluster({
  title = "Helpful Guides & Checklists",
  guides,
}: ServiceGuideClusterProps) {
  if (!guides || guides.length === 0) return null;

  return (
    <SectionReveal className="bg-white rounded-[16px] p-6 sm:p-8 space-y-6 text-start">
      <div className="flex items-center gap-2 border-[#ECEAE3] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-ink-100 border border-[#ECEAE3] text-ink-600 text-xs font-mono font-medium uppercase">
          <BookOpen className="w-3.5 h-3.5 text-ink-600 shrink-0" />
          <span>Knowledge Base</span>
        </div>
        <h3 className="font-heading text-2xl font-medium text-ink-900">{title}</h3>
      </div>

      <StaggerGrid className="grid sm:grid-cols-3 gap-4" staggerDelay={0.06}>
        {guides.map((item, idx) => (
          <StaggerItem key={idx}>
            <Link
              href={item.href}
              className="group p-5 rounded-[16px] bg-white hover:bg-[#EAF8D6] hover:border-ink-900 transition-colors duration-200 text-decoration-none flex flex-col justify-between h-full space-y-3 block"
            >
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-white text-ink-500 text-xs font-mono ">
                  {item.readTime}
                </span>
                <h4 className="font-heading text-lg font-medium text-ink-900 group-hover:text-ink-900 leading-snug">
                  {item.title}
                </h4>
                <p className="text-sm text-ink-500 font-normal line-clamp-2">{item.excerpt}</p>
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-ink-600 pt-1">
                <span>Read Article</span>
                <ArrowRight className="w-4 h-4 text-ink-600" />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}
