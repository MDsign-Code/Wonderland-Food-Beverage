import React from 'react';
import { CheckCircle2, MessageCircle, ExternalLink } from 'lucide-react';
import { OrderRecord, StoreSettings } from '../types/menu';
import { formatPrice } from '../utils/formatters';
import { createWhatsAppUrl } from '../utils/whatsapp';

interface OrderSuccessModalProps {
  order: OrderRecord | null;
  settings: StoreSettings;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  settings,
  onClose,
  onNewOrder,
}) => {
  if (!order) return null;

  const whatsappUrl = createWhatsAppUrl(settings.whatsappNumber, order.whatsappMessageText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest block mb-1">
              ORDER #{order.orderNumber}
            </span>
            <h3 className="text-xl font-extrabold text-stone-900">
              Order Dispatched Successfully!
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
              Thank you, <strong>{order.customerName}</strong>. Your order is queued for Wonderland&apos;s kitchen and barista team.
            </p>
          </div>

          {/* Quick Receipt Summary */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-left text-xs space-y-2">
            <div className="flex justify-between text-stone-500">
              <span>Dining Option:</span>
              <span className="font-semibold text-stone-800">
                {order.orderType === 'dine_in' ? `Dine-in (Table #${order.tableNumber})` : 'Takeaway'}
              </span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Payment Preference:</span>
              <span className="font-semibold text-stone-800 capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Total Items:</span>
              <span className="font-semibold text-stone-800">
                {order.items.reduce((s, i) => s + i.quantity, 0)} {order.items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
              <span>Total Amount:</span>
              <span className="text-amber-700">{formatPrice(order.total, settings)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp Chat</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => {
                onClose();
                onNewOrder();
              }}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Order More Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
