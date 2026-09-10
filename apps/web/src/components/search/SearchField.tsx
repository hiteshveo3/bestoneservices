"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Cancel01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { SERVICES_DIRECTORY } from "@/content/service-directory";

interface Suggestion {
  id: string;
  title: string;
  category: string;
  hint: string;
  href: string;
  isRecent?: boolean;
}

interface SearchFieldProps {
  defaultValue?: string;
  placeholder?: string;
  buttonLabel?: string;
  layout?: "stacked" | "inline";
  className?: string;
  onSearch?: (term: string) => void;
}

const RECENT_KEY = "bestone_recent_searches";

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw).slice(0, 5) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  if (typeof window === "undefined" || !term.trim()) return;
  try {
    const termClean = term.trim();
    const prev = getRecentSearches().filter((q) => q.toLowerCase() !== termClean.toLowerCase());
    localStorage.setItem(RECENT_KEY, JSON.stringify([termClean, ...prev].slice(0, 5)));
  } catch {
    // Ignore storage quota errors
  }
}

export function SearchField({
  defaultValue = "",
  placeholder = "Search cleaning, bed bugs, removals, gardening…",
  buttonLabel = "Search",
  layout = "inline",
  className = "",
  onSearch,
}: SearchFieldProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  // Tracks `defaultValue` so an external change (e.g. a URL param update)
  // can be detected and applied during render, per React's documented
  // pattern for adjusting state from props — avoids the extra render +
  // flash that committing this in an effect would cause.
  const [syncedDefaultValue, setSyncedDefaultValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  // Lazy initializer: recents only need reading once, on first client
  // render, so there is nothing here for an effect to "synchronize" — the
  // SSR-safe localStorage read already no-ops on the server.
  const [recentQueries, setRecentQueries] = useState<string[]>(() => getRecentSearches());
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  if (defaultValue !== syncedDefaultValue) {
    setSyncedDefaultValue(defaultValue);
    setValue(defaultValue);
  }

  // Compute suggestions based on value
  const suggestions: Suggestion[] = useMemo(() => {
    const q = value.toLowerCase().trim();
    if (!q) {
      return recentQueries.map((item) => ({
        id: `recent-${item}`,
        title: item,
        category: "Recent",
        hint: "Recent search",
        href: `/search?q=${encodeURIComponent(item)}`,
        isRecent: true,
      }));
    }

    const matches: Suggestion[] = [];
    for (const service of SERVICES_DIRECTORY) {
      const nameMatch = service.name.toLowerCase().includes(q);
      const subMatch = service.subService.toLowerCase().includes(q);
      const aliasMatch = service.aliases.find((a) => a.toLowerCase().includes(q));

      if (nameMatch || subMatch || aliasMatch) {
        matches.push({
          id: service.id,
          title: service.name,
          category: service.categoryLabel,
          hint: aliasMatch ? `Matches "${aliasMatch}"` : service.subService,
          href: `/search?q=${encodeURIComponent(service.name)}`,
        });
      }
      if (matches.length >= 6) break;
    }
    return matches;
  }, [value, recentQueries]);

  // Click outside listener
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Reset the highlighted suggestion whenever the query changes, applied
  // during render (see the defaultValue sync above for why) rather than in
  // an effect.
  const [cursorResetFor, setCursorResetFor] = useState(value);
  if (value !== cursorResetFor) {
    setCursorResetFor(value);
    setCursor(-1);
  }

  const handleSelect = (item: Suggestion) => {
    saveRecentSearch(item.title);
    setValue(item.title);
    setOpen(false);
    if (onSearch) {
      onSearch(item.title);
    } else {
      router.push(item.href);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const term = value.trim();
    if (term) saveRecentSearch(term);
    setOpen(false);
    if (onSearch) {
      onSearch(term);
    } else {
      router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!suggestions.length) return;
      e.preventDefault();
      setOpen(true);
      setCursor((prev) => {
        const next = e.key === "ArrowDown" ? prev + 1 : prev - 1;
        return (next + suggestions.length) % suggestions.length;
      });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (open && cursor >= 0 && suggestions[cursor]) {
        handleSelect(suggestions[cursor]);
      } else {
        handleSubmit();
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={wrapRef}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F3A00]/60 z-10"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={value}
          autoComplete="off"
          spellCheck="false"
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            if (onSearch) onSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="w-full h-11 pl-10 pr-24 rounded-[12px] border border-[#E5FBC9] bg-white text-sm text-[#1F3A00] placeholder:text-[#1F3A00]/45 focus:border-[#B7F56A] focus:ring-2 focus:ring-[#B7F56A]/30 focus:outline-none transition-all shadow-2xs hover:border-[#B7F56A]"
        />

        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                if (onSearch) onSearch("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-[#1F3A00]/50 hover:text-[#1F3A00] hover:bg-[#F9FCF5] cursor-pointer"
              aria-label="Clear search input"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2} />
            </button>
          )}
          <button
            type="submit"
            className="h-8 px-3.5 rounded-[8px] bg-[#B7F56A] hover:bg-[#a6ec55] text-[#1F3A00] font-bold text-xs transition-colors shrink-0 cursor-pointer flex items-center justify-center shadow-2xs"
          >
            <span>{buttonLabel}</span>
          </button>
        </div>
      </form>

      {/* Auto-suggestions & Recents Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full min-w-[300px] sm:min-w-[420px] max-w-[calc(100vw-32px)] bg-white rounded-[14px] border-2 border-[#B7F56A] shadow-2xl overflow-hidden py-1.5 text-start animate-in fade-in-50 duration-150">
          <div className="px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#1F3A00]/70 flex items-center justify-between border-b border-[#E5FBC9] bg-[#F9FCF5]">
            <span>{value.trim() ? "Suggested Services" : "Recent Searches"}</span>
            {value.trim() && (
              <HugeiconsIcon icon={SparklesIcon} size={13} strokeWidth={1.8} className="text-[#1F3A00]/50" />
            )}
          </div>

          <ul role="listbox" className="max-h-72 overflow-y-auto py-1 divide-y divide-[#E5FBC9]/40">
            {suggestions.map((item, idx) => {
              const active = idx === cursor;
              return (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setCursor(idx)}
                  className={`px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors text-sm ${
                    active ? "bg-[#DCFAB7]/60 text-[#1F3A00]" : "text-[#1F3A00]/90 hover:bg-[#F9FCF5]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {item.isRecent ? (
                      <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.8} className="text-[#1F3A00]/50 shrink-0" />
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#DCFAB7] text-[#1F3A00] font-semibold shrink-0 whitespace-nowrap">
                        {item.category}
                      </span>
                    )}
                    <span className="truncate font-medium text-[#1F3A00]">{item.title}</span>
                  </div>

                  <span className="text-xs text-[#1F3A00]/60 shrink-0 flex items-center gap-1 pl-2">
                    <span className="hidden sm:inline truncate max-w-[140px]">{item.hint}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.8} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
