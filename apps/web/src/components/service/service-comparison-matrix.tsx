import { Layers } from "lucide-react";

export interface ComparisonRow {
  feature: string;
  standard: string;
  premium: string;
}

export interface ServiceComparisonMatrixProps {
  badge?: string;
  title?: string;
  rows: ComparisonRow[];
}

export function ServiceComparisonMatrix({
  badge = "TRANSPARENT PACKAGE COMPARISON",
  title = "Standard vs Premium Package Matrix",
  rows,
}: ServiceComparisonMatrixProps) {
  return (
    <section className="bg-[#F8F9FA] rounded-[16px] p-8 sm:p-12 border border-[#E5FBC9] space-y-8 text-start">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-base font-medium">
          <Layers className="w-4 h-4 text-ink-600 shrink-0" />
          <span>{badge}</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-medium text-ink-900 tracking-tight pt-1">
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-[16px] border border-[#E5FBC9]">
        <table className="w-full text-start border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-[#E5FBC9] text-ink-900 font-heading text-lg">
              <th className="py-4 px-4 text-start font-medium sticky left-0 bg-[#F8F9FA] z-20 border-r border-[#E5FBC9]">
                Service Scope & Inclusions
              </th>
              <th className="py-4 px-4 text-center font-medium">
                Standard Package
              </th>
              <th className="py-4 px-4 text-center font-medium bg-white text-ink-600">
                Premium Package
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bone-300 text-base text-ink-500">
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="py-4 px-4 text-start font-medium text-ink-600 sticky left-0 bg-[#F8F9FA] z-10 border-r border-[#E5FBC9]">
                  {row.feature}
                </td>
                <td className="py-4 px-4 text-center">
                  {row.standard}
                </td>
                <td className="py-4 px-4 text-center font-medium text-ink-600 bg-white">
                  {row.premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
