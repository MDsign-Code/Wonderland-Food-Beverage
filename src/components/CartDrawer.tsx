import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  Copy,
  Check,
  ShoppingBag,
  Store,
  Eye,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import {
  CartItem,
  StoreSettings,
  OrderType,
  PaymentMethod,
  OrderRecord,
} from '../types/menu';
import { formatPrice, generateOrderId } from '../utils/formatters';
import { buildWhatsAppMessage, createWhatsAppUrl } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  subtotal: number;
  taxAmount: number;
  total: number;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderCompleted: (order: OrderRecord) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  subtotal,
  taxAmount,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kasir');
  const [orderNotes, setOrderNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formError, setFormError] = useState('');

  // Generate preview message
  const previewPayload = {
    orderNumber: 'PREVIEW',
    customerName: customerName || 'Guest',
    customerPhone,
    orderType,
    tableNumber,
    paymentMethod,
    notes: orderNotes,
    items: cart,
    subtotal,
    taxAmount,
    total,
    settings,
  };
  const previewMessage = buildWhatsAppMessage(previewPayload);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(previewMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSendOrder = () => {
    // Validation
    if (cart.length === 0) {
      setFormError('Your order cart is currently empty.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Please enter the customer name.');
      return;
    }
    if (orderType === 'dine_in' && !tableNumber.trim()) {
      setFormError('Please provide your table number for Dine-in.');
      return;
    }

    setFormError('');
    const orderId = generateOrderId();
    const finalPayload = {
      ...previewPayload,
      orderNumber: orderId,
    };
    const finalMessage = buildWhatsAppMessage(finalPayload);
    const whatsappUrl = createWhatsAppUrl(settings.whatsappNumber, finalMessage);

    // Record order in state & localStorage
    const newOrder: OrderRecord = {
      id: orderId,
      orderNumber: orderId,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber.trim() : undefined,
      notes: orderNotes.trim() || undefined,
      paymentMethod,
      items: [...cart],
      subtotal,
      taxRate: settings.taxRatePercent,
      taxAmount,
      total,
      status: 'pending',
      whatsappMessageText: finalMessage,
    };

    onOrderCompleted(newOrder);

    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-stone-900">Your Order Cart</h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full tabular-nums">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {cart.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <UtensilsCrossed className="w-12 h-12 stroke-[1.5] text-stone-300 mb-3" />
                <p className="text-sm font-semibold text-stone-700">Your Cart is Empty</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Choose delicious food and refreshing drinks for your family.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Browse Menu Now
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Selected Items
                    </span>
                    <button
                      onClick={onClearCart}
                      className="text-xs text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3"
                    >
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-lg shrink-0 border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-bold text-stone-900 truncate">
                            {item.menuItem.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-stone-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.temperature && (
                          <span
                            className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded mt-0.5 ${
                              item.temperature === 'Iced'
                                ? 'bg-cyan-100 text-cyan-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.temperature}
                          </span>
                        )}

                        {item.notes && (
                          <p className="text-[11px] text-stone-500 italic mt-0.5 truncate">
                            Notes: {item.notes}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-stone-900 tabular-nums">
                            {formatPrice(item.calculatedPrice, settings)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Details Form */}
                <div className="pt-4 border-t border-stone-200 space-y-4">
                  <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-amber-600" />
                    <span>Guest & Dining Details</span>
                  </h3>

                  {/* Order Type Selector */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOrderType('dine_in')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        orderType === 'dine_in'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Dine-in (At Table)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        orderType === 'takeaway'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Takeaway (To-Go)
                    </button>
                  </div>

                  {/* Name & Table fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Sarah Johnson"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (formError) setFormError('');
                        }}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900 font-medium"
                      />
                    </div>

                    {orderType === 'dine_in' ? (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Table Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 04"
                          value={tableNumber}
                          onChange={(e) => {
                            setTableNumber(e.target.value);
                            if (formError) setFormError('');
                          }}
                          className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900 font-medium"
                        />
                      </div>
                    ) : (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900 font-medium"
                        />
                      </div>
                    )}
                  </div>

                  {/* Payment method selector */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Payment Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('kasir')}
                        className={`p-2 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                          paymentMethod === 'kasir'
                            ? 'border-amber-600 bg-amber-50 text-amber-900'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        Cash at Counter
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qris')}
                        className={`p-2 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                          paymentMethod === 'qris'
                            ? 'border-amber-600 bg-amber-50 text-amber-900'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        QR / Digital Pay
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('transfer')}
                        className={`p-2 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                          paymentMethod === 'transfer'
                            ? 'border-amber-600 bg-amber-50 text-amber-900'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        Card / Transfer
                      </button>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Special Instructions / Kitchen Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Dressing on the side, extra straws, allergies..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900 resize-none font-medium"
                    />
                  </div>

                  {/* Toggle Preview Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showPreview ? 'Hide WhatsApp Message Preview' : 'Preview WhatsApp Order Message'}</span>
                    </button>

                    {showPreview && (
                      <div className="mt-2 p-3 bg-stone-900 text-emerald-300 rounded-xl text-[11px] font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-stone-800">
                        {previewMessage}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Price Breakdown and WhatsApp action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                  <span className="tabular-nums font-semibold">
                    {formatPrice(subtotal, settings)}
                  </span>
                </div>

                {taxAmount > 0 && (
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Tax & Service ({settings.taxRatePercent}%)</span>
                    <span className="tabular-nums font-semibold">
                      {formatPrice(taxAmount, settings)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-stone-900 font-extrabold text-base pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="tabular-nums text-amber-700">
                    {formatPrice(total, settings)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSendOrder}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Order via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl border border-stone-300 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Order Text Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copy Order Details</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Directly connected to Wonderland WhatsApp Kitchen</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
