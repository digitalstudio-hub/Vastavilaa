import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { CELEBRATION_PACKAGES, type CelebrationPackage } from '../data/villaData';
import type { OccasionOption } from '../utils/booking';
import { ResilientImage } from './ResilientImage';

interface CelebrationsSectionProps {
  onSelectOccasionForBooking: (occasion: OccasionOption) => void;
}

export function CelebrationsSection({
  onSelectOccasionForBooking,
}: CelebrationsSectionProps) {
  const [activeId, setActiveId] = useState<CelebrationPackage['id']>('birthday');
  const activePackage =
    CELEBRATION_PACKAGES.find((pkg) => pkg.id === activeId) ?? CELEBRATION_PACKAGES[0];

  return (
    <section
      id="celebrations"
      className="scroll-mt-20 py-16 lg:py-24 bg-[#143625] text-[#FAF9F5] border-b border-[#0E271B]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col gap-6 mb-8">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-medium text-[#D7B46A] tracking-wide">
              Party & Celebration Services
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-white leading-tight">
              Special Decoration Tailored to Your Milestone
            </h2>
            <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed">
              We provide bespoke celebration styling across the pool deck, thatched cabanas, and
              garden lawn — ready before you step in at 3:00 PM.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Celebration decoration packages"
            className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#0E271B] border border-white/15 rounded-lg self-start"
          >
            {CELEBRATION_PACKAGES.map((pkg) => {
              const isActive = pkg.id === activePackage.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(pkg.id)}
                  className={`min-h-10 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7B46A] ${
                    isActive
                      ? 'bg-[#FAF9F5] text-[#143625]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {pkg.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-[#0E271B] border border-white/15 rounded-xl p-5 sm:p-8">
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#D7B46A]">
                <span>Special Decoration Available</span>
                <span aria-hidden="true">·</span>
                <span>{activePackage.recommendedSpace}</span>
              </div>

              <h3 className="font-editorial text-3xl sm:text-[34px] font-semibold text-white leading-tight">
                {activePackage.title}
              </h3>

              <p className="font-editorial italic text-xl text-[#D7B46A] leading-snug">
                {activePackage.tagline}
              </p>

              <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed">
                {activePackage.description}
              </p>

              <ul className="pt-3 space-y-3 border-t border-white/15">
                {activePackage.highlights.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-white/90 leading-snug"
                  >
                    <Check
                      className="w-4 h-4 mt-0.5 text-[#D7B46A] shrink-0"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onSelectOccasionForBooking(activePackage.id)}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-sm font-medium text-[#143625] bg-[#FAF9F5] hover:bg-[#F2EFE6] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7B46A]"
              >
                <span>Include {activePackage.shortLabel} in Stay Inquiry</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="text-xs text-white/65">
                Pre-fills decoration preference below
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 overflow-hidden rounded-lg bg-[#143625] h-[300px] sm:h-[400px] lg:h-[460px]">
            <ResilientImage
              src={activePackage.imageSrc}
              alt={activePackage.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
