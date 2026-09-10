"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { subscribeAdminBookings } from "@/lib/repositories/bookings";
import { subscribeAdminInvoices } from "@/lib/repositories/invoices";
import { subscribeAdminStaff } from "@/lib/repositories/staff";
import { subscribeAdminReviews } from "@/lib/repositories/reviews";
import { calculateAnalyticsSummary } from "@/lib/analytics-engine";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type AnalyticsSummary } from "@/types/analytics";
import { type BookingItem } from "@/types/booking";
import { type InvoiceItem } from "@/types/invoice";
import { type StaffMemberItem } from "@/types/staff";
import { type ReviewItem } from "@/types/review";
import { Spinner } from "@/components/ui/spinner";
import { 
  TrendingUp, 
  PieChart, 
  Award, 
  FileSpreadsheet
} from "lucide-react";

export default function AdminAnalyticsDashboardPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [staff, setStaff] = useState<StaffMemberItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const unSubBookings = subscribeAdminBookings({ status: "all" }, (data) => {
      if (active) setBookings(data);
    });

    const unSubInvoices = subscribeAdminInvoices("all", (data) => {
      if (active) setInvoices(data);
    });

    const unSubStaff = subscribeAdminStaff("all", (data) => {
      if (active) setStaff(data);
    });

    const unSubReviews = subscribeAdminReviews("all", (data) => {
      if (active) {
        setReviews(data);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unSubBookings();
      unSubInvoices();
      unSubStaff();
      unSubReviews();
    };
  }, []);

  const summary: AnalyticsSummary = calculateAnalyticsSummary(bookings, invoices, staff, reviews);

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER BAR */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">EXECUTIVE BI & ANALYTICS WORKSPACE</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Financial Analytics & Revenue Forecasting</h1>
            <p className="text-sm text-ink-500">Track gross revenue, category growth, 30-day projected income, and staff performance metrics</p>
          </div>

          <Link
            href="/admin/reports"
            className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs hover:bg-[#2d5004] transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer text-decoration-none border border-[#E5FBC9]"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Export CSV Reports</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Calculating executive BI analytics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* TOP REVENUE KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-[18px] p-6 space-y-1 border border-[#E5FBC9]">
              <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Gross Invoiced Revenue</span>
              <p className="font-heading font-medium text-2xl text-ink-900">
                {formatPenceToGBP(summary.grossInvoicedPence)}
              </p>
              <span className="text-[11px] font-mono text-ink-500">Total Billed to Clients</span>
            </div>

            <div className="bg-white rounded-[18px] p-6 space-y-1 border border-[#E5FBC9]">
              <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Net Revenue Collected</span>
              <p className="font-heading font-medium text-2xl text-[#1F3A00]">
                {formatPenceToGBP(summary.netCollectedPence)}
              </p>
              <span className="text-[11px] font-mono text-success-900">Cash & Card Received</span>
            </div>

            <div className="bg-white rounded-[18px] p-6 space-y-1 border border-[#E5FBC9]">
              <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Outstanding Receivables</span>
              <p className="font-heading font-medium text-2xl text-danger-500">
                {formatPenceToGBP(summary.outstandingReceivablesPence)}
              </p>
              <span className="text-[11px] font-mono text-danger-500">Pending Invoices Due</span>
            </div>

            <div className="bg-white rounded-[18px] p-6 space-y-1 border border-[#E5FBC9]">
              <span className="text-[10px] font-mono font-medium uppercase text-ink-500">Average Booking Value</span>
              <p className="font-heading font-medium text-2xl text-ink-900">
                {formatPenceToGBP(summary.averageBookingValuePence)}
              </p>
              <span className="text-[11px] font-mono text-ink-500">Per Appointment Average</span>
            </div>
          </div>

          {/* CATEGORY DISTRIBUTION & FORECASTING GRID */}
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Category Revenue Share (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
              <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
                <span className="text-xs font-mono font-medium uppercase text-ink-500">CATEGORY REVENUE DISTRIBUTION</span>
                <PieChart className="w-4 h-4 text-ink-600" />
              </div>

              <div className="space-y-3">
                {summary.categoryBreakdown.map((cat) => (
                  <div key={cat.categoryId} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-medium text-ink-600">{cat.categoryName} ({cat.bookingCount} Jobs)</span>
                      <span className="text-ink-600 font-medium">{formatPenceToGBP(cat.totalRevenuePence)} ({cat.percentage}%)</span>
                    </div>

                    <div className="w-full bg-[#F9FCF5] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#1F3A00] h-2.5 rounded-full"
                        style={{ width: `${Math.max(cat.percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 30-Day Revenue Forecast (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
              <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
                <span className="text-xs font-mono font-medium uppercase text-ink-500">30-DAY REVENUE PROJECTION & FORECAST</span>
                <TrendingUp className="w-4 h-4 text-[#1F3A00]" />
              </div>

              <div className="space-y-3">
                {summary.monthlyForecast.map((fc, idx) => (
                  <div key={idx} className="p-4 rounded-[18px] bg-white border border-[#E5FBC9] flex items-center justify-between">
                    <div>
                      <span className="font-heading font-medium text-base text-ink-900">{fc.monthLabel}</span>
                      <span className="text-xs font-mono text-ink-500 block">{fc.bookingCount} Projected Bookings</span>
                    </div>

                    <span className="font-heading font-medium text-xl text-ink-900">
                      {formatPenceToGBP(fc.projectedRevenuePence)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* STAFF PERFORMANCE RATING TABLE */}
          <div className="bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
            <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
              <span className="text-xs font-mono font-medium uppercase text-ink-500">FIELD TECHNICIAN & STAFF PERFORMANCE SCORECARD</span>
              <Award className="w-4 h-4 text-ink-600" />
            </div>

            {summary.staffPerformance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-[#E5FBC9] text-left text-[11px] text-ink-500 uppercase">
                      <th className="py-2 font-medium">Technician Name</th>
                      <th className="py-2 font-medium">Role</th>
                      <th className="py-2 text-center font-medium">Completed Jobs</th>
                      <th className="py-2 text-right font-medium">Average Customer Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bone-300">
                    {summary.staffPerformance.map((stf) => (
                      <tr key={stf.staffId}>
                        <td className="py-3 font-medium text-ink-600">{stf.staffName} ({stf.staffId})</td>
                        <td className="py-3 text-ink-500">{stf.role.replace("_", " ").toUpperCase()}</td>
                        <td className="py-3 text-center font-medium text-ink-600">{stf.jobsCompletedCount}</td>
                        <td className="py-3 text-right font-medium text-warning-500">{stf.averageRating} ★</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-xs font-mono text-ink-500">
                No staff members recorded in database.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

