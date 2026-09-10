"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const fullItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  // Generate BreadcrumbList JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": fullItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://www.bestoneservices.co.uk${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav 
        aria-label="Breadcrumb navigation"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-1 ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-1.5 text-base font-medium list-none p-0 m-0 text-start">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;

            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-ink-500 shrink-0" />
                )}

                {isLast || !item.href ? (
                  <span className="text-ink-600 font-medium truncate max-w-[220px] sm:max-w-none" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-ink-500 hover:text-ink-600 transition-colors duration-150 text-decoration-none flex items-center gap-1"
                  >
                    {index === 0 ? <Home className="w-4 h-4 text-ink-500 shrink-0" /> : null}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
