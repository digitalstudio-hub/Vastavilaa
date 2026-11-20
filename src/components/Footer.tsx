import { MapPin } from 'lucide-react';
import { VILLA_INFO } from '../data/villaData';

interface FooterProps {
  onOpenBrochure: () => void;
}

export function Footer({ onOpenBrochure }: FooterProps) {
  return (
    <footer className="bg-[#0E271B] text-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
          <div className="md:col-span-5 space-y-3">
            <a href="#top" className="font-editorial text-3xl font-semibold text-white">
              {VILLA_INFO.name}
            </a>
            <p className="font-editorial italic text-lg text-[#D7B46A]">
              {VILLA_INFO.closingLine}
            </p>
            <div className="pt-1 flex items-center gap-2 text-sm text-white/80">
              <MapPin className="w-4 h-4 text-[#D7B46A] shrink-0" aria-hidden="true" />
              <span>{VILLA_INFO.region}</span>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3 text-sm">
            <p className="font-medium text-white">Estate Overview</p>
            <ul className="space-y-2 text-white/75 tabular-nums">
              <li>2 BHK Fully Air-Conditioned Private Villa</li>
              <li>Private Swimming Pool ({VILLA_INFO.poolSize})</li>
              <li>Total Property Area: {VILLA_INFO.totalArea}</li>
              <li>
                Check-In: {VILLA_INFO.checkInTime} · Check-Out: {VILLA_INFO.checkOutTime}
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 text-sm">
            <p className="font-medium text-white">Explore</p>
            <nav aria-label="Footer navigation" className="flex flex-col gap-2 text-white/75">
              <a href="#highlights" className="hover:text-white transition-colors">
                Property Highlights
              </a>
              <a href="#spaces" className="hover:text-white transition-colors">
                Villa Spaces
              </a>
              <a href="#gallery" className="hover:text-white transition-colors">
                Photo Gallery & Video Tour
              </a>
              <a href="#celebrations" className="hover:text-white transition-colors">
                Party & Celebration Services
              </a>
              <button
                type="button"
                onClick={onOpenBrochure}
                className="text-left text-[#D7B46A] hover:text-white transition-colors"
              >
                View Official Brochure
              </button>
            </nav>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} {VILLA_INFO.name}, {VILLA_INFO.city}. All rights reserved.
          </p>
          <p>{VILLA_INFO.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
