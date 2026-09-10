import { type BookingItem } from "@/types/booking";
import { type InvoiceItem } from "@/types/invoice";
import { type StaffMemberItem } from "@/types/staff";
import { type ReviewItem } from "@/types/review";
import { 
  type AnalyticsSummary, 
  type CategoryRevenueItem, 
  type StaffPerformanceItem 
} from "@/types/analytics";

export function calculateAnalyticsSummary(
  bookings: BookingItem[] = [],
  invoices: InvoiceItem[] = [],
  staff: StaffMemberItem[] = [],
  reviews: ReviewItem[] = []
): AnalyticsSummary {
  const grossInvoicedPence = invoices.reduce((acc, inv) => acc + (inv.totalPence || 0), 0);
  const netCollectedPence = invoices.reduce((acc, inv) => acc + (inv.depositPaidPence || 0), 0);
  const outstandingReceivablesPence = invoices.reduce((acc, inv) => acc + (inv.balanceDuePence || 0), 0);

  const totalBookingsCount = bookings.length;
  const completedBookingsCount = bookings.filter((b) => b.status === "completed").length;
  const activeBookingsCount = bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled").length;

  const averageBookingValuePence = totalBookingsCount > 0 
    ? Math.round(grossInvoicedPence / totalBookingsCount) 
    : 0;

  // Category Distribution
  const categories: Array<{ id: "cleaning" | "pest" | "gardening" | "removals"; name: string }> = [
    { id: "cleaning", name: "Cleaning Services" },
    { id: "pest", name: "Pest Control" },
    { id: "gardening", name: "Gardening & Clearance" },
    { id: "removals", name: "Removals & Storage" },
  ];

  const categoryBreakdown: CategoryRevenueItem[] = categories.map((cat) => {
    const catBookings = bookings.filter((b) => b.categoryId === cat.id);
    const catInvoices = invoices.filter((inv) => {
      const b = bookings.find((bk) => bk.id === inv.bookingId);
      return b?.categoryId === cat.id;
    });

    const catRevenuePence = catInvoices.reduce((acc, inv) => acc + (inv.totalPence || 0), 0);
    const percentage = grossInvoicedPence > 0 
      ? Math.round((catRevenuePence / grossInvoicedPence) * 100) 
      : 25;

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      bookingCount: catBookings.length,
      totalRevenuePence: catRevenuePence,
      percentage,
    };
  });

  // Staff Performance Metrics
  const staffPerformance: StaffPerformanceItem[] = staff.map((stf) => {
    const assignedJobs = bookings.filter((b) => b.assignedStaffId === stf.id && b.status === "completed");
    const stfReviews = reviews.filter((r) => r.staffId === stf.id);
    const avgRating = stfReviews.length > 0
      ? Math.round((stfReviews.reduce((acc, r) => acc + r.rating, 0) / stfReviews.length) * 10) / 10
      : 5.0;

    return {
      staffId: stf.id,
      staffName: stf.name,
      role: stf.role,
      jobsCompletedCount: assignedJobs.length,
      averageRating: avgRating,
    };
  });

  return {
    grossInvoicedPence,
    netCollectedPence,
    outstandingReceivablesPence,
    averageBookingValuePence,

    totalBookingsCount,
    completedBookingsCount,
    activeBookingsCount,

    categoryBreakdown,
    monthlyForecast: [
      { monthLabel: "Current Month", projectedRevenuePence: grossInvoicedPence, bookingCount: totalBookingsCount },
      { monthLabel: "Next 30 Days Forecast", projectedRevenuePence: Math.round(grossInvoicedPence * 1.15), bookingCount: Math.round(totalBookingsCount * 1.15) },
    ],
    staffPerformance,
  };
}

export function generateCsvExport(
  entityType: "bookings" | "invoices" | "staff" | "reviews",
  items: unknown[]
): string {
  if (!items || items.length === 0) return "No data available";

  if (entityType === "bookings") {
    const headers = ["Reference", "Customer Name", "Customer Email", "Category", "Service Name", "Status", "Date"];
    const rows = (items as BookingItem[]).map((b) => [
      b.reference,
      `"${b.customerSnapshot?.fullName || ''}"`,
      b.customerSnapshot?.email || "",
      b.categoryId,
      `"${b.serviceNameSnapshot || ''}"`,
      b.status,
      b.scheduling?.requestedDate || "",
    ]);
    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  if (entityType === "invoices") {
    const headers = ["Invoice Ref", "Booking Ref", "Customer Name", "Total (£)", "Paid (£)", "Balance Due (£)", "Status"];
    const rows = (items as InvoiceItem[]).map((inv) => [
      inv.reference,
      inv.bookingReference,
      `"${inv.customerName}"`,
      (inv.totalPence / 100).toFixed(2),
      ((inv.depositPaidPence || 0) / 100).toFixed(2),
      ((inv.balanceDuePence || 0) / 100).toFixed(2),
      inv.paymentStatus,
    ]);
    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  if (entityType === "staff") {
    const headers = ["Staff ID", "Name", "Email", "Role", "Category", "Daily Capacity"];
    const rows = (items as StaffMemberItem[]).map((stf) => [
      stf.id,
      `"${stf.name}"`,
      stf.email,
      stf.role,
      stf.assignedCategory,
      stf.dailyCapacityCount || 3,
    ]);
    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  if (entityType === "reviews") {
    const headers = ["Review ID", "Booking Ref", "Customer Name", "Rating", "Status", "Review Text"];
    const rows = (items as ReviewItem[]).map((r) => [
      r.id,
      r.bookingReference,
      `"${r.customerName}"`,
      r.rating,
      r.status,
      `"${r.reviewText.replace(/"/g, '""')}"`,
    ]);
    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  return "Export entity type not recognized";
}
