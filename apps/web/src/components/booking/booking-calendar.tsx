"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, AlertCircle, Check } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export interface BookingCalendarProps {
  selectedDate?: string;
  selectedTimeSlot?: "morning" | "afternoon" | "evening";
  onChange: (data: { date: string; timeSlot: "morning" | "afternoon" | "evening"; nightSurcharge?: boolean }) => void;
}

export function BookingCalendar({
  selectedDate = "",
  selectedTimeSlot = "morning",
  onChange,
}: BookingCalendarProps) {
  const [date, setDate] = useState<string>(selectedDate || getTomorrowsDate());
  const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon" | "evening">(selectedTimeSlot);

  function getTomorrowsDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }

  function getWeekendSlot(): string {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 6 ? 0 : 6 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split("T")[0];
  }

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    onChange({ date: newDate, timeSlot });
  };

  const handleSlotChange = (newSlot: "morning" | "afternoon" | "evening") => {
    setTimeSlot(newSlot);
    onChange({ date, timeSlot: newSlot, nightSurcharge: newSlot === "evening" });
  };

  return (
    <SectionReveal className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#E5FBC9] space-y-6 text-start">
      <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
          <CalendarIcon className="w-3.5 h-3.5 text-white shrink-0" />
          <span>Preferred Schedule</span>
        </div>
        <h3 className="font-heading text-2xl font-medium text-ink-900">
          Choose Your Preferred Date & Time Window
        </h3>
        <p className="text-base text-ink-500">
          Select when you would like our service team to attend. Final slot timing will be confirmed after review.
        </p>
      </div>

      {/* Quick Date Options */}
      <div className="space-y-2">
        <label className="text-sm font-mono text-ink-500 uppercase block">Quick Date Choices</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleDateChange(getTomorrowsDate())}
            className={`px-4 py-2 rounded-full text-base font-medium border transition-colors duration-150 cursor-pointer ${ date === getTomorrowsDate() ? "bg-[#1F3A00] border-[#99D055] text-white font-medium" : "bg-[#F9FCF5] border-[#E5FBC9] text-[#1F3A00] hover:bg-[#DCFAB7]" }`}
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handleDateChange(getWeekendSlot())}
            className={`px-4 py-2 rounded-full text-base font-medium border transition-colors duration-150 cursor-pointer ${ date === getWeekendSlot() ? "bg-[#1F3A00] border-[#99D055] text-white font-medium" : "bg-[#F9FCF5] border-[#E5FBC9] text-[#1F3A00] hover:bg-[#DCFAB7]" }`}
          >
            This Weekend
          </button>
        </div>
      </div>

      {/* Date Picker Input */}
      <div className="space-y-2">
        <label htmlFor="booking-date-input" className="text-sm font-mono text-ink-500 uppercase block">Custom Date</label>
        <input
          id="booking-date-input"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full sm:w-72 p-3.5 rounded-[16px] bg-[#F9FCF5] border border-[#E5FBC9] text-base font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-[#99D055] cursor-pointer"
        />
      </div>

      {/* Time Slot Selection */}
      <div className="space-y-3 pt-2 border-t border-[#E5FBC9]">
        <label className="text-sm font-mono text-ink-500 uppercase block">Arrival Time Window</label>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { id: "morning", label: "Morning Window", time: "08:00 – 12:00" },
            { id: "afternoon", label: "Afternoon Window", time: "12:00 – 16:00" },
            { id: "evening", label: "Evening Window", time: "16:00 – 20:00" },
          ].map((slot) => {
            const isSelected = timeSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleSlotChange(slot.id as "morning" | "afternoon" | "evening")}
                className={`p-4 rounded-[16px] border transition-colors duration-150 text-start cursor-pointer space-y-1 ${ isSelected ? "bg-[#1F3A00] border-[#99D055] text-white " : "bg-[#F9FCF5] border-[#E5FBC9] text-[#1F3A00] hover:bg-[#DCFAB7]" }`}
              >
                <div className="flex justify-between items-center font-heading font-medium text-base">
                  <span>{slot.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-ink-600" />}
                </div>
                <div className="text-xs font-mono text-ink-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-ink-600 shrink-0" />
                  <span>{slot.time}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Disclosure Notice */}
      <div className="p-4 rounded-[16px] bg-[#F9FCF5] border border-[#E5FBC9] flex items-start gap-2.5 text-sm text-ink-500">
        <AlertCircle className="w-5 h-5 text-ink-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-medium text-ink-600">Confirmation Process: </span>
          Your requested date ({date || "Selected Date"}) is recorded as your preferred arrival window. Our dispatch manager will contact you within 2 hours to confirm technician allocation.
        </div>
      </div>
    </SectionReveal>
  );
}
