import Link from "next/link";
import { Petals } from "@/components/touchstone";

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

/** Touchstone card grid: the four-petal bullet, a title and one sentence. No images. */
export function SitewideIllustrationGrid({ eyebrow, title, description, cards }: SitewideIllustrationGridProps) {
  return (
    <section className="bg-white text-start">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid max-w-3xl gap-3">
          <p className="ts-eyebrow m-0">{eyebrow}</p>
          <h2 className="ts-head m-0 text-[clamp(28px,3.4vw,40px)]">{title}</h2>
          {description ? <p className="m-0 text-lg text-[#5A605C]">{description}</p> : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const content = (
              <>
                <Petals size={36} />
                <b className="text-[17px]">{card.title}</b>
                <span className="text-[15px] text-[#5A605C]">{card.description}</span>
              </>
            );
            const cls = "grid content-start gap-3 rounded-2xl bg-[#F6F5F1] p-5 no-underline";
            const isExternal = card.href ? /^https?:\/\//.test(card.href) : false;
            return card.href ? (
              <Link key={card.slug} href={card.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className={`${cls} transition-colors duration-150 hover:bg-[#EAF8D6]`}>
                {content}
              </Link>
            ) : (
              <article key={card.slug} className={cls}>
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
