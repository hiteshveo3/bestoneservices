"use client";

import { MapPin, Phone, ExternalLink, Navigation } from "lucide-react";
import { getGoogleProfileForCategory, type GoogleBusinessProfile } from "@/config/google-business-profiles";

export interface GoogleBusinessLocationProps {
  category?: string;
  showMap?: boolean;
}

export function GoogleBusinessLocation({
  category = "pest-control",
  showMap = true,
}: GoogleBusinessLocationProps) {
  const profile: GoogleBusinessProfile = getGoogleProfileForCategory(category);

  return (
    <div className="bg-[#F9FCF5] rounded-[16px] p-6 sm:p-8 border border-[#B7F56A] space-y-6 text-start">
      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
          VERIFIED GOOGLE LOCATION
        </span>
        <h3 className="font-heading text-2xl font-medium text-ink-900">{profile.businessName}</h3>
        <p className="text-sm text-ink-500">{profile.category}</p>
      </div>

      <div className="space-y-3 text-base text-ink-600 font-medium">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-ink-600 shrink-0 mt-0.5" />
          <span>{profile.address}</span>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-ink-600 shrink-0" />
          <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="hover:underline text-ink-600 text-decoration-none font-medium">
            {profile.phone}
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <a
          href={profile.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] transition-colors duration-150 inline-flex items-center gap-2 text-decoration-none border border-[#E5FBC9]"
        >
          <Navigation className="w-4 h-4 text-white" />
          <span>Get Directions</span>
        </a>

        <a
          href={profile.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-ink-600 font-medium text-sm hover:bg-[#DCFAB7] transition-colors duration-150 inline-flex items-center gap-2 text-decoration-none"
        >
          <span>View on Google Maps</span>
          <ExternalLink className="w-4 h-4 text-ink-600" />
        </a>
      </div>

      {showMap && (
        <div className="rounded-[16px] overflow-hidden border border-[#E5FBC9] aspect-16/9 bg-[#F9FCF5] mt-4">
          <iframe
            title={`${profile.businessName} Map`}
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.2285149303!2d0.0718!3d51.5588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTE8MTMzJzMxLjciTiAwwrAwNCcyOC41IkU!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}

