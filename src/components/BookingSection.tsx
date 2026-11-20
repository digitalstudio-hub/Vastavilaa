import { useEffect, useState, type FormEvent } from 'react';
import { Check, Clock, Copy, FileText, Minus, Plus, Trash2 } from 'lucide-react';
import { VILLA_INFO } from '../data/villaData';
import {
  calculateStayDuration,
  formatDisplayDate,
  formatInquiryBrief,
  generateReferenceCode,
  getDefaultStayDates,
  hasValidationErrors,
  MAX_GUESTS,
  MIN_GUESTS,
  OCCASION_LABELS,
  validateBookingInquiry,
  type BookingInquiryInput,
  type BookingValidationErrors,
  type OccasionOption,
  type SubmittedInquiry,
} from '../utils/booking';

const STORAGE_KEY = 'vatsya_villa_inquiries_v1';

interface BookingSectionProps {
  selectedOccasion: OccasionOption | null;
  onOpenBrochure: () => void;
}

function loadSavedInquiries(): SubmittedInquiry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function BookingSection({
  selectedOccasion,
  onOpenBrochure,
}: BookingSectionProps) {
  const defaults = getDefaultStayDates();

  const [formState, setFormState] = useState<BookingInquiryInput>({
    guestName: '',
    phone: '',
    checkInDate: defaults.checkInDate,
    checkOutDate: defaults.checkOutDate,
    guests: 6,
    occasion: 'stay-only',
    needsDecoration: false,
    notes: '',
  });
  const [errors, setErrors] = useState<BookingValidationErrors>({});
  const [activeConfirmation, setActiveConfirmation] = useState<SubmittedInquiry | null>(null);
  const [savedInquiries, setSavedInquiries] = useState<SubmittedInquiry[]>(() =>
    typeof window !== 'undefined' ? loadSavedInquiries() : [],
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedOccasion) {
      setFormState((prev) => ({
        ...prev,
        occasion: selectedOccasion,
        needsDecoration: selectedOccasion !== 'stay-only',
      }));
      setActiveConfirmation(null);
    }
  }, [selectedOccasion]);

  const persistInquiries = (next: SubmittedInquiry[]) => {
    setSavedInquiries(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore private-mode storage quota errors
    }
  };

  const duration = calculateStayDuration(formState.checkInDate, formState.checkOutDate);

  const updateField = <K extends keyof BookingInquiryInput>(
    field: K,
    value: BookingInquiryInput[K],
  ) => {
    setFormState((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'occasion' && value !== 'stay-only') {
        next.needsDecoration = true;
      }
      return next;
    });
    if (field in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof BookingValidationErrors];
        return next;
      });
    }
  };

  const handleStepGuests = (delta: number) => {
    const next = Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, formState.guests + delta));
    updateField('guests', next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateBookingInquiry(formState);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    const stay = calculateStayDuration(formState.checkInDate, formState.checkOutDate);
    const now = Date.now();
    const submission: SubmittedInquiry = {
      ...formState,
      guestName: formState.guestName.trim(),
      notes: formState.notes.trim(),
      id: `inq-${now}`,
      referenceCode: generateReferenceCode(now),
      nights: stay.nights,
      totalHours: stay.totalHours,
      submittedAtIso: new Date(now).toISOString(),
    };

    setErrors({});
    setActiveConfirmation(submission);
    persistInquiries([submission, ...savedInquiries].slice(0, 5));
  };

  const handleCopyBrief = async (inquiry: SubmittedInquiry) => {
    const brief = formatInquiryBrief(inquiry);
    try {
      await navigator.clipboard.writeText(brief);
      setCopiedId(inquiry.id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === inquiry.id ? null : current));
      }, 2500);
    } catch {
      setCopiedId(null);
    }
  };

  const handleDeleteInquiry = (id: string) => {
    const next = savedInquiries.filter((item) => item.id !== id);
    persistInquiries(next);
    if (activeConfirmation?.id === id) {
      setActiveConfirmation(null);
    }
  };

  const handleResetNewInquiry = () => {
    const freshDates = getDefaultStayDates();
    setFormState({
      guestName: '',
      phone: '',
      checkInDate: freshDates.checkInDate,
      checkOutDate: freshDates.checkOutDate,
      guests: 6,
      occasion: 'stay-only',
      needsDecoration: false,
      notes: '',
    });
    setErrors({});
    setActiveConfirmation(null);
  };

  return (
    <section id="plan-stay" className="scroll-mt-20 py-16 lg:py-24 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Timings, Stay Summary & Official Brochure */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-medium text-[#8C6520]">Check-In & Stay Inquiry</p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#143625] leading-tight">
                Plan Your Stay at Vatsya Villa, Indore
              </h2>
              <p className="text-sm sm:text-[15px] text-[#4E5E54] leading-relaxed">
                Share your preferred dates, group size, and celebration decor needs. You will
                receive an instant structured booking brief ready to share with our host team.
              </p>
            </div>

            {/* Official Check-In / Check-Out Timings */}
            <div className="bg-[#FFFFFF] border border-[#E4DFD2] rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between gap-4 border-b border-[#E4DFD2] pb-4">
                <h3 className="font-editorial text-2xl font-semibold text-[#143625]">
                  Check-In & Check-Out Timings
                </h3>
                <Clock className="w-5 h-5 text-[#B6842B] shrink-0" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-2 gap-6 divide-x divide-[#E4DFD2]">
                <div>
                  <p className="text-xs font-medium text-[#4E5E54]">Check-In</p>
                  <p className="mt-1 font-editorial text-2xl sm:text-3xl font-semibold text-[#143625] tabular-nums">
                    {VILLA_INFO.checkInTime}
                  </p>
                  <p className="mt-1 text-xs text-[#4E5E54]">Villa & pool prepared before arrival</p>
                </div>
                <div className="pl-6">
                  <p className="text-xs font-medium text-[#4E5E54]">Check-Out</p>
                  <p className="mt-1 font-editorial text-2xl sm:text-3xl font-semibold text-[#143625] tabular-nums">
                    12:00 PM
                  </p>
                  <p className="mt-1 text-xs text-[#4E5E54]">Next Day (21 hrs per night)</p>
                </div>
              </div>

              {/* Live Stay Preview */}
              <div className="pt-4 border-t border-[#E4DFD2] space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#4E5E54]">Selected Stay</span>
                  <span className="font-medium text-[#14261C] tabular-nums">
                    {duration.valid
                      ? `${duration.nights} ${duration.nights === 1 ? 'Night' : 'Nights'} · ${duration.totalHours} Hours`
                      : 'Choose valid dates'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#4E5E54]">Group Size</span>
                  <span className="font-medium text-[#14261C] tabular-nums">
                    {formState.guests} Guests · Exclusive 2 BHK Access
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#4E5E54]">Occasion</span>
                  <span className="font-medium text-[#14261C]">
                    {OCCASION_LABELS[formState.occasion]}
                    {formState.needsDecoration ? ' + Custom Decor' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Brochure Preview Action */}
            <div className="flex items-center justify-between gap-4 py-4 px-5 bg-[#F2EFE6] border border-[#E4DFD2] rounded-xl">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[#143625]">Official Villa Brochure</p>
                <p className="text-xs text-[#4E5E54]">
                  View full highlights & timings card for Indore
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenBrochure}
                className="inline-flex items-center justify-center gap-2 min-h-10 px-4 py-2 text-xs font-medium text-[#143625] bg-[#FFFFFF] border border-[#D8D1C0] hover:border-[#143625] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B]"
              >
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>View Brochure</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Validated Form or Confirmation Card */}
          <div className="lg:col-span-7 space-y-6">
            {activeConfirmation ? (
              <div
                data-testid="booking-confirmation"
                className="bg-[#FFFFFF] border border-[#143625]/25 rounded-xl p-6 sm:p-8 space-y-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E4DFD2] pb-5">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#143625]">
                      <Check className="w-4 h-4 text-[#143625]" aria-hidden="true" />
                      <span>Stay Inquiry Ready</span>
                    </div>
                    <h3 className="font-editorial text-3xl font-semibold text-[#143625]">
                      Thank You, {activeConfirmation.guestName}
                    </h3>
                    <p className="text-sm text-[#4E5E54]">
                      Your Vatsya Villa inquiry brief is saved with reference{' '}
                      <span className="font-semibold text-[#14261C] tabular-nums">
                        {activeConfirmation.referenceCode}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="py-2 border-b border-[#E4DFD2]">
                    <dt className="text-xs text-[#4E5E54]">Check-In</dt>
                    <dd className="mt-1 font-medium text-[#14261C] tabular-nums">
                      {formatDisplayDate(activeConfirmation.checkInDate)} · 3:00 PM
                    </dd>
                  </div>
                  <div className="py-2 border-b border-[#E4DFD2]">
                    <dt className="text-xs text-[#4E5E54]">Check-Out</dt>
                    <dd className="mt-1 font-medium text-[#14261C] tabular-nums">
                      {formatDisplayDate(activeConfirmation.checkOutDate)} · 12:00 PM
                    </dd>
                  </div>
                  <div className="py-2 border-b border-[#E4DFD2]">
                    <dt className="text-xs text-[#4E5E54]">Stay Duration & Guests</dt>
                    <dd className="mt-1 font-medium text-[#14261C] tabular-nums">
                      {activeConfirmation.nights}{' '}
                      {activeConfirmation.nights === 1 ? 'Night' : 'Nights'} (
                      {activeConfirmation.totalHours} hrs) · {activeConfirmation.guests} Guests
                    </dd>
                  </div>
                  <div className="py-2 border-b border-[#E4DFD2]">
                    <dt className="text-xs text-[#4E5E54]">Occasion & Decoration</dt>
                    <dd className="mt-1 font-medium text-[#14261C]">
                      {OCCASION_LABELS[activeConfirmation.occasion]}
                      {activeConfirmation.needsDecoration ? ' (Special Decor Requested)' : ''}
                    </dd>
                  </div>
                </dl>

                <div className="bg-[#FAF9F5] border border-[#E4DFD2] rounded-lg p-4">
                  <p className="text-xs font-medium text-[#4E5E54] mb-2">
                    Formatted Booking Brief
                  </p>
                  <pre className="text-xs sm:text-sm text-[#14261C] whitespace-pre-wrap font-sans leading-relaxed">
                    {formatInquiryBrief(activeConfirmation)}
                  </pre>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyBrief(activeConfirmation)}
                    className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-sm font-medium text-[#FAF9F5] bg-[#143625] hover:bg-[#0E271B] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B]"
                  >
                    {copiedId === activeConfirmation.id ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Copied Booking Brief</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden="true" />
                        <span>Copy Booking Brief</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveConfirmation(null)}
                    className="inline-flex items-center justify-center min-h-11 px-4 py-2.5 text-sm font-medium text-[#143625] border border-[#D8D1C0] hover:border-[#143625] rounded-md transition-colors whitespace-nowrap shrink-0"
                  >
                    Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleResetNewInquiry}
                    className="inline-flex items-center justify-center min-h-11 px-4 py-2.5 text-sm font-medium text-[#4E5E54] hover:text-[#143625] transition-colors whitespace-nowrap shrink-0"
                  >
                    Start New Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-[#FFFFFF] border border-[#E4DFD2] rounded-xl p-6 sm:p-8 space-y-6"
              >
                <div className="border-b border-[#E4DFD2] pb-4">
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#143625]">
                    Request Availability & Custom Decor
                  </h3>
                  <p className="mt-1 text-sm text-[#4E5E54]">
                    All fields marked required help us confirm availability accurately.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="guest-name"
                      className="block text-sm font-medium text-[#14261C] mb-1.5"
                    >
                      Full Name <span className="text-[#8C6520]">*</span>
                    </label>
                    <input
                      id="guest-name"
                      name="guestName"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g., Aarav Sharma"
                      value={formState.guestName}
                      onChange={(e) => updateField('guestName', e.target.value)}
                      aria-invalid={Boolean(errors.guestName)}
                      aria-describedby={errors.guestName ? 'guest-name-error' : undefined}
                      className={`w-full min-h-11 px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-md text-[#14261C] placeholder:text-[#7E8C83] focus:outline-none focus:ring-2 focus:ring-[#143625]/25 ${
                        errors.guestName ? 'border-red-700' : 'border-[#D8D1C0] focus:border-[#143625]'
                      }`}
                    />
                    {errors.guestName && (
                      <p id="guest-name-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.guestName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="guest-phone"
                      className="block text-sm font-medium text-[#14261C] mb-1.5"
                    >
                      Mobile Number (WhatsApp / Call) <span className="text-[#8C6520]">*</span>
                    </label>
                    <input
                      id="guest-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="e.g., 98260 12345"
                      value={formState.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'guest-phone-error' : undefined}
                      className={`w-full min-h-11 px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-md text-[#14261C] placeholder:text-[#7E8C83] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#143625]/25 ${
                        errors.phone ? 'border-red-700' : 'border-[#D8D1C0] focus:border-[#143625]'
                      }`}
                    />
                    {errors.phone && (
                      <p id="guest-phone-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="check-in-date"
                      className="block text-sm font-medium text-[#14261C] mb-1.5"
                    >
                      Check-In Date (3:00 PM) <span className="text-[#8C6520]">*</span>
                    </label>
                    <input
                      id="check-in-date"
                      name="checkInDate"
                      type="date"
                      value={formState.checkInDate}
                      onChange={(e) => updateField('checkInDate', e.target.value)}
                      aria-invalid={Boolean(errors.checkInDate)}
                      aria-describedby={errors.checkInDate ? 'check-in-error' : undefined}
                      className={`w-full min-h-11 px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-md text-[#14261C] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#143625]/25 ${
                        errors.checkInDate ? 'border-red-700' : 'border-[#D8D1C0] focus:border-[#143625]'
                      }`}
                    />
                    {errors.checkInDate && (
                      <p id="check-in-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.checkInDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="check-out-date"
                      className="block text-sm font-medium text-[#14261C] mb-1.5"
                    >
                      Check-Out Date (12:00 PM) <span className="text-[#8C6520]">*</span>
                    </label>
                    <input
                      id="check-out-date"
                      name="checkOutDate"
                      type="date"
                      value={formState.checkOutDate}
                      onChange={(e) => updateField('checkOutDate', e.target.value)}
                      aria-invalid={Boolean(errors.checkOutDate)}
                      aria-describedby={errors.checkOutDate ? 'check-out-error' : undefined}
                      className={`w-full min-h-11 px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-md text-[#14261C] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#143625]/25 ${
                        errors.checkOutDate ? 'border-red-700' : 'border-[#D8D1C0] focus:border-[#143625]'
                      }`}
                    />
                    {errors.checkOutDate && (
                      <p id="check-out-error" role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.checkOutDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <span className="block text-sm font-medium text-[#14261C] mb-1.5">
                      Number of Guests
                    </span>
                    <div className="flex items-center justify-between min-h-11 px-2 bg-[#FAF9F5] border border-[#D8D1C0] rounded-md">
                      <button
                        type="button"
                        onClick={() => handleStepGuests(-1)}
                        disabled={formState.guests <= MIN_GUESTS}
                        aria-label="Decrease guests"
                        className="w-9 h-9 inline-flex items-center justify-center rounded text-[#143625] hover:bg-[#EAE5D7] disabled:opacity-35 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span
                        data-testid="guest-count-value"
                        className="text-sm font-semibold text-[#14261C] tabular-nums"
                      >
                        {formState.guests} Guests
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStepGuests(1)}
                        disabled={formState.guests >= MAX_GUESTS}
                        aria-label="Increase guests"
                        className="w-9 h-9 inline-flex items-center justify-center rounded text-[#143625] hover:bg-[#EAE5D7] disabled:opacity-35 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.guests && (
                      <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.guests}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="occasion-select"
                      className="block text-sm font-medium text-[#14261C] mb-1.5"
                    >
                      Occasion Type
                    </label>
                    <select
                      id="occasion-select"
                      name="occasion"
                      value={formState.occasion}
                      onChange={(e) =>
                        updateField('occasion', e.target.value as OccasionOption)
                      }
                      className="w-full min-h-11 px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#D8D1C0] focus:border-[#143625] rounded-md text-[#14261C] focus:outline-none focus:ring-2 focus:ring-[#143625]/25"
                    >
                      {(Object.keys(OCCASION_LABELS) as OccasionOption[]).map((key) => (
                        <option key={key} value={key}>
                          {OCCASION_LABELS[key]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formState.needsDecoration}
                      onChange={(e) => updateField('needsDecoration', e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#143625] rounded border-[#D8D1C0]"
                    />
                    <span className="text-sm text-[#14261C] leading-snug">
                      Add <span className="font-medium">Special Celebration Decoration</span>{' '}
                      (balloons, florals, poolside lighting, or custom cabana styling)
                    </span>
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="booking-notes"
                    className="block text-sm font-medium text-[#14261C] mb-1.5"
                  >
                    Special Requests or Decor Preferences (Optional)
                  </label>
                  <textarea
                    id="booking-notes"
                    name="notes"
                    rows={3}
                    placeholder="Share cake setup timing, color theme, kitchen requirements, or arrival notes..."
                    value={formState.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#D8D1C0] focus:border-[#143625] rounded-md text-[#14261C] placeholder:text-[#7E8C83] focus:outline-none focus:ring-2 focus:ring-[#143625]/25"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center min-h-12 px-7 py-3 text-sm font-medium text-[#FAF9F5] bg-[#143625] hover:bg-[#0E271B] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B]"
                  >
                    Send Stay Inquiry
                  </button>
                  <p className="text-xs text-[#4E5E54]">
                    Generates an instant booking summary & reference number.
                  </p>
                </div>
              </form>
            )}

            {/* Persisted Saved Inquiries List */}
            {savedInquiries.length > 0 && (
              <div
                data-testid="saved-inquiries-list"
                className="bg-[#FFFFFF] border border-[#E4DFD2] rounded-xl p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-editorial text-xl font-semibold text-[#143625]">
                    Your Saved Stay Inquiries
                  </h3>
                  <span className="text-xs text-[#4E5E54] tabular-nums">
                    {savedInquiries.length} saved
                  </span>
                </div>
                <ul className="divide-y divide-[#E4DFD2]">
                  {savedInquiries.map((inq) => (
                    <li
                      key={inq.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[#14261C]">{inq.guestName}</span>
                          <span aria-hidden="true" className="text-[#4E5E54]">
                            ·
                          </span>
                          <span className="text-xs font-medium text-[#8C6520] tabular-nums">
                            {inq.referenceCode}
                          </span>
                        </div>
                        <p className="text-xs text-[#4E5E54] tabular-nums">
                          {formatDisplayDate(inq.checkInDate)} to {formatDisplayDate(inq.checkOutDate)} ·{' '}
                          {inq.guests} Guests · {OCCASION_LABELS[inq.occasion]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyBrief(inq)}
                          className="min-h-9 px-3 py-1.5 text-xs font-medium text-[#143625] border border-[#D8D1C0] hover:border-[#143625] rounded-md transition-colors whitespace-nowrap"
                        >
                          {copiedId === inq.id ? 'Copied' : 'Copy Brief'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          aria-label={`Remove saved inquiry ${inq.referenceCode}`}
                          className="w-9 h-9 inline-flex items-center justify-center text-[#4E5E54] hover:text-red-700 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
