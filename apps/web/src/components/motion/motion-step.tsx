"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "./motion-tokens";

export interface MotionStepProps {
  stepKey: string | number;
  children: React.ReactNode;
  direction?: "forward" | "backward";
  className?: string;
}

/**
 * Booking-wizard step change. A short directional fade communicates "you
 * moved forward/back" — this is wayfinding, not a slide transition.
 */
export function MotionStep({
  stepKey,
  children,
  direction = "forward",
  className = "",
}: MotionStepProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const xInitial = direction === "forward" ? 12 : -12;
  const xExit = direction === "forward" ? -12 : 12;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: xInitial }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: xExit }}
        transition={{
          duration: MOTION_DURATION.fast,
          ease: MOTION_EASE,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
