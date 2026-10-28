import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { DietaryType } from '../types';

interface FoodImageProps {
  src: string;
  alt: string;
  dietary: DietaryType;
  className?: string;
  isAlternative?: boolean;
}

// Category-authentic high-reliability fallback photographs
const FALLBACK_PHOTOS: Record<DietaryType, string> = {
  veg: '/dishes/vc-3.jpg',
  egg: '/dishes/es-2.jpg',
  'non-veg': '/dishes/by-1.jpg',
};

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  alt,
  dietary,
  className = '',
  isAlternative = false,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [usedFallbackPhoto, setUsedFallbackPhoto] = useState(false);
  const [allImagesFailed, setAllImagesFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    setCurrentSrc(src);
    setUsedFallbackPhoto(false);
    setAllImagesFailed(false);
  }, [src]);

  // Gradient accents based on dietary type for final fallback container
  const dietaryAccent =
    dietary === 'veg'
      ? 'from-emerald-950/60 to-zinc-900'
      : dietary === 'egg'
      ? 'from-amber-950/60 to-zinc-900'
      : 'from-rose-950/60 to-zinc-900';

  const badgeColor =
    dietary === 'veg'
      ? 'border-emerald-500 text-emerald-400'
      : dietary === 'egg'
      ? 'border-amber-500 text-amber-400'
      : 'border-rose-500 text-rose-400';

  const handleImageError = () => {
    if (!usedFallbackPhoto && FALLBACK_PHOTOS[dietary] && currentSrc !== FALLBACK_PHOTOS[dietary]) {
      // First fallback: Switch to verified authentic category food photo
      setUsedFallbackPhoto(true);
      setCurrentSrc(FALLBACK_PHOTOS[dietary]);
    } else {
      // Final fallback: styled decorative culinary container (zero broken image icon)
      setAllImagesFailed(true);
    }
  };

  if (allImagesFailed || !currentSrc) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${dietaryAccent} border border-zinc-800/80 p-4 text-center overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="relative z-10 p-3 rounded-full bg-zinc-900/90 border border-zinc-700/60 text-amber-300/80 mb-2 shadow-inner">
          <Utensils className="w-5 h-5" />
        </div>
        <span className="relative z-10 text-xs font-medium text-zinc-300 line-clamp-1 px-2 font-display">
          {alt}
        </span>
        <span className={`relative z-10 text-[10px] mt-1 tracking-wider uppercase ${badgeColor}`}>
          Authentic Hyderabadi Specialty
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
          <Utensils className="w-6 h-6 text-zinc-700" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Subtle indicator if alternative photo is flagged for review */}
      {isAlternative && (
        <div className="absolute bottom-1.5 left-1.5 z-10 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] text-amber-300/90 border border-amber-500/30">
          Chef Reference
        </div>
      )}
    </div>
  );
};
