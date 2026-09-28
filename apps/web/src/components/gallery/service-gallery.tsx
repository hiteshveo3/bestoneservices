"use client";

import { useState } from "react";
import { Camera, ZoomIn } from "@/components/icons";
import { SectionReveal } from "@/components/motion";
import { Lightbox, type LightboxImage } from "./lightbox";

export interface ServiceGalleryProps {
  title?: string;
  subtitle?: string;
  images: LightboxImage[];
}

export function ServiceGallery({
  title = "Verified Service Work",
  subtitle = "High-resolution photography from verified job completions",
  images,
}: ServiceGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // STRICT RULE: Do not render section if no verified image data exists
  if (!images || images.length === 0) return null;

  const openLightboxAt = (idx: number) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      <SectionReveal className="bg-white rounded-[16px] p-6 sm:p-10 space-y-6 text-start">
        <div className="space-y-1 border-[#ECEAE3] pb-4">
          <div className="inline-flex items-center gap-1.5 ts-eyebrow">
            <Camera className="w-3.5 h-3.5 text-[#1D201E] shrink-0" />
            <span>AUTHENTIC PHOTOGRAPHY</span>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">{title}</h3>
          <p className="text-base text-ink-500">{subtitle}</p>
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightboxAt(idx)}
              className={`group relative rounded-[16px] overflow-hidden cursor-pointer hover:bg-[#EAF8D6] transition-colors duration-200 bg-white ${
 idx === 0 ? "sm:col-span-2 sm:row-span-2 aspect-4/3" : "aspect-4/3"
 }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-ink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                <div className="p-3 rounded-full bg-white text-ink-600 ">
                  <ZoomIn className="w-5 h-5 text-ink-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* Accessible Lightbox Modal */}
      <Lightbox
        images={images}
        currentIndex={activeIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setActiveIdx(newIdx)}
      />
    </>
  );
}
