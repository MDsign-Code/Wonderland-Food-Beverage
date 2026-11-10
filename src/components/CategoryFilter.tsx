import React from 'react';
import { MenuCategory, CategoryInfo } from '../types/menu';
import { CATEGORIES } from '../data/initialMenu';
import { Utensils, Smile, Sandwich, Soup, Coffee, Sparkles, IceCream, CupSoda } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: MenuCategory;
  onSelectCategory: (category: MenuCategory) => void;
  itemCountsByCategory: Record<MenuCategory, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  itemCountsByCategory,
}) => {
  const getIcon = (catId: MenuCategory) => {
    switch (catId) {
      case 'kids_meal':
        return <Smile className="w-4 h-4 shrink-0" />;
      case 'wraps':
        return <Sandwich className="w-4 h-4 shrink-0" />;
      case 'cup_noodle':
        return <Soup className="w-4 h-4 shrink-0" />;
      case 'coffee':
        return <Coffee className="w-4 h-4 shrink-0" />;
      case 'iced_ade':
        return <Sparkles className="w-4 h-4 shrink-0" />;
      case 'slush':
        return <IceCream className="w-4 h-4 shrink-0" />;
      case 'latte':
        return <CupSoda className="w-4 h-4 shrink-0" />;
      case 'tea':
        return <Coffee className="w-4 h-4 shrink-0" />;
      default:
        return <Utensils className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div className="bg-white border-b border-stone-200 sticky top-18 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            const count = itemCountsByCategory[category.id] || 0;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {getIcon(category.id)}
                <span>{category.name}</span>
                <span
                  className={`text-[11px] tabular-nums px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-amber-750 text-amber-100' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
