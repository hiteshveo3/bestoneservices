"use client";

import { useMemo } from "react";

/**
 * Touchstone date and time picker (Lab 04 R1 C + D, "the sundial").
 * A strip of working days, then the day as a half dial from 8am to 8pm. The sun
 * sits over the chosen part of the day. The dial is for pointers; the list
 * underneath is the radiogroup for keyboards and screen readers.
 */

export type DayPart = { id: string; label: string; time: string };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Next working days (Mon–Sat), starting tomorrow. */
export function useWorkingDays(count = 12) {
  return useMemo(() => {
    const out: Array<{ iso: string; day: string; date: number; month: string }> = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < count) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) continue;
      out.push({ iso: iso(d), day: DAY_NAMES[d.getDay()], date: d.getDate(), month: MONTHS[d.getMonth()] });
    }
    return out;
  }, [count]);
}

export function DayStrip({ value, onChange, labelledBy }: { value: string; onChange: (iso: string) => void; labelledBy?: string }) {
  const days = useWorkingDays();
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {days.map((d) => {
        const on = d.iso === value;
        return (
          <button
            key={d.iso}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={`${d.day} ${d.date} ${d.month}`}
            onClick={() => onChange(d.iso)}
            className={`grid min-w-[62px] flex-none justify-items-center gap-0.5 rounded-2xl px-2 py-2.5 text-xs transition-colors duration-150 ${on ? "bg-lime text-ink" : "bg-white text-muted hover:bg-lime-soft"}`}
          >
            <span>{d.day}</span>
            <b className="ts-fig text-[22px] text-ink">{d.date}</b>
            <span>{d.month}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Sundial({ parts, value, onChange, disabled, labelledBy }: { parts: DayPart[]; value: string; onChange: (id: string) => void; disabled?: boolean; labelledBy?: string }) {
  const cx = 160, cy = 176, R = 146, r = 98;
  const n = parts.length;
  const pt = (rad: number, a: number) => [cx + rad * Math.cos(a), cy - rad * Math.sin(a)] as const;
  const selected = Math.max(0, parts.findIndex((p) => p.id === value));
  const sunA = Math.PI - (selected + 0.5) * (Math.PI / n);
  const [sx, sy] = pt(R + 17, sunA);
  const current = parts.find((p) => p.id === value);

  return (
    <div className="grid gap-3">
      <div className="relative">
        <svg viewBox="0 0 320 192" className="block h-auto w-full" aria-hidden="true">
          {parts.map((p, i) => {
            const gap = 0.03;
            const a0 = Math.PI - i * (Math.PI / n) - gap;
            const a1 = Math.PI - (i + 1) * (Math.PI / n) + gap;
            const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1), [x2, y2] = pt(r, a1), [x3, y3] = pt(r, a0);
            const [lx, ly] = pt((R + r) / 2, (a0 + a1) / 2);
            const on = p.id === value;
            return (
              <g key={p.id}>
                <path
                  d={`M${x0},${y0}A${R},${R} 0 0 1 ${x1},${y1}L${x2},${y2}A${r},${r} 0 0 0 ${x3},${y3}Z`}
                  fill={on ? "#B7F56A" : "#FFFFFF"}
                  className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
                  onClick={() => !disabled && onChange(p.id)}
                />
                <text x={lx} y={ly + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="#1D201E" pointerEvents="none" fontFamily="var(--font-albert), Arial, sans-serif">
                  {p.label}
                </text>
              </g>
            );
          })}
          {/* The sun on the chosen part of the day */}
          {value ? <circle cx={sx} cy={sy} r="9" fill="#1D201E" style={{ transition: "cx 240ms, cy 240ms" }} /> : null}
          <path d={`M${cx - r + 6},${cy}H${cx + r - 6}`} stroke="#E1DED4" strokeWidth="2" />
        </svg>
        <div className="pointer-events-none absolute inset-x-0 bottom-1 grid justify-items-center text-center" aria-live="polite">
          <span className="ts-fig text-[30px]">{current ? current.time : "Pick a time"}</span>
          <span className="text-[13px] text-muted">{current ? current.label : "Tap part of the day"}</span>
        </div>
      </div>
      {/* The same choices as a list, for anyone who prefers it */}
      <div role="radiogroup" aria-labelledby={labelledBy} className="grid gap-1.5">
        {parts.map((p) => {
          const on = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              role="radio"
              aria-checked={on}
              onClick={() => onChange(p.id)}
              className={`flex min-h-12 items-center justify-between rounded-xl px-4 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${on ? "bg-lime" : "bg-white hover:bg-lime-soft"}`}
            >
              <b>{p.label}</b>
              <span className="text-sm tabular-nums text-muted">{p.time}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
