import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, QrCode } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, config }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://thedarkhouseinn.menu';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${config.name} - Digital Menu`,
          text: `Explore the digital menu of ${config.name}, ${config.city} and order easily on WhatsApp!`,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopy();
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🍽️ View the digital menu of *${config.name}, ${config.city}* and order dishes directly on WhatsApp:\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121218] border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-[#f5f2eb] relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-3">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#f5f2eb]">
            Share Digital Menu
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Share this link with customers, print on table QR standees, or paste into your Google Maps profile!
          </p>
        </div>

        {/* Copy Link Field */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-1.5 bg-transparent text-xs text-zinc-300 font-mono focus:outline-none truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-[#d4af37] text-zinc-950 font-semibold text-xs rounded-lg hover:bg-[#e6ca65] transition-colors flex items-center gap-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#d4af37]" />
              <span>Native Share</span>
            </button>
          </div>

          {/* Table Standee Hint */}
          <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 text-center flex items-center justify-center gap-2">
            <QrCode className="w-4 h-4 text-[#d4af37]" />
            <span>Perfect for Dine-In table standees & WhatsApp status</span>
          </div>
        </div>
      </div>
    </div>
  );
};
