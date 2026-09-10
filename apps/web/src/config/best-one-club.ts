/**
 * Best One Club - Membership Configuration Foundation
 * Centralized dataset for verified member benefits and rate rules
 */

export interface BestOneClubConfig {
  enabled: boolean;
  title: string;
  verifiedBenefits: {
    serviceId: string;
    serviceName: string;
    standardRate: string;
    clubRate: string;
    savingsNote: string;
  }[];
}

export const BEST_ONE_CLUB_CONFIG: BestOneClubConfig = {
  enabled: true,
  title: "Best One Club Member Rates",
  verifiedBenefits: [
    {
      serviceId: "removals",
      serviceName: "House Removals & Packing",
      standardRate: "£30 / hour",
      clubRate: "£25 / hour",
      savingsNote: "Save £5/hr on professional packing services across London",
    },
  ],
};

export function getClubBenefitForService(serviceId: string) {
  return BEST_ONE_CLUB_CONFIG.verifiedBenefits.find((b) => b.serviceId === serviceId);
}
