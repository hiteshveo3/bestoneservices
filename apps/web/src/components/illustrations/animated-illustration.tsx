import { Petals } from "@/components/touchstone";

type AnimatedIllustrationProps = {
  slug: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Touchstone stand-in for the per-service illustrations, whose image files
 * were never added to /public. Draws the logo's four petals on a soft lime
 * field so cards keep their shape without a broken image. Decorative only.
 */
export function AnimatedIllustration({ slug }: AnimatedIllustrationProps) {
  return (
    <div data-illustration={slug} aria-hidden="true" className="absolute inset-0 grid place-items-center bg-[image:var(--grad-lime-soft)]">
      <Petals size={96} />
    </div>
  );
}
