"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_STAGGER, MOTION_VIEWPORT, staggerItemVariants } from "./motion-tokens";

export interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  /** Per-item delay. Spec range 60–100ms; anything longer drags. */
  staggerDelay?: number;
  once?: boolean;
  /** Opt out for above-the-fold groups. */
  disabled?: boolean;
}

/**
 * The one place a cascade is appropriate: a grid of sibling cards or stats
 * appearing in reading order as the section enters view.
 */
export function StaggerGrid({
  children,
  className = "",
  staggerDelay = MOTION_STAGGER.normal,
  once = true,
  disabled = false,
}: StaggerGridProps) {
  const reduceMotion = useReducedMotion();

  if (disabled || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ ...MOTION_VIEWPORT, once }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  if (disabled || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
