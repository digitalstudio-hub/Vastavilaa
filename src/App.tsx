import { useState } from 'react';
import { BookingSection } from './components/BookingSection';
import { CelebrationsSection } from './components/CelebrationsSection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { VillaSpaces } from './components/VillaSpaces';
import type { OccasionOption } from './utils/booking';

export default function App() {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionOption | null>(null);
  const [externalLightboxId, setExternalLightboxId] = useState<string | null>(null);

  const handleSelectOccasionForBooking = (occasion: OccasionOption) => {
    setSelectedOccasion(occasion);
    const target = document.getElementById('plan-stay');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenBrochure = () => {
    setExternalLightboxId('official-brochure');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#14261C]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <VillaSpaces />
        <GallerySection
          externalLightboxId={externalLightboxId}
          onClearExternalLightbox={() => setExternalLightboxId(null)}
        />
        <CelebrationsSection onSelectOccasionForBooking={handleSelectOccasionForBooking} />
        <BookingSection
          selectedOccasion={selectedOccasion}
          onOpenBrochure={handleOpenBrochure}
        />
      </main>
      <Footer onOpenBrochure={handleOpenBrochure} />
    </div>
  );
}
