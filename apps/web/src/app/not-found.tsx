import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Button, Eyebrow, Petals } from "@/components/touchstone";

/** Lab 03 S61 C: the page has moved, and every service is one tap away. */
export default function NotFound() {
  const shortcuts = [
    { label: "Pest control", href: "/pest-control-services/" },
    { label: "End of tenancy cleaning", href: "/cleaning-services/end-of-tenancy-cleaning/" },
    { label: "Gardening", href: "/gardening/" },
    { label: "Removals", href: "/removals/" },
    { label: "Every price", href: "/prices/" },
    { label: "Areas we cover", href: "/areas/" },
  ];

  return (
    <main id="main-content" className="min-h-[70vh] bg-paper text-ink">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="grid content-start gap-5">
          <Petals size={64} />
          <p className="ts-fig m-0 text-[96px]">404</p>
          <h1 className="ts-head m-0 text-[clamp(32px,4vw,48px)]">
            This page has moved. <span className="ts-soft">Everything else is one tap away.</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            <Button href="/prices/" size="lg">See every price</Button>
            <Button href="/" variant="white" size="lg">Home</Button>
          </div>
        </div>
        <div className="grid content-start gap-3">
          <Eyebrow>Popular pages</Eyebrow>
          <ul className="m-0 grid list-none gap-1 p-0">
            {shortcuts.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3.5 font-semibold no-underline transition-colors duration-150 hover:bg-lime-soft">
                  {s.label}
                  <ArrowRight className="size-4 text-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
