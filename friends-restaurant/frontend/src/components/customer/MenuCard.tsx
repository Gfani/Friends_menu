import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types/menu';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Subtle F.R.I.E.N.D.S Signature Dot Color (Red, Blue, Yellow) for category indicator
  const friendsColors = ['#F32636', '#16B9E8', '#FFBD18'];
  const dotColor = friendsColors[index % friendsColors.length];

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) {
      return 'Price on Request';
    }
    return `${price.toLocaleString()} ETB`;
  };

  const isMarketPrice = item.price === null || item.price === undefined;

  // At most ONE special badge: only for Chef's specials / signature dishes
  const isSpecial =
    isMarketPrice ||
    (item.tags &&
      (item.tags.toLowerCase().includes('chef') ||
        item.tags.toLowerCase().includes('signature') ||
        item.tags.toLowerCase().includes('special')));

  const specialLabel = isMarketPrice ? "Chef's Special" : 'House Special';

  // Subtitle category name
  const categoryName = item.category?.name || 'Kitchen Special';

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative rounded-xl border transition-all duration-300 cursor-pointer select-none overflow-hidden ${
        isExpanded
          ? 'bg-[#18181c] border-[#383842] shadow-[0_16px_36px_rgba(0,0,0,0.5)] ring-1 ring-[#FFBD18]/25'
          : isSpecial
          ? 'bg-[#151518] border-[#2c2820] hover:border-[#FFBD18]/50 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.4)]'
          : 'bg-[#151518] border-[#222227] hover:border-[#35353d] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.4)]'
      } ${!item.isAvailable ? 'opacity-60' : ''}`}
    >
      <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
        <div>
          {/* Row 1: Dish Title, Special Tag, and Price + Chevron */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`font-headline text-lg sm:text-[19px] font-semibold text-white tracking-normal leading-snug group-hover:text-[#ffe0aa] transition-colors ${
                    !item.isAvailable ? 'line-through text-[#71717a]' : ''
                  }`}
                >
                  {item.name}
                </h3>

                {/* At most ONE refined badge per item */}
                {isSpecial && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-medium uppercase tracking-[0.12em] bg-[#241e12] border border-[#FFBD18]/35 text-[#FFBD18]">
                    <Sparkles className="w-2.5 h-2.5" />
                    {specialLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Price & Sleek Minimal Chevron */}
            <div className="flex items-center gap-2.5 shrink-0 text-right">
              <span
                className={`font-headline text-base sm:text-lg font-bold tracking-tight whitespace-nowrap ${
                  isMarketPrice
                    ? 'text-[#ffe0aa] text-xs uppercase tracking-wider font-medium'
                    : 'text-[#FFBD18]'
                }`}
              >
                {formatPrice(item.price)}
              </span>

              {/* Minimal rotating chevron icon: no technical "SELECT" or "CLOSE DETAILS" buttons */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[#71717a] group-hover:text-white transition-transform duration-300 ${
                  isExpanded ? 'rotate-180 text-[#FFBD18]' : ''
                }`}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Row 2: Clean, legible description with breathing room */}
          {item.description ? (
            <p
              className={`font-body text-xs sm:text-[13px] text-[#9a9aa2] leading-relaxed transition-all ${
                isExpanded ? 'text-[#c8c0b5] mt-2' : 'line-clamp-2'
              }`}
            >
              {item.description}
            </p>
          ) : (
            <p className="font-body text-xs text-[#71717a] italic">
              Crafted fresh daily with house-made stock and seasonal herbs.
            </p>
          )}

          {/* EDITORIAL EXPANDED VIEW: Pristine rounded image with typography below (No badge clutter!) */}
          {isExpanded && (
            <div className="mt-4 pt-3 border-t border-[#26262d] animate-in fade-in duration-200 space-y-3">
              {/* Clean, un-cluttered food photography */}
              {item.image && !imgError && (
                <div className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#26262d] shadow-md group/img">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                </div>
              )}

              {/* High-contrast typography & availability indicator */}
              <div className="flex items-center justify-between text-xs pt-1 text-[#8e8e96]">
                <span className="font-sans text-[11px] uppercase tracking-[0.15em]">
                  {categoryName} &bull; Made Fresh To Order
                </span>

                {!item.isAvailable && (
                  <span className="font-sans text-[11px] uppercase tracking-[0.15em] font-semibold text-[#F32636]">
                    Currently Sold Out
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Row 3: Sophisticated Category Subtitle Footer (Clean uppercase tracking) */}
        <div className="mt-4 pt-3.5 border-t border-[#202025] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Elegant single Friends accent dot */}
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: dotColor,
                boxShadow: `0 0 6px ${dotColor}80`,
              }}
            />
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#8e8e96] font-medium">
              {categoryName}
            </span>
          </div>

          <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#63636b]">
            Mereba Kitchen
          </span>
        </div>
      </div>
    </div>
  );
};
