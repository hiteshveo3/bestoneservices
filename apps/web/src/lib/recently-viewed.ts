export interface RecentServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: string;
  visitedAt: number;
}

const STORAGE_KEY = "bestone_recently_viewed_services";

export function getRecentlyViewedServices(currentSlug?: string): RecentServiceItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const items: RecentServiceItem[] = JSON.parse(raw);
    
    // Exclude current page and filter last 4 items
    return items
      .filter((item) => !currentSlug || item.slug !== currentSlug)
      .sort((a, b) => b.visitedAt - a.visitedAt)
      .slice(0, 4);
  } catch {
    return [];
  }
}

export function trackServiceVisit(item: Omit<RecentServiceItem, "visitedAt">) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentlyViewedServices();
    const updated = [
      { ...item, visitedAt: Date.now() },
      ...existing.filter((i) => i.slug !== item.slug),
    ].slice(0, 6);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}
