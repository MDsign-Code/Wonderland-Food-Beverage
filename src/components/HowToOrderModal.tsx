import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface HowToOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOrder: () => void;
}

export const HowToOrderModal: React.FC<HowToOrderModalProps> = ({
  isOpen,
  onClose,
  onStartOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
        <div className="px-6 py-5 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base">Easy Digital Ordering Guide</h3>
            <p className="text-xs text-stone-400">Order without lines at Wonderland Play & Party</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Select Your Food & Drinks</h4>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  Browse our fresh Kids Meals, Wraps, Cup Noodles, Espresso Coffee, Slushies, or Sparkling Ades. Choose Hot or Iced if available.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Set Dining Option & Table Number</h4>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  Open your cart, choose Dine-in (enter your table number) or Takeaway, and add special instructions (e.g., sauce on the side).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Instant Dispatch via WhatsApp</h4>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  Click &quot;Send Order via WhatsApp&quot;. Your order number, itemized list, and total amount will be sent directly to our staff!
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Our team will promptly confirm, prepare your order, and deliver it directly to your table!
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onStartOrder();
            }}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            Start Browsing Menu
          </button>
        </div>
      </div>
    </div>
  );
};
