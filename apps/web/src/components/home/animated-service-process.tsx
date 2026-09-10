import Image from "next/image";

const steps = [
  {
    step: "01",
    title: "Instant Fixed Quote",
    description:
      "Select your property size and service specifications to calculate an instant, transparent rate with zero hidden fees.",
    image: "/images/illustrations/instant-quote-v2-source.png",
    alt: "Instant quote interface with a progress bar and pointer",
  },
  {
    step: "02",
    title: "Choose the Right Service",
    description:
      "Cleaning, pest control, gardening and removals stay organised in one clear property-care journey.",
    image: "/images/illustrations/choose-service-v2-source.png",
    alt: "Selection of cleaning, pest control, gardening and removals services",
  },
  {
    step: "03",
    title: "Track Every Booking",
    description:
      "See your confirmed slot and service progress while our local team handles the work from arrival to completion.",
    image: "/images/illustrations/track-booking-v2-source.png",
    alt: "Booking timeline with progress indicators and confirmation",
  },
] as const;

export function AnimatedServiceProcess() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((item) => (
        <article key={item.step} className="space-y-5">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] bg-[#F9FCF5] border border-[#E5FBC9] shadow-2xs">
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-2 px-1 text-start">
            <span className="font-mono text-xs font-bold text-[#1F3A00] bg-[#DCFAB7] border border-[#99D055] px-2.5 py-0.5 rounded-full uppercase inline-block tracking-wide">
              STEP {item.step}
            </span>
            <h3 className="font-heading text-xl font-bold text-[#1F3A00]">{item.title}</h3>
            <p className="text-base leading-relaxed text-[#1F3A00]">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
