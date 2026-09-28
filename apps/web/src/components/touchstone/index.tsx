/**
 * Touchstone — Bestone's design system components.
 * Rules and decisions: design/TOUCHSTONE.md. Visual reference: design/lab/.
 * No shadows, no dividing lines, no dark sections; lime is never text.
 */
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ---------- Actions ---------- */

type ButtonVariant = "primary" | "white" | "soft" | "link";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap no-underline transition-[background-color,transform] duration-150 active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";
const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-lime text-ink hover:bg-lime-2",
  white: "bg-white text-ink hover:bg-lime-soft",
  soft: "bg-stone text-ink hover:bg-stone-2",
  link: "text-ink rounded-none px-1! bg-[linear-gradient(var(--lime),var(--lime))] bg-[length:100%_3px] bg-[position:left_88%] bg-no-repeat hover:bg-[length:100%_40%]",
};
const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3.5 text-[15px] rounded-[10px]",
  md: "min-h-12 px-5 text-base rounded-xl",
  lg: "min-h-14 px-6 text-[17px] rounded-[14px]",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string) {
  return cx(BUTTON_BASE, BUTTON_SIZE[size], BUTTON_VARIANT[variant], extra);
}

type ButtonProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  className?: string;
  children: ReactNode;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/** A link styled as a Touchstone button. External links open in a new tab. */
export function Button({ href, variant = "primary", size = "md", icon, iconEnd, className, children, external, ...rest }: ButtonProps) {
  const cls = buttonClass(variant, size, className);
  const isExternal = external ?? /^https?:|^tel:|^mailto:/.test(href);
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {iconEnd}
    </>
  );
  if (isExternal) {
    const newTab = /^https?:/.test(href);
    return (
      <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}

/* ---------- Type ---------- */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("ts-eyebrow m-0", className)}>{children}</p>;
}

/** Two-weight heading (Lab 03 S07 C): the claim, then the quieter answer. */
export function TwoWeight({ lead, soft }: { lead: ReactNode; soft?: ReactNode }) {
  return (
    <>
      {lead}
      {soft ? (
        <>
          {" "}
          <span className="ts-soft">{soft}</span>
        </>
      ) : null}
    </>
  );
}

export function SectionHead({
  eyebrow,
  title,
  soft,
  intro,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  soft?: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="grid max-w-3xl gap-3">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="ts-head m-0 text-[clamp(28px,3.4vw,40px)]">
          <TwoWeight lead={title} soft={soft} />
        </h2>
        {intro ? <p className="m-0 max-w-[60ch] text-lg text-muted">{intro}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ---------- Small parts ---------- */

export function Fact({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-[15px]">
      <i className="ts-tick" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}

export function Facts({ items }: { items: ReactNode[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2.5">
      {items.map((item, i) => (
        <Fact key={i}>{item}</Fact>
      ))}
    </div>
  );
}

export function Plaque({ n, state }: { n: number | string; state?: "done" | "todo" }) {
  return (
    <span className="ts-plaque" data-state={state} aria-hidden="true">
      {n}
    </span>
  );
}

/** A starting price: optional "from", the figure, optional unit. */
export function Price({ from, amount, unit, size = 32 }: { from?: boolean; amount: string; unit?: string; size?: number }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
      <span className="ts-fig" style={{ fontSize: size }}>
        {from ? <small>from</small> : null}
        {amount}
      </span>
      {unit ? <span className="text-sm text-muted">{unit}</span> : null}
    </span>
  );
}

/** Lab 04 R4 C: the price sits in a soft lime tile with its action. */
export function PriceTile({ label = "Fixed from", amount, unit, action }: { label?: string; amount: string; unit?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[image:var(--grad-lime-soft)] px-3.5 py-3">
      <div className="grid gap-0.5">
        <span className="ts-eyebrow">{label}</span>
        <span className="flex items-baseline gap-1.5">
          <span className="ts-fig text-[32px]">{amount}</span>
          {unit ? <span className="text-sm text-muted">{unit}</span> : null}
        </span>
      </div>
      {action}
    </div>
  );
}

/** Lab 03 S01: four punches carrying four facts. */
export function Hallmarks({ marks }: { marks: [string, string, string, string] }) {
  const shapes = ["shield", "oct", "oval", "square"] as const;
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden="true">
      {marks.map((m, i) => (
        <span key={i} className="ts-mark" data-shape={shapes[i]}>
          {m}
        </span>
      ))}
    </span>
  );
}

export function Stamp({ top, main, small }: { top: string; main: string; small?: string }) {
  return (
    <span className="ts-stamp">
      {top}
      <b>{main}</b>
      {small ? <small>{small}</small> : null}
    </span>
  );
}

/** The logo's four petals, one per service (Lab 03 S04). Decorative only. */
export function Petals({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <g fill="#EAF8D6">
        <circle cx="50" cy="25" r="22" />
        <circle cx="75" cy="50" r="22" />
        <circle cx="50" cy="75" r="22" />
        <circle cx="25" cy="50" r="22" />
      </g>
      <rect x="40" y="40" width="20" height="20" rx="3" transform="rotate(45 50 50)" fill="#B7F56A" />
    </svg>
  );
}

/** Lab 03 S02 B: a floor plan with the rooms that are done in soft lime. Never a pest. */
export function FloorPlan({ done = ["kitchen", "living", "bath"], className, label = "Floor plan with rooms signed off" }: { done?: Array<"kitchen" | "living" | "bed" | "bath">; className?: string; label?: string }) {
  const fill = (room: "kitchen" | "living" | "bed" | "bath") => (done.includes(room) ? "#EAF8D6" : "transparent");
  return (
    <svg viewBox="0 0 280 180" className={className} role="img" aria-label={label}>
      <rect x="6" y="6" width="142" height="88" fill={fill("kitchen")} />
      <rect x="152" y="6" width="122" height="96" fill={fill("living")} />
      <rect x="6" y="100" width="142" height="74" fill={fill("bed")} />
      <rect x="152" y="106" width="56" height="68" fill={fill("bath")} />
      <g fill="none" stroke="#3A3F3C" strokeWidth="3" strokeLinecap="round">
        <rect x="4" y="4" width="272" height="172" rx="3" />
        <path d="M150 4v62M150 104v72M4 96h82M120 96h30M210 104v72M150 104h60M236 104h40" />
      </g>
      <g fill="none" stroke="#8B908B" strokeWidth="1.5">
        <path d="M86 96a34 34 0 0 1 34-34M150 66a38 38 0 0 1 38 38M210 104a26 26 0 0 1 26 -26" />
      </g>
      <g fontFamily="var(--font-albert), Arial, sans-serif" fontSize="11" fill="#5A605C" fontWeight="600">
        <text x="18" y="28">Kitchen</text>
        <text x="166" y="28">Living room</text>
        <text x="18" y="124">Bedroom</text>
        <text x="162" y="128">Bath</text>
        <text x="220" y="128">Hall</text>
      </g>
    </svg>
  );
}

/* ---------- Blocks ---------- */

export type PriceRow = { name: string; note: string; amount: string; from?: boolean; href: string };

/** Lab 03 S24 A: prices as record rows. */
export function PriceList({ rows, onPaper = false }: { rows: PriceRow[]; onPaper?: boolean }) {
  return (
    <ul className={cx("ts-rows m-0 list-none p-0", onPaper && "on-paper")}>
      {rows.map((row) => (
        <li key={row.name}>
          <Link href={row.href} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-3.5 py-3 no-underline transition-colors duration-150 hover:bg-lime-soft">
            <span className="grid">
              <span className="font-semibold">{row.name}</span>
              <span className="text-[13px] text-muted">{row.note}</span>
            </span>
            <span className="ts-fig text-[28px]">
              {row.from ? <small>from</small> : null}
              {row.amount}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Lab 03 S35 B: facts as big figures. */
export function BigFacts({ items }: { items: Array<{ figure: string; label: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1 rounded-2xl bg-white p-4 sm:p-5">
          <span className="ts-fig text-[clamp(34px,4vw,44px)]">{item.figure}</span>
          <span className="text-sm text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Lab 03 S58 A: the slim closing band. */
export function SlimCta({ title, soft, action }: { title: string; soft?: string; action: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4">
      <p className="m-0 text-[17px]">
        <b>{title}</b> {soft ? <span className="text-muted">{soft}</span> : null}
      </p>
      {action}
    </div>
  );
}

/** Lab 03 S55 B: questions beside a short help column. */
export function FaqSplit({ title = "Questions", items, help }: { title?: string; items: Array<{ q: string; a: string }>; help: ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
      <div className="grid content-start gap-3">
        <h2 className="ts-head m-0 text-[clamp(28px,3.4vw,40px)]">{title}</h2>
        {help}
      </div>
      <div className="ts-faq">
        {items.map((item, i) => (
          <details key={item.q} open={i === 0}>
            <summary>{item.q}</summary>
            <div>{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

export function Section({ children, className, id, tone = "paper" }: { children: ReactNode; className?: string; id?: string; tone?: "paper" | "white" }) {
  return (
    <section id={id} className={cx("scroll-mt-24", tone === "white" ? "bg-white" : "bg-paper", className)}>
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">{children}</div>
    </section>
  );
}
