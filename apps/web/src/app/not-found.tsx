import Link from "next/link";
import { Search, Home, Sparkles, Bug, Trees, Truck, Calculator, MapPin, ArrowRight } from "lucide-react";

export default function NotFound() {
  const shortcuts = [
    { label: "End of Tenancy Cleaning", href: "/cleaning-services/end-of-tenancy-cleaning/", icon: Sparkles },
    { label: "Pest Control Services", href: "/pest-control-services/", icon: Bug },
    { label: "Gardening & Clearance", href: "/gardening/", icon: Trees },
    { label: "House Removals & Storage", href: "/removals/", icon: Truck },
    { label: "Instant Price Calculator", href: "/prices/", icon: Calculator },
    { label: "London Coverage Areas", href: "/areas/", icon: MapPin },
  ];

  return (
    <>
      <main id="main-content" className="py-16 text-start min-h-[70vh] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
          
          {/* HERO RECOVERY CARD */}
          <div className="bg-[#F9FCF5] rounded-[24px] p-8 sm:p-12 border border-[#B7F56A] shadow-2xs space-y-6 text-start">
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-[#DCFAB7] text-[#1F3A00] shadow-2xs text-xs font-mono font-semibold font-medium uppercase tracking-wider">
                ERROR 404
              </span>
              <h1 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-ink-900">
                We Couldn&apos;t Find That Page
              </h1>
              <p className="text-lg text-ink-500 max-w-xl leading-relaxed">
                The page may have moved, or the web address might be incorrect. Use the search tool or popular service shortcuts below to recover quickly.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/search/"
                className="px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 inline-flex items-center gap-2 cursor-pointer text-decoration-none"
              >
                <Search className="w-4 h-4 text-[#1F3A00]" />
                <span>Search Best One Services</span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#F9FCF5] border border-[#E5FBC9] text-[#1F3A00] hover:opacity-90 transition-opacity duration-200 text-decoration-none gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 text-ink-600" />
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>

          {/* POPULAR SHORTCUTS GRID */}
          <div className="space-y-4 text-start">
            <h2 className="font-heading text-xl font-medium text-ink-900">Popular Service Destinations</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shortcuts.map((sc, idx) => {
                const Icon = sc.icon;
                return (
                  <Link
                    key={idx}
                    href={sc.href}
                    className="p-5 rounded-[20px] bg-white border border-[#B7F56A] shadow-2xs hover:border-[#1F3A00] transition-colors duration-200 flex items-center justify-between text-ink-700 text-decoration-none group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center font-medium">
                        <Icon className="w-5 h-5 text-[#1F3A00]" />
                      </div>
                      <span className="font-heading font-medium text-sm group-hover:underline">{sc.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1F3A00] opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </main>

    </>
  );
}


