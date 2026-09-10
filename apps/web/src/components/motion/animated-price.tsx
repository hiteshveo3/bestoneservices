"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "./motion-tokens";

export interface AnimatedPriceProps {
  value: string;
  className?: string;
}

/**
 * Crossfades a recalculated price so the change is noticed rather than
 * silently swapped. Functional feedback, not decoration — kept to 200ms.
 */
export function AnimatedPrice({ value, className = "" }: AnimatedPriceProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{value}</span>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{
          duration: MOTION_DURATION.fast,
          ease: MOTION_EASE,
        }}
        className={`inline-block ${className}`}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}
