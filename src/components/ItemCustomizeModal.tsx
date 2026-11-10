import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame, Snowflake } from 'lucide-react';
import { MenuItem, StoreSettings } from '../types/menu';
import { formatPrice } from '../utils/formatters';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  settings: StoreSettings;
  onClose: () => void;
  onConfirm: (
    item: MenuItem,
    quantity: number,
    temperature?: 'Hot' | 'Iced',
    notes?: string
  ) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  settings,
  onClose,
  onConfirm,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState<'Hot' | 'Iced'>('Hot');
  const [notes, setNotes] = useState('');

  const extraTempPrice = (item.hasTemperatureOption && temperature === 'Iced' && item.icedExtraPrice)
    ? item.icedExtraPrice
    : 0;
  
  const unitPrice = item.price + extraTempPrice;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(
      item,
      quantity,
      item.hasTemperatureOption ? temperature : undefined,
      notes.trim() || undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
        {/* Header with image */}
        <div className="relative h-44 bg-stone-100">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-xs text-stone-200 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Content form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Temperature Options (Hot vs Iced) */}
          {item.hasTemperatureOption && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Select Temperature & Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTemperature('Hot')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                    temperature === 'Hot'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/30'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Hot</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTemperature('Iced')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                    temperature === 'Iced'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/30'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Snowflake className="w-4 h-4 text-cyan-600" />
                  <span>Iced (+{formatPrice(item.icedExtraPrice || 0.5, settings)})</span>
                </button>
              </div>
            </div>
          )}

          {/* Special Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Less sweet, dressing on the side, extra cup..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900"
              maxLength={120}
            />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <div>
              <span className="text-xs text-stone-500 block">Quantity</span>
              <span className="text-sm font-bold text-stone-900">
                {quantity}x ({formatPrice(unitPrice, settings)} / each)
              </span>
            </div>

            <div className="flex items-center gap-3 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-xs text-stone-700 hover:bg-stone-200 disabled:opacity-40 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-bold tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-xs text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-between p-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Add to Order</span>
            </div>
            <span className="tabular-nums font-extrabold text-amber-100">
              {formatPrice(totalPrice, settings)}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
