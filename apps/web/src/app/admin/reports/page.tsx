"use client";

import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Download, 
  FileText, 
  Users, 
  MessageSquare
} from "lucide-react";

export default function AdminReportsPage() {
  const [downloadingEntity, setDownloadingEntity] = useState<string | null>(null);

  const handleDownloadCsv = (entity: string) => {
    setDownloadingEntity(entity);
    window.location.href = `/api/admin/reports/export?entity=${entity}`;
    setTimeout(() => {
      setDownloadingEntity(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 text-start max-w-4xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-2 ">
        <span className="text-xs font-mono font-medium uppercase text-ink-500">EXPORT & REPORTING ENGINE</span>
        <h1 className="font-heading text-2xl sm:text-3xl font-[650] text-ink-900">Operational Business Reports</h1>
        <p className="text-sm text-ink-500">Generate and download instant CSV spreadsheet reports for accounting, auditing, and field operations</p>
      </div>

      {/* REPORT CARDS GRID */}
      <div className="grid sm:grid-cols-2 gap-6">
        
        {/* Bookings Master Report */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 flex flex-col justify-between border-t-black ">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-[18px] bg-[#F6F5F1] flex items-center justify-center">
              <FileText className="w-5 h-5 text-ink-600" />
            </div>
            <h3 className="font-heading font-medium text-lg text-ink-900">Bookings Master Report</h3>
            <p className="text-xs text-ink-500 leading-relaxed">
              Export all customer appointments, booking references, category breakdown, service snapshots, and dispatch statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleDownloadCsv("bookings")}
            disabled={downloadingEntity === "bookings"}
            className="w-full py-3 rounded-md bg-[#B7F56A] text-[#1D201E] hover:bg-[#A2EA4E] text-xs font-medium transition-colors duration-150 border-none cursor-pointer flex items-center justify-center gap-2 "
          >
            <Download className="w-4 h-4 text-[#1D201E]" />
            <span>{downloadingEntity === "bookings" ? "Exporting CSV..." : "Download Bookings CSV →"}</span>
          </button>
        </div>

        {/* Financial Invoices Report */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 flex flex-col justify-between border-t-blue-500 ">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-[18px] bg-success-50 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-success-900" />
            </div>
            <h3 className="font-heading font-medium text-lg text-ink-900">Financial Invoices Report</h3>
            <p className="text-xs text-ink-500 leading-relaxed">
              Export complete invoicing ledger, total amounts (£), VAT tax breakdown, deposits paid, and outstanding receivables.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleDownloadCsv("invoices")}
            disabled={downloadingEntity === "invoices"}
            className="w-full py-3 rounded-md bg-[#B7F56A] text-[#1D201E] hover:bg-[#A2EA4E] text-xs font-medium transition-colors duration-150 border-none cursor-pointer flex items-center justify-center gap-2 "
          >
            <Download className="w-4 h-4 text-[#1D201E]" />
            <span>{downloadingEntity === "invoices" ? "Exporting CSV..." : "Download Invoices CSV →"}</span>
          </button>
        </div>

        {/* Staff Roster Report */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 flex flex-col justify-between border-t-warning-500 ">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-[18px] bg-warning-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-warning-900" />
            </div>
            <h3 className="font-heading font-medium text-lg text-ink-900">Field Staff Roster Report</h3>
            <p className="text-xs text-ink-500 leading-relaxed">
              Export field technician profiles, assigned category verticals, contact info, and daily job capacity limits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleDownloadCsv("staff")}
            disabled={downloadingEntity === "staff"}
            className="w-full py-3 rounded-md bg-[#B7F56A] text-[#1D201E] hover:bg-[#A2EA4E] text-xs font-medium transition-colors duration-150 border-none cursor-pointer flex items-center justify-center gap-2 "
          >
            <Download className="w-4 h-4 text-[#1D201E]" />
            <span>{downloadingEntity === "staff" ? "Exporting CSV..." : "Download Staff Roster CSV →"}</span>
          </button>
        </div>

        {/* Customer Reviews Report */}
        <div className="bg-white rounded-[18px] p-6 space-y-4 flex flex-col justify-between border-t-blue-500 ">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-[18px] bg-[#F6F5F1] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#1D201E]" />
            </div>
            <h3 className="font-heading font-medium text-lg text-ink-900">Customer Reviews Report</h3>
            <p className="text-xs text-ink-500 leading-relaxed">
              Export 5-star customer reviews, rating scores, review feedback text, and moderation statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleDownloadCsv("reviews")}
            disabled={downloadingEntity === "reviews"}
            className="w-full py-3 rounded-md bg-[#B7F56A] text-[#1D201E] hover:bg-[#A2EA4E] text-xs font-medium transition-colors duration-150 border-none cursor-pointer flex items-center justify-center gap-2 "
          >
            <Download className="w-4 h-4 text-[#1D201E]" />
            <span>{downloadingEntity === "reviews" ? "Exporting CSV..." : "Download Reviews CSV →"}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
