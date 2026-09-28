"use client";

export interface SegmentOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface SegmentedControlProps {
  label?: string;
  options: SegmentOption[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps) {
  return (
    <div className={`space-y-1.5 text-start w-full ${className}`}>
      {label && <label className="text-sm font-mono text-ink-500 uppercase block font-medium">{label}</label>}
      <div className="p-1 rounded-[16px] bg-[#F6F5F1] border-none inline-flex flex-wrap sm:flex-nowrap gap-1 w-full">
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={isSelected}
              className={`flex-1 py-2.5 px-4 rounded-[16px] text-base transition-colors duration-150 cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-[#1D201E] border-none ${ isSelected ? "bg-[#B7F56A] text-[#1D201E] font-medium " : "bg-transparent text-[#1D201E] font-medium hover:bg-[#EAF8D6]" } border border-[#ECEAE3]`}
            >
              <div>{opt.label}</div>
              {opt.sublabel && <div className="text-xs text-ink-500 font-normal">{opt.sublabel}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
