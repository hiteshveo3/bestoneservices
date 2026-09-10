"use client";

import React, { useState, useEffect } from "react";
import { subscribeAdminStaff } from "@/lib/repositories/staff";
import { type StaffMemberItem, type StaffRole } from "@/types/staff";
import { Spinner } from "@/components/ui/spinner";
import { 
  Users, 
  AlertCircle, 
  CheckCircle2
} from "lucide-react";

export default function AdminStaffRosterPage() {
  const [staff, setStaff] = useState<StaffMemberItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State for New Staff Member
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("lead_cleaner");
  const [assignedCategory, setAssignedCategory] = useState<"cleaning" | "pest" | "gardening" | "removals">("cleaning");
  const [dailyCapacityCount, setDailyCapacityCount] = useState<number>(3);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const unSub = subscribeAdminStaff("all", (data) => {
      if (!active) return;
      setStaff(data);
      setLoading(false);
    });

    return () => {
      active = false;
      unSub();
    };
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          assignedCategory,
          dailyCapacityCount,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Failed to create staff profile");
      } else {
        setSuccessMsg(`Staff member ${name} registered successfully.`);
        setName("");
        setEmail("");
        setPhone("");
      }
    } catch {
      setErrorMsg("Network error registering staff member");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-start max-w-5xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 space-y-2 border border-[#E5FBC9]">
        <span className="text-xs font-mono font-medium uppercase text-ink-500">STAFF & FIELD TEAMS</span>
        <h1 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">Field Technicians Roster</h1>
        <p className="text-sm text-ink-500">Manage field staff profiles, daily job capacity limits, and team specializations</p>
      </div>

      {/* ALERTS */}
      {errorMsg && (
        <div className="p-4 rounded-[18px] bg-danger-50 border border-danger-500 text-danger-900 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-[18px] bg-success-50 border border-success-500 text-success-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* CREATE STAFF FORM (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <div className="border-b border-[#E5FBC9] pb-3">
            <h3 className="font-heading font-medium text-lg text-ink-900">Add New Field Member</h3>
            <p className="text-xs text-ink-500">Register new technician or team lead</p>
          </div>

          <form onSubmit={handleCreateStaff} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David Miller"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="david@bestoneservices.co.uk"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900000"
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                >
                  <option value="lead_cleaner">Lead Cleaner</option>
                  <option value="pest_technician">Pest Tech</option>
                  <option value="gardener">Gardener</option>
                  <option value="mover_driver">Driver / Mover</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Category *</label>
                <select
                  value={assignedCategory}
                  onChange={(e) => setAssignedCategory(e.target.value as "cleaning" | "pest" | "gardening" | "removals")}
                  className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
                >
                  <option value="cleaning">Cleaning</option>
                  <option value="pest">Pest Control</option>
                  <option value="gardening">Gardening</option>
                  <option value="removals">Removals</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-ink-500 uppercase block">Daily Jobs Capacity Limit</label>
              <input
                type="number"
                value={dailyCapacityCount}
                onChange={(e) => setDailyCapacityCount(parseInt(e.target.value, 10) || 1)}
                min={1}
                max={10}
                className="w-full p-3 rounded-[18px] bg-[#F9FCF5] text-xs font-medium text-ink-600 border-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !name.trim() || !email.trim()}
              className="w-full py-3.5 rounded-full bg-[#1F3A00] text-[#B7F56A] text-xs font-semibold hover:bg-[#2d5004] cursor-pointer disabled:opacity-50 transition-colors duration-150 border border-[#E5FBC9]"
            >
              {submitting ? "Registering Staff Member..." : "Register Staff Member →"}
            </button>
          </form>
        </div>

        {/* STAFF ROSTER LIST (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-[18px] p-6 space-y-4 border border-[#E5FBC9]">
          <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-3">
            <h3 className="font-heading font-medium text-lg text-ink-900">Active Roster ({staff.length})</h3>
            <span className="text-xs font-mono text-ink-500">Capacity Rules Active</span>
          </div>

          {loading ? (
            <div className="p-8 text-center space-y-2">
              <Spinner size={24} className="mx-auto" />
              <p className="text-xs font-medium text-ink-600">Fetching staff roster...</p>
            </div>
          ) : staff.length > 0 ? (
            <div className="space-y-3">
              {staff.map((stf) => (
                <div key={stf.id} className="p-4 rounded-[18px] bg-white border border-[#E5FBC9] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink-600 text-sm">{stf.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#1F3A00] text-white text-[10px] uppercase font-medium">
                        {stf.role.replace("_", " ")}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-white text-ink-600 font-medium border border-[#E5FBC9]">
                      Max {stf.dailyCapacityCount || 3} Jobs/Day
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-ink-500 pt-1">
                    <span>Email: {stf.email}</span>
                    <span>Phone: {stf.phone}</span>
                    <span>Category: {stf.assignedCategory.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center space-y-3">
              <Users className="w-8 h-8 text-[#1F3A00] mx-auto" />
              <p className="text-xs font-medium text-ink-600">No staff members registered yet.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
