import React from 'react';
import { useStore } from './utils/useStore';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { MenuCard } from './components/MenuCard';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { HowToOrderModal } from './components/HowToOrderModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { FloatingCartButton } from './components/FloatingCartButton';
import { CATEGORIES } from './data/initialMenu';
import { MenuCategory, MenuItem } from './types/menu';
import { kidsMealImage, wrapsImage, beveragesImage } from './assets/images';
import {
  UtensilsCrossed,
  Sparkles,
  ShieldCheck,
  Send,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const {
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
  } = useStore();

  // Item counts by category
  const itemCountsByCategory = CATEGORIES.reduce((acc, cat) => {
    if (cat.id === 'all') {
      acc[cat.id] = menuItems.length;
    } else {
      acc[cat.id] = menuItems.filter((i) => i.category === cat.id).length;
    }
    return acc;
  }, {} as Record<MenuCategory, number>);

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Helper to get items count currently in cart for an item
  const getItemCartQuantity = (itemId: string) => {
    return cart
      .filter((ci) => ci.menuItem.id === itemId)
      .reduce((sum, ci) => sum + ci.quantity, 0);
  };

  // Group items if showing all categories
  const categoriesToShow = selectedCategory === 'all'
    ? CATEGORIES.filter((c) => c.id !== 'all' && itemCountsByCategory[c.id] > 0)
    : CATEGORIES.filter((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* 1. Header (Strict Top Bar Contract) */}
      <Header
        settings={settings}
        cartCount={cartItemCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenHowToOrder={() => setIsHowToOrderOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 2. Hero Banner */}
      <HeroBanner
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenHowToOrder={() => setIsHowToOrderOpen(true)}
      />

      {/* 3. Category Filter Tabs */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        itemCountsByCategory={itemCountsByCategory}
      />

      {/* 4. Featured Category Spotlights (Shown when category is 'all' and no active search) */}
      {selectedCategory === 'all' && !searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Spotlight 1: Kids Meal */}
            <div
              onClick={() => setSelectedCategory('kids_meal')}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-stone-200 transition-all hover:shadow-md"
            >
              <img
                src={kidsMealImage}
                alt="Kids Meal Favorites"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  Kids Favorites
                </span>
                <h3 className="text-lg font-bold">Kids Meals & Snacks</h3>
                <p className="text-xs text-stone-300 mt-0.5 line-clamp-1">
                  Mac & Cheese, Chicken Tenders, Pizza & Nuggets
                </p>
              </div>
            </div>

            {/* Spotlight 2: Artisan Wraps */}
            <div
              onClick={() => setSelectedCategory('wraps')}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-stone-200 transition-all hover:shadow-md"
            >
              <img
                src={wrapsImage}
                alt="Artisan Wraps"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  Savory Lunch
                </span>
                <h3 className="text-lg font-bold">Toasted Artisan Wraps</h3>
                <p className="text-xs text-stone-300 mt-0.5 line-clamp-1">
                  Ham Cheese, Chicken Pesto & Caesar Wraps
                </p>
              </div>
            </div>

            {/* Spotlight 3: Refreshing Drinks */}
            <div
              onClick={() => setSelectedCategory('iced_ade')}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-stone-200 transition-all hover:shadow-md"
            >
              <img
                src={beveragesImage}
                alt="Fruit Ades & Slush"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  Chilled & Refreshing
                </span>
                <h3 className="text-lg font-bold">Fruit Ades & Slushies</h3>
                <p className="text-xs text-stone-300 mt-0.5 line-clamp-1">
                  Lemon, Strawberry, Mango, Lychee & Taro
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Main Menu Section */}
      <main id="menu-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto">
            <UtensilsCrossed className="w-12 h-12 stroke-[1.5] text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No Menu Items Found</h3>
            <p className="text-xs text-stone-500 mt-1">
              No items matched your search &quot;{searchQuery}&quot;. Please try a different search keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Show All Menu Items
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {categoriesToShow.map((cat) => {
              const itemsInCat = filteredItems.filter((i) => i.category === cat.id);
              if (itemsInCat.length === 0) return null;

              return (
                <section key={cat.id} id={`category-${cat.id}`} className="space-y-4">
                  {/* Category Section Header with Zero-Pill Typography */}
                  <div className="flex items-baseline justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-stone-400 tabular-nums">
                      {itemsInCat.length} {itemsInCat.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {itemsInCat.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        settings={settings}
                        quantityInCart={getItemCartQuantity(item.id)}
                        onAddToCart={(itm) => addToCart(itm, 1)}
                        onCustomize={(itm) => setCustomizingItem(itm)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. Mobile Floating Cart Button */}
      <FloatingCartButton
        itemCount={cartItemCount}
        total={cartTotal}
        settings={settings}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 7. Quiet Footer */}
      <footer className="mt-16 bg-white border-t border-stone-200 text-stone-600 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="font-extrabold text-stone-900 text-sm block">
                {settings.storeName}
              </span>
              <p className="text-stone-500 text-xs mt-1">
                {settings.tagline} · {settings.address}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-stone-600">
              <button
                onClick={() => setIsHowToOrderOpen(true)}
                className="hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>How to Order</span>
              </button>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp: +{settings.whatsappNumber}</span>
              </a>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-amber-800 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-amber-700"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center text-stone-400 text-[11px]">
            &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved. Automated digital ordering directly connected to WhatsApp.
          </div>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        settings={settings}
        subtotal={cartSubtotal}
        taxAmount={cartTaxAmount}
        total={cartTotal}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onOrderCompleted={(order) => {
          recordOrder(order);
          setIsCartOpen(false);
        }}
      />

      <ItemCustomizeModal
        item={customizingItem}
        settings={settings}
        onClose={() => setCustomizingItem(null)}
        onConfirm={(item, qty, temp, notes) => {
          addToCart(item, qty, temp, notes);
        }}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
        settings={settings}
        orders={orders}
        onUpdateMenuItem={updateMenuItem}
        onAddMenuItem={addMenuItem}
        onDeleteMenuItem={deleteMenuItem}
        onResetMenu={resetMenuToDefault}
        onUpdateSettings={updateSettings}
        onUpdateOrderStatus={updateOrderStatus}
        onDeleteOrder={deleteOrder}
        onClearOrders={clearOrderHistory}
      />

      <HowToOrderModal
        isOpen={isHowToOrderOpen}
        onClose={() => setIsHowToOrderOpen(false)}
        onStartOrder={() => {
          document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <OrderSuccessModal
        order={latestOrder}
        settings={settings}
        onClose={() => setLatestOrder(null)}
        onNewOrder={() => {
          setLatestOrder(null);
          document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}
