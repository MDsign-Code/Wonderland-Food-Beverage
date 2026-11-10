export type MenuCategory = 
  | 'all'
  | 'kids_meal'
  | 'wraps'
  | 'cup_noodle'
  | 'coffee'
  | 'iced_ade'
  | 'slush'
  | 'latte'
  | 'tea';

export interface CategoryInfo {
  id: MenuCategory;
  name: string;
  subtitle: string;
  indonesianName?: string;
  icon: string;
  badge?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  hasTemperatureOption?: boolean; // Hot vs Iced (+$0.50)
  icedExtraPrice?: number;
  spicyOption?: boolean;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  temperature?: 'Hot' | 'Iced';
  notes?: string;
  calculatedPrice: number;
}

export type OrderType = 'dine_in' | 'takeaway';
export type PaymentMethod = 'kasir' | 'qris' | 'transfer';
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  tableNumber?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: OrderStatus;
  whatsappMessageText: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // e.g., 6281234567890
  currencySymbol: string; // '$' or 'Rp'
  currencyPosition: 'prefix' | 'suffix';
  taxRatePercent: number; // e.g. 0 or 10
  openHours: string;
  address: string;
  isOpen: boolean;
  adminPin: string;
}
