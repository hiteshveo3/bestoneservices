import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "dark" | "outline" | "white" | "glass";
export type ButtonSize = "sm" | "md";

// Exact user specification:
// font: 'Inter', sans-serif | padding: 0.75rem 1.5rem | radius: 0.375rem (rounded-md) | size: 1rem | weight: 500 | border: none | hover: opacity 0.9
const BASE =
  "inline-flex items-center justify-center font-inter text-base font-medium rounded-md border-none transition-opacity duration-200 no-underline cursor-pointer box-border disabled:opacity-60 disabled:cursor-not-allowed leading-[1.5] hover:opacity-90";

function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
    case "white":
      return "bg-[#B7F56A] text-[#1F3A00] border-none";
    case "dark":
      return "bg-[#1F3A00] text-[#B7F56A] border-none";
    case "glass":
      return "bg-[#DCFAB7] text-[#1F3A00] border-none";
    case "secondary":
    case "outline":
      return "bg-[#DCFAB7] text-[#1F3A00] border-none";
  }
}

function sizeClasses(size: ButtonSize): string {
  return size === "sm" ? "px-4 py-2 text-sm gap-1.5" : "px-6 py-3 text-base gap-2";
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
  return (
    <Link className={`${BASE} ${sizeClasses(size)} ${variantClasses(variant)} ${className}`} href={href}>
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
