"use client";

import { ReactNode } from "react";

export interface ServiceBadgeProps {
  children: ReactNode;
  variant?: "primary" | "neutral" | "dark" | "outline" | "status";
  className?: string;
}

export function ServiceBadge({ children, variant = "primary", className = "" }: ServiceBadgeProps) {
  const variantStyles = {
    primary: "bg-[#DCFAB7] text-[#1F3A00] border-[#99D055]",
    neutral: "bg-white text-[#1F3A00] border-[#E5FBC9]",
    dark: "bg-[#1F3A00] text-[#B7F56A] border-[#1F3A00]",
    outline: "bg-transparent text-[#1F3A00] border-[#E5FBC9]",
    status: "bg-[#DCFAB7] text-[#1F3A00] border-[#99D055]",
  };

  // The "status" variant reads as plain-language status text (e.g. a booking
  // status), so it skips the uppercase/mono/tracking treatment the other
  // variants use for short label-style badges.
  const textStyle =
    variant === "status" ? "text-xs font-medium normal-case" : "text-xs font-mono font-medium uppercase tracking-wider";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${textStyle} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
