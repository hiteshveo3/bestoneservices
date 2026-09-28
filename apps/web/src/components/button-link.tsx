import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export type ButtonVariant = "primary" | "secondary" | "dark" | "outline" | "white" | "glass";
export type ButtonSize = "sm" | "md";

// Touchstone buttons (design/TOUCHSTONE.md): solid lime for the main action,
// white for secondary actions on the paper page. 12px corners, no borders.
const BASE =
  "inline-flex items-center justify-center font-semibold rounded-xl border-none transition-[background-color,transform] duration-150 active:translate-y-px no-underline cursor-pointer box-border whitespace-nowrap disabled:bg-[#ECEAE3] disabled:text-[#8B908B] disabled:cursor-not-allowed focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1D201E]";

function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
    case "dark":
      return "bg-[#B7F56A] text-[#1D201E] hover:bg-[#A2EA4E]";
    case "white":
    case "secondary":
    case "outline":
    case "glass":
      return "bg-white text-[#1D201E] hover:bg-[#EAF8D6]";
  }
}

function sizeClasses(size: ButtonSize): string {
  return size === "sm" ? "min-h-10 px-3.5 text-[15px] gap-1.5" : "min-h-12 px-5 text-base gap-2";
}

export interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  showArrow = true,
  className = "",
}: ButtonLinkProps) {
  const classes = `${BASE} ${sizeClasses(size)} ${variantClasses(variant)} ${className}`;
  // External links (e.g. wa.me) need a real anchor in a new tab, not client-side <Link> routing.
  if (/^https?:\/\//.test(href)) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
        <span>{children}</span>
        {showArrow ? <ArrowRight className="w-4 h-4 text-current shrink-0" /> : null}
      </a>
    );
  }
  return (
    <Link className={classes} href={href}>
      <span>{children}</span>
      {showArrow ? <ArrowRight className="w-4 h-4 text-current shrink-0" /> : null}
    </Link>
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  showArrow = true,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${BASE} ${sizeClasses(size)} ${variantClasses(variant)} ${className}`} {...props}>
      <span>{children}</span>
      {showArrow ? <ArrowRight className="w-4 h-4 text-current shrink-0" /> : null}
    </button>
  );
}
