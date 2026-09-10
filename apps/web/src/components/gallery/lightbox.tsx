"use client";

import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        onNavigate((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox viewer"
      className="fixed inset-0 z-50 bg-ink-900/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
    >
      {/* Lightbox Header Bar */}
      <div className="flex items-center justify-between text-white z-10">
        <span className="text-sm font-mono font-medium">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close image lightbox"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors duration-150"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main Lightbox Image View */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors duration-150"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        <img
          src={currentImg.src}
          alt={currentImg.alt}
          className="max-h-[75vh] max-w-full object-contain rounded-[16px] border border-[#E5FBC9]"
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex + 1) % images.length)}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors duration-150"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Lightbox Caption Footer */}
      {currentImg.caption && (
        <div className="text-center text-white/90 text-sm font-medium pb-2 max-w-xl mx-auto">
          {currentImg.caption}
        </div>
      )}
    </div>
  );
}
