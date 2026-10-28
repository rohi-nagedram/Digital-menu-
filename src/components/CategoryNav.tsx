import React from 'react';
import { Category } from '../types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  categoryItemCounts: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryItemCounts,
}) => {
  return (
    <div className="sticky top-16 z-30 bg-[#0c0c10]/95 backdrop-blur-md border-b border-zinc-800/80 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {/* "All Dishes" Option */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedCategoryId === 'all'
                ? 'bg-[#d4af37] text-zinc-950 font-semibold shadow-sm shadow-[#d4af37]/20'
                : 'text-zinc-400 hover:text-[#f5f2eb] hover:bg-zinc-800/80'
            }`}
          >
            <span>All Categories</span>
          </button>

          {/* Individual Category Tabs */}
          {categories.map((cat) => {
            const count = categoryItemCounts[cat.id] || 0;
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#d4af37] text-zinc-950 font-semibold shadow-sm shadow-[#d4af37]/20'
                    : 'text-zinc-400 hover:text-[#f5f2eb] hover:bg-zinc-800/80'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-black/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
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
