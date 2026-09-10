"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE, MOTION_VIEWPORT, MOTION_Y_OFFSET } from "./motion-tokens";

export interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  /** Set false only for content that legitimately re-enters (it rarely is). */
  once?: boolean;
  /**
   * Opt out entirely. Use for anything above the fold: hero copy and primary
   * CTAs must paint immediately, never wait on an observer.
   */
  disabled?: boolean;
}

export function SectionReveal({
  children,
  className = "",
  delay = 0,
  yOffset = MOTION_Y_OFFSET,
  once = true,
  disabled = false,
}: SectionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (disabled || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ ...MOTION_VIEWPORT, once }}
      transition={{
        duration: MOTION_DURATION.reveal,
        delay,
        ease: MOTION_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
