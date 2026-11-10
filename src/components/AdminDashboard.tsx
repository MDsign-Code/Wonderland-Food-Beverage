import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Store,
  Phone,
  Clock3,
  Search,
  ShieldCheck,
  Package,
  CheckCircle2,
} from 'lucide-react';
import {
  MenuItem,
  StoreSettings,
  OrderRecord,
  MenuCategory,
  OrderStatus,
} from '../types/menu';
import { CATEGORIES } from '../data/initialMenu';
import { formatPrice } from '../utils/formatters';
import { createWhatsAppUrl } from '../utils/whatsapp';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  settings: StoreSettings;
  orders: OrderRecord[];
  onUpdateMenuItem: (item: MenuItem) => void;
  onAddMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  onResetMenu: () => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onClearOrders: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  menuItems,
  settings,
  orders,
  onUpdateMenuItem,
  onAddMenuItem,
  onDeleteMenuItem,
  onResetMenu,
  onUpdateSettings,
  onUpdateOrderStatus,
  onDeleteOrder,
  onClearOrders,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'settings'>('menu');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<MenuCategory>('all');

  // Edit / Add Item Modal state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Settings form local state
  const [tempSettings, setTempSettings] = useState<StoreSettings>({ ...settings });
  const [settingsSavedFeedback, setSettingsSavedFeedback] = useState(false);

  // Quick edit item form state
  const [itemForm, setItemForm] = useState<Partial<MenuItem>>({
    name: '',
    category: 'kids_meal',
    price: 5.99,
    description: '',
    image: '',
    isAvailable: true,
    isPopular: false,
    hasTemperatureOption: false,
    icedExtraPrice: 0.5,
  });

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setItemForm({ ...item });
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingItem(null);
    setItemForm({
      id: `item-${Date.now()}`,
      name: '',
      category: 'kids_meal',
      price: 5.99,
      description: '',
      image: '/src/assets/images/kids_meal_platter_1794284846453.jpg',
      isAvailable: true,
      isPopular: false,
      hasTemperatureOption: false,
      icedExtraPrice: 0.5,
    });
  };

  const handleSaveItemForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name?.trim()) return;

    if (isAddingNew) {
      const newItem: MenuItem = {
        id: itemForm.id || `item-${Date.now()}`,
        name: itemForm.name.trim(),
        category: itemForm.category || 'kids_meal',
        price: Number(itemForm.price) || 0,
        description: itemForm.description?.trim() || '',
        image: itemForm.image?.trim() || '/src/assets/images/kids_meal_platter_1794284846453.jpg',
        isAvailable: itemForm.isAvailable ?? true,
        isPopular: itemForm.isPopular ?? false,
        hasTemperatureOption: itemForm.hasTemperatureOption ?? false,
        icedExtraPrice: Number(itemForm.icedExtraPrice) || 0.5,
      };
      onAddMenuItem(newItem);
    } else if (editingItem) {
      const updated: MenuItem = {
        ...editingItem,
        name: itemForm.name.trim(),
        category: itemForm.category || editingItem.category,
        price: Number(itemForm.price) || editingItem.price,
        description: itemForm.description?.trim() || '',
        image: itemForm.image?.trim() || editingItem.image,
        isAvailable: itemForm.isAvailable ?? editingItem.isAvailable,
        isPopular: itemForm.isPopular ?? editingItem.isPopular,
        hasTemperatureOption: itemForm.hasTemperatureOption ?? editingItem.hasTemperatureOption,
        icedExtraPrice: Number(itemForm.icedExtraPrice) || 0.5,
      };
      onUpdateMenuItem(updated);
    }

    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setSettingsSavedFeedback(true);
    setTimeout(() => setSettingsSavedFeedback(false), 2500);
  };

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCatFilter === 'all' || item.category === selectedCatFilter;
    const matchesQuery = item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const availableCount = menuItems.filter((i) => i.isAvailable).length;
  const unavailableCount = menuItems.length - availableCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-200">
        {/* Top Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-stone-950 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Wonderland Admin Portal</h2>
              <p className="text-xs text-stone-400">
                Real-Time Menu, Pricing & WhatsApp Order Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-stone-100 border-b border-stone-200 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4 text-amber-600" />
            <span>Menu & Pricing</span>
            <span className="bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded text-[11px] tabular-nums">
              {menuItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock3 className="w-4 h-4 text-emerald-600" />
            <span>Incoming Orders</span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[11px] tabular-nums font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-4 h-4 text-cyan-600" />
            <span>Store & WhatsApp Settings</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50">
          {/* TAB 1: MENU & PRICE MANAGEMENT */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              {/* Stat bar and action row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center gap-4 text-xs font-medium text-stone-600">
                  <span className="font-bold text-stone-900 text-sm">
                    {menuItems.length} Total Items
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {availableCount} In Stock
                  </span>
                  {unavailableCount > 0 && (
                    <span className="text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {unavailableCount} Sold Out
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onResetMenu}
                    title="Restore original Wonderland menu from attachment"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                    <span>Reset to Default</span>
                  </button>

                  <button
                    onClick={handleStartAdd}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Item</span>
                  </button>
                </div>
              </div>

              {/* Filters row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                  />
                </div>

                <select
                  value={selectedCatFilter}
                  onChange={(e) => setSelectedCatFilter(e.target.value as MenuCategory)}
                  className="px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-600 uppercase font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-3 w-16">Photo</th>
                        <th className="p-3">Item & Category</th>
                        <th className="p-3 w-28">Price</th>
                        <th className="p-3 w-32">Stock Status</th>
                        <th className="p-3 w-28 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-stone-900 text-sm">{item.name}</div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                              <span className="capitalize">{item.category.replace('_', ' ')}</span>
                              {item.hasTemperatureOption && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-cyan-700">Iced Option (+{formatPrice(item.icedExtraPrice || 0.5, settings)})</span>
                                </>
                              )}
                              {item.isPopular && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-amber-600 font-semibold">Popular</span>
                                </>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                              {item.description}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-extrabold text-stone-900 tabular-nums text-sm">
                              {formatPrice(item.price, settings)}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() =>
                                onUpdateMenuItem({ ...item, isAvailable: !item.isAvailable })
                              }
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                                item.isAvailable
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                              }`}
                            >
                              {item.isAvailable ? '✓ In Stock' : '✕ Sold Out'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                                title="Edit Item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Remove "${item.name}" from the menu?`)) {
                                    onDeleteMenuItem(item.id);
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                title="Delete Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INCOMING ORDERS LOG */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Real-time Incoming Orders</h3>
                  <p className="text-xs text-stone-500">
                    Live feed of orders received from customer WhatsApp dispatches
                  </p>
                </div>
                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear entire order history?')) {
                        onClearOrders();
                      }
                    }}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400">
                  <Clock3 className="w-12 h-12 mx-auto stroke-1 text-stone-300 mb-2" />
                  <p className="text-sm font-semibold text-stone-700">No Incoming Orders Yet</p>
                  <p className="text-xs text-stone-500 mt-1">
                    When guests click &quot;Send Order via WhatsApp&quot;, their order records will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-stone-900">
                              #{order.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                order.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'processing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {order.status === 'completed'
                                ? 'Completed'
                                : order.status === 'processing'
                                ? 'In Preparation'
                                : 'New Order'}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                            <span>{new Date(order.createdAt).toLocaleTimeString('en-US')}</span>
                            <span aria-hidden="true">·</span>
                            <span>Customer: <strong>{order.customerName}</strong></span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {order.orderType === 'dine_in'
                                ? `Dine-in (Table ${order.tableNumber})`
                                : 'Takeaway'}
                            </span>
                          </div>
                        </div>

                        {/* Status dropdown & actions */}
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                            }
                            className="text-xs font-semibold bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 cursor-pointer"
                          >
                            <option value="pending">Pending (New)</option>
                            <option value="processing">In Preparation</option>
                            <option value="ready">Ready for Pickup</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => {
                              const url = createWhatsAppUrl(
                                settings.whatsappNumber,
                                `Order status update for #${order.orderNumber} (${order.customerName}): Status is now ${order.status}.`
                              );
                              window.open(url, '_blank');
                            }}
                            title="Open WhatsApp Chat"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 cursor-pointer"
                          >
                            <Phone className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteOrder(order.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1 text-xs">
                        {order.items.map((ci) => (
                          <div key={ci.cartItemId} className="flex items-center justify-between text-stone-700">
                            <span>
                              {ci.quantity}x {ci.menuItem.name} {ci.temperature ? `(${ci.temperature})` : ''}
                              {ci.notes ? ` [${ci.notes}]` : ''}
                            </span>
                            <span className="font-semibold tabular-nums">
                              {formatPrice(ci.calculatedPrice, settings)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-500">
                          Payment: <strong className="capitalize">{order.paymentMethod}</strong>
                        </span>
                        <span className="font-extrabold text-stone-900 text-sm tabular-nums">
                          Total: {formatPrice(order.total, settings)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STORE & WHATSAPP SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <h3 className="font-bold text-stone-900 text-base mb-1">
                Store & WhatsApp Settings
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Configure your kitchen WhatsApp number, currency format, tax rate, and store hours. All changes sync in real time.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Kitchen / Cashier WhatsApp Number (International format)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="6281234567890 or 1xxxxxxxxxx"
                      value={tempSettings.whatsappNumber}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-stone-900"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Enter country code without the &apos;+&apos; sign. Examples: US: 15551234567 or Indonesia: 6281234567890.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={tempSettings.storeName}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, storeName: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Currency Symbol
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setTempSettings({
                            ...tempSettings,
                            currencySymbol: '$',
                            currencyPosition: 'prefix',
                          })
                        }
                        className={`py-2 px-3 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          tempSettings.currencySymbol === '$'
                            ? 'border-amber-600 bg-amber-50 text-amber-900'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTempSettings({
                            ...tempSettings,
                            currencySymbol: 'Rp',
                            currencyPosition: 'prefix',
                          })
                        }
                        className={`py-2 px-3 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          tempSettings.currencySymbol === 'Rp'
                            ? 'border-amber-600 bg-amber-50 text-amber-900'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        IDR (Rp)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Tax / Service Rate (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={tempSettings.taxRatePercent}
                      onChange={(e) =>
                        setTempSettings({
                          ...tempSettings,
                          taxRatePercent: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={tempSettings.openHours}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, openHours: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Store Address / Location
                  </label>
                  <input
                    type="text"
                    value={tempSettings.address}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, address: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-medium"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Store Settings</span>
                  </button>

                  {settingsSavedFeedback && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Settings successfully saved!
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal for Edit / Add Item */}
        {(editingItem || isAddingNew) && (
          <div className="fixed inset-0 z-60 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
              <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">
                  {isAddingNew ? 'Add New Menu Item' : `Edit Item: ${editingItem?.name}`}
                </h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingNew(false);
                  }}
                  className="p-1 text-stone-400 hover:text-white rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveItemForm} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Category
                    </label>
                    <select
                      value={itemForm.category}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, category: e.target.value as MenuCategory })
                      }
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-medium"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Price ({settings.currencySymbol}) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={itemForm.price}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, price: parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 resize-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Product Image URL
                  </label>
                  <input
                    type="text"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-mono"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Can use local image paths or standard web image URLs.
                  </p>
                </div>

                {/* Toggles */}
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemForm.isAvailable}
                      onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Item Available (In Stock)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemForm.isPopular}
                      onChange={(e) => setItemForm({ ...itemForm, isPopular: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Mark as Popular / Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemForm.hasTemperatureOption}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, hasTemperatureOption: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Hot & Iced Option Available (+{formatPrice(itemForm.icedExtraPrice || 0.5, settings)})</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setIsAddingNew(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
