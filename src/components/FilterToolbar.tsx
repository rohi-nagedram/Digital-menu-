import React from 'react';
import { Search, X, Check, Filter } from 'lucide-react';
import { DietaryType } from '../types';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDietary: 'all' | DietaryType;
  onDietaryChange: (type: 'all' | DietaryType) => void;
  priceFilter: 'all' | 'confirmed' | 'unconfirmed';
  onPriceFilterChange: (filter: 'all' | 'confirmed' | 'unconfirmed') => void;
  totalVisibleDishes: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDietary,
  onDietaryChange,
  priceFilter,
  onPriceFilterChange,
  totalVisibleDishes,
  onResetFilters,
  isFiltered,
}) => {
  return (
    <div className="py-4 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dish (e.g. Majestic, Biryani, Chilli, Kaju)..."
            className="w-full pl-10 pr-9 py-2 bg-[#15151e] border border-zinc-800 focus:border-[#d4af37] rounded-lg text-sm text-[#f5f2eb] placeholder-zinc-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dietary Filters: Clean Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => onDietaryChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              selectedDietary === 'all'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800/50'
            }`}
          >
            All Diets
          </button>

          <button
            type="button"
            onClick={() => onDietaryChange('veg')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedDietary === 'veg'
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/60 shadow-sm'
                : 'text-zinc-400 hover:text-emerald-300 bg-zinc-900/60 hover:bg-zinc-800/50'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-[2px] border border-emerald-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            <span>Pure Veg</span>
          </button>

          <button
            type="button"
            onClick={() => onDietaryChange('egg')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedDietary === 'egg'
                ? 'bg-amber-950/70 text-amber-300 border border-amber-500/60 shadow-sm'
                : 'text-zinc-400 hover:text-amber-300 bg-zinc-900/60 hover:bg-zinc-800/50'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-[2px] border border-amber-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </span>
            <span>Egg</span>
          </button>

          <button
            type="button"
            onClick={() => onDietaryChange('non-veg')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedDietary === 'non-veg'
                ? 'bg-rose-950/70 text-rose-300 border border-rose-600/60 shadow-sm'
                : 'text-zinc-400 hover:text-rose-300 bg-zinc-900/60 hover:bg-zinc-800/50'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-[2px] border border-rose-600 flex items-center justify-center">
              <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-rose-600" />
            </span>
            <span>Non-Veg</span>
          </button>
        </div>
      </div>

      {/* Meta Filter Info bar */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
        <div className="flex items-center gap-2">
          <span>Showing <strong className="text-[#f5f2eb] font-mono">{totalVisibleDishes}</strong> items</span>
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[#f3df95] hover:underline flex items-center gap-1 ml-2"
            >
              <X className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Quick price status toggle */}
        <div className="flex items-center gap-2">
          <label className="text-zinc-500 hidden sm:inline">Price status:</label>
          <select
            value={priceFilter}
            onChange={(e) => onPriceFilterChange(e.target.value as any)}
            className="bg-[#15151e] border border-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]"
          >
            <option value="all">All Prices</option>
            <option value="confirmed">Confirmed Only</option>
            <option value="unconfirmed">Awaiting Price Confirmation</option>
          </select>
        </div>
      </div>
    </div>
  );
};
