"use client";

import { Check } from "lucide-react";

/**
 * Form success and error presentation.
 *
 * Success is the single place on the site where a "pop" is allowed: one
 * non-repeating 0.8→1 scale on the checkmark, marking a real confirmation
 * moment. Errors deliberately get the same calm fade as success — no shake,
 * no wobble, no colour flash. Shaking an error reads as scolding, which is
 * the wrong tone when someone is trying to book a cleaner.
 */

export function FormSuccess({
  title,
  children,
  className = "",
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={`form-status-in flex items-start gap-3 p-4 rounded-[16px] bg-[#F9FCF5] border border-[#99D055] text-start ${className}`}
    >
      <span className="form-check-pop grid place-items-center w-7 h-7 shrink-0 rounded-full bg-[#B7F56A] text-[#1F3A00]">
        <Check className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="m-0 font-medium text-[#1F3A00]">{title}</p>
        {children ? <div className="text-sm text-[#1F3A00]/80">{children}</div> : null}
      </div>
    </div>
  );
}

export function FormError({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      role="alert"
      className={`form-status-in m-0 p-4 rounded-[16px] bg-danger-50 text-danger-900 text-sm font-medium text-start ${className}`}
    >
      {children}
    </p>
  );
}
