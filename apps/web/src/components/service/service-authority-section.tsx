import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/button-link";

export interface AuthorityFeature {
  title: string;
  desc: string;
}

export interface ServiceAuthoritySectionProps {
  badge: string;
  title: string;
  description: string;
  features: AuthorityFeature[];
  image: string;
  imageAlt: string;
  imageTagline: string;
  imageBadge: string;
  ctaText?: string;
  ctaHref?: string;
}

export function ServiceAuthoritySection({
  badge,
  title,
  description,
  features,
  image,
  imageAlt,
  imageTagline,
  imageBadge,
  ctaText = "Book Move-Out Clean",
  ctaHref = "/booking/",
}: ServiceAuthoritySectionProps) {
  return (
    <section className="bg-[#F8F9FA] rounded-[16px] p-8 sm:p-12 border border-[#E5FBC9] space-y-8 text-start">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Authority Narrative */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-base font-medium bg-ink-100 border border-[#E5FBC9] text-ink-600">
            <ShieldCheck className="w-5 h-5 text-ink-600 shrink-0" />
            <span>{badge}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-ink-900 tracking-tight">
            {title}
          </h2>

          <p className="text-lg text-ink-500 leading-relaxed font-normal">
            {description}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-base font-medium">
            {features.map((feat, idx) => (
              <div key={idx} className="p-5 rounded-[16px] bg-white border border-[#B7F56A] space-y-1">
                <div className="text-ink-900 font-heading font-medium text-xl">{feat.title}</div>
                <div className="text-base text-ink-500">{feat.desc}</div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <ButtonLink href={ctaHref} variant="dark" className="w-fit">
              {ctaText}
            </ButtonLink>
          </div>
        </div>

        {/* Right Column: Authority Image & Badge */}
        <div className="lg:col-span-6">
          <div className="rounded-[16px] overflow-hidden border border-[#E5FBC9] relative h-[380px]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#F9FCF5]/95 backdrop-blur-md p-4 rounded-[16px] border border-[#B7F56A] flex items-center justify-between">
              <div className="text-base font-medium text-ink-600">{imageTagline}</div>
              <span className="px-3.5 py-1 rounded-full bg-[#F9FCF5] text-ink-600 text-base font-mono font-medium border border-[#B7F56A]">
                {imageBadge}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
