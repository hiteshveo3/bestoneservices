"use client";

import { useRef, useState } from "react";
import { Check } from "@/components/icons";
import { masterPricingData } from "@/config/pricing-data";
import { getCalculatorConfig, CALC_TO_DATA_KEY, type CalcCategory } from "@/config/pricing-calculator-config";

const TAB_ORDER: CalcCategory[] = ["cleaning", "pest", "gardening", "removals"];

export function RateTabs() {
  const [active, setActive] = useState<CalcCategory>("cleaning");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const config = getCalculatorConfig();
  const cat = masterPricingData[CALC_TO_DATA_KEY[active]];
  const activeIdx = TAB_ORDER.indexOf(active);

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    let next = activeIdx;
    if (e.key === "ArrowRight") next = (activeIdx + 1) % TAB_ORDER.length;
    else if (e.key === "ArrowLeft") next = (activeIdx - 1 + TAB_ORDER.length) % TAB_ORDER.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TAB_ORDER.length - 1;
    else return;
    e.preventDefault();
    setActive(TAB_ORDER[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Service categories"
        className="flex gap-1 overflow-x-auto border-[#ECEAE3] mb-8"
      >
        {TAB_ORDER.map((key, i) => {
          const isOn = active === key;
          return (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={isOn}
              aria-controls="rates-panel"
              tabIndex={isOn ? 0 : -1}
              onClick={() => setActive(key)}
              onKeyDown={onTabKeyDown}
              className={`px-4 sm:px-5 py-3.5 -mb-px font-heading text-sm sm:text-base whitespace-nowrap cursor-pointer transition-colors duration-150 ${
 isOn ? "border-[#1D201E] font-semibold text-[#1D201E]" : "border-transparent font-medium text-[#1D201E]/60 hover:text-[#1D201E]"
 }`}
            >
              {config[key].label}
            </button>
          );
        })}
      </div>

      <div id="rates-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="space-y-10">
        <div className="grid md:grid-cols-3 gap-4 md:gap-8 items-start">
          <h3 className="font-heading text-2xl font-medium text-[#1D201E] md:col-span-1">{cat.title}</h3>
          <p className="text-base text-[#1D201E]/70 leading-relaxed md:col-span-2">{cat.description}</p>
        </div>

        {/* Featured cards — a curated subset, not the full list; the full list is the table below */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {config[active].featured.map((card) => (
            <div key={card.name} className="bg-white rounded-[20px] p-6 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <span className="font-heading font-semibold text-base text-[#1D201E]">{card.name}</span>
                {card.badge && (
                  <span className="ts-chip">
                    {card.badge}
                  </span>
                )}
              </div>
              <div className="font-mono text-2xl font-bold tracking-tight text-[#1D201E]">{card.price}</div>
              <div className="text-xs text-[#1D201E]/60">{card.unit}</div>
              <ul className="pt-2 mt-1 border-[#ECEAE3] space-y-1.5 list-none p-0">
                {card.includes.map((inc, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#1D201E]/85">
                    <Check className="w-4 h-4 text-[#1D201E] shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Full semantic rate table — complete transparency, crawler-readable */}
        <div className="overflow-x-auto rounded-[20px] bg-white">
          <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4 border-[#ECEAE3]">
            <span className="font-semibold text-[#1D201E]">Complete {cat.title.replace(" Pricing", "")} list</span>
            <span className="font-mono text-xs text-[#1D201E]/60">{cat.variants.length} rates</span>
          </div>
          <table className="w-full min-w-[540px] ts-table text-left text-sm">
            <caption className="sr-only">{cat.title} full price list</caption>
            <thead>
              <tr className="bg-[#EAF8D6] text-[#1D201E]">
                <th scope="col" className="p-3.5 sm:p-4 font-semibold">Package</th>
                <th scope="col" className="p-3.5 sm:p-4 font-semibold">Unit</th>
                <th scope="col" className="p-3.5 sm:p-4 font-semibold text-end">Price</th>
              </tr>
            </thead>
            <tbody className=" text-[#1D201E]">
              {cat.variants.map((v) => (
                <tr key={v.id}>
                  <th scope="row" className="p-3.5 sm:p-4 font-semibold text-start">{v.name}</th>
                  <td className="p-3.5 sm:p-4 text-[#1D201E]/70">{v.unit ?? "—"}</td>
                  <td className="p-3.5 sm:p-4 font-mono font-medium text-end whitespace-nowrap">
                    £{v.startingPrice}{v.maxPrice ? `–£${v.maxPrice}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="font-mono text-xs font-medium text-[#1D201E]/60 uppercase tracking-wider">Optional add-ons</p>
            <div className="flex flex-col">
              {cat.addOns.map((add, i) => (
                <div key={i} className="flex items-baseline justify-between gap-4 py-2.5 border-[#ECEAE3]">
                  <span className="text-sm text-[#1D201E]/85">{add.name}</span>
                  <span className="font-mono text-sm font-medium text-[#1D201E]">{add.priceDisplay}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-xs font-medium text-[#1D201E]/60 uppercase tracking-wider">What changes the price</p>
            <ul className="space-y-2 list-none p-0">
              {cat.factorsAffectingPrice.map((f, i) => (
                <li key={i} className="text-sm text-[#1D201E]/70 leading-relaxed">{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
