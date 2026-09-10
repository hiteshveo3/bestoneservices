export interface CategoryRevenueItem {
  categoryId: "cleaning" | "pest" | "gardening" | "removals";
  categoryName: string;
  bookingCount: number;
  totalRevenuePence: number;
  percentage: number;
}

export interface MonthlyForecastItem {
  monthLabel: string;
  projectedRevenuePence: number;
  bookingCount: number;
}

export interface StaffPerformanceItem {
  staffId: string;
  staffName: string;
  role: string;
  jobsCompletedCount: number;
  averageRating: number;
}

export interface AnalyticsSummary {
  grossInvoicedPence: number;
  netCollectedPence: number;
  outstandingReceivablesPence: number;
  averageBookingValuePence: number;

  totalBookingsCount: number;
  completedBookingsCount: number;
  activeBookingsCount: number;

  categoryBreakdown: CategoryRevenueItem[];
  monthlyForecast: MonthlyForecastItem[];
  staffPerformance: StaffPerformanceItem[];
}
