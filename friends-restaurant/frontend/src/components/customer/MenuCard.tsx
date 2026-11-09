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
  const categoryLower = categoryName.toLowerCase();

  // Modern background-tinted pill badge styling based on category
  const getCategoryBadgeStyle = () => {
    if (categoryLower.includes('pasta')) {
      return 'bg-[#F32636]/10 text-[#ff808b] border-[#F32636]/25';
    }
    if (categoryLower.includes('rice')) {
      return 'bg-[#16B9E8]/10 text-[#5cd5fa] border-[#16B9E8]/25';
    }
    if (categoryLower.includes('salad')) {
      return 'bg-[#10b981]/10 text-[#6ee7b7] border-[#10b981]/25';
    }
    if (categoryLower.includes('soup')) {
      return 'bg-[#FFBD18]/10 text-[#FFBD18] border-[#FFBD18]/25';
    }
    return 'bg-[#26262e]/70 text-[#d4c4ac] border-white/10';
  };

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative rounded-xl border transition-all duration-300 cursor-pointer select-none overflow-hidden flex flex-col justify-between ${
        isExpanded
          ? 'bg-[#18181c] border-[#383842] shadow-[0_16px_36px_rgba(0,0,0,0.55)] ring-1 ring-[#FFBD18]/25'
          : isSpecial
          ? 'bg-[#151518] border-[#2d2820] hover:border-[#FFBD18]/50 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.4)]'
          : 'bg-[#151518] border-[#222227] hover:border-[#35353d] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.4)]'
      } ${!item.isAvailable ? 'opacity-60' : ''}`}
    >
      <div className="p-4 sm:p-5 flex flex-col justify-between h-full">
        <div>
          {/* Main Dish Row: High-resolution Thumbnail + Title & Price */}
          <div className="flex items-start gap-3.5 sm:gap-4">
            {/* 1. COMPACT DISH THUMBNAIL (Rounded Square, High-Res, Visually Mouthwatering) */}
            {item.image && !imgError && (
              <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden shrink-0 border border-[#2b2b34] bg-[#0c0c0e] shadow-md group-hover:border-[#FFBD18]/45 transition-all duration-300">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            )}

            {/* Title, Special Tag, and Price */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 pr-1">
                  <h3
                    className={`font-headline text-base sm:text-lg font-semibold text-white tracking-normal leading-snug group-hover:text-[#ffe0aa] transition-colors truncate ${
                      !item.isAvailable ? 'line-through text-[#71717a]' : ''
                    }`}
                  >
                    {item.name}
                  </h3>

                  {/* Translucent House/Chef Special Pill Badge */}
                  {isSpecial && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-[0.1em] bg-[#FFBD18]/15 border border-[#FFBD18]/30 text-[#FFBD18]">
                      <Sparkles className="w-2.5 h-2.5" />
                      {specialLabel}
                    </span>
                  )}
                </div>

                {/* Price Tag & Sleek Chevron */}
                <div className="flex items-center gap-2 shrink-0 text-right">
                  <span
                    className={`font-headline text-sm sm:text-base font-bold tracking-tight whitespace-nowrap ${
                      isMarketPrice
                        ? 'text-[#ffe0aa] text-xs uppercase tracking-wider font-medium'
                        : 'text-[#FFBD18]'
                    }`}
                  >
                    {formatPrice(item.price)}
                  </span>

                  {/* Subtle rotating minimal chevron */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[#71717a] group-hover:text-white transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-[#FFBD18]' : ''
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
                  className={`font-body text-xs text-[#9a9aa2] leading-relaxed mt-1.5 transition-all ${
                    isExpanded ? 'text-[#c8c0b5]' : 'line-clamp-2'
                  }`}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>

          {/* EDITORIAL EXPANDED VIEW: Pristine Full Hero Photo & Description */}
          {isExpanded && (
            <div className="mt-4 pt-3.5 border-t border-[#26262d] animate-in fade-in duration-200 space-y-3">
              {/* Full Clean Food Photography */}
              {item.image && !imgError && (
                <div className="relative w-full h-44 sm:h-56 rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#26262d] shadow-md group/img">
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
              <div className="flex items-center justify-between text-xs pt-1 text-[#8e8e96]">
                <span className="font-sans text-[11px] uppercase tracking-[0.12em]">
                  {categoryName} &bull; Cooked Fresh To Order
                </span>

                {!item.isAvailable && (
                  <span className="font-sans text-[11px] uppercase tracking-[0.12em] font-semibold text-[#F32636]">
                    Currently Sold Out
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Row 3: SLEEK PILL BADGE REDESIGN (Translucent background-tinted badges) */}
        <div className="mt-3.5 pt-3 border-t border-[#1f1f24] flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Background-tinted category pill */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.12em] font-semibold border backdrop-blur-sm ${getCategoryBadgeStyle()}`}
            >
              {categoryName}
            </span>

            {/* In-stock status pill */}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-[0.1em] font-medium border ${
                item.isAvailable
                  ? 'bg-[#16B9E8]/10 text-[#6ad4f5] border-[#16B9E8]/20'
                  : 'bg-[#F32636]/10 text-[#ff808b] border-[#F32636]/20'
              }`}
            >
              {item.isAvailable ? 'Fresh Today' : 'Sold Out'}
            </span>
          </div>

          <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#63636b]">
            Mereba Bistro
          </span>
        </div>
      </div>
    </div>
  );
};
