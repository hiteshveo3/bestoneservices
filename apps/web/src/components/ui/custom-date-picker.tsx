"use client";

import { useState, useRef, useEffect, useId } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Calendar03Icon, 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  CheckmarkCircle02Icon
} from "@hugeicons/core-free-icons";

export interface CustomDatePickerProps {
  id?: string;
  label?: string;
  value?: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // YYYY-MM-DD (defaults to today)
  error?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseISODate(isoString: string): Date | null {
  if (!isoString) return null;
  const parts = isoString.split("-").map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function formatISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(isoString: string): string {
  if (!isoString) return "";
  const d = parseISODate(isoString);
  if (!d) return isoString;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function CustomDatePicker({
  id,
  label = "Select service date",
  value = "",
  onChange,
  minDate,
  error,
  helperText,
  placeholder = "Choose date...",
  className = "",
}: CustomDatePickerProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = formatISODate(today);

  const effectiveMinISO = minDate || todayISO;
  const effectiveMinDate = parseISODate(effectiveMinISO) || today;

  // Track the month and year currently viewed in the calendar
  const initialDate = parseISODate(value) || effectiveMinDate;
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  // Keep view in sync when value changes externally
  useEffect(() => {
    if (value) {
      const parsed = parseISODate(value);
      if (parsed) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Can navigate to previous month? (Don't allow going before min month)
  const canGoPrev = (() => {
    const minYear = effectiveMinDate.getFullYear();
    const minMonth = effectiveMinDate.getMonth();
    return viewYear > minYear || (viewYear === minYear && viewMonth > minMonth);
  })();

  // Calculate calendar days
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Day of week for 1st of month: 0 is Sun, 1 is Mon... convert to Monday=0, Sunday=6
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const days: { day: number; iso: string; disabled: boolean; isToday: boolean; isSelected: boolean }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const current = new Date(viewYear, viewMonth, d);
    const iso = formatISODate(current);
    const disabled = iso < effectiveMinISO;
    const isToday = iso === todayISO;
    const isSelected = iso === value;

    days.push({ day: d, iso, disabled, isToday, isSelected });
  }

  // Quick shortcuts
  const selectQuick = (targetISO: string) => {
    onChange(targetISO);
    setIsOpen(false);
  };

  const getTomorrowISO = () => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return formatISODate(d);
  };

  const getWeekendISO = () => {
    const d = new Date(today);
    const day = d.getDay(); // 0 is Sun, 6 is Sat
    const diff = day === 6 ? 0 : day === 0 ? 6 : 6 - day;
    d.setDate(d.getDate() + (diff === 0 ? 7 : diff)); // Next Saturday
    return formatISODate(d);
  };

  const tomorrowISO = getTomorrowISO();
  const weekendISO = getWeekendISO();

  return (
    <div ref={containerRef} className={`relative space-y-1.5 text-start w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-semibold text-[#1F3A00] block"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={inputId}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-h-[52px] px-4 py-3 rounded-[14px] bg-white border-2 text-start flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs focus:outline-none ${
          error 
            ? "border-red-500 ring-2 ring-red-100" 
            : isOpen 
              ? "border-[#1F3A00] ring-4 ring-[#B7F56A]/30" 
              : "border-[#D1E8B8] hover:border-[#99D055]"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 transition-colors ${
            value ? "bg-[#DCFAB7] text-[#1F3A00]" : "bg-[#F9FCF5] text-[#1F3A00]/60"
          }`}>
            <HugeiconsIcon icon={Calendar03Icon} size={18} strokeWidth={2} />
          </div>
          <div className="truncate">
            {value ? (
              <span className="font-semibold text-base text-[#1F3A00]">
                {formatDisplayDate(value)}
              </span>
            ) : (
              <span className="text-base text-[#1F3A00]/45 font-medium">
                {placeholder}
              </span>
            )}
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-[#1F3A00] shrink-0">
          {isOpen ? "Close" : "Change"}
        </span>
      </button>

      {error ? (
        <p role="alert" className="text-xs font-semibold text-red-600 pt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#1F3A00]/60 pt-0.5">{helperText}</p>
      ) : null}

      {/* Popover Calendar */}
      {isOpen && (
        <div 
          role="dialog"
          aria-label="Calendar date picker"
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-full sm:w-[350px] bg-white rounded-[18px] border-2 border-[#B7F56A] shadow-2xl p-4 animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Quick Choice Chips */}
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#E5FBC9] overflow-x-auto">
            <button
              type="button"
              onClick={() => selectQuick(tomorrowISO)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                value === tomorrowISO
                  ? "bg-[#1F3A00] text-[#B7F56A]"
                  : "bg-[#F9FCF5] text-[#1F3A00] hover:bg-[#DCFAB7] border border-[#E5FBC9]"
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => selectQuick(weekendISO)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                value === weekendISO
                  ? "bg-[#1F3A00] text-[#B7F56A]"
                  : "bg-[#F9FCF5] text-[#1F3A00] hover:bg-[#DCFAB7] border border-[#E5FBC9]"
              }`}
            >
              This Weekend
            </button>
          </div>

          {/* Month & Year Navigation Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="font-heading font-bold text-base text-[#1F3A00]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h4>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                disabled={!canGoPrev}
                aria-label="Previous month"
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#1F3A00] hover:bg-[#DCFAB7] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#1F3A00] hover:bg-[#DCFAB7] cursor-pointer transition-colors"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="text-[11px] font-bold uppercase tracking-wider text-[#1F3A00]/50 py-1">
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Blank cells for offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="w-full aspect-square" />
            ))}

            {/* Month Days */}
            {days.map(({ day, iso, disabled, isToday, isSelected }) => {
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(iso);
                    setIsOpen(false);
                  }}
                  className={`w-full aspect-square rounded-[10px] text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-[#1F3A00] text-[#B7F56A] shadow-md scale-105 font-bold z-10"
                      : disabled
                        ? "text-gray-300 cursor-not-allowed hover:bg-transparent"
                        : isToday
                          ? "bg-[#DCFAB7] text-[#1F3A00] hover:bg-[#cbf799]"
                          : "text-[#1F3A00] hover:bg-[#F9FCF5] hover:border hover:border-[#B7F56A]"
                  }`}
                >
                  <span>{day}</span>
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#1F3A00]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2.5 border-t border-[#E5FBC9] flex items-center justify-between text-[11px] text-[#1F3A00]/70">
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} strokeWidth={2} className="text-[#1F3A00]" />
              Same-day & next-day slots
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-bold text-[#1F3A00] hover:underline cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
