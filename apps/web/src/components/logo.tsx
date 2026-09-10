import Link from "next/link";
import Image from "next/image";

export function LogoMark({ className = "" }: { className?: string }) {
  return null;
}

export interface LogoProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function Logo({ href, children, className = "" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 text-decoration-none shrink-0 ${className}`}>
      {children}
    </Link>
  );
}
