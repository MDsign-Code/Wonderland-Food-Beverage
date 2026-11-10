import React from 'react';
import { ShoppingBag, ShieldCheck, HelpCircle } from 'lucide-react';
import { StoreSettings } from '../types/menu';
import { formatPrice } from '../utils/formatters';

interface HeaderProps {
  settings: StoreSettings;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenHowToOrder: () => void;
  onSelectCategory: (cat: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenAdmin,
  onOpenHowToOrder,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Single text element wordmark as per Top Bar Contract) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl font-extrabold tracking-tight text-amber-900 whitespace-nowrap shrink-0 hover:text-amber-800 transition-colors"
          >
            {settings.storeName}
          </a>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-600">
            <button
              onClick={() => {
                onSelectCategory('all');
                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-amber-900 transition-colors whitespace-nowrap shrink-0"
            >
              Full Menu
            </button>
            <button
              onClick={() => {
                onSelectCategory('kids_meal');
                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-amber-900 transition-colors whitespace-nowrap shrink-0"
            >
              Kids Meal
            </button>
            <button
              onClick={() => {
                onSelectCategory('wraps');
                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-amber-900 transition-colors whitespace-nowrap shrink-0"
            >
              Wraps
            </button>
            <button
              onClick={() => {
                onSelectCategory('coffee');
                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-amber-900 transition-colors whitespace-nowrap shrink-0"
            >
              Coffee & Ade
            </button>
            <button
              onClick={onOpenHowToOrder}
              className="flex items-center gap-1.5 hover:text-amber-900 transition-colors whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-4 h-4 text-stone-400" />
              How to Order
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              title="Open Admin Dashboard (Edit Menu & Prices)"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-stone-200"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Order Cart</span>
              {cartCount > 0 && (
                <span className="tabular-nums font-bold bg-amber-800 px-1.5 py-0.5 rounded text-xs">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden md:inline tabular-nums text-amber-100 text-xs font-semibold border-l border-amber-500 pl-2">
                  {formatPrice(cartTotal, settings)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
