import { useState, useEffect } from 'react';
import { MenuItem, StoreSettings, CartItem, OrderRecord, MenuCategory } from '../types/menu';
import { INITIAL_MENU_ITEMS, INITIAL_SETTINGS } from '../data/initialMenu';

const STORAGE_KEYS = {
  MENU: 'wl_menu_items_v2',
  SETTINGS: 'wl_store_settings_v2',
  ORDERS: 'wl_orders_history_v2',
  CART: 'wl_active_cart_v2',
};

export function useStore() {
  // 1. Menu Items State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_MENU_ITEMS;
  });

  // 2. Store Settings State
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return INITIAL_SETTINGS;
  });

  // 3. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // 4. Orders History State
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // 5. Active Category & Search
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 6. UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHowToOrderOpen, setIsHowToOrderOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Cart Handlers
  const addToCart = (
    item: MenuItem,
    quantity: number = 1,
    temperature?: 'Hot' | 'Iced',
    notes?: string
  ) => {
    const tempKey = temperature || 'Default';
    const noteKey = (notes || '').trim();
    const cartItemId = `${item.id}-${tempKey}-${noteKey}`;

    const extra = (temperature === 'Iced' && item.icedExtraPrice) ? item.icedExtraPrice : 0;
    const unitPrice = item.price + extra;
    const calculatedPrice = unitPrice * quantity;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(ci => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prevCart];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          calculatedPrice: unitPrice * newQty,
        };
        return next;
      }
      return [
        ...prevCart,
        {
          cartItemId,
          menuItem: item,
          quantity,
          temperature,
          notes: noteKey,
          calculatedPrice,
        },
      ];
    });
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(ci => {
        if (ci.cartItemId !== cartItemId) return ci;
        const extra = (ci.temperature === 'Iced' && ci.menuItem.icedExtraPrice) ? ci.menuItem.icedExtraPrice : 0;
        const unitPrice = ci.menuItem.price + extra;
        return {
          ...ci,
          quantity: newQuantity,
          calculatedPrice: unitPrice * newQuantity,
        };
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(ci => ci.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.calculatedPrice, 0);
  const cartTaxAmount = (cartSubtotal * (settings.taxRatePercent || 0)) / 100;
  const cartTotal = cartSubtotal + cartTaxAmount;

  // Admin Handlers
  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const addMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [newItem, ...prev]);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    // also remove from cart if present
    setCart(prev => prev.filter(ci => ci.menuItem.id !== itemId));
  };

  const resetMenuToDefault = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.MENU);
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  const recordOrder = (order: OrderRecord) => {
    setOrders(prev => [order, ...prev]);
    setLatestOrder(order);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(ord => ord.id !== orderId));
  };

  const clearOrderHistory = () => {
    setOrders([]);
  };

  return {
    menuItems,
    settings,
    cart,
    orders,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isCartOpen,
    setIsCartOpen,
    isAdminOpen,
    setIsAdminOpen,
    isHowToOrderOpen,
    setIsHowToOrderOpen,
    customizingItem,
    setCustomizingItem,
    latestOrder,
    setLatestOrder,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartItemCount,
    cartSubtotal,
    cartTaxAmount,
    cartTotal,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    resetMenuToDefault,
    updateSettings,
    recordOrder,
    updateOrderStatus,
    deleteOrder,
    clearOrderHistory,
  };
}
