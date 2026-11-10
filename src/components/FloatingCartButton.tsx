import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { StoreSettings } from '../types/menu';
import { formatPrice } from '../utils/formatters';

interface FloatingCartButtonProps {
  itemCount: number;
  total: number;
  settings: StoreSettings;
  onOpenCart: () => void;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  itemCount,
  total,
  settings,
  onOpenCart,
}) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-30 max-w-lg mx-auto sm:hidden animate-in slide-in-from-bottom-4 duration-200">
      <button
        onClick={onOpenCart}
        className="w-full flex items-center justify-between p-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-2xl shadow-xl transition-all cursor-pointer font-bold text-sm"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative p-1.5 bg-amber-700 rounded-lg">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-white text-amber-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <div className="text-left">
            <div className="text-[11px] text-amber-100 font-normal">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
            </div>
            <div className="text-sm font-extrabold tabular-nums">
              {formatPrice(total, settings)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-700/60 hover:bg-amber-700 px-3 py-1.5 rounded-xl text-xs font-bold">
          <span>View Cart & Order</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
