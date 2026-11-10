import React, { useState } from 'react';
import { Plus, Check, SlidersHorizontal, Utensils } from 'lucide-react';
import { MenuItem, StoreSettings } from '../types/menu';
import { formatPrice } from '../utils/formatters';

interface MenuCardProps {
  item: MenuItem;
  settings: StoreSettings;
  quantityInCart: number;
  onAddToCart: (item: MenuItem) => void;
  onCustomize: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  settings,
  quantityInCart,
  onAddToCart,
  onCustomize,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleAction = () => {
    if (!item.isAvailable) return;
    if (item.hasTemperatureOption || item.spicyOption) {
      onCustomize(item);
    } else {
      onAddToCart(item);
    }
  };

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden transition-all duration-200 ${
        item.isAvailable
          ? 'hover:shadow-md hover:-translate-y-0.5'
          : 'opacity-70 grayscale-[30%] bg-stone-50'
      }`}
    >
      {/* Product Image slot */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4">
            <Utensils className="w-8 h-8 mb-1.5 opacity-60 text-amber-700" />
            <span className="text-xs font-medium text-stone-500 text-center">{item.name}</span>
          </div>
        )}

        {/* Quiet status or feature flag */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-stone-900 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
              Sold Out
            </span>
          </div>
        )}

        {item.isAvailable && item.hasTemperatureOption && (
          <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
            Hot / Iced (+{formatPrice(item.icedExtraPrice || 0.5, settings)})
          </div>
        )}

        {item.isAvailable && item.isPopular && (
          <div className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded shadow-xs">
            Popular
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-800 transition-colors">
              {item.name}
            </h3>
            <span className="font-bold text-stone-900 text-base tabular-nums whitespace-nowrap shrink-0">
              {formatPrice(item.price, settings)}
            </span>
          </div>

          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Action Button Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          {item.isAvailable ? (
            item.hasTemperatureOption ? (
              <button
                onClick={() => onCustomize(item)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 rounded-lg transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
                {quantityInCart > 0 && (
                  <span className="ml-1 bg-amber-700 text-white text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
                    {quantityInCart}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                {quantityInCart > 0 ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Add More ({quantityInCart})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Order</span>
                  </>
                )}
              </button>
            )
          ) : (
            <button
              disabled
              className="w-full py-2 text-xs font-medium text-stone-400 bg-stone-100 rounded-lg cursor-not-allowed text-center"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
