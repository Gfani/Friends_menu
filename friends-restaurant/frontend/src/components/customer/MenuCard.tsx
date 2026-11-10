import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { api } from '../../api/client';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

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
      className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden flex flex-col justify-between ${
        isExpanded
          ? 'bg-[#181818] border-[#333333] shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
          : 'bg-[#121212] border-[#222222] hover:border-[#333333] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
      } ${!item.isAvailable ? 'opacity-50' : ''}`}
    >
      <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
        <div>
          {/* Main Dish Row: Compact Thumbnail + Title & Price */}
          <div className="flex items-start gap-4">
            {/* Dish Thumbnail */}
            {item.image && !imgError && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#222222] bg-[#080808] group-hover:border-[#333333] transition-all duration-300">
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
                    className={`font-headline text-base sm:text-lg font-bold text-white tracking-normal leading-snug group-hover:text-white transition-colors truncate ${
                      !item.isAvailable ? 'line-through text-[#71717A]' : ''
                    }`}
                  >
                    {item.name}
                  </h3>

                  {/* Clean Minimal Special Pill Badge (Monochrome) */}
                  {isSpecial && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-[0.12em] bg-white/5 border border-white/10 text-[#d4d4d8]">
                      <Sparkles className="w-2.5 h-2.5 text-zinc-400" />
                      {specialLabel}
                    </span>
                  )}
                </div>

                {/* Price Tag & Sleek Chevron */}
                <div className="flex items-center gap-2 shrink-0 text-right">
                  <span
                    className={`font-headline text-sm sm:text-base font-bold font-mono tracking-tight whitespace-nowrap ${
                      isMarketPrice
                        ? 'text-[#A1A1AA] text-xs uppercase tracking-wider font-medium'
                        : 'text-[#FFBD18]'
                    }`}
                  >
                    {formatPrice(item.price)}
                  </span>

                  {/* Subtle rotating minimal chevron */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[#71717A] group-hover:text-white transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-white' : ''
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
                  className={`font-body text-xs text-[#A1A1AA] leading-relaxed mt-2 transition-all ${
                    isExpanded ? 'text-zinc-200' : 'line-clamp-2'
                  }`}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>

          {/* EDITORIAL EXPANDED VIEW: Pristine Full Hero Photo & Description */}
          {isExpanded && (
            <div className="mt-5 pt-4 border-t border-[#222222] animate-in fade-in duration-200 space-y-3.5">
              {/* Full Clean Food Photography */}
              {item.image && !imgError && (
                <div className="relative w-full h-48 sm:h-60 rounded-xl overflow-hidden bg-[#080808] border border-[#222222] group/img">
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
              <div className="flex items-center justify-between text-xs pt-1 text-[#A1A1AA]">
                <span className="font-sans text-[11px] uppercase tracking-[0.14em]">
                  {categoryName} &bull; Prepared Fresh To Order
                </span>

                {!item.isAvailable && (
                  <span className="font-sans text-[11px] uppercase tracking-[0.14em] font-semibold text-zinc-400">
                    Currently Unavailable
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Row 3: SLEEK MONOCHROME PILL BADGES */}
        <div className="mt-4 pt-3.5 border-t border-[#1c1c1c] flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Clean luxury category pill */}
            <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] font-semibold bg-[#1a1a1a] text-[#d4d4d8] border border-[#2a2a2a]">
              {categoryName}
            </span>

            {/* Unavailable badge */}
            {!item.isAvailable && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider font-semibold border bg-white/5 text-zinc-400 border-white/10">
                Sold Out
              </span>
            )}
          </div>

          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#71717A] font-medium">
            Mereba Bistro
          </span>
        </div>
      </div>
    </div>
  );
};
