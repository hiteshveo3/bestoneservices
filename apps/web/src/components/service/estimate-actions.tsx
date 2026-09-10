"use client";

import { useState } from "react";
import { Share2, Bookmark, Check, X } from "lucide-react";
import {
  saveEstimateLocally,
  loadSavedEstimate,
  clearSavedEstimate,
  generateShareableUrl,
  type EstimateState,
} from "@/lib/estimate-persistence";

export interface EstimateActionsProps {
  currentState: EstimateState;
  onRestoreState?: (state: EstimateState) => void;
}

export function EstimateActions({ currentState, onRestoreState }: EstimateActionsProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<EstimateState | null>(() => {
    const previous = loadSavedEstimate();
    if (previous && previous.service && previous.service !== currentState.service) {
      return previous;
    }
    return null;
  });

  const handleSave = () => {
    saveEstimateLocally(currentState);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleShare = async () => {
    const url = generateShareableUrl(currentState);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Best One Services Estimate",
          text: `Check my estimate configuration for ${currentState.service || "service"}`,
          url,
        });
        return;
      } catch {
        // Fallback to copy link
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4 text-start">
      {/* RESUME ESTIMATE BANNER (For Returning Users) */}
      {resumePrompt && (
        <div className="p-4 rounded-[16px] bg-white border-2 border-[#99D055] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-start animate-in fade-in duration-200">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-medium text-ink-500 uppercase">PREVIOUS ESTIMATE FOUND</span>
            <p className="text-base font-medium text-ink-600">
              Continue your previous estimate for{" "}
              <span className="font-medium text-ink-600 uppercase">{resumePrompt.service.replaceAll("-", " ")}</span>?
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onRestoreState) onRestoreState(resumePrompt);
                setResumePrompt(null);
              }}
              className="px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] text-sm font-semibold hover:bg-[#2d5004] cursor-pointer"
            >
              Continue Estimate
            </button>
            <button
              type="button"
              onClick={() => {
                clearSavedEstimate();
                setResumePrompt(null);
              }}
              aria-label="Dismiss previous estimate prompt"
              className="p-2 rounded-full bg-[#F9FCF5] text-ink-600 hover:bg-[#DCFAB7] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SAVE & SHARE ACTION CONTROLS */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2.5 rounded-full bg-white border border-[#B7F56A] text-ink-600 text-sm font-medium hover:bg-[#DCFAB7] transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-ink-600" /> : <Bookmark className="w-4 h-4 text-ink-600" />}
          <span>{saved ? "Saved on this device" : "Save Estimate"}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="px-4 py-2.5 rounded-full bg-white border border-[#B7F56A] text-ink-600 text-sm font-medium hover:bg-[#DCFAB7] transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-ink-600" /> : <Share2 className="w-4 h-4 text-ink-600" />}
          <span>{copied ? "Link Copied!" : "Share Estimate"}</span>
        </button>
      </div>
    </div>
  );
}
