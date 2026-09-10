import Image from "next/image";
import Link from "next/link";
import { AnimatedIllustration } from "@/components/illustrations/animated-illustration";

export type IllustrationCard = {
  slug: string;
  title: string;
  description: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
};

type SitewideIllustrationGridProps = {
  eyebrow: string;
  title: string;
  description?: string;
  cards: readonly IllustrationCard[];
};

export function SitewideIllustrationGrid({
  eyebrow,
  title,
  description,
  cards,
}: SitewideIllustrationGridProps) {
  return (
    <section className="py-16 sm:py-20 bg-white text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-9 space-y-3">
          <span className="px-4 py-1.5 rounded-full bg-[#DCFAB7] border border-[#99D055] text-[#1F3A00] text-xs sm:text-sm font-bold uppercase tracking-wider inline-block">
            {eyebrow}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#1F3A00]">{title}</h2>
          {description ? <p className="text-lg leading-relaxed text-[#1F3A00]/70">{description}</p> : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const content = (
              <>
                <div className="relative aspect-[3/2] overflow-hidden rounded-[22px] bg-[#F9FCF5]">
                  {card.imageSrc ? (
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt ?? card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <AnimatedIllustration slug={card.slug} alt={card.title} />
                  )}
                </div>
                <div className="space-y-2 px-1 pt-4">
                  <h3 className="font-heading text-xl font-medium text-[#1F3A00]">{card.title}</h3>
                  <p className="text-base leading-relaxed text-[#1F3A00]/70">{card.description}</p>
                </div>
              </>
            );

            const isExternal = card.href ? /^https?:\/\//.test(card.href) : false;

            return card.href ? (
              <Link
                key={card.slug}
                href={card.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group block rounded-[24px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#99D055]"
              >
                {content}
              </Link>
            ) : (
              <article key={card.slug} className="rounded-[24px]">
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
