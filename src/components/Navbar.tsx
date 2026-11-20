import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#highlights', label: 'Highlights' },
  { href: '#spaces', label: 'Spaces' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#celebrations', label: 'Celebrations' },
  { href: '#plan-stay', label: 'Stay Info' },
] as const;

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E4DFD2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          className="font-editorial text-2xl sm:text-[26px] font-semibold tracking-tight text-[#143625] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B6842B]"
        >
          Vatsya Villa
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4E5E54]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-1 whitespace-nowrap shrink-0 hover:text-[#143625] underline-offset-8 decoration-[#B6842B] hover:underline transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B6842B]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#plan-stay"
            className="hidden sm:inline-flex items-center justify-center min-h-10 px-5 py-2 text-sm font-medium text-[#FAF9F5] bg-[#143625] hover:bg-[#0E271B] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B]"
          >
            Plan Your Stay
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-[#143625] hover:bg-[#F2EFE6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6842B]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#E4DFD2] bg-[#FAF9F5] px-5 py-4"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 text-base font-medium text-[#14261C] hover:text-[#143625] hover:bg-[#F2EFE6] rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#plan-stay"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center min-h-11 px-5 py-2.5 text-sm font-medium text-[#FAF9F5] bg-[#143625] hover:bg-[#0E271B] rounded-md transition-colors"
            >
              Plan Your Stay
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
