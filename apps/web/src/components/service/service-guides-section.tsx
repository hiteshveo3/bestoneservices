import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowUpRight, User } from "lucide-react";

export interface GuideCardProps {
  tag: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  href: string;
}

export interface ServiceGuidesSectionProps {
  badge?: string;
  title?: string;
  guides: GuideCardProps[];
}

export function ServiceGuidesSection({
  badge = "HELPFUL ADVICE & GUIDES",
  title = "Service Guides & Moving Advice",
  guides,
}: ServiceGuidesSectionProps) {
  return (
    <section className="space-y-8 text-start">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-base font-medium">
          <BookOpen className="w-4 h-4 text-ink-600 shrink-0" />
          <span>{badge}</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-medium text-ink-900 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 text-start">
        {guides.map((guide, idx) => (
          <Link
            key={idx}
            href={guide.href}
            className="group bg-[#F8F9FA] rounded-[16px] p-5 border border-[#E5FBC9] space-y-4 transition-colors duration-150 cursor-pointer block text-decoration-none"
          >
            <div className="relative rounded-[16px] overflow-hidden h-48 border border-[#E5FBC9]">
              <Image
                src={guide.image}
                alt={guide.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#F9FCF5]/95 text-ink-600 text-base font-medium border border-[#B7F56A]">
                {guide.tag}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-xl font-medium text-ink-900 group-hover:text-ink-900 leading-snug">
                {guide.title}
              </h3>
              <p className="text-base text-ink-500 leading-relaxed">
                {guide.excerpt}
              </p>
              <div className="pt-3 flex items-center justify-between border-t border-[#E5FBC9] text-base font-medium text-ink-600">
                <span className="flex items-center gap-1.5 text-ink-500">
                  <User className="w-4 h-4 text-ink-600 shrink-0" />
                  <span>{guide.author}</span>
                </span>
                <ArrowUpRight className="w-5 h-5 text-ink-600 shrink-0" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
