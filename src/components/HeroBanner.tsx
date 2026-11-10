import React from 'react';
import { Search, Send, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../types/menu';

interface HeroBannerProps {
  settings: StoreSettings;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenHowToOrder: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  searchQuery,
  onSearchChange,
  onOpenHowToOrder,
}) => {
  return (
    <div className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_wonderland_cafe_1794284846606.jpg"
          alt="Wonderland Indoor Playground & Cafe Counter"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-75 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Measured dark scrim for WCAG AA compliance */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/75 to-stone-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-2xl">
          {/* Subtle metadata with typographic separators (anti-pill) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3">
            <span>Play & Party Cafe</span>
            <span aria-hidden="true">·</span>
            <span>Digital Ordering</span>
            <span aria-hidden="true">·</span>
            <span>WhatsApp Ready</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Delicious Food & Refreshing Drinks for the Whole Family
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
            Order comfortably from your table or playground area. Select your favorites, specify your table number, and your order is dispatched straight to our WhatsApp kitchen!
          </p>

          {/* Quick info row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 mb-7">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-md border border-white/15">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Hours: {settings.openHours}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-md border border-white/15">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-950/70 text-emerald-300 px-3 py-1.5 rounded-md border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Active: +{settings.whatsappNumber}</span>
            </div>
          </div>

          {/* Search bar & quick action */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search menu (Mac & Cheese, Latte, Slush, Wraps...)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={onOpenHowToOrder}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-sm rounded-lg shadow-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>How It Works</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
