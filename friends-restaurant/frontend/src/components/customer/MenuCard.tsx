import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { api } from '../../api/client';
import { useTheme } from '../../context/ThemeContext';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  let isLightMode = false;
  try {
    const themeContext = useTheme();
    isLightMode = themeContext.isLightMode;
  } catch {
    // Fallback if rendered outside ThemeProvider
  }

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) {
      return 'Price on Request';
    }
    return `${price.toLocaleString()} ETB`;
  };

  const isMarketPrice = item.price === null || item.price === undefined;

  // Subtle special indicator for signature dishes
  const isSpecial =
    isMarketPrice ||
    (item.tags &&
      (item.tags.toLowerCase().includes('chef') ||
        item.tags.toLowerCase().includes('signature') ||
        item.tags.toLowerCase().includes('special')));

  const specialLabel = isMarketPrice ? "Chef's Special" : 'House Special';
  const categoryName = item.category?.name || 'Artisan Selection';

  const handleToggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState) {
      api.trackEvent({
        type: 'ITEM_VIEW',
        itemId: item.id,
        itemName: item.name,
      }).catch(() => {});
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden h-auto ${
        isLightMode
          ? isExpanded
            ? 'bg-white border-zinc-300 shadow-[0_16px_36px_rgba(0,0,0,0.12)]'
            : 'bg-white border-zinc-200 hover:border-zinc-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] shadow-sm'
          : isExpanded
            ? 'bg-[#181818] border-[#333333] shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
            : 'bg-[#121212] border-[#222222] hover:border-[#333333] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
      } ${!item.isAvailable ? 'opacity-50' : ''}`}
    >
      <div className="p-4 sm:p-5 flex flex-col h-auto">
        <div>
          {/* Main Dish Row: Compact Thumbnail + Title & Price */}
          <div className="flex items-start gap-3.5 sm:gap-4">
            {/* Dish Thumbnail */}
            {item.image && !imgError && (
              <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border transition-all duration-300 ${
                isLightMode
                  ? 'border-zinc-200 bg-zinc-100 group-hover:border-zinc-300 shadow-sm'
                  : 'border-[#222222] bg-[#080808] group-hover:border-[#333333] shadow-md'
              }`}>
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Title, Special Tag, and Price */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 pr-1">
                  <h3
                    className={`font-headline text-base sm:text-lg font-bold tracking-normal leading-snug transition-colors truncate ${
                      isLightMode
                        ? 'text-zinc-900 group-hover:text-black'
                        : 'text-white group-hover:text-white'
                    } ${!item.isAvailable ? 'line-through text-zinc-400' : ''}`}
                  >
                    {item.name}
                  </h3>

                  {/* Clean Minimal Special Pill Badge */}
                  {isSpecial && (
                    <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-[0.12em] ${
                      isLightMode
                        ? 'bg-amber-50 border border-amber-200 text-amber-900'
                        : 'bg-white/5 border border-white/10 text-[#d4d4d8]'
                    }`}>
                      <Sparkles className={`w-2.5 h-2.5 ${isLightMode ? 'text-amber-600' : 'text-zinc-400'}`} />
                      {specialLabel}
                    </span>
                  )}
                </div>

                {/* Price Tag & Sleek Chevron */}
                <div className="flex items-center gap-1.5 shrink-0 text-right">
                  <span
                    className={`font-headline text-sm sm:text-base font-bold font-mono tracking-tight whitespace-nowrap ${
                      isMarketPrice
                        ? isLightMode
                          ? 'text-zinc-500 text-xs uppercase tracking-wider font-medium'
                          : 'text-[#A1A1AA] text-xs uppercase tracking-wider font-medium'
                        : isLightMode
                          ? 'text-amber-600'
                          : 'text-[#FFBD18]'
                    }`}
                  >
                    {formatPrice(item.price)}
                  </span>

                  {/* Subtle rotating minimal chevron */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      isLightMode
                        ? isExpanded ? 'rotate-180 text-black' : 'text-zinc-500 group-hover:text-black'
                        : isExpanded ? 'rotate-180 text-white' : 'text-[#71717A] group-hover:text-white'
                    }`}
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Description preview */}
              {item.description && (
                <p
                  className={`font-body text-xs leading-relaxed mt-1.5 transition-all ${
                    isLightMode
                      ? isExpanded ? 'text-zinc-800' : 'text-zinc-600 line-clamp-2'
                      : isExpanded ? 'text-zinc-200' : 'text-[#A1A1AA] line-clamp-2'
                  }`}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>

          {/* EDITORIAL EXPANDED VIEW: Pristine Full Hero Photo & Description */}
          {isExpanded && (
            <div className={`mt-4 pt-3.5 border-t animate-in fade-in duration-200 space-y-3 ${
              isLightMode ? 'border-zinc-200' : 'border-[#222222]'
            }`}>
              {/* Full Clean Food Photography */}
              {item.image && !imgError && (
                <div className={`relative w-full h-44 sm:h-56 rounded-xl overflow-hidden border group/img ${
                  isLightMode ? 'bg-zinc-100 border-zinc-200' : 'bg-[#080808] border-[#222222]'
                }`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                </div>
              )}

              {/* Preparation note & In-stock status */}
              <div className={`flex items-center justify-between text-xs pt-1 ${
                isLightMode ? 'text-zinc-500' : 'text-[#A1A1AA]'
              }`}>
                <span className="font-sans text-[11px] uppercase tracking-[0.14em]">
                  {categoryName} &bull; Prepared Fresh To Order
                </span>

                {!item.isAvailable && (
                  <span className={`font-sans text-[11px] uppercase tracking-[0.14em] font-semibold ${
                    isLightMode ? 'text-zinc-400' : 'text-zinc-400'
                  }`}>
                    Currently Unavailable
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Row 3: SLEEK PILL BADGES */}
        <div className={`mt-3 pt-2.5 border-t flex items-center justify-between ${
          isLightMode ? 'border-zinc-200' : 'border-[#1f1f1f]'
        }`}>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Clean category pill */}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-[0.12em] font-semibold border ${
              isLightMode
                ? 'bg-zinc-100 text-zinc-800 border-zinc-300'
                : 'bg-[#1a1a1a] text-[#d4d4d8] border-[#2a2a2a]'
            }`}>
              {categoryName}
            </span>

            {/* Unavailable badge */}
            {!item.isAvailable && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider font-semibold border ${
                isLightMode ? 'bg-zinc-200 text-zinc-600 border-zinc-300' : 'bg-white/5 text-zinc-400 border-white/10'
              }`}>
                Sold Out
              </span>
            )}
          </div>

          <span className={`font-sans text-[10px] uppercase tracking-[0.14em] font-medium ${
            isLightMode ? 'text-zinc-500' : 'text-[#71717A]'
          }`}>
            Mereba Bistro
          </span>
        </div>
      </div>
    </div>
  );
};
