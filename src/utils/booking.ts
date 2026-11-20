import type { GalleryCategory, GalleryItem } from '../data/villaData';

export type OccasionOption =
  | 'stay-only'
  | 'birthday'
  | 'anniversary'
  | 'private-party'
  | 'special-occasion';

export interface BookingInquiryInput {
  guestName: string;
  phone: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guests: number;
  occasion: OccasionOption;
  needsDecoration: boolean;
  notes: string;
}

export interface BookingValidationErrors {
  guestName?: string;
  phone?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: string;
}

export interface StayDurationResult {
  valid: boolean;
  nights: number;
  totalHours: number;
}

export interface SubmittedInquiry extends BookingInquiryInput {
  id: string;
  referenceCode: string;
  nights: number;
  totalHours: number;
  submittedAtIso: string;
}

export const OCCASION_LABELS: Record<OccasionOption, string> = {
  'stay-only': 'Relaxed Private Stay',
  birthday: 'Birthday Party',
  anniversary: 'Anniversary Celebration',
  'private-party': 'Private Party',
  'special-occasion': 'Special Occasion',
};

export const MIN_GUESTS = 2;
export const MAX_GUESTS = 20;

/**
 * Formats a Date into local YYYY-MM-DD for date inputs.
 */
export function toIsoDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns default check-in (tomorrow) and check-out (day after) dates.
 */
export function getDefaultStayDates(baseDate: Date = new Date()): {
  checkInDate: string;
  checkOutDate: string;
} {
  const checkIn = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 1);
  const checkOut = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 2);
  return {
    checkInDate: toIsoDateString(checkIn),
    checkOutDate: toIsoDateString(checkOut),
  };
}

/**
 * Parses a YYYY-MM-DD string into a UTC timestamp at midnight, returning null if invalid.
 */
function parseIsoDateUtc(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const [y, m, d] = value.split('-').map(Number);
  const ts = Date.UTC(y, m - 1, d);
  const check = new Date(ts);
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null;
  }
  return ts;
}

/**
 * Calculates nights and exclusive estate hours based on Vatsya Villa's
 * 3:00 PM Check-In and 12:00 PM (Next Day) Check-Out schedule.
 * 1 night = 21 hours, 2 nights = 45 hours, N nights = N * 24 - 3 hours.
 */
export function calculateStayDuration(
  checkInDate: string,
  checkOutDate: string,
): StayDurationResult {
  const start = parseIsoDateUtc(checkInDate);
  const end = parseIsoDateUtc(checkOutDate);

  if (start === null || end === null || end <= start) {
    return { valid: false, nights: 0, totalHours: 0 };
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const nights = Math.round((end - start) / msPerDay);
  const totalHours = nights * 24 - 3; // 3:00 PM check-in to 12:00 PM check-out

  return { valid: true, nights, totalHours };
}

/**
 * Normalizes a phone string by extracting digits and stripping optional leading 91 / 0 country prefixes.
 */
export function normalizeIndianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

/**
 * Validates all fields of the Vatsya Villa booking inquiry form.
 */
export function validateBookingInquiry(
  input: BookingInquiryInput,
): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  const trimmedName = input.guestName.trim();
  if (!trimmedName) {
    errors.guestName = 'Please enter your full name.';
  } else if (trimmedName.length < 2) {
    errors.guestName = 'Name must be at least 2 characters.';
  }

  const normalizedPhone = normalizeIndianPhone(input.phone);
  if (!input.phone.trim()) {
    errors.phone = 'Please enter a contact phone number.';
  } else if (normalizedPhone.length !== 10) {
    errors.phone = 'Enter a valid 10-digit mobile number (e.g., 98260 12345).';
  }

  if (!parseIsoDateUtc(input.checkInDate)) {
    errors.checkInDate = 'Select a valid check-in date.';
  }

  const duration = calculateStayDuration(input.checkInDate, input.checkOutDate);
  if (!parseIsoDateUtc(input.checkOutDate)) {
    errors.checkOutDate = 'Select a valid check-out date.';
  } else if (!duration.valid) {
    errors.checkOutDate = 'Check-out date must be after check-in date.';
  } else if (duration.nights > 14) {
    errors.checkOutDate = 'For stays longer than 14 nights, please mention details in notes.';
  }

  if (!Number.isInteger(input.guests) || input.guests < MIN_GUESTS || input.guests > MAX_GUESTS) {
    errors.guests = `Guest count must be between ${MIN_GUESTS} and ${MAX_GUESTS}.`;
  }

  return errors;
}

export function hasValidationErrors(errors: BookingValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Formats YYYY-MM-DD into a human-friendly date string (e.g. "21 Nov 2026").
 */
export function formatDisplayDate(isoDate: string): string {
  const ts = parseIsoDateUtc(isoDate);
  if (ts === null) return isoDate;
  const date = new Date(ts);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * Generates a deterministic-format inquiry reference code (e.g. VV-IND-4821).
 */
export function generateReferenceCode(seed: number = Date.now()): string {
  const suffix = String(Math.abs(seed) % 9000 + 1000);
  return `VV-IND-${suffix}`;
}

/**
 * Builds a clean, copy-ready inquiry message for WhatsApp or direct messaging.
 */
export function formatInquiryBrief(inquiry: SubmittedInquiry): string {
  const occasionLabel = OCCASION_LABELS[inquiry.occasion];
  const decorLine = inquiry.needsDecoration
    ? `Special Decoration: Requested (${occasionLabel})`
    : 'Special Decoration: Not required';

  const lines = [
    `Vatsya Villa, Indore — Stay Inquiry (${inquiry.referenceCode})`,
    `Guest: ${inquiry.guestName.trim()}`,
    `Phone: +91 ${normalizeIndianPhone(inquiry.phone)}`,
    `Check-In: ${formatDisplayDate(inquiry.checkInDate)} at 3:00 PM`,
    `Check-Out: ${formatDisplayDate(inquiry.checkOutDate)} at 12:00 PM`,
    `Duration: ${inquiry.nights} ${inquiry.nights === 1 ? 'Night' : 'Nights'} (${inquiry.totalHours} hrs private access)`,
    `Guests: ${inquiry.guests}`,
    `Occasion: ${occasionLabel}`,
    decorLine,
  ];

  if (inquiry.notes.trim()) {
    lines.push(`Notes: ${inquiry.notes.trim()}`);
  }

  return lines.join('\n');
}

/**
 * Filters gallery items cleanly by category.
 */
export function filterGalleryItems(
  items: GalleryItem[],
  category: GalleryCategory,
): GalleryItem[] {
  if (category === 'all') {
    return items;
  }
  return items.filter((item) => item.category === category);
}
