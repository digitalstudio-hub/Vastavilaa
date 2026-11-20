import { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { HERO_SPECS, VILLA_INFO } from '../data/villaData';
import { ResilientImage } from './ResilientImage';

const HERO_VIEWS = [
  {
    id: 'poolside',
    label: 'Poolside',
    caption: '17 × 11 ft private pool with warm deck illumination & thatched palm eaves',
    src: '/assets/aistudio/IMG-20261120-WA0015_34cc96a6.jpg',
    alt: 'Guests relaxing along the emerald private swimming pool at Vatsya Villa in Indore',
    objectPosition: 'object-center',
  },
  {
    id: 'cabana',
    label: 'Cabana Lounge',
    caption: 'Draped saffron dining pavilion with glowing handwoven bamboo pendant lamps',
    src: '/assets/aistudio/IMG-20261120-WA0017_387815ed.jpg',
    alt: 'Golden hour view of the thatched poolside cabana with saffron curtains and outdoor dining table',
    objectPosition: 'object-center',
  },
  {
    id: 'steps',
    label: 'Pool & Palms',
    caption: 'Curved entry steps and serene garden privacy across 5,000 sq. ft.',
    src: '/assets/vatsya-pool-steps-wide.jpg',
    alt: 'Daylight wide view of the turquoise swimming pool with curved Roman corner steps and banana leaves',
    objectPosition: 'object-center',
  },
] as const;

export function Hero() {
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const activeView = HERO_VIEWS[activeViewIndex];

  return (
    <section id="top" className="border-b border-[#E4DFD2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-10 lg:pt-10 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-7">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#4E5E54]">
                <span>{VILLA_INFO.region}</span>
                <span aria-hidden="true">·</span>
                <span>2 BHK Private Villa</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">5,000 Sq. Ft.</span>
              </div>

              <div className="space-y-2.5">
                <h1 className="font-editorial text-[clamp(2.75rem,4.5vw,4rem)] font-semibold leading-[1.03] tracking-tight text-[#143625]">
                  {VILLA_INFO.name}
                </h1>
                <p className="font-editorial italic text-2xl sm:text-[26px] leading-snug text-[#8C6520]">
                  {VILLA_INFO.tagline}
                </p>
              </div>

              <p className="text-[15px] sm:text-base leading-relaxed text-[#4E5E54] max-w-[46ch]">
                {VILLA_INFO.summary}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-4">
                <a
                  href="#plan-stay"
                  className="inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 text-sm font-medium text-[#FAF9F5] bg-[#143625] hover:bg-[#0E271B] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B]"
                >
                  <span>Book Your Private Stay</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="#video-tour"
                  className="inline-flex items-center justify-center gap-2 min-h-12 px-4 py-3 text-sm font-medium text-[#143625] hover:text-[#8C6520] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B]"
                >
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Watch Villa Walkthrough</span>
                </a>
              </div>
            </div>

            {/* Subtle editorial detail footer inside hero column */}
            <div className="pt-5 border-t border-[#E4DFD2] flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-[#4E5E54]">
              <div>
                <span className="font-medium text-[#14261C]">Check-In:</span>{' '}
                <span className="tabular-nums">{VILLA_INFO.checkInTime}</span>
              </div>
              <div>
                <span className="font-medium text-[#14261C]">Check-Out:</span>{' '}
                <span className="tabular-nums">{VILLA_INFO.checkOutTime}</span>
              </div>
            </div>
          </div>

          {/* Dominant Visual Carrier Column */}
          <div className="lg:col-span-7">
            <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[500px] rounded-xl overflow-hidden bg-[#143625]">
              <ResilientImage
                src={activeView.src}
                alt={activeView.alt}
                loading="eager"
                className={`w-full h-full object-cover ${activeView.objectPosition} transition-opacity duration-200`}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <p className="text-sm text-white/95 leading-snug max-w-[44ch]">
                  {activeView.caption}
                </p>
                <div
                  role="tablist"
                  aria-label="Hero property views"
                  className="inline-flex items-center gap-1 p-1 rounded-lg bg-black/45 backdrop-blur-sm self-start sm:self-auto shrink-0"
                >
                  {HERO_VIEWS.map((view, idx) => {
                    const isSelected = idx === activeViewIndex;
                    return (
                      <button
                        key={view.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveViewIndex(idx)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7B46A] ${
                          isSelected
                            ? 'bg-[#FAF9F5] text-[#143625]'
                            : 'text-white/85 hover:text-white'
                        }`}
                      >
                        {view.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Property Spec Strip */}
        <dl className="mt-8 pt-6 border-t border-[#E4DFD2] grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-6 lg:divide-x lg:divide-[#E4DFD2]">
          {HERO_SPECS.map((spec, idx) => (
            <div key={spec.label} className={idx > 0 ? 'lg:pl-8' : ''}>
              <dt className="text-xs font-medium text-[#4E5E54]">{spec.label}</dt>
              <dd className="mt-1.5 font-editorial text-2xl sm:text-[28px] font-semibold text-[#143625] tabular-nums leading-tight">
                {spec.value}
              </dd>
              <dd className="mt-1 text-xs sm:text-sm text-[#4E5E54]">{spec.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
