"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "@/components/motion";

export function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 240);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE }}
          className="fixed bottom-[196px] lg:bottom-8 right-4 sm:right-6 z-40"
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="w-12 h-12 rounded-full bg-[#B7F56A] text-[#1F3A00] flex items-center justify-center cursor-pointer hover:opacity-90 border border-[#B7F56A] shadow-sm transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-[#99D055]"
          >
            <HugeiconsIcon icon={ArrowUp01Icon} size={20} strokeWidth={2.5} className="text-[#1F3A00]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



