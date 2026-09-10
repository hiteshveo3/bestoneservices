"use client";

import React from "react";
import { motion, MotionProps, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE, MOTION_VIEWPORT, MOTION_Y_OFFSET } from "./motion-tokens";

export interface MaskedTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
  delay?: number;
  once?: boolean;
  /** Opt out for above-the-fold headings. */
  disabled?: boolean;
}

/**
 * Section-level heading reveal: a single fade-up for the whole block.
 * Deliberately not per-word or per-character — typewriter and word-stagger
 * effects read as portfolio flourish, which is the wrong tone here.
 */
export function MaskedText({
  children,
  className = "",
  as = "div",
  delay = 0,
  once = true,
  disabled = false,
}: MaskedTextProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] as React.ComponentType<MotionProps & { className?: string; children?: React.ReactNode }>;

  if (disabled || reduceMotion) {
    return React.createElement(as, { className }, children);
  }

  return (
    <Component
      initial={{ opacity: 0, y: MOTION_Y_OFFSET }}
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
    </Component>
  );
}
