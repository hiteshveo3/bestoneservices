"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  SprayCan,
  Trees,
  Truck,
  Check,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { masterPricingData } from "@/config/pricing-data";
import {
  getCalculatorConfig,
  CLEANING_TIER_VARIANT_IDS,
  type CalcCategory,
  type ChoiceItem,
} from "@/config/pricing-calculator-config";
import { CONTACT } from "@/config/contact";
import { PricePromiseBadge } from "@/components/ui/price-promise-badge";

const CATEGORY_ICONS: Record<CalcCategory, typeof Sparkles> = {
  cleaning: Sparkles,
  pest: SprayCan,
  gardening: Trees,
  removals: Truck,
};

function SearchParamListener({ onPreselect }: { onPreselect: (vertical: CalcCategory) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get("category");
    const srv = searchParams.get("service");

    if (cat === "pest-control" || cat === "pest" || srv?.includes("mouse") || srv?.includes("rat") || srv?.includes("pest")) {
      onPreselect("pest");
    } else if (cat === "gardening" || srv?.includes("garden")) {
      onPreselect("gardening");
    } else if (cat === "removals" || srv?.includes("van") || srv?.includes("moving")) {
      onPreselect("removals");
    } else if (cat === "cleaning" || srv?.includes("tenancy") || srv?.includes("clean")) {
      onPreselect("cleaning");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}

/** Watches a container's width so the 2-col grid can collapse based on the space this component actually has (it's embedded in narrower columns on some service pages), not just the viewport. */
function useNarrowContainer(breakpoint = 860) {
  const ref = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = (width: number) => setNarrow(width < breakpoint);
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) measure(entry.contentRect.width);
      });
      ro.observe(el);
      measure(el.getBoundingClientRect().width);
      return () => ro.disconnect();
    }
    const onResize = () => measure(el.getBoundingClientRect().width);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return { ref, narrow };
}

export interface InstantEstimatorProps {
  /** Skips Step 1 and opens directly into this vertical — for embedding inline on a single service page. */
  defaultVertical?: CalcCategory;
}

type Sel = Record<string, { label: string; value: number; note: string }>;

export function InstantEstimator({ defaultVertical }: InstantEstimatorProps = {}) {
  const [cat, setCat] = useState<CalcCategory | null>(defaultVertical ?? null);
  const [step, setStep] = useState(defaultVertical ? 1 : 0);
  const [sel, setSel] = useState<Sel>({});
  const [addons, setAddons] = useState<Record<string, number>>({});
  const [pulse, setPulse] = useState(0);
  const [preselected, setPreselected] = useState(Boolean(defaultVertical));
  const { ref: containerRef, narrow } = useNarrowContainer();

  const router = useRouter();
  const pathname = usePathname();

  const config = getCalculatorConfig();
  const cfg = cat ? config[cat] : null;
  const stepsTotal = cfg ? cfg.steps.length : 4;
  const idx = cfg ? Math.min(step, stepsTotal - 1) : 0;
  const stepId = cfg ? cfg.steps[idx] : "category";
  const isCategory = stepId === "category";
  const isAddons = stepId === "addons";
  const isResult = stepId === "result";

  useEffect(() => {
    if (!cat) return;
    const params = new URLSearchParams();
    params.set("category", cat === "pest" ? "pest-control" : cat);
    router.replace(`${pathname}?${params.toString()}#smart-calculator`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  const handlePreselect = useCallback(
    (vertical: CalcCategory) => {
      if (preselected) return;
      setCat(vertical);
      setStep(1);
      setPreselected(true);
    },
    [preselected]
  );

  const pickCategory = (key: CalcCategory) => {
    setCat(key);
    setStep(1);
    setSel({});
    setAddons({});
    setPulse((p) => p + 1);
  };

  const choose = (stepKey: string, item: ChoiceItem) => {
    setSel((prev) => ({ ...prev, [stepKey]: item }));
    setPulse((p) => p + 1);
  };

  const toggleAddon = (label: string, price: number) => {
    setAddons((prev) => {
      const next = { ...prev };
      if (next[label] != null) delete next[label];
      else next[label] = price;
      return next;
    });
    setPulse((p) => p + 1);
  };

  const back = () => {
    if (step <= 1) {
      setCat(null);
      setStep(0);
      setSel({});
      setAddons({});
      setPreselected(false);
    } else {
      setStep((s) => s - 1);
    }
  };

  const reset = () => {
    setCat(null);
    setStep(0);
    setSel({});
    setAddons({});
    setPreselected(false);
  };

  /** Choice items for the current step — the cleaning "tier" step is computed on the fly from the real Standard/Premium variant prices for the selected size, rather than a flat mockup percentage. */
  function getChoiceItems(): ChoiceItem[] {
    if (!cfg) return [];
    if (cat === "cleaning" && stepId === "tier") {
      const sizeLabel = sel.size?.label;
      if (!sizeLabel) return [];
      const [stdId, premId] = CLEANING_TIER_VARIANT_IDS[sizeLabel];
      const stdPrice = masterPricingData.cleaning.variants.find((v) => v.id === stdId)!.startingPrice;
      const premPrice = masterPricingData.cleaning.variants.find((v) => v.id === premId)!.startingPrice;
      const delta = premPrice - stdPrice;
      return [
        { label: "Standard", value: 0, note: "Included" },
        { label: "Premium", value: delta, note: `+£${delta}` },
      ];
    }
    return cfg.choices[stepId]?.items ?? [];
  }

  const choiceItems = getChoiceItems();
  const isChoiceStep = !isCategory && !isAddons && !isResult && choiceItems.length > 0;
  const choiceTitle = cfg && cat === "cleaning" && stepId === "tier" ? "Which tier?" : cfg?.choices[stepId]?.title ?? "";

  function compute(): { total: number; lines: Array<{ label: string; value: string }> } {
    if (!cat || !cfg) return { total: 0, lines: [] };
    const lines: Array<{ label: string; value: string }> = [];
    let total = 0;

    if (cat === "cleaning") {
      if (sel.size) {
        total = sel.size.value;
        lines.push({ label: `${sel.size.label} — end of tenancy`, value: `£${sel.size.value}` });
      }
      if (sel.tier && sel.tier.value > 0 && total) {
        lines.push({ label: "Premium tier", value: `+£${sel.tier.value}` });
        total += sel.tier.value;
      }
    } else if (cat === "pest") {
      if (sel.pest) {
        total = sel.pest.value;
        lines.push({ label: `${sel.pest.label} treatment`, value: `£${sel.pest.value}` });
      }
      if (sel.timing && sel.timing.value > 0 && total) {
        lines.push({ label: sel.timing.label, value: `+£${sel.timing.value}` });
        total += sel.timing.value;
      }
    } else if (cat === "gardening") {
      if (sel.hours) {
        total = sel.hours.value;
        lines.push({ label: `${sel.hours.label} gardening team`, value: `£${sel.hours.value}` });
      }
    } else if (cat === "removals") {
      const rate = sel.crew?.value ?? 0;
      const hrs = sel.hours?.value ?? 0;
      if (rate && hrs) {
        total = rate * hrs;
        lines.push({ label: `${sel.crew!.label}, ${hrs} hrs at £${rate}/hr`, value: `£${total}` });
      }
    }

    Object.keys(addons).forEach((label) => {
      total += addons[label];
      lines.push({ label, value: `+£${addons[label]}` });
    });

    return { total, lines };
  }

  const { total, lines } = compute();
  const nextDisabled = isChoiceStep && !sel[stepId];
  const nextLabel = cfg && cfg.steps[idx + 1] === "result" ? "See my quote" : "Continue";
  const stepLabel = isResult ? "Quote complete" : `Step ${idx + 1} of ${stepsTotal - 1}`;
  const progressPct = Math.round(((idx + (isResult ? 1 : 0)) / Math.max(1, stepsTotal - 1)) * 100);
  const totalLabel = total ? `£${total}` : "£—";
  const totalCaption = cfg ? (total ? `${cfg.label}, all in` : "Pick your options to see the total") : "Choose a service to start";

  const whatsappQuoteMessage = cfg
    ? [
        "Hi, I'd like this quote from bestoneservices.co.uk:",
        `Service: ${cfg.label}`,
        `Estimated price: £${total}`,
        `Guarantee: ${cfg.guarantee}`,
      ].join("\n")
    : "";
  const whatsappQuoteHref = `https://wa.me/${CONTACT.whatsapp.wa}?text=${encodeURIComponent(whatsappQuoteMessage)}`;

  return (
    <div
      ref={containerRef}
      id="smart-calculator"
      className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E5FBC9] shadow-2xs text-start scroll-mt-24"
    >
      <noscript>
        <div className="p-4 rounded-[16px] bg-[#DCFAB7] border border-[#99D055] text-sm text-[#1F3A00]">
          This calculator needs JavaScript enabled. You can see every rate directly on the{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- noscript fallback must use a plain anchor; next/link requires JS */}
          <a href="/prices/#rates" className="font-semibold underline underline-offset-2">price list</a> instead.
        </div>
      </noscript>
      <Suspense fallback={null}>
        <SearchParamListener onPreselect={handlePreselect} />
      </Suspense>

      <div className={narrow ? "grid gap-5 grid-cols-1" : "grid gap-6 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start"}>
        {/* MAIN STEP FLOW */}
        <div className="min-w-0 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-mono font-medium text-[#1F3A00]/60 uppercase tracking-wider">{stepLabel}</span>
            {cat && (
              <button
                type="button"
                onClick={reset}
                className="text-xs font-medium text-[#1F3A00]/60 underline underline-offset-2 hover:text-[#1F3A00] cursor-pointer"
              >
                Start again
              </button>
            )}
          </div>

          <div className="h-[3px] rounded-full bg-[#E5FBC9] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#B7F56A] transition-all duration-200 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {isCategory && (
            <div className="space-y-4">
              <h3 className="font-heading text-xl sm:text-2xl font-medium text-[#1F3A00]">What do you need?</h3>
              <div role="group" aria-label="Service category" className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {(Object.keys(config) as CalcCategory[]).map((key) => {
                  const Icon = CATEGORY_ICONS[key];
                  const isOn = cat === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={isOn}
                      onClick={() => pickCategory(key)}
                      className={`p-4 rounded-[16px] border text-start cursor-pointer transition-colors duration-150 flex flex-col gap-1.5 ${
                        isOn ? "bg-[#B7F56A] border-[#99D055] text-[#1F3A00]" : "bg-white border-[#E5FBC9] text-[#1F3A00] hover:bg-[#DCFAB7]/40"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-[#1F3A00]" />
                      <span className="font-heading font-semibold text-base">{config[key].label}</span>
                      <span className="font-mono text-xs text-[#1F3A00]/60">{config[key].fromNote}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isChoiceStep && (
            <div className="space-y-4">
              <h3 className="font-heading text-xl sm:text-2xl font-medium text-[#1F3A00]">{choiceTitle}</h3>
              <div role="radiogroup" aria-label={choiceTitle} className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
                {choiceItems.map((item) => {
                  const isOn = sel[stepId]?.label === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      role="radio"
                      aria-checked={isOn}
                      onClick={() => choose(stepId, item)}
                      className={`p-4 rounded-[16px] border text-start cursor-pointer transition-colors duration-150 flex flex-col gap-1 ${
                        isOn ? "bg-[#B7F56A] border-[#99D055] text-[#1F3A00]" : "bg-white border-[#E5FBC9] text-[#1F3A00] hover:bg-[#DCFAB7]/40"
                      }`}
                    >
                      <span className="font-semibold text-sm">{item.label}</span>
                      <span className="font-mono text-xs text-[#1F3A00]/60">{item.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isAddons && cfg && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-heading text-xl sm:text-2xl font-medium text-[#1F3A00]">Anything to add?</h3>
                <p className="text-sm text-[#1F3A00]/60">Optional. Skip this if you don&apos;t need extras.</p>
              </div>
              {cfg.addons.length === 0 ? (
                <p className="text-sm text-[#1F3A00]/60">No optional add-ons for this service — continue to your quote.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {cfg.addons.map((add) => {
                    const isOn = addons[add.label] != null;
                    return (
                      <button
                        key={add.label}
                        type="button"
                        role="checkbox"
                        aria-checked={isOn}
                        onClick={() => toggleAddon(add.label, add.price)}
                        className={`flex items-center gap-3.5 w-full p-3.5 rounded-[14px] border cursor-pointer transition-colors duration-150 ${
                          isOn ? "bg-white border-[#1F3A00]" : "bg-white border-[#E5FBC9] hover:bg-[#DCFAB7]/20"
                        }`}
                      >
                        <span
                          className={`flex shrink-0 items-center justify-center w-5 h-5 rounded-[6px] border ${
                            isOn ? "bg-[#B7F56A] border-[#99D055]" : "bg-white border-[#E5FBC9]"
                          }`}
                        >
                          {isOn && <Check className="w-3.5 h-3.5 text-[#1F3A00]" />}
                        </span>
                        <span className="flex-1 min-w-0 text-start text-sm font-medium text-[#1F3A00]">{add.label}</span>
                        <span className="font-mono text-sm font-medium text-[#1F3A00]">+£{add.price}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {isResult && cfg && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <PricePromiseBadge variant={cat === "removals" || cat === "gardening" ? "range" : "fixed"} />
                <h3 className="font-heading text-2xl sm:text-3xl font-medium text-[#1F3A00]">
                  Your {cfg.label.toLowerCase()} quote
                </h3>
              </div>

              <div className="border-t border-[#E5FBC9]">
                {lines.map((line, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-4 py-3 border-b border-[#E5FBC9]">
                    <span className="text-sm text-[#1F3A00]/85">{line.label}</span>
                    <span className="font-mono text-sm font-medium text-[#1F3A00]">{line.value}</span>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 pt-4">
                  <span className="text-base font-semibold text-[#1F3A00]">Total</span>
                  <motion.span
                    key={pulse}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="font-mono text-3xl font-bold tracking-tight text-[#1F3A00]"
                  >
                    {totalLabel}
                  </motion.span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#1F3A00]/85 bg-[#F9FCF5] border border-[#E5FBC9] rounded-[16px] p-4">
                <strong className="font-semibold">{cfg.guarantee}</strong> Fixed price, confirmed before we arrive, no hidden fees.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappQuoteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[160px] px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#1F3A00] shrink-0" />
                  <span>Book This Now via WhatsApp</span>
                </a>
                <a
                  href={whatsappQuoteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] px-6 py-3 rounded-md font-inter text-base font-medium bg-white border border-[#1F3A00] text-[#1F3A00] hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#1F3A00] shrink-0" />
                  <span>Send Me This Quote on WhatsApp</span>
                </a>
              </div>

              <p className="text-xs text-[#1F3A00]/60">
                Market context: London providers typically quote {cfg.marketContext.match(/£[\d,]+[\s–-]*[£\d,]*/)?.[0] ?? cfg.marketContext} for this. Ours is the rate above.
              </p>
            </div>
          )}

          {!isResult && cat && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5FBC9]">
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-[#1F3A00]/70 hover:text-[#1F3A00] hover:underline underline-offset-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={nextDisabled}
                onClick={() => !nextDisabled && setStep((s) => s + 1)}
                className={`min-w-[170px] px-6 py-3 rounded-md font-inter text-base font-medium flex items-center justify-center gap-2 transition-opacity duration-200 ${
                  nextDisabled ? "bg-[#DCFAB7] text-[#1F3A00]/60 cursor-not-allowed" : "bg-[#B7F56A] text-[#1F3A00] hover:opacity-90 cursor-pointer"
                }`}
              >
                <span>{nextLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* STICKY SUMMARY SIDEBAR — desktop / wide container */}
        {!narrow && (
          <aside
            aria-label="Running quote"
            className="sticky top-20 bg-[#F9FCF5] rounded-[16px] p-6 border border-[#E5FBC9] space-y-4 text-start"
          >
            <span className="text-xs font-mono font-medium text-[#1F3A00]/60 uppercase tracking-wider">Your quote so far</span>
            <div aria-live="polite" className="flex flex-col gap-1">
              <motion.span
                key={pulse}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="font-mono text-4xl font-bold tracking-tight text-[#1F3A00]"
              >
                {totalLabel}
              </motion.span>
              <span className="text-sm text-[#1F3A00]/60">{totalCaption}</span>
            </div>
            <div className="h-px bg-[#E5FBC9]" />
            <div className="space-y-2">
              {cfg && <SummaryRow label="Service" value={cfg.label} />}
              {Object.entries(sel).map(([k, v]) => (
                <SummaryRow key={k} label={k === "timing" ? "Timing" : k.charAt(0).toUpperCase() + k.slice(1)} value={v.label} />
              ))}
              {Object.keys(addons).length > 0 && <SummaryRow label="Add-ons" value={`${Object.keys(addons).length} selected`} />}
            </div>
            <p className="text-xs leading-relaxed text-[#1F3A00]/60">
              Prices shown are the amount you pay. VAT and travel within our coverage area are included.
            </p>
          </aside>
        )}
      </div>

      {/* MOBILE STICKY TOTAL BAR — narrow container, mid-flow only */}
      {narrow && cat && !isResult && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-white border-t border-[#E5FBC9] shadow-lg"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#1F3A00]/60">Estimated total</span>
              <span className="font-mono text-xl font-bold tracking-tight text-[#1F3A00]">{totalLabel}</span>
            </div>
            <span className="text-xs text-[#1F3A00]/60 text-end">{totalCaption}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-[#1F3A00]/60">{label}</span>
      <span className="text-sm font-semibold text-[#1F3A00] text-end">{value}</span>
    </div>
  );
}
