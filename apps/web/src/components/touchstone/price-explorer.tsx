"use client";

import { useState } from "react";
import { buttonClass } from "@/components/touchstone";

export type ExplorerOption = { id: string; label: string; amount: number; note: string };

/**
 * Lab 03 S25: pick a size, the fixed price and the button follow.
 * Selection is solid lime (Lab 04 R2 A). Uses a radiogroup with arrow-key support.
 */
export function PriceExplorer({
  eyebrow,
  title,
  options,
  initial = 0,
  includes,
  bookHref,
  askHref,
}: {
  eyebrow: string;
  title: string;
  options: ExplorerOption[];
  initial?: number;
  includes: string[];
  bookHref: string;
  askHref: string;
}) {
  const [i, setI] = useState(initial);
  const current = options[i];

  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : options.length - 1)) % options.length;
    setI(next);
    const el = e.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next];
    el?.focus();
  }

  return (
    <div className="grid gap-8 rounded-3xl bg-white p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="grid content-start gap-4">
        <p className="ts-eyebrow m-0">{eyebrow}</p>
        <h3 className="ts-head m-0 text-[clamp(26px,3vw,36px)]">{title}</h3>
        <div role="radiogroup" aria-label="Property size" onKeyDown={onKey} className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-stone p-1 max-sm:grid-flow-row max-sm:grid-cols-3">
          {options.map((opt, idx) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={idx === i}
              tabIndex={idx === i ? 0 : -1}
              onClick={() => setI(idx)}
              className={`min-h-11 rounded-[9px] text-[15px] font-semibold transition-colors duration-150 ${idx === i ? "bg-lime text-ink" : "text-muted hover:bg-white"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1" aria-live="polite">
          <span className="ts-fig text-[clamp(56px,7vw,80px)]">£{current.amount}</span>
          <span className="text-muted">{current.note} Confirmed before you book.</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <a href={bookHref} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "lg")}>
            Book at £{current.amount}
          </a>
          <a href={askHref} target="_blank" rel="noopener noreferrer" className={buttonClass("soft", "lg")}>
            Ask on WhatsApp
          </a>
        </div>
      </div>
      <div className="grid content-start gap-3">
        <p className="ts-eyebrow m-0">Included</p>
        <ul className="ts-rows m-0 list-none p-0">
          {includes.map((item) => (
            <li key={item} className="flex items-baseline gap-2.5 px-3 py-2.5 text-[15px]">
              <i className="ts-tick translate-y-[3px]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
