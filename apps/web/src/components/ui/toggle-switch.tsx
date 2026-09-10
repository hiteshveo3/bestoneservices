"use client";

import { useId } from "react";

export interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className = "",
}: ToggleSwitchProps) {
  const switchId = useId();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between gap-4 p-3.5 rounded-[16px] bg-white border border-[#B7F56A] cursor-pointer transition-colors duration-200 ${
        disabled ? "opacity-40 cursor-not-allowed" : "hover:border-ink-900/30"
      } ${className}`}
    >
      <div className="space-y-0.5 text-start">
        <label htmlFor={switchId} className="font-heading font-medium text-base text-ink-900 cursor-pointer block">
          {label}
        </label>
        {description && <p className="text-xs text-ink-500 font-normal">{description}</p>}
      </div>

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#99D055] ${
          checked ? "bg-[#1F3A00]" : "bg-[#E5FBC9]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-ink-900 transition duration-200 ease-in-out ${ checked ? "translate-x-5" : "translate-x-0" } border border-[#E5FBC9]`}
        />
      </button>
    </div>
  );
}
