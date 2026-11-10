import React from 'react';
import { Utensils, Wine } from 'lucide-react';
import { Category } from '../../types/menu';
import { Language, translations, translateCategory } from '../../i18n/translations';

interface CategoryTabsProps {
  categories: Category[];
  activeParent: 'FOOD' | 'DRINKS';
  onSelectParent: (parent: 'FOOD' | 'DRINKS') => void;
  activeCategory: string; // 'all' or category.id
  onSelectCategory: (id: string) => void;
  totalFoodCount: number;
  totalDrinkCount: number;
  currentLang?: Language;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeParent,
  onSelectParent,
  activeCategory,
  onSelectCategory,
  totalFoodCount,
  totalDrinkCount,
  currentLang = 'en',
}) => {
  const t = translations[currentLang];

  // Filter subcategories for the active parent department
  const currentSubCategories = categories.filter((cat) => {
    const parent = cat.parentCategory || 'FOOD';
    return parent === activeParent;
  });

  return (
    <div className="w-full flex flex-col items-center gap-3.5">
      {/* 1. Primary Department Switcher: FOOD vs DRINKS */}
      <div className="inline-flex items-center p-1.5 rounded-full bg-[#121212] border border-[#262626] shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
        <button
          type="button"
          onClick={() => {
            onSelectParent('FOOD');
            onSelectCategory('all');
          }}
          className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full font-headline text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
            activeParent === 'FOOD'
              ? 'bg-[#FFBD18] text-black shadow-[0_0_20px_rgba(255,189,24,0.4)] scale-102'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>{t.food} ({totalFoodCount})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSelectParent('DRINKS');
            onSelectCategory('all');
          }}
          className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full font-headline text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
            activeParent === 'DRINKS'
              ? 'bg-[#FFBD18] text-black shadow-[0_0_20px_rgba(255,189,24,0.4)] scale-102'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Wine className="w-4 h-4" />
          <span>{t.drinks} ({totalDrinkCount})</span>
        </button>
      </div>

      {/* 2. Subcategory Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 pt-1 no-scrollbar select-none justify-start sm:justify-center w-full px-2">
        {/* 'All' in this department */}
        <button
          onClick={() => onSelectCategory('all')}
          type="button"
          className={`px-4 sm:px-5 py-2 rounded-full font-headline text-xs uppercase tracking-wider font-bold transition-all duration-200 shrink-0 cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.25)]'
              : 'bg-[#141414] text-[#A1A1AA] hover:text-white hover:bg-[#1f1f1f] border border-[#222222]'
          }`}
        >
          <span>{activeParent === 'FOOD' ? t.allFood : t.allDrinks}</span>
        </button>

        {/* Dynamic subcategories with localization */}
        {currentSubCategories.map((category) => {
          const isActive = activeCategory === category.id;
          const translatedName = translateCategory(category.name, currentLang);

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              type="button"
              className={`px-4 sm:px-5 py-2 rounded-full font-headline text-xs uppercase tracking-wider font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                  : 'bg-[#141414] text-[#A1A1AA] hover:text-white hover:bg-[#1f1f1f] border border-[#222222]'
              }`}
            >
              <span>{translatedName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
