import fs from "fs";
import path from "path";
import { type BookingItem } from "@/types/booking";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const STORE_FILE = path.join(DATA_DIR, "bookings-store.json");

function ensureStoreFile(): BookingItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    return JSON.parse(raw) as BookingItem[];
  } catch (err) {
    console.error("Error accessing bookings store file:", err);
    return [];
  }
}

export function getAllStoredBookings(): BookingItem[] {
  return ensureStoreFile();
}

export function saveStoredBooking(booking: BookingItem): void {
  try {
    const list = ensureStoreFile();
    // Prepend new booking
    const updated = [booking, ...list.filter((b) => b.id !== booking.id)];
    fs.writeFileSync(STORE_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving booking to local store:", err);
  }
}
