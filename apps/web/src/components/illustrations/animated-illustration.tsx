import Image from "next/image";

type AnimatedIllustrationProps = {
  slug: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function AnimatedIllustration({
  slug,
  alt,
  className = "object-cover",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: AnimatedIllustrationProps) {
  return (
    <Image
      src={`/images/illustrations/${slug}-source.png`}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
