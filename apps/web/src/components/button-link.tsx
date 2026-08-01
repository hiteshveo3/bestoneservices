import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { DecorativeIcon } from "@/components/decorative-icon";

export function ButtonLink({
  href,
  children,
  secondary = false,
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
  arrow?: boolean;
}) {
  const className = secondary ? "button button-secondary" : "button";

  if (href.startsWith("mailto:")) {
    return (
      <a className={className} href={href}>
        <span>{children}</span>
        {arrow ? <DecorativeIcon icon={ArrowRight02Icon} size={19} /> : null}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      <span>{children}</span>
      {arrow ? <DecorativeIcon icon={ArrowRight02Icon} size={19} /> : null}
    </Link>
  );
}
