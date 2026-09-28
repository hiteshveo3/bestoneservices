"use client";

import { ReactNode } from "react";

export interface ServiceBadgeProps {
  children: ReactNode;
  variant?: "primary" | "neutral" | "dark" | "outline" | "status";
  className?: string;
}

export function ServiceBadge({ children, variant = "primary", className = "" }: ServiceBadgeProps) {
  const variantStyles = {
    primary: "bg-[#EAF8D6] text-[#1D201E] border-[#ECEAE3]",
    neutral: "bg-white text-[#1D201E] border-[#ECEAE3]",
    dark: "bg-[#B7F56A] text-[#1D201E] border-[#1D201E]",
    outline: "bg-transparent text-[#1D201E] border-[#ECEAE3]",
    status: "bg-[#EAF8D6] text-[#1D201E] border-[#ECEAE3]",
  };

  // The "status" variant reads as plain-language status text (e.g. a booking
  // status), so it skips the uppercase/mono/tracking treatment the other
  // variants use for short label-style badges.
  const textStyle =
    variant === "status" ? "text-xs font-medium normal-case" : "text-xs font-mono font-medium uppercase tracking-wider";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border ${textStyle} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
