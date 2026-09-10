"use client";

import { useState, useRef, useEffect, useId, forwardRef, type KeyboardEvent } from "react";
import { ChevronDown, Check, Plus, Minus, Calendar } from "lucide-react";

/* 1. CUSTOM TEXT INPUT */
export interface CustomTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function CustomTextInput({ label, helperText, error, id, className = "", ...props }: CustomTextInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="space-y-1.5 text-start w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm text-ink-600 block font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`w-full min-h-12 px-3 py-2 rounded-[16px] bg-white border text-base font-normal text-ink-600 placeholder:text-ink-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
          error ? "border-danger-500 bg-danger-50/50" : "border-[#E5FBC9] hover:border-ink-900/30"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-mono text-danger-500 pt-0.5">{error}</p>
      ) : helperText ? (
        <p id={helperId} className="text-xs font-mono text-ink-500 pt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

/* 2. CUSTOM SELECT / COMBOBOX */
export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  "aria-describedby"?: string;
}

export function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  error,
  className = "",
  "aria-describedby": ariaDescribedBy,
}: CustomSelectProps) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const errorId = `${generatedId}-error`;
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, highlightedIndex]);

  const open = () => {
    setIsOpen(true);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  };

  const selectOption = (val: string) => {
    onChange(val);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        open();
        return;
      }
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setHighlightedIndex((i) => (i + delta + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isOpen) {
        open();
      } else if (highlightedIndex >= 0) {
        selectOption(options[highlightedIndex].value);
      }
    } else if (e.key === "Escape") {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`space-y-1.5 text-start w-full relative ${className}`}>
      {label && (
        <label className="text-sm text-ink-600 block font-medium">
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : ariaDescribedBy}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-12 px-3 py-2 rounded-[16px] bg-white border text-base font-normal text-ink-600 transition-colors duration-150 flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 ${
          error ? "border-danger-500" : isOpen ? "border-ink-900 bg-white" : "border-[#E5FBC9] hover:border-ink-900/30"
        }`}
      >
        <span className={selectedOption ? "text-ink-600" : "text-ink-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-ink-600 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-[#E5FBC9] p-1.5 list-none space-y-1"
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(opt.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`p-3 rounded-[16px] text-base font-medium transition-colors duration-150 cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-[#1F3A00] text-white font-medium"
                    : isHighlighted
                    ? "bg-[#DCFAB7] text-[#1F3A00]"
                    : "text-[#1F3A00] hover:bg-[#DCFAB7]"
                }`}
              >
                <div>
                  <div>{opt.label}</div>
                  {opt.sublabel && <div className="text-xs font-mono text-ink-500 font-normal">{opt.sublabel}</div>}
                </div>
                {isSelected && <Check className="w-4 h-4 text-ink-600 shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
      {error && <p id={errorId} role="alert" className="text-xs font-mono text-danger-500 pt-0.5">{error}</p>}
    </div>
  );
}

/* 2b. CUSTOM DATE INPUT — wraps the native date input with a styled calendar
   trigger. The trigger calls showPicker() so clicking anywhere on the field
   opens the native OS/browser date picker rather than relying on the tiny
   default calendar-icon hitbox. */
export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  { label, error, id, className = "", disabled, ...props },
  forwardedRef
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const internalRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (disabled) return;
    const el = internalRef.current;
    try {
      el?.showPicker?.();
    } catch {
      el?.focus();
    }
  };

  return (
    <div className="space-y-1.5 text-start w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm text-ink-600 block font-medium">
          {label}
        </label>
      )}
      <div className={`relative flex items-center ${disabled ? "opacity-50" : ""}`}>
        <input
          id={inputId}
          type="date"
          disabled={disabled}
          ref={(node) => {
            internalRef.current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          onClick={openPicker}
          className={`w-full min-h-12 px-3 py-2 pe-11 rounded-[16px] bg-white border text-base font-normal text-ink-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
            error ? "border-danger-500 bg-danger-50/50" : "border-[#E5FBC9] hover:border-ink-900/30"
          } ${className}`}
          {...props}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : props["aria-describedby"]}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled}
          onClick={openPicker}
          className="pointer-events-none absolute end-3 text-ink-500"
        >
          <Calendar className="w-4.5 h-4.5" />
        </button>
      </div>
      {error && <p id={errorId} role="alert" className="text-xs font-mono text-danger-500 pt-0.5">{error}</p>}
    </div>
  );
});

/* 3. CUSTOM RANGE SLIDER */
export interface CustomRangeSliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
}

export function CustomRangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = "",
}: CustomRangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2 text-start w-full">
      {label && (
          <div className="flex justify-between items-center text-sm text-ink-600 font-medium">
          <span>{label}</span>
          <span className="text-[#1F3A00] font-medium px-2.5 py-0.5 rounded-[16px] bg-[#1F3A00] text-base">
            {value} {unit}
          </span>
        </div>
      )}
      <div className="relative flex items-center h-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-[#F9FCF5] border border-[#E5FBC9] rounded-[16px] appearance-none cursor-pointer focus:outline-none accent-blue-600"
          style={{
            /* MIGRATION-REVIEW: functional range-track fill, not a decorative gradient */
            background: `linear-gradient(to right, var(--color-blue-500) ${percentage}%, var(--color-bone-200) ${percentage}%)`,
          }}
        />
      </div>
    </div>
  );
}

/* 4. NUMBER STEPPER CONTROLLER */
export interface NumberStepperProps {
  label?: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (val: number) => void;
}

export function NumberStepper({ label, min = 1, max = 10, value, onChange }: NumberStepperProps) {
  return (
    <div className="space-y-1.5 text-start">
      {label && <label className="text-sm text-ink-600 block font-medium">{label}</label>}
      <div className="inline-flex items-center gap-3 p-1.5 rounded-[16px] bg-[#F9FCF5] border border-[#E5FBC9]">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={label ? `Decrease ${label}` : "Decrease"}
          className="w-9 h-9 rounded-[16px] bg-white border border-[#B7F56A] text-ink-600 flex items-center justify-center font-medium hover:bg-[#DCFAB7] disabled:opacity-40 cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-heading font-medium text-lg text-ink-900 px-2 min-w-8 text-center" aria-live="polite">{value}</span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={label ? `Increase ${label}` : "Increase"}
          className="w-9 h-9 rounded-[16px] bg-white border border-[#B7F56A] text-ink-600 flex items-center justify-center font-medium hover:bg-[#DCFAB7] disabled:opacity-40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
