import { masterPricingData, PRICING_LAST_UPDATED } from "@/config/pricing-data";
import { siteConfig } from "@/config/site";

export async function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    siteConfig.description,
    "",
    `Coverage: Greater London and the M25 (all 32 boroughs).`,
    `Prices last updated: ${PRICING_LAST_UPDATED}. Full detail: ${siteConfig.url}/prices/`,
    "",
    "## Services and starting prices",
    "",
    ...Object.values(masterPricingData).map(
      (cat) => `- ${cat.title.replace(" Pricing", "")}: ${cat.startingRateDisplay} — ${siteConfig.url}/prices/`
    ),
    "",
    "## Guarantees",
    "",
    "- Cleaning: 48-Hour Re-Clean Guarantee",
    "- Pest control: 1-month guarantee (2-visit packages), 3-month guarantee (3-visit packages)",
    "- Removals: full goods-in-transit and public liability insurance",
    "",
    "## Contact",
    "",
    `Booking: ${siteConfig.url}/booking/`,
    `Contact: ${siteConfig.url}/contact/`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
