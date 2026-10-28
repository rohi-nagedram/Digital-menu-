import React from 'react';
import { ShoppingBag, ArrowDown, Phone, MapPin, Share2, Sparkles, MessageCircle } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface HeroSectionProps {
  config: RestaurantConfig;
  onExploreMenu: () => void;
  onOpenCart: () => void;
  onOpenShare: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onExploreMenu,
  onOpenCart,
  onOpenShare,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0c0c10] via-[#121218] to-[#0c0c10] pt-6 sm:pt-10 pb-10 sm:pb-16 border-b border-zinc-800/80">
      {/* Decorative subtle ambient gold lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#f3df95] tracking-wide uppercase">
              <span className="w-6 h-[1px] bg-[#d4af37]"></span>
              <span>The Dark House Inn · Hyderabad</span>
              <span className="w-6 h-[1px] bg-[#d4af37]"></span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#f5f2eb] tracking-tight leading-[1.15] text-balance">
              Exquisite Flavors, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3df95] to-[#c59b27]">
                Authentic Hyderabadi Taste
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
              Explore our complete digital menu featuring sizzling starters, rich curries, aromatic fried rice, and Hyderabadi specialties. Order directly to your table or home via WhatsApp.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onExploreMenu}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-950 bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#e6ca65] hover:to-[#f3df95] rounded-lg shadow-lg shadow-[#d4af37]/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Browse Menu</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenCart}
                className="px-5 py-2.5 text-sm font-semibold text-[#f5f2eb] bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#d4af37]/50 rounded-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                <span>View Order</span>
              </button>

              <button
                type="button"
                onClick={onOpenShare}
                className="px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900/50 rounded-lg transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Link</span>
              </button>
            </div>

            {/* Verified Contact Details - strictly only if configured by owner */}
            {(config.verifiedPhoneNumber || config.verifiedMapsUrl) && (
              <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                {config.verifiedPhoneNumber && (
                  <a
                    href={`tel:${config.verifiedPhoneNumber}`}
                    className="inline-flex items-center gap-1.5 text-[#f3df95] hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: {config.verifiedPhoneNumber}</span>
                  </a>
                )}
                {config.verifiedMapsUrl && (
                  <a
                    href={config.verifiedMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Get Directions</span>
                  </a>
                )}
              </div>
            )}

            {/* Quick Features Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                Live Verified Pricing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Pure Veg & Non-Veg Options
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Direct WhatsApp Orders
              </span>
            </div>
          </div>

          {/* Right Visual Column: Food Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative gold border */}
              <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl shadow-black/80 bg-zinc-900 group">
                <img
                  src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80"
                  alt="Hyderabadi Fine Dining Specialties at The Dark House Inn"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to secondary high availability culinary asset if needed
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                
                {/* Gradient Scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#f3df95] font-display font-medium text-sm block">
                      Hyderabad Culinary Heritage
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      Sizzling Starters · Gravies · Dum Biryani
                    </span>
                  </div>
                  <div className="bg-[#d4af37] text-zinc-950 px-2.5 py-1 rounded font-semibold text-[11px] shadow">
                    Digital Menu
                  </div>
                </div>
              </div>

              {/* Sub-card: Express WhatsApp Guarantee */}
              <div className="absolute -bottom-4 -right-2 sm:-bottom-5 sm:right-4 bg-zinc-900/95 border border-[#d4af37]/40 rounded-xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#f5f2eb]">Instant WhatsApp Dispatch</div>
                  <div className="text-[10px] text-zinc-400">Itemized bill sent in 1 tap</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
