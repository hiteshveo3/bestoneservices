"use client";

import { Check } from "lucide-react";

export interface BookingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const STEP_LABELS = [
  "Service",
  "Job Details",
  "Date & Time",
  "Contact Info",
  "Review & Lock",
];

export function BookingProgressBar({
  currentStep,
  totalSteps = 5,
  onStepClick,
}: BookingProgressBarProps) {
  if (currentStep > totalSteps) return null; // Hide on success screen

  return (
    <div className="space-y-4">
      {/* Mobile Compact Progress Bar */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between text-base font-medium text-ink-600">
          <span>{STEP_LABELS[currentStep - 1] || `Step ${currentStep}`}</span>
          <span className="text-xs font-mono font-medium text-ink-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[#DCFAB7] overflow-hidden">
          <div
            className="h-full bg-[#1F3A00] duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Clean Horizontal Progress Rail (Unboxed) */}
      <nav aria-label="Booking Progress" className="hidden sm:block">
        <ol className="flex items-center justify-between gap-2 list-none p-0 m-0">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <li key={idx} className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  disabled={stepNum > currentStep}
                  onClick={() => onStepClick?.(stepNum)}
                  className={`flex items-center gap-2 text-start cursor-pointer border-none bg-transparent ${
                    isCurrent
                      ? "text-ink-600 font-medium"
                      : isCompleted
                      ? "text-ink-600 hover:underline cursor-pointer"
                      : "text-ink-500 cursor-not-allowed opacity-50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-medium text-xs ${
                      isCurrent
                        ? "bg-[#1F3A00] text-white ring-2 ring-blue-600/40"
                        : isCompleted
                        ? "bg-[#1F3A00] text-white"
                        : "bg-[#DCFAB7] text-ink-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 text-white" /> : stepNum}
                  </div>
                  <span className="font-heading text-base truncate">{label}</span>
                </button>

                {idx < totalSteps - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isCompleted ? "bg-ink-900" : "bg-[#DCFAB7]"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
