"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { subscribeAdminServices } from "@/lib/repositories/services";
import { formatPenceToGBP } from "@/lib/booking-domain";
import { type ServicePackageItem, type ServiceStatus } from "@/types/service";
import { Spinner } from "@/components/ui/spinner";
import { 
  Package, 
  Plus, 
  ChevronRight
} from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServicePackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");

  useEffect(() => {
    let active = true;
    const unSub = subscribeAdminServices(statusFilter, (data) => {
      if (!active) return;
      setServices(data);
      setLoading(false);
    });

    return () => {
      active = false;
      unSub();
    };
  }, [statusFilter]);

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case "published":
        return <span className="px-2.5 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">Published</span>;
      case "draft":
        return <span className="px-2.5 py-1 rounded-full bg-warning-50 text-warning-900 text-xs font-mono font-medium uppercase">Draft</span>;
      case "archived":
        return <span className="px-2.5 py-1 rounded-full bg-ink-200 text-ink-500 text-xs font-mono font-medium uppercase">Archived</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-ink-100 text-ink-600 text-xs font-mono font-medium uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-start">
      
      {/* HEADER & QUICK ACTIONS */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-4 border border-[#E5FBC9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-medium uppercase text-ink-500">CATALOG & PRICING ENGINE</span>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Service Packages Catalog</h1>
            <p className="text-sm text-ink-500">Draft, preview, publish, and configure property room matrix pricing</p>
          </div>

          <Link
            href="/admin/services/new"
            className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-[#B7F56A] font-semibold text-sm hover:bg-[#2d5004] transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer text-decoration-none border border-[#E5FBC9]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create New Package</span>
          </Link>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5FBC9]">
          {[
            { id: "all", label: "All Packages", count: services.length },
            { id: "published", label: "Published (Live)", count: services.filter((s) => s.status === "published").length },
            { id: "draft", label: "Drafts", count: services.filter((s) => s.status === "draft").length },
            { id: "archived", label: "Archived", count: services.filter((s) => s.status === "archived").length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as ServiceStatus | "all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer transition-colors duration-150 ${ statusFilter === tab.id ? "bg-[#1F3A00] text-white font-medium " : "bg-[#F9FCF5] text-ink-500 hover:text-[#1F3A00]" } border border-[#E5FBC9]`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* CATALOG GRID */}
      {loading ? (
        <div className="bg-white rounded-[18px] p-12 text-center space-y-3 border border-[#E5FBC9]">
          <Spinner size={32} className="mx-auto" />
          <p className="text-sm font-medium text-ink-600">Fetching Firestore service catalog packages...</p>
        </div>
      ) : services.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div 
              key={srv.id}
              className="bg-white rounded-[18px] p-6 space-y-4 flex flex-col justify-between border-t-4 border-t-blue-500 border border-[#E5FBC9]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F9FCF5] text-[10px] font-mono font-medium uppercase text-ink-500">
                    {srv.categoryId}
                  </span>
                  {getStatusBadge(srv.status)}
                </div>

                <div>
                  <h3 className="font-heading font-medium text-lg text-ink-900">{srv.name}</h3>
                  <p className="text-xs text-ink-500 line-clamp-2 leading-relaxed mt-1">
                    {srv.shortDescription}
                  </p>
                </div>

                <div className="p-3.5 rounded-[18px] bg-white space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-ink-500">
                    <span>PRICING ENGINE</span>
                    <span className="font-medium text-ink-600 uppercase">{srv.pricingType.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#E5FBC9]">
                    <span className="text-ink-500">Base Rate</span>
                    <span className="font-heading font-medium text-base text-ink-900">
                      {formatPenceToGBP(srv.basePricePence || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5FBC9] flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-500 font-medium">
                  VERSION: v{srv.version || 1}
                </span>

                <Link
                  href={`/admin/services/${srv.id}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#1F3A00] text-[#B7F56A] hover:bg-[#2d5004] text-xs font-medium text-decoration-none transition-colors duration-150 border border-[#E5FBC9]"
                >
                  <span>Configure</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* CLEAN EMPTY STATE */
        <div className="bg-white rounded-[18px] p-10 text-center space-y-4 max-w-md mx-auto border border-[#E5FBC9]">
          <Package className="w-10 h-10 text-[#1F3A00] mx-auto" />
          <h3 className="font-heading text-lg font-medium text-ink-900">No Service Packages Found</h3>
          <p className="text-xs text-ink-500 leading-relaxed">
            There are currently no services matching your selected status tab. Create a new service package to begin drafting.
          </p>
          <Link
            href="/admin/services/new"
            className="px-5 py-2.5 rounded-full bg-[#1F3A00] text-white font-medium text-xs inline-block text-decoration-none border border-[#E5FBC9]"
          >
            Create First Package
          </Link>
        </div>
      )}

    </div>
  );
}

