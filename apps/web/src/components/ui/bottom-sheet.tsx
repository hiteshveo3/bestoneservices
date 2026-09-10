"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "@/components/motion";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/50 backdrop-blur-xs"
          />

          {/* Slide-Up Panel (Sits safely above bottom nav) */}
          <motion.div
            initial={shouldReduceMotion ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE }}
            className="relative w-full bg-[#F9FCF5] rounded-t-3xl border-t border-[#E5FBC9] p-6 space-y-4 max-h-[80vh] overflow-y-auto text-start z-10 mb-16"
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5FBC9]">
              <div className="w-12 h-1.5 rounded-full bg-[#E5FBC9] mx-auto absolute top-2 left-1/2 -translate-x-1/2" />
              <h3 className="font-heading text-lg font-medium text-ink-900 pt-2">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#DCFAB7] text-ink-600 transition-colors duration-150"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-ink-600" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="pt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
