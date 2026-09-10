import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";

export interface RelatedServiceItem {
  title: string;
  description: string;
  price: string;
  href: string;
}

export interface RelatedServicesGridProps {
  badge?: string;
  title?: string;
  services: RelatedServiceItem[];
}

export function RelatedServicesGrid({
  badge = "CONTEXTUAL ADD-ONS & COMPLEMENTARY SERVICES",
  title = "Related Cleaning & Property Services",
  services,
}: RelatedServicesGridProps) {
  return (
    <SectionReveal className="space-y-8 text-start">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-base font-medium">
          <Sparkles className="w-4 h-4 text-ink-600 shrink-0" />
          <span>{badge}</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-medium text-ink-900 tracking-tight">
          {title}
        </h2>
      </div>

      <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.07}>
        {services.map((srv, idx) => (
          <StaggerItem 
            key={idx}
            className="bg-[#F8F9FA] rounded-[16px] p-6 border border-[#E5FBC9] space-y-4 transition-colors duration-150 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-heading text-xl font-medium text-ink-900">{srv.title}</h3>
                <span className="px-3 py-1 rounded-full bg-[#F9FCF5] text-ink-600 text-base font-mono font-medium border border-[#E5FBC9]">
                  {srv.price}
                </span>
              </div>
              <p className="text-base text-ink-500 leading-relaxed">
                {srv.description}
              </p>
            </div>

            <ButtonLink href={srv.href} variant="outline" className="w-full">
              View Service
            </ButtonLink>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}
