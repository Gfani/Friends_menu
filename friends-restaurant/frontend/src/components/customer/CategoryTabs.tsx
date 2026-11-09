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
  return (
    <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar">
      {/* 'All' Tab */}
      <button
        onClick={() => onSelectCategory('all')}
        className={`shrink-0 px-4 py-2 rounded font-headline text-xs uppercase tracking-widest transition-all ${
          activeCategory === 'all'
            ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
            : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
        }`}
      >
        <span>All ({totalItemCount})</span>
      </button>

      {/* Dynamic Category Tabs */}
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        const itemCount = category.items ? category.items.length : category._count?.items ?? 0;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`shrink-0 px-4 py-2 rounded font-headline text-xs uppercase tracking-widest transition-all ${
              isActive
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            <span>{category.name}</span>
            {itemCount > 0 && <span className="opacity-75 font-mono ml-1.5">({itemCount})</span>}
          </button>
        );
      })}
    </div>
  );
};
