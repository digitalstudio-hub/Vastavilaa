import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStayDuration,
  filterGalleryItems,
  formatDisplayDate,
  formatInquiryBrief,
  generateReferenceCode,
  hasValidationErrors,
  normalizeIndianPhone,
  validateBookingInquiry,
  type BookingInquiryInput,
  type SubmittedInquiry,
} from './booking';
import { GALLERY_ITEMS } from '../data/villaData';

test('calculateStayDuration computes 21 hours for 1 night and 45 hours for 2 nights', () => {
  const oneNight = calculateStayDuration('2026-11-21', '2026-11-22');
  assert.deepEqual(oneNight, { valid: true, nights: 1, totalHours: 21 });

  const twoNights = calculateStayDuration('2026-11-21', '2026-11-23');
  assert.deepEqual(twoNights, { valid: true, nights: 2, totalHours: 45 });
});

test('calculateStayDuration rejects same-day or reversed date ranges', () => {
  assert.equal(calculateStayDuration('2026-11-22', '2026-11-22').valid, false);
  assert.equal(calculateStayDuration('2026-11-25', '2026-11-22').valid, false);
  assert.equal(calculateStayDuration('invalid', '2026-11-22').valid, false);
});

test('normalizeIndianPhone handles +91, leading zero, and formatted numbers', () => {
  assert.equal(normalizeIndianPhone('+91 98260-12345'), '9826012345');
  assert.equal(normalizeIndianPhone('09826012345'), '9826012345');
  assert.equal(normalizeIndianPhone('98260 12345'), '9826012345');
});

test('validateBookingInquiry catches missing or invalid fields', () => {
  const emptyInput: BookingInquiryInput = {
    guestName: '  ',
    phone: '12345',
    checkInDate: '2026-11-25',
    checkOutDate: '2026-11-24',
    guests: 25,
    occasion: 'birthday',
    needsDecoration: true,
    notes: '',
  };

  const errors = validateBookingInquiry(emptyInput);
  assert.equal(hasValidationErrors(errors), true);
  assert.ok(errors.guestName);
  assert.ok(errors.phone);
  assert.ok(errors.checkOutDate);
  assert.ok(errors.guests);
});

test('validateBookingInquiry accepts a complete valid booking inquiry', () => {
  const validInput: BookingInquiryInput = {
    guestName: 'Aarav Sharma',
    phone: '+91 98260 54321',
    checkInDate: '2026-11-21',
    checkOutDate: '2026-11-22',
    guests: 8,
    occasion: 'anniversary',
    needsDecoration: true,
    notes: 'Poolside floral lighting before 3 PM.',
  };

  const errors = validateBookingInquiry(validInput);
  assert.equal(hasValidationErrors(errors), false);
});

test('formatInquiryBrief outputs complete summary with check-in/out timings', () => {
  const inquiry: SubmittedInquiry = {
    id: 'inq-1',
    referenceCode: generateReferenceCode(1234),
    guestName: 'Priya Verma',
    phone: '9826011223',
    checkInDate: '2026-12-05',
    checkOutDate: '2026-12-06',
    guests: 10,
    occasion: 'birthday',
    needsDecoration: true,
    notes: 'Balloon arch near cabana.',
    nights: 1,
    totalHours: 21,
    submittedAtIso: '2026-11-20T10:00:00.000Z',
  };

  const brief = formatInquiryBrief(inquiry);
  assert.match(brief, /Vatsya Villa, Indore/);
  assert.match(brief, /VV-IND-2234/);
  assert.match(brief, /5 Dec 2026 at 3:00 PM/);
  assert.match(brief, /6 Dec 2026 at 12:00 PM/);
  assert.match(brief, /Special Decoration: Requested \(Birthday Party\)/);
  assert.equal(formatDisplayDate('2026-12-05'), '5 Dec 2026');
});

test('filterGalleryItems returns full list for all and subsets per category', () => {
  assert.equal(filterGalleryItems(GALLERY_ITEMS, 'all').length, GALLERY_ITEMS.length);
  const poolItems = filterGalleryItems(GALLERY_ITEMS, 'pool');
  assert.ok(poolItems.length >= 2);
  assert.ok(poolItems.every((item) => item.category === 'pool'));

  const brochureItems = filterGalleryItems(GALLERY_ITEMS, 'brochure');
  assert.equal(brochureItems.length, 1);
  assert.equal(brochureItems[0].id, 'official-brochure');
});
