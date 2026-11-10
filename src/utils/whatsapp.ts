import { CartItem, OrderType, PaymentMethod, StoreSettings } from '../types/menu';
import { formatPrice } from './formatters';

export interface WhatsAppOrderPayload {
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  orderType: OrderType;
  tableNumber?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  settings: StoreSettings;
}

export function buildWhatsAppMessage(payload: WhatsAppOrderPayload): string {
  const {
    orderNumber,
    customerName,
    customerPhone,
    orderType,
    tableNumber,
    paymentMethod,
    notes,
    items,
    subtotal,
    taxAmount,
    total,
    settings,
  } = payload;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const orderTypeLabel = orderType === 'dine_in' 
    ? `Dine-in (Table #${tableNumber || '-'})` 
    : 'Takeaway (To-Go / Takeout)';

  const paymentLabelMap: Record<PaymentMethod, string> = {
    kasir: 'Cash at Counter',
    qris: 'QR / Digital Wallet',
    transfer: 'Card / Bank Transfer',
  };

  const lines: string[] = [
    `*HELLO ${settings.storeName.toUpperCase()}*`,
    `I would like to place an order with the following details:`,
    '',
    `📌 *ORDER NO: #${orderNumber}*`,
    `📅 Date & Time: ${dateFormatted}`,
    `👤 Customer: *${customerName || 'Guest'}*`,
    ...(customerPhone ? [`📱 Phone / WhatsApp: ${customerPhone}`] : []),
    `📍 Dining Option: *${orderTypeLabel}*`,
    `💳 Payment: *${paymentLabelMap[paymentMethod]}*`,
    '',
    `━━━━━━━━━━━━━━━━━━━━`,
    `🛒 *ORDER ITEMS:*`,
  ];

  items.forEach((item, index) => {
    const tempSuffix = item.temperature ? ` (${item.temperature})` : '';
    lines.push(
      `${index + 1}. *${item.menuItem.name}${tempSuffix}* x${item.quantity} = ${formatPrice(item.calculatedPrice, settings)}`
    );
    if (item.notes && item.notes.trim()) {
      lines.push(`   _Notes: "${item.notes.trim()}"_`);
    }
  });

  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`💵 Subtotal: ${formatPrice(subtotal, settings)}`);
  
  if (taxAmount > 0) {
    lines.push(`🧾 Tax & Service (${settings.taxRatePercent}%): ${formatPrice(taxAmount, settings)}`);
  }
  
  lines.push(`💰 *TOTAL AMOUNT: ${formatPrice(total, settings)}*`);

  if (notes && notes.trim()) {
    lines.push('');
    lines.push(`📝 *Special Instructions:*`);
    lines.push(`"${notes.trim()}"`);
  }

  lines.push('');
  lines.push(`Please confirm availability and start preparing my order. Thank you! 🙏✨`);

  return lines.join('\n');
}

export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  // Normalize phone number (strip '+', spaces, dashes)
  let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
