"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bug, Leaf, Package, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { ServiceCategory } from "@/content/service-directory";

type ServiceCardMotionProps = {
  category: ServiceCategory;
  serviceName: string;
  serviceId: string;
};

const floatTransition = { duration: 2.8, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" as const };
const RODENT_CARD_IMAGES: Record<string, string> = {
  "mice-control": "/images/service/pest-mouse-mice-control-v1.webp",
  "rat-control": "/images/service/pest-mouse-rat-control-v1.webp",
  "pest-inspection-survey": "/images/service/pest-mouse-inspection-v1.webp",
  "dead-pest-removal": "/images/service/pest-mouse-proofing-v1.webp",
};

export function ServiceCardMotion({ category, serviceName, serviceId }: ServiceCardMotionProps) {
  const reduceMotion = useReducedMotion();
  const [pestFrame, setPestFrame] = useState(0);
  const isRodentService = /mouse|mice|rat|rodent/i.test(serviceName);
  const suppliedRodentImage = RODENT_CARD_IMAGES[serviceId];
  const animation = reduceMotion ? undefined : { y: [-6, 6, -6] };

  useEffect(() => {
    if (reduceMotion || category !== "pest-control" || !isRodentService) return;
    const interval = window.setInterval(() => setPestFrame((frame) => (frame + 1) % 6), 520);
    return () => window.clearInterval(interval);
  }, [category, isRodentService, reduceMotion]);

  return (
    <div
      role="img"
      aria-label={`${serviceName} service illustration`}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#F4FBEA] text-[#1F3A00]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,#ffffff_0,transparent_32%),linear-gradient(135deg,#f9fcf5_0%,#e7f7ce_100%)]" />
      <div className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-[#B7F56A]/35 blur-2xl" />

      {category === "cleaning" && (
        <>
          <motion.div animate={reduceMotion ? undefined : { rotate: [0, 7, 0], y: [0, -4, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 grid h-24 w-24 place-items-center rounded-[28px] border border-[#B7F56A] bg-white shadow-sm">
            <Sparkles className="h-11 w-11 text-[#4E8C16]" strokeWidth={1.7} />
          </motion.div>
          <motion.span animate={animation} className="absolute left-[22%] top-[24%] h-3 w-3 rounded-full bg-[#B7F56A]" />
          <motion.span animate={animation} transition={{ ...floatTransition, delay: 0.6 }} className="absolute right-[20%] bottom-[25%] h-2 w-2 rounded-full bg-[#1F3A00]/25" />
          <motion.div animate={reduceMotion ? undefined : { x: [-36, 36, -36] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] h-1.5 w-20 rounded-full bg-[#B7F56A]" />
        </>
      )}

      {category === "pest-control" && suppliedRodentImage && (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${suppliedRodentImage})` }} />
      )}

      {category === "pest-control" && isRodentService && !suppliedRodentImage && (
        <div
          className="absolute inset-0 bg-no-repeat transition-[background-position] duration-200"
          style={{
            backgroundImage: `url(${reduceMotion ? "/images/service/pest-mouse-card-v1.webp" : "/images/service/pest-mouse-sprite-v1.webp"})`,
            backgroundSize: reduceMotion ? "cover" : "300% 200%",
            backgroundPosition: reduceMotion ? "center" : `${(pestFrame % 3) * 50}% ${Math.floor(pestFrame / 3) * 100}%`,
          }}
        />
      )}

      {category === "pest-control" && !isRodentService && !suppliedRodentImage && (
        <>
          <motion.div animate={reduceMotion ? undefined : { scale: [1, 1.07, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 grid h-24 w-24 place-items-center rounded-full border-[3px] border-[#B7F56A] bg-white shadow-sm">
            <Bug className="h-10 w-10 text-[#1F3A00]" strokeWidth={1.7} />
            <ShieldCheck className="absolute -right-3 -bottom-2 h-9 w-9 rounded-full bg-[#B7F56A] p-1.5 text-[#1F3A00]" strokeWidth={2} />
          </motion.div>
          <motion.span animate={reduceMotion ? undefined : { scale: [0.86, 1.08, 0.86], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="absolute h-36 w-36 rounded-full border border-[#B7F56A]" />
        </>
      )}

      {category === "gardening" && (
        <>
          <motion.div animate={reduceMotion ? undefined : { rotate: [-5, 6, -5], y: [0, -4, 0] }} transition={floatTransition} className="relative z-10 grid h-24 w-24 place-items-center rounded-[28px] border border-[#B7F56A] bg-white shadow-sm">
            <Leaf className="h-12 w-12 text-[#4E8C16]" strokeWidth={1.6} />
          </motion.div>
          {["left-[22%] top-[28%]", "right-[20%] top-[26%]", "right-[25%] bottom-[22%]"].map((position, index) => (
            <motion.span key={position} animate={reduceMotion ? undefined : { y: [-5, 6, -5], rotate: [-10, 8, -10] }} transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.35, ease: "easeInOut" }} className={`absolute ${position} h-4 w-2 rounded-full bg-[#B7F56A]`} />
          ))}
        </>
      )}

      {category === "removals" && (
        <>
          <motion.div animate={reduceMotion ? undefined : { x: [-8, 8, -8] }} transition={floatTransition} className="relative z-10 flex items-end gap-2">
            <div className="grid h-20 w-20 place-items-center rounded-[22px] border border-[#B7F56A] bg-white shadow-sm"><Package className="h-10 w-10 text-[#1F3A00]" strokeWidth={1.7} /></div>
            <Truck className="mb-1 h-11 w-11 text-[#4E8C16]" strokeWidth={1.7} />
          </motion.div>
          <motion.div animate={reduceMotion ? undefined : { x: [-42, 42, -42] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[22%] h-1.5 w-24 rounded-full bg-[#B7F56A]" />
        </>
      )}
    </div>
  );
}
