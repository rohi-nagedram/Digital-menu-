import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface MobileCartBarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
}

export const MobileCartBar: React.FC<MobileCartBarProps> = ({ cartItems, onOpenCart }) => {
  if (cartItems.length === 0) return null;

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  let confirmedTotal = 0;
  let unconfirmedCount = 0;

  cartItems.forEach((item) => {
    if (item.dish.price !== null) {
      confirmedTotal += item.dish.price * item.quantity;
    } else {
      unconfirmedCount += item.quantity;
    }
  });

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 max-h-[14vh] transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="bg-[#121218]/95 backdrop-blur-md border border-[#d4af37]/60 rounded-xl px-4 py-2.5 shadow-2xl shadow-black flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-zinc-950 flex items-center justify-center shrink-0 font-bold text-xs">
            {totalCount}
          </div>
          <div className="min-w-0">
            <div className="text-xs text-zinc-400">Order Subtotal</div>
            <div className="text-sm font-bold text-[#f3df95] font-mono tabular-nums leading-none flex items-center gap-1">
              <span>₹{confirmedTotal}</span>
              {unconfirmedCount > 0 && (
                <span className="text-[10px] text-amber-300 font-normal truncate">
                  (+{unconfirmedCount} TBC)
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCart}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#e6ca65] hover:to-[#f3df95] transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
        >
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
