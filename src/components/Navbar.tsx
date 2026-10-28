import React from 'react';
import { ShoppingBag, Share2, Settings, Sparkles } from 'lucide-react';

interface NavbarProps {
  totalCartItems: number;
  onOpenCart: () => void;
  onOpenShare: () => void;
  onOpenOwnerModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalCartItems,
  onOpenCart,
  onOpenShare,
  onOpenOwnerModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0c10]/95 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex flex-col">
            <span className="font-brand text-base sm:text-lg lg:text-xl font-bold tracking-wider text-[#f5f2eb] flex items-center gap-2">
              <span className="text-[#d4af37]">THE DARK HOUSE INN</span>
            </span>
            <span className="text-[10px] sm:text-xs text-[#d4af37]/80 tracking-widest uppercase font-medium">
              Hyderabad · Dining & Express Ordering
            </span>
          </a>
        </div>

        {/* Zone 2: Concise navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <a
            href="#menu-section"
            className="hover:text-[#f3df95] transition-colors whitespace-nowrap shrink-0"
          >
            Digital Menu
          </a>
          <a
            href="#starters"
            className="hover:text-[#f3df95] transition-colors whitespace-nowrap shrink-0"
          >
            Starters
          </a>
          <a
            href="#curries"
            className="hover:text-[#f3df95] transition-colors whitespace-nowrap shrink-0"
          >
            Curries & Biryani
          </a>
          <a
            href="#about-section"
            className="hover:text-[#f3df95] transition-colors whitespace-nowrap shrink-0"
          >
            Restaurant Info
          </a>
        </nav>

        {/* Zone 3: Primary Actions (Share + Owner Portal + Cart Trigger) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Share branded link */}
          <button
            type="button"
            onClick={onOpenShare}
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
            title="Share Menu Link"
            aria-label="Share branded menu link"
          >
            <Share2 className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Owner Menu Management */}
          <button
            type="button"
            onClick={onOpenOwnerModal}
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-zinc-300 hover:text-[#f3df95] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
            title="Owner Menu Management & Setup"
            aria-label="Owner Menu Management"
          >
            <Settings className="w-4 h-4 text-zinc-400 group-hover:text-[#d4af37]" />
            <span className="hidden sm:inline">Owner Edit</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#e6ca65] hover:to-[#f3df95] rounded-lg transition-all flex items-center gap-2 shadow-sm shadow-[#d4af37]/20 active:scale-95"
            aria-label={`View Cart with ${totalCartItems} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalCartItems > 0 && (
              <span className="px-1.5 py-0.5 text-[11px] font-bold bg-black text-[#f3df95] rounded-full font-mono tabular-nums">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
