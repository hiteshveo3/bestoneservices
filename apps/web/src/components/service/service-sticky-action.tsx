"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "@/components/motion";

export interface ServiceStickyActionProps {
  title: string;
  startingPrice: string;
  ctaText?: string;
  ctaHref?: string;
}

export function ServiceStickyAction({
  title,
  startingPrice,
  ctaText = "Get Estimate",
  ctaHref = "#calculator",
}: ServiceStickyActionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="sticky top-16 z-30 pointer-events-none hidden sm:flex justify-center py-2">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: MOTION_DURATION.fast,
          ease: MOTION_EASE,
        }}
        className="pointer-events-auto bg-[#F9FCF5]/95 backdrop-blur-md p-2 sm:p-2.5 rounded-full border border-[#B7F56A] flex items-center justify-between gap-3 sm:gap-4 max-w-lg w-full mx-4 sm:mx-auto shadow-sm"
      >
        <div className="flex items-center gap-3 px-3">
          <span className="px-3 py-1 rounded-full bg-[#DCFAB7] text-[#1F3A00] font-bold font-mono text-sm sm:text-base shrink-0 border border-[#99D055]">
            {startingPrice}
          </span>
          <span className="text-base font-semibold text-[#1F3A00] truncate">
            {title}
          </span>
        </div>

        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shrink-0 gap-1.5 text-decoration-none"
        >
          <span>{ctaText}</span>
          <ArrowRight className="w-4 h-4 text-[#1F3A00]" />
        </Link>
      </motion.div>
    </div>
  );
}

