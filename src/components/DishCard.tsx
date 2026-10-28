import React from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { Dish } from '../types';
import { FoodImage } from './FoodImage';
import { DietaryBadge } from './DietaryBadge';

interface DishCardProps {
  dish: Dish;
  quantityInCart: number;
  onAddToCart: (dish: Dish) => void;
  onUpdateQuantity: (dishId: string, delta: number) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const isPriceConfirmed = dish.price !== null;

  return (
    <div className="group flex flex-col justify-between bg-[#15151d] hover:bg-[#181822] border border-zinc-800/80 hover:border-[#d4af37]/40 rounded-xl overflow-hidden transition-all duration-300 shadow-lg shadow-black/40">
      {/* Top Image & Badge */}
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
          <FoodImage
            src={dish.image}
            alt={dish.name}
            dietary={dish.dietary}
            className="w-full h-full"
            isAlternative={dish.imageIsAlternative}
          />

          {/* Floating Dietary Badge */}
          <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md border border-zinc-700/60 shadow-md">
            <DietaryBadge type={dish.dietary} showText />
          </div>

          {/* Price Tag Overlay for quick scan */}
          <div className="absolute bottom-3 right-3 z-10 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#d4af37]/40 shadow-md">
            {isPriceConfirmed ? (
              <span className="text-sm font-semibold text-[#f3df95] font-mono tabular-nums tracking-tight">
                ₹{dish.price}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-amber-200/90 tracking-tight">
                Price to be confirmed
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-[#f5f2eb] group-hover:text-[#f3df95] transition-colors leading-snug">
              {dish.name}
            </h3>
          </div>

          {/* Verified Description */}
          {dish.description && (
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
              {dish.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 sm:p-5 pt-0 mt-auto">
        <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">Price</span>
            {isPriceConfirmed ? (
              <span className="text-base sm:text-lg font-bold text-[#f3df95] font-mono tabular-nums">
                ₹{dish.price}
              </span>
            ) : (
              <span className="text-xs text-amber-300 font-medium">
                Price to be confirmed
              </span>
            )}
          </div>

          {/* Cart Controls */}
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-1 bg-zinc-900 border border-[#d4af37]/50 rounded-lg p-1 shadow-inner">
              <button
                type="button"
                onClick={() => onUpdateQuantity(dish.id, -1)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-[#d4af37] hover:text-black transition-colors"
                aria-label={`Decrease quantity of ${dish.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-mono tabular-nums text-sm font-semibold text-[#f5f2eb]">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(dish.id, 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-[#d4af37] hover:text-black transition-colors"
                aria-label={`Increase quantity of ${dish.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(dish)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-900 bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#e6ca65] hover:to-[#f3df95] rounded-lg shadow-sm hover:shadow-md hover:shadow-[#d4af37]/20 transition-all duration-200 whitespace-nowrap active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
