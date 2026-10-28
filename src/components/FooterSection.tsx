import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Heart } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface FooterSectionProps {
  config: RestaurantConfig;
  onOpenOwnerModal: () => void;
  onOpenShare: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  config,
  onOpenOwnerModal,
  onOpenShare,
}) => {
  return (
    <footer id="about-section" className="bg-[#08080b] border-t border-zinc-800/80 pt-12 pb-20 md:pb-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-zinc-800/80">
          
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="font-brand text-lg font-bold text-[#f5f2eb] tracking-wider">
              <span className="text-[#d4af37]">THE DARK HOUSE INN</span>
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Hyderabad's premium destination for authentic royal starters, aromatic dum biryani, and rich Indian gravies. Order online directly via WhatsApp for quick dine-in or takeaway.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#f3df95]/90 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>FSSAI Compliant · Pure Veg & Halal Non-Veg</span>
            </div>
          </div>

          {/* Restaurant Quick Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Hours & Service
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Open Daily: 11:30 AM – 11:30 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{config.addressDetails || 'Hyderabad, Telangana, India'}</span>
              </li>
              {config.verifiedPhoneNumber && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <a href={`tel:${config.verifiedPhoneNumber}`} className="hover:text-white">
                    {config.verifiedPhoneNumber}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#menu-section" className="hover:text-[#f3df95] transition-colors">
                  Digital Menu & Categories
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenShare}
                  className="hover:text-[#f3df95] transition-colors text-left"
                >
                  Share Menu Link with Friends
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenOwnerModal}
                  className="hover:text-[#f3df95] transition-colors text-left text-zinc-400"
                >
                  Restaurant Owner Setup & Edit
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Quiet copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} The Dark House Inn Restaurant, Hyderabad. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span>Prices inclusive of applicable taxes</span>
            <span>·</span>
            <span>Made for Hyderabad Foodies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
