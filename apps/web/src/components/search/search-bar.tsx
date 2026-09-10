"use client";

import { useState, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search services (e.g. 'oven clean', 'wasp nest', 'garden clearance')",
  className = "",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  // Tracks the external `value` so a prop change (e.g. clear all chips) can
  // be detected and applied during render, per React's documented pattern
  // for adjusting state from props — avoids the extra render + flash that
  // committing this in an effect would cause.
  const [syncedValue, setSyncedValue] = useState(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setLocalValue(value);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setLocalValue(next);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChange(next);
    }, 280);
  };

  const handleClear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setLocalValue("");
    onChange("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      <label htmlFor="service-search-input" className="sr-only">
        Search services
      </label>
      <div className="relative flex items-center">
        <Search
          className="absolute left-4 w-5 h-5 text-[#1F3A00]/60 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="service-search-input"
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full h-12 sm:h-14 pl-12 pr-11 bg-white border-2 border-[#E5FBC9] rounded-[18px] text-[#1F3A00] placeholder:text-[#1F3A00]/50 text-base font-normal shadow-2xs transition-colors duration-200 hover:border-[#B7F56A] focus:border-[#1F3A00] focus:outline-none"
        />
        {localValue.trim() && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 w-7 h-7 flex items-center justify-center rounded-full bg-[#DCFAB7]/60 text-[#1F3A00] hover:bg-[#B7F56A] transition-colors duration-150 cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
