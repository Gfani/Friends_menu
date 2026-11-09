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
  totalItemCount,
}) => {
  // Signature F.R.I.E.N.D.S dots: Red, Blue, Yellow
  const friendsPalette = [
    { color: '#F32636', glow: 'shadow-[0_0_10px_rgba(243,38,54,0.6)]' },
    { color: '#16B9E8', glow: 'shadow-[0_0_10px_rgba(22,185,232,0.6)]' },
    { color: '#FFBD18', glow: 'shadow-[0_0_10px_rgba(255,189,24,0.6)]' },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar select-none justify-start sm:justify-center">
      {/* 'All' Tab - Exact match to Screenshot 2: Solid yellow rectangular pill */}
      <button
        onClick={() => onSelectCategory('all')}
        type="button"
        className={`px-5 sm:px-6 py-2.5 rounded-sm font-headline text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer ${
          activeCategory === 'all'
            ? 'bg-[#FFBD18] text-black shadow-[0_0_18px_rgba(255,189,24,0.45)] scale-[1.02]'
            : 'bg-[#222226] text-[#ffe0aa] hover:bg-[#2b2b30] hover:text-white border border-[#333338]/60'
        }`}
      >
        <span>All</span>
      </button>

      {/* Dynamic Category Tabs: Pasta, Rice, Salad, Soup */}
      {categories.map((category, idx) => {
        const isActive = activeCategory === category.id;
        const palette = friendsPalette[idx % friendsPalette.length];

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            type="button"
            className={`px-4 sm:px-5 py-2.5 rounded-sm font-headline text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-[#FFBD18] text-black shadow-[0_0_18px_rgba(255,189,24,0.45)] scale-[1.02]'
                : 'bg-[#222226] text-[#ffe0aa] hover:bg-[#2b2b30] hover:text-white border border-[#333338]/60'
            }`}
          >
            {/* Friends colored dot */}
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block transition-transform duration-200 ${
                isActive ? 'scale-125' : ''
              }`}
              style={{
                backgroundColor: isActive ? '#000000' : palette.color,
              }}
            />
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};
