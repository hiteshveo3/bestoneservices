"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE, MOTION_VIEWPORT } from "./motion-tokens";

export interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  delay?: number;
  once?: boolean;
  /** Opt out for above-the-fold imagery. */
  disabled?: boolean;
}

/**
 * Opacity-only reveal. Images deliberately do not scale, zoom or translate:
 * a photo that grows into place reads as a portfolio effect and, on a
 * service page, actively delays the user seeing the thing they came for.
 */
export function ImageReveal({
  src,
  alt,
  className = "",
  imageClassName = "",
  delay = 0,
  once = true,
  disabled = false,
}: ImageRevealProps) {
  const reduceMotion = useReducedMotion();

  if (disabled || reduceMotion) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imageClassName}`} />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ ...MOTION_VIEWPORT, once }}
        transition={{
          duration: MOTION_DURATION.reveal,
          delay,
          ease: MOTION_EASE,
        }}
        className={`w-full h-full object-cover ${imageClassName}`}
      />
    </div>
  );
}
