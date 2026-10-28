import React from 'react';
import { DietaryType } from '../types';

interface DietaryBadgeProps {
  type: DietaryType;
  showText?: boolean;
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ type, showText = false }) => {
  if (type === 'veg') {
    return (
      <div className="inline-flex items-center gap-1.5" title="Pure Vegetarian">
        <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-emerald-500 flex items-center justify-center bg-emerald-950/20 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        {showText && <span className="text-xs font-medium text-emerald-400">Pure Veg</span>}
      </div>
    );
  }

  if (type === 'egg') {
    return (
      <div className="inline-flex items-center gap-1.5" title="Contains Egg">
        <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-amber-500 flex items-center justify-center bg-amber-950/20 shrink-0">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
        {showText && <span className="text-xs font-medium text-amber-400">Contains Egg</span>}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5" title="Non-Vegetarian">
      <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-rose-600 flex items-center justify-center bg-rose-950/20 shrink-0">
        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-rose-600" />
      </div>
      {showText && <span className="text-xs font-medium text-rose-400">Non-Veg</span>}
    </div>
  );
};
