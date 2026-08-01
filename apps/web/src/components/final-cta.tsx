import { ButtonLink } from "@/components/button-link";

export function FinalCta({
  eyebrow,
  title,
  description,
  href = "/get-a-quote/",
  titleId,
  buttonLabel = "Get a Free Quote",
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  titleId?: string;
  buttonLabel?: string;
}) {
  return (
    <div className="shell final-cta">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
      </div>
      <ButtonLink href={href}>{buttonLabel}</ButtonLink>
    </div>
  );
}
