"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldCheck, MapPin, Mail, CheckCircle2, ChevronDown, Phone, MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CONTACT } from "@/config/contact";
import { siteContact } from "@/config/site-contact";
import { footerNavigation } from "@/config/site-navigation";

export function SiteFooter() {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy/" },
    { label: "Cookie Policy", href: "/cookie-policy/" },
    { label: "Terms & Conditions", href: "/terms-and-conditions/" },
    { label: "Cancellation & Refunds", href: "/cancellation-and-refund-policy/" },
  ];

  return (
    <footer className="bg-[#F4F9ED] text-[#1F3A00] border-t border-[#D1E8B8] pt-14 pb-12 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Brand & Identity Header */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-[12px] bg-[#B7F56A] text-[#1F3A00] flex items-center justify-center font-bold shadow-2xs">
                <Sparkles className="w-5 h-5 text-[#1F3A00]" />
              </div>
              <span className="font-heading font-bold text-2xl text-[#1F3A00] tracking-[-0.02em]">
                {siteConfig.name}
              </span>
            </div>

            <p className="text-base text-[#1F3A00]/70 leading-relaxed max-w-sm font-normal">
              {siteConfig.description}
            </p>

            {/* Verification Card */}
            <div className="p-4 rounded-[16px] bg-white space-y-2.5 text-base border border-[#D1E8B8] shadow-2xs">
              <div className="flex items-center justify-between font-medium text-[#1F3A00] flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-[#1F3A00] shrink-0" />
                  <span>Licensed Professional Service</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#B7F56A] text-[#1F3A00] text-xs font-bold inline-flex items-center gap-1">
                  <span>4.9 ★★★★★</span>
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-[#1F3A00]/70 border-t border-[#E5FBC9] pt-2">
                <div className="flex items-center justify-between">
                  <span>Google & Trustpilot Reviews</span>
                  <span className="font-semibold text-[#1F3A00]">1,020+ Verified</span>
                </div>
                <div>Coverage: Greater London & M25 Postcodes</div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 text-base text-[#1F3A00]/80 pt-1">
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-5 h-5 text-[#1F3A00] shrink-0" />
                <span>{CONTACT.address}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Phone className="w-5 h-5 text-[#1F3A00] shrink-0" />
                <a href={`tel:${CONTACT.landline.tel}`} className="text-[#1F3A00] hover:underline text-decoration-none transition-colors duration-150">
                  {CONTACT.landline.display}
                </a>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <MessageSquare className="w-5 h-5 text-[#1F3A00] shrink-0" />
                <a href={`https://wa.me/${CONTACT.whatsapp.wa}`} target="_blank" rel="noopener noreferrer" className="text-[#1F3A00] hover:underline text-decoration-none transition-colors duration-150">
                  WhatsApp Us ({CONTACT.whatsapp.display})
                </a>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Mail className="w-5 h-5 text-[#1F3A00] shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="text-[#1F3A00] hover:underline text-decoration-none transition-colors duration-150">
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </div>

          {/* DESKTOP MULTI-COLUMN NAVIGATION LINKS */}
          <div className="hidden lg:contents">
            {footerNavigation.map((group) => (
              <div className="space-y-3" key={group.title}>
                <div className="font-heading text-base font-bold text-[#1F3A00]">
                  {group.title}
                </div>
                <ul className="space-y-2 text-base text-[#1F3A00]/70 font-normal list-none p-0">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-[#1F3A00] hover:underline transition-colors duration-150 text-decoration-none text-[#1F3A00]/70">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Desktop Legal Links */}
            <div className="space-y-3">
              <div className="font-heading text-base font-bold text-[#1F3A00]">
                Legal Policies
              </div>
              <ul className="space-y-2 text-base text-[#1F3A00]/70 font-normal list-none p-0">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-[#1F3A00] hover:underline transition-colors duration-150 text-decoration-none text-[#1F3A00]/70">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MOBILE ACCORDION NAVIGATION GROUPS */}
          <div className="lg:hidden border-t border-[#D1E8B8] divide-y divide-[#D1E8B8]">
            {[
              ...footerNavigation.map((g) => ({ title: g.title, links: g.links })),
              { title: "Legal Policies", links: legalLinks },
            ].map((group) => {
              const isOpen = !!openAccordions[group.title];

              return (
                <div 
                  key={group.title}
                  className="bg-transparent py-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(group.title)}
                    aria-expanded={isOpen}
                    className="w-full py-4 px-0 flex items-center justify-between font-heading font-semibold text-base text-[#1F3A00] cursor-pointer text-start transition-colors duration-150 group"
                  >
                    <span>{group.title}</span>
                    <div 
                      style={{ transitionDuration: "0.4s" }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ease-out ${
                        isOpen ? "rotate-180 bg-[#B7F56A] text-[#1F3A00]" : "bg-white border border-[#D1E8B8] text-[#1F3A00] group-hover:border-[#B7F56A]"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 text-current" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.25, 1, 0.5, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pt-1">
                          <ul className="space-y-2.5 text-base text-[#1F3A00]/70 list-none p-0 m-0">
                            {group.links.map((item) => (
                              <li key={item.href}>
                                <Link href={item.href} className="block py-1 text-[#1F3A00]/80 font-medium hover:text-[#1F3A00] hover:underline text-decoration-none">
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

        {/* SEO Verification Strip */}
        <div className="pt-8 border-t border-[#D1E8B8] space-y-3">
          <div className="text-base font-semibold text-[#1F3A00] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1F3A00] shrink-0" />
            <span>Official Licensed Service Provider: Best One Services</span>
          </div>
          <div className="flex flex-wrap gap-2 text-base text-[#1F3A00]">
            <span className="px-3.5 py-1.5 rounded-full bg-[#B7F56A] border border-[#B7F56A] font-medium text-[#1F3A00] text-sm">End of Tenancy Cleaning</span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#B7F56A] border border-[#B7F56A] font-medium text-[#1F3A00] text-sm">Pest Control Services</span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#B7F56A] border border-[#B7F56A] font-medium text-[#1F3A00] text-sm">Gardening & Clearance</span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#B7F56A] border border-[#B7F56A] font-medium text-[#1F3A00] text-sm">Removals & Storage</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#D1E8B8] flex flex-col sm:flex-row items-center justify-between gap-4 text-base text-[#1F3A00]/60">
          <div>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/privacy-policy/" className="hover:text-[#1F3A00] hover:underline transition-colors duration-150 text-decoration-none text-[#1F3A00]/60">Privacy Policy</Link>
            <Link href="/terms-and-conditions/" className="hover:text-[#1F3A00] hover:underline transition-colors duration-150 text-decoration-none text-[#1F3A00]/60">Terms of Service</Link>
            <Link href="/cancellation-and-refund-policy/" className="hover:text-[#1F3A00] hover:underline transition-colors duration-150 text-decoration-none text-[#1F3A00]/60">Refunds</Link>
            <Link href="/cookie-policy/" className="hover:text-[#1F3A00] hover:underline transition-colors duration-150 text-decoration-none text-[#1F3A00]/60">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
