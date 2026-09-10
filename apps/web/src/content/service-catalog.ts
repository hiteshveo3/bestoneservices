export const serviceCatalog = {
  "pest-control-services": {
    label: "Pest Control Services",
    intro: "Pest-control support for homes, rental properties and businesses across London.",
    services: [
      ["rat-control", "Rat Control"], ["mice-control", "Mice Control"], ["bed-bug-treatment", "Bed Bug Treatment"], ["cockroach-control", "Cockroach Control"], ["ant-treatment", "Ant Treatment"], ["flea-treatment", "Flea Treatment"], ["wasp-treatment", "Wasp Treatment"], ["squirrel-control", "Squirrel Control"], ["spider-treatment", "Spider Treatment"], ["silverfish-treatment", "Silverfish Treatment"], ["moth-treatment", "Moth Treatment"], ["carpet-beetles", "Carpet Beetle Treatment"], ["woodworm-treatment", "Woodworm Treatment"], ["general-fogging", "General Fogging"], ["dead-pest-removal", "Dead Pest Removal"], ["pest-inspection", "Pest Inspection"], ["commercial-pest-control", "Commercial Pest Control"],
      ["pharaoh-ant-control", "Pharaoh Ant Control"], ["bed-bug-heat-treatment", "Bed Bug Heat Treatment"], ["bed-bug-mattress-protection", "Bed Bug Mattress Protection"], ["bee-removal", "Bee Removal"], ["bee-nest-extraction", "Bee Nest Extraction"], ["bird-control", "Bird Control"], ["pigeon-control", "Pigeon Control / Removal"], ["bird-pigeon-proofing", "Bird & Pigeon Proofing"], ["falconry-bird-control", "Falconry Bird Control"], ["solar-panel-bird-proofing", "Solar Panel Bird/Pigeon Proofing"], ["chimney-protection", "Chimney Protection"], ["cluster-fly-control", "Cluster Fly Control"], ["fly-control", "Fly Control"], ["electric-fly-killer-services", "Electric Fly Killer (EFK) Services"], ["fox-control", "Fox Control"], ["glis-glis-control", "Glis Glis / Edible Dormouse Control"], ["harlequin-ladybird-control", "Harlequin Ladybird Control"], ["mite-plaster-beetle-control", "Mite / Plaster Beetle Control"], ["mole-control", "Mole Control"], ["rat-sewer-control", "Rat Sewer Control"], ["rabbit-control", "Rabbit Control"], ["slug-control", "Slug Control"], ["hornet-nest-removal", "Hornet Nest Removal"], ["woodlice-control", "Woodlice Control"], ["rodent-proofing", "Rat, Mice, Squirrel & Glis Glis Proofing"], ["drain-sewer-camera-surveys", "Drain & Sewer Camera Surveys"], ["disinfectant-biocide-treatment", "Disinfectant / Biocide Treatment"], ["loft-insulation-removal-installation", "Loft Insulation Removal & Installation"], ["pest-control-contracts", "Pest Control Contracts / Ongoing Pest Management"],
    ],
  },
  "cleaning-services": {
    label: "Cleaning Services",
    intro: "Cleaning services for homes, rental properties and property managers across London.",
    services: [
      ["end-of-tenancy-cleaning", "End of Tenancy Cleaning"], ["domestic-cleaning", "Domestic Cleaning"], ["regular-cleaning", "Regular Cleaning"], ["one-off-cleaning-services", "One-off Cleaning Services"], ["after-builders-cleaning", "After Builders Cleaning"], ["carpet-cleaning", "Carpet Cleaning"], ["oven-cleaning-service", "Oven Cleaning Service"], ["appliance-cleaning", "Appliance Cleaning"], ["mattress-cleaning-service", "Mattress Cleaning Service"], ["upholstery-cleaning", "Upholstery Cleaning"], ["window-cleaning", "Window Cleaning"], ["holiday-rental-cleaning", "Holiday Rental Cleaning"], ["range-cooker-cleaning", "Range Cooker Cleaning"], ["aga-cleaning", "AGA Cleaning"], ["bbq-cleaning", "BBQ Cleaning"], ["curtains-and-blinds-cleaning", "Curtains and Blinds Cleaning"], ["leather-sofa-cleaning-services", "Leather Sofa Cleaning Services"], ["conservatory-cleaning", "Conservatory Cleaning"], ["gutter-cleaning", "Gutter Cleaning"], ["home-organising-services", "Home Organising Services"], ["laundry-dry-cleaning", "Laundry and Dry Cleaning"],
    ],
  },
} as const;

export type ServiceCategory = keyof typeof serviceCatalog;
export function getService(category: ServiceCategory, slug: string) { return serviceCatalog[category].services.find(([serviceSlug]) => serviceSlug === slug); }
