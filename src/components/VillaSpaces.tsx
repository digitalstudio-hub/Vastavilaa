import { useState } from 'react';
import { Check } from 'lucide-react';
import { PROPERTY_HIGHLIGHTS, VILLA_SPACES } from '../data/villaData';
import { ResilientImage } from './ResilientImage';

export function VillaSpaces() {
  const [selectedSpaceId, setSelectedSpaceId] = useState(VILLA_SPACES[0].id);
  const activeSpace =
    VILLA_SPACES.find((space) => space.id === selectedSpaceId) ?? VILLA_SPACES[0];

  return (
    <>
      {/* Property Highlights — Clean Editorial Numbered Index */}
      <section id="highlights" className="scroll-mt-20 py-16 lg:py-24 border-b border-[#E4DFD2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <p className="text-xs font-medium text-[#8C6520]">Property Highlights</p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#143625] leading-tight">
                Everything You Need for an Uninterrupted Private Stay
              </h2>
              <p className="text-[15px] leading-relaxed text-[#4E5E54]">
                Every corner of Vatsya Villa is reserved exclusively for your group — from the
                air-conditioned 2 BHK interiors to the 17 × 11 ft swimming pool and landscaped
                5,000 sq. ft. grounds.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#E4DFD2] border-t border-b border-[#E4DFD2]">
              {PROPERTY_HIGHLIGHTS.map((item) => (
                <div
                  key={item.number}
                  className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
                >
                  <div className="sm:col-span-5 flex items-baseline gap-4">
                    <span className="text-xs font-semibold text-[#B6842B] tabular-nums shrink-0">
                      {item.number}.
                    </span>
                    <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#143625] leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="sm:col-span-7 text-sm sm:text-[15px] leading-relaxed text-[#4E5E54] sm:pl-2">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Space Explorer */}
      <section
        id="spaces"
        className="scroll-mt-20 py-16 lg:py-24 bg-[#F2EFE6]/70 border-b border-[#E4DFD2]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col gap-6 mb-8">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-medium text-[#8C6520]">Explore the Estate</p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#143625] leading-tight">
                Spaces Built for Daylong Leisure and Warm Evenings
              </h2>
            </div>

            {/* Interactive Segmented Tab Selector */}
            <div
              role="tablist"
              aria-label="Villa spaces"
              className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#EAE5D7] rounded-lg self-start"
            >
              {VILLA_SPACES.map((space) => {
                const isActive = space.id === activeSpace.id;
                return (
                  <button
                    key={space.id}
                    type="button"
                    role="tab"
                    id={`tab-${space.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${space.id}`}
                    onClick={() => setSelectedSpaceId(space.id)}
                    className={`min-h-10 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B] ${
                      isActive
                        ? 'bg-[#FFFFFF] text-[#143625] shadow-xs'
                        : 'text-[#4E5E54] hover:text-[#143625]'
                    }`}
                  >
                    {space.index}. {space.specLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            role="tabpanel"
            id={`panel-${activeSpace.id}`}
            aria-labelledby={`tab-${activeSpace.id}`}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-[#FFFFFF] border border-[#E4DFD2] rounded-xl p-5 sm:p-8"
          >
            <div className="lg:col-span-7 overflow-hidden rounded-lg bg-[#143625] h-[300px] sm:h-[400px] lg:h-[460px]">
              <ResilientImage
                src={activeSpace.imageSrc}
                alt={activeSpace.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-6 py-1">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-medium text-[#8C6520]">
                  <span className="tabular-nums">Space {activeSpace.index}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSpace.specLabel}</span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#143625] leading-tight">
                  {activeSpace.name}
                </h3>
                <p className="text-sm sm:text-[15px] font-medium text-[#14261C] leading-relaxed">
                  {activeSpace.summary}
                </p>
                <p className="text-sm sm:text-[15px] text-[#4E5E54] leading-relaxed">
                  {activeSpace.description}
                </p>

                <ul className="pt-2 space-y-3 border-t border-[#E4DFD2]">
                  {activeSpace.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-3 text-sm text-[#14261C] leading-snug"
                    >
                      <Check
                        className="w-4 h-4 mt-0.5 text-[#143625] shrink-0"
                        aria-hidden="true"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#E4DFD2] flex items-center justify-between gap-4">
                <span className="text-xs text-[#4E5E54]">Included with every full-villa booking</span>
                <a
                  href="#plan-stay"
                  className="text-sm font-medium text-[#143625] hover:text-[#8C6520] underline underline-offset-4 decoration-[#B6842B] whitespace-nowrap shrink-0 transition-colors"
                >
                  Inquire for Dates
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
