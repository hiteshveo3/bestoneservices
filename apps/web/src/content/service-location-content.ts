import { allApprovedServicePages, type ApprovedServicePage } from "@/content/approved-service-pages";
import { getLocation, locations, type LocationEntry } from "@/content/locations";
import { getService, type ServiceCategory } from "@/content/service-catalog";

export type ServiceLocationContent = ApprovedServicePage & {
  locationName: string;
  locationIntro: string;
  localDemandNote?: string;
  nearbyLocations: LocationEntry[];
};

/**
 * A short paragraph that is genuinely different per location — using the
 * real search-volume/ranking data already collected in locations.ts — so
 * every service × location page isn't just the base service copy with the
 * place name swapped in. Falls back to naming real neighbouring areas
 * (still unique per location) when no keyword data exists for that place.
 */
function localDemandNoteFor(
  serviceTitle: string,
  location: LocationEntry,
  nearby: LocationEntry[],
  isCleaning: boolean
): string | undefined {
  // The recorded search-volume keywords in locations.ts are specifically
  // pest-control search terms — reusing them on a cleaning-services page
  // would cite the wrong service, so cleaning pages always use the
  // neighbouring-areas fallback instead.
  if (!isCleaning && location.existingKeyword && location.volume) {
    const rankNote =
      location.existingPosition && location.existingPosition <= 3
        ? `Best One already ranks in the top ${location.existingPosition === 1 ? "position" : `${location.existingPosition} results`} for "${location.existingKeyword}" locally.`
        : `"${location.existingKeyword}" is searched roughly ${location.volume} times a month in this area.`;
    return `${rankNote} It's one of the more active postcodes we cover for ${serviceTitle.toLowerCase()}.`;
  }

  if (nearby.length > 0) {
    const names = nearby.slice(0, 2).map((l) => l.name).join(" and ");
    return `We also regularly cover ${names} nearby, so a technician is rarely far from ${location.name}.`;
  }

  return undefined;
}

function nearbyLocationsFor(slug: string, count = 4): LocationEntry[] {
  const idx = locations.findIndex((l) => l.slug === slug);
  if (idx === -1) return [];
  const rest = locations.filter((l) => l.slug !== slug);
  const start = idx % rest.length;
  return [...rest.slice(start), ...rest.slice(0, start)].slice(0, count);
}

function locationIntroFor(serviceTitle: string, location: LocationEntry, isCleaning = false): string {
  if (isCleaning) {
    return `${serviceTitle} is available to ${location.name} tenants, landlords and letting agents. Guaranteed 48-hour re-clean support, full inventory checklist and transparent flat pricing.`;
  }
  if (location.existingKeyword && location.volume) {
    return `${serviceTitle} enquiries in ${location.name} sit alongside strong local demand for pest control in the area. Describe the signs you have seen, the affected rooms and your ${location.name} postcode so the right next step can be discussed.`;
  }
  return `${serviceTitle} is available to ${location.name} residents, landlords and businesses. Describe the signs you have seen, the affected rooms and your ${location.name} postcode so the right next step can be discussed.`;
}

export function getServiceLocationContent(
  category: ServiceCategory,
  serviceSlug: string,
  locationSlug: string
): ServiceLocationContent | undefined {
  const serviceRecord = getService(category, serviceSlug);
  const location = getLocation(locationSlug);
  const approved = allApprovedServicePages[`${category}/${serviceSlug}`];
  if (!serviceRecord || !location || !approved) return undefined;

  const [, serviceTitle] = serviceRecord;
  const isCleaning = category === "cleaning-services";
  const nearbyLocations = nearbyLocationsFor(location.slug);

  return {
    ...approved,
    title: approved.title,
    description: `${approved.title} in ${location.name}. ${approved.description}`,
    locationName: location.name,
    locationIntro: locationIntroFor(serviceTitle, location, isCleaning),
    localDemandNote: localDemandNoteFor(serviceTitle, location, nearbyLocations, isCleaning),
    nearbyLocations,
    faqs: [
      ...approved.faqs,
      {
        question: `Do you provide ${approved.title.toLowerCase()} in ${location.name}?`,
        answer: `Yes. Best One Services provides ${approved.title.toLowerCase()} for homes, rental properties and businesses in ${location.name}. Tell us the property postcode, signs and affected areas when you enquire.`,
      },
    ],
  };
}
