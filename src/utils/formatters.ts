import { StoreSettings } from '../types/menu';

export function formatPrice(amount: number, settings: StoreSettings): string {
  const isIdr = settings.currencySymbol.toLowerCase().includes('rp');
  
  if (isIdr) {
    const formatted = Math.round(amount).toLocaleString('id-ID');
    return settings.currencyPosition === 'prefix' 
      ? `${settings.currencySymbol} ${formatted}`
      : `${formatted} ${settings.currencySymbol}`;
  }

  // USD or general currency with decimals
  const formatted = amount.toFixed(2);
  return settings.currencyPosition === 'prefix' 
    ? `${settings.currencySymbol}${formatted}` 
    : `${formatted} ${settings.currencySymbol}`;
}

export function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `WL-${dateStr}-${randomNum}`;
}
