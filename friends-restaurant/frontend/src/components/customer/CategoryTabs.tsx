import React from 'react';
import { Category } from '../../types/menu';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string; // 'all' or category.id
  onSelectCategory: (id: string) => void;
  totalItemCount: number;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar select-none justify-start sm:justify-center">
      {/* 'All' Tab */}
      <button
        onClick={() => onSelectCategory('all')}
        type="button"
        className={`px-5 sm:px-6 py-2.5 rounded-full font-headline text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer ${
          activeCategory === 'all'
            ? 'bg-[#FFBD18] text-black shadow-[0_0_15px_rgba(255,189,24,0.3)]'
            : 'bg-[#121212] text-[#A1A1AA] hover:text-white hover:bg-[#1a1a1a] border border-[#222222]'
        }`}
      >
        <span>All</span>
      </button>

      {/* Dynamic Category Tabs: Pasta, Rice, Salad, Soup */}
      {categories.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            type="button"
            className={`px-5 sm:px-6 py-2.5 rounded-full font-headline text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#FFBD18] text-black shadow-[0_0_15px_rgba(255,189,24,0.3)]'
                : 'bg-[#121212] text-[#A1A1AA] hover:text-white hover:bg-[#1a1a1a] border border-[#222222]'
            }`}
          >
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};
