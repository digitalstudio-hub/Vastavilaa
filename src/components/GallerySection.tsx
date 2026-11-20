import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import {
  GALLERY_ITEMS,
  VIDEO_CHAPTERS,
  VILLA_INFO,
  type GalleryCategory,
  type GalleryItem,
} from '../data/villaData';
import { filterGalleryItems } from '../utils/booking';
import { ResilientImage } from './ResilientImage';

interface GallerySectionProps {
  externalLightboxId: string | null;
  onClearExternalLightbox: () => void;
}

const FILTER_TABS: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All Photos' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'cabana', label: 'Cabana & Grounds' },
  { id: 'brochure', label: 'Official Brochure' },
];

function parseChapterSeconds(timeStr: string): number {
  const [min, sec] = timeStr.split(':').map(Number);
  return (min || 0) * 60 + (sec || 0);
}

export function GallerySection({
  externalLightboxId,
  onClearExternalLightbox,
}: GallerySectionProps) {
  const [category, setCategory] = useState<GalleryCategory>('all');
  const [lightboxItemId, setLightboxItemId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const visibleItems = filterGalleryItems(GALLERY_ITEMS, category);
  const activeLightboxId = externalLightboxId ?? lightboxItemId;

  const activeLightboxIndex = activeLightboxId
    ? GALLERY_ITEMS.findIndex((item) => item.id === activeLightboxId)
    : -1;
  const activeLightboxItem: GalleryItem | null =
    activeLightboxIndex >= 0 ? GALLERY_ITEMS[activeLightboxIndex] : null;

  const closeLightbox = () => {
    setLightboxItemId(null);
    onClearExternalLightbox();
  };

  const navigateLightbox = (direction: -1 | 1) => {
    if (activeLightboxIndex < 0) return;
    const nextIdx =
      (activeLightboxIndex + direction + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    onClearExternalLightbox();
    setLightboxItemId(GALLERY_ITEMS[nextIdx].id);
  };

  useEffect(() => {
    if (!activeLightboxItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowRight') {
        navigateLightbox(1);
      } else if (event.key === 'ArrowLeft') {
        navigateLightbox(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeekChapter = async (timeStr: string) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = parseChapterSeconds(timeStr);
    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      // Ignore autoplay blocks on muted/unmuted interaction
    }
  };

  return (
    <section id="gallery" className="scroll-mt-20 py-16 lg:py-24 border-b border-[#E4DFD2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header & Category Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-medium text-[#8C6520]">Real Property Views</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#143625] leading-tight">
              Inside Vatsya Villa — Day to Twilight
            </h2>
            <p className="text-sm sm:text-[15px] text-[#4E5E54]">
              Every photograph and walkthrough frame is captured directly on site in Indore. Select
              any image to inspect in full screen.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter gallery photos"
            className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#F2EFE6] border border-[#E4DFD2] rounded-lg self-start lg:self-auto"
          >
            {FILTER_TABS.map((tab) => {
              const isSelected = category === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setCategory(tab.id)}
                  className={`min-h-10 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B] ${
                    isSelected
                      ? 'bg-[#143625] text-[#FAF9F5]'
                      : 'text-[#4E5E54] hover:text-[#143625]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Editorial Photo Grid */}
        <div
          data-testid="gallery-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {visibleItems.map((item, idx) => {
            const isWideFeature = category === 'all' && idx === 1;
            return (
              <figure
                key={item.id}
                className={`group flex flex-col bg-[#FFFFFF] border border-[#E4DFD2] rounded-xl overflow-hidden ${
                  isWideFeature ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onClearExternalLightbox();
                    setLightboxItemId(item.id);
                  }}
                  aria-label={`View ${item.title} in full screen`}
                  className="relative block w-full text-left overflow-hidden bg-[#143625] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D7B46A]"
                >
                  <div
                    className={`w-full overflow-hidden ${
                      isWideFeature ? 'h-[300px] sm:h-[380px]' : 'h-[300px] sm:h-[380px]'
                    }`}
                  >
                    <ResilientImage
                      src={item.src}
                      alt={item.alt}
                      className={`w-full h-full ${
                        item.category === 'brochure' ? 'object-contain bg-[#F6F1E2] p-2' : 'object-cover'
                      } ${item.objectPosition ?? 'object-center'} transition-transform duration-300 group-hover:scale-[1.03]`}
                    />
                  </div>
                  <span className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-md bg-black/55 text-white backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </span>
                </button>
                <figcaption className="p-5 flex flex-col gap-1.5">
                  <h3 className="font-editorial text-xl font-semibold text-[#143625]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#4E5E54] leading-relaxed">{item.caption}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* Dedicated Video Walkthrough Showcase */}
        <div
          id="video-tour"
          className="scroll-mt-20 mt-14 pt-14 border-t border-[#E4DFD2] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#8C6520]">
              <span>Full Estate Tour</span>
              <span aria-hidden="true">·</span>
              <span>Pool, Garden & 2 BHK Interiors</span>
            </div>
            <h3 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#143625] leading-tight">
              Walk Through Vatsya Villa Before You Arrive
            </h3>
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#4E5E54]">
              Preview the full estate layout in motion — from the private pool, thatched dining
              cabanas, and lit evening lawn straight into our royal-blue velvet AC living room and
              bedrooms.
            </p>

            {/* Clickable Video Chapters */}
            <div className="pt-2 space-y-2">
              <p className="text-xs font-medium text-[#4E5E54]">Jump to Walkthrough Moment</p>
              <div className="divide-y divide-[#E4DFD2] border-t border-b border-[#E4DFD2]">
                {VIDEO_CHAPTERS.map((chapter) => (
                  <button
                    key={chapter.time}
                    type="button"
                    onClick={() => handleSeekChapter(chapter.time)}
                    className="w-full py-3 flex items-center justify-between gap-4 text-left hover:text-[#8C6520] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B]"
                  >
                    <span className="text-sm font-medium text-[#14261C]">{chapter.label}</span>
                    <span className="text-xs font-medium text-[#8C6520] tabular-nums shrink-0">
                      {chapter.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-[#0E271B] rounded-xl p-4 sm:p-6 flex flex-col items-center">
              <div className="relative w-full max-w-[340px] aspect-[9/16] max-h-[540px] rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={VILLA_INFO.videoTourSrc}
                  poster="/assets/aistudio/IMG-20261120-WA0017_387815ed.jpg"
                  controls
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                >
                  Your browser does not support embedded video playback.
                </video>
              </div>
              <div className="mt-4 w-full max-w-[340px] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="inline-flex items-center justify-center gap-2 min-h-10 px-4 py-2 text-xs font-medium text-[#0E271B] bg-[#FAF9F5] hover:bg-[#F2EFE6] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7B46A]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Pause Tour</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                      <span>Play Walkthrough</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Unmute walkthrough video' : 'Mute walkthrough video'}
                  className="inline-flex items-center justify-center gap-2 min-h-10 px-3.5 py-2 text-xs font-medium text-[#FAF9F5] border border-white/25 hover:border-white/50 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7B46A]"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Unmute</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Mute</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Full-Screen Photo Lightbox Modal */}
      {activeLightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          className="fixed inset-0 z-50 bg-black/88 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full bg-[#14261C] text-[#FAF9F5] rounded-xl overflow-hidden border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-white/15">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-medium text-[#D7B46A] tabular-nums shrink-0">
                  {activeLightboxIndex + 1} / {GALLERY_ITEMS.length}
                </span>
                <h3 className="font-editorial text-xl font-semibold text-white truncate">
                  {activeLightboxItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close photo lightbox"
                className="inline-flex items-center justify-center w-10 h-10 rounded-md text-white/85 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7B46A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black flex items-center justify-center h-[60vh] sm:h-[70vh]">
              <ResilientImage
                src={activeLightboxItem.src}
                alt={activeLightboxItem.alt}
                loading="eager"
                className="max-w-full max-h-full object-contain"
              />
              <button
                type="button"
                onClick={() => navigateLightbox(-1)}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/65 text-white hover:bg-black/85 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7B46A]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => navigateLightbox(1)}
                aria-label="Next photo"
                className="absolute right-3 sm:right-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/65 text-white hover:bg-black/85 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7B46A]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-white/85">
              <p>{activeLightboxItem.caption}</p>
              <span className="text-xs text-white/60 shrink-0">Use arrow keys or Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
