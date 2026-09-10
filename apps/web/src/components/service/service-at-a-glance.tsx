"use client";

import { Tag, ShieldCheck, MapPin, Clock, Users, PoundSterling } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export interface AtAGlanceField {
  label: string;
  value: string;
  icon?: "price" | "guarantee" | "coverage" | "type" | "team" | "clock";
}

export interface ServiceAtAGlanceProps {
  title?: string;
  fields: AtAGlanceField[];
}

export function ServiceAtAGlance({ title = "Service at a Glance", fields }: ServiceAtAGlanceProps) {
  if (!fields || fields.length === 0) return null;

  const getIcon = (type?: AtAGlanceField["icon"]) => {
    switch (type) {
      case "price": return PoundSterling;
      case "guarantee": return ShieldCheck;
      case "coverage": return MapPin;
      case "team": return Users;
      case "clock": return Clock;
      default: return Tag;
    }
  };

  return (
    <SectionReveal className="bg-[#F8F9FA] rounded-[16px] p-6 border border-[#E5FBC9] space-y-4 text-start">
      <div className="flex items-center gap-2 font-heading font-medium text-lg text-ink-900 border-b border-[#E5FBC9] pb-3">
        <Tag className="w-5 h-5 text-ink-600 shrink-0" />
        <span>{title}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fields.map((field, idx) => {
          const Icon = getIcon(field.icon);
          return (
            <div key={idx} className="space-y-1 p-3 rounded-[16px] bg-white border border-[#B7F56A]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-ink-500 uppercase tracking-wider">
                <Icon className="w-3.5 h-3.5 text-ink-600 shrink-0" />
                <span>{field.label}</span>
              </div>
              <div className="font-heading font-medium text-base text-ink-900 truncate">
                {field.value}
              </div>
            </div>
          );
        })}
      </div>
    </SectionReveal>
  );
}
