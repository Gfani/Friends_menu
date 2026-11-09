import React, { useState } from 'react';
import { ChevronDown, Utensils, Sparkles, CheckCircle2, AlertOctagon, Eye } from 'lucide-react';
import { MenuItem } from '../../types/menu';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  isFeaturedTopRow?: boolean;
  onOpenModal?: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  index,
  isFeaturedTopRow = false,
  onOpenModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // F.R.I.E.N.D.S Signature Color Rotation: Red (#F32636), Blue (#16B9E8), Yellow (#FFBD18)
  const friendsColors = [
    {
      name: 'red',
      hex: '#F32636',
      borderHover: 'hover:border-[#F32636]/60',
      glowShadow: 'hover:shadow-[0_10px_25px_-5px_rgba(243,38,54,0.22)]',
      dotGlow: 'shadow-[0_0_8px_rgba(243,38,54,0.7)]',
      badgeBg: 'bg-[#F32636]/10 text-[#F32636] border-[#F32636]/30',
    },
    {
      name: 'blue',
      hex: '#16B9E8',
      borderHover: 'hover:border-[#16B9E8]/60',
      glowShadow: 'hover:shadow-[0_10px_25px_-5px_rgba(22,185,232,0.22)]',
      dotGlow: 'shadow-[0_0_8px_rgba(22,185,232,0.7)]',
      badgeBg: 'bg-[#16B9E8]/10 text-[#16B9E8] border-[#16B9E8]/30',
    },
    {
      name: 'yellow',
      hex: '#FFBD18',
      borderHover: 'hover:border-[#FFBD18]/60',
      glowShadow: 'hover:shadow-[0_10px_25px_-5px_rgba(255,189,24,0.22)]',
      dotGlow: 'shadow-[0_0_8px_rgba(255,189,24,0.7)]',
      badgeBg: 'bg-[#FFBD18]/10 text-[#FFBD18] border-[#FFBD18]/30',
    },
  ];

  const colorTheme = friendsColors[index % friendsColors.length];

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) {
      return 'Price on Request';
    }
    return `${price.toLocaleString()} ETB`;
  };

  const isMarketPrice = item.price === null || item.price === undefined;

  // Determine if it is a chef's special (or market price lasagna/telatelli)
  const isChefSpecial =
    isMarketPrice ||
    (item.tags && item.tags.toLowerCase().includes('chef')) ||
    (item.tags && item.tags.toLowerCase().includes('baked al forno'));

  // Parse tags list
  const tagsList = item.tags
    ? item.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  // Subtitle to display on the bottom left (matches screenshot 1)
  const getSubtitleTag = () => {
    if (tagsList.length > 0) {
      return tagsList[0];
    }
    return `${item.category?.name || 'Chef Specialty'}`;
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative rounded-lg border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
        isExpanded
          ? 'bg-[#18181c] border-[#FFBD18]/60 shadow-[0_12px_32px_rgba(0,0,0,0.6)]'
          : isChefSpecial
          ? 'bg-[#161619] border-[#FFBD18]/30 hover:border-[#FFBD18]/70 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(255,189,24,0.2)]'
          : `bg-[#151518] border-[#25252a] ${colorTheme.borderHover} hover:-translate-y-1 ${colorTheme.glowShadow}`
      } ${!item.isAvailable ? 'opacity-65' : ''}`}
      style={{
        boxShadow: isExpanded ? '0 12px 30px rgba(0,0,0,0.7)' : undefined,
      }}
    >
      {/* Top Section */}
      <div className="p-4 pb-3">
        {/* Row 1: Dish Name & Price */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap min-w-0 pr-1">
            <h3
              className={`font-headline text-base sm:text-[17px] font-bold leading-snug tracking-wide text-white group-hover:text-[#ffe0aa] transition-colors ${
                !item.isAvailable ? 'line-through text-outline' : ''
              }`}
            >
              {item.name}
            </h3>

            {/* Chef's Special Badge (Exact match to screenshot 1) */}
            {isChefSpecial && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#241d11] border border-[#FFBD18]/40 text-[#FFBD18] font-headline text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                Chef&apos;s Special
              </span>
            )}
          </div>

          {/* Price Tag in Bold Yellow (#FFBD18) */}
          <div className="text-right shrink-0">
            <span
              className={`font-headline text-base sm:text-[17px] font-bold whitespace-nowrap tracking-tight ${
                isMarketPrice
                  ? 'text-[#ffe0aa] text-xs uppercase tracking-wider font-semibold block pt-0.5'
                  : 'text-[#FFBD18] drop-shadow-[0_0_8px_rgba(255,189,24,0.25)]'
              }`}
            >
              {formatPrice(item.price)}
            </span>
            {!item.isAvailable && (
              <span className="block text-[10px] font-headline uppercase font-bold text-[#F32636] tracking-wider">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Description (2-3 lines crisp text) */}
        {item.description ? (
          <p
            className={`font-body text-xs text-[#a1a1aa] leading-relaxed transition-all ${
              isExpanded ? 'text-[#d4c4ac] mt-2' : 'line-clamp-2'
            }`}
          >
            {item.description}
          </p>
        ) : (
          <p className="font-body text-xs text-[#6e6e78] italic">
            Chef seasoned with fresh ingredients and fragrant herbs.
          </p>
        )}
      </div>

      {/* EXPANDED SECTION (BRINGS DISH TO LIFE WITH PHOTOGRAPHY & BADGES) */}
      {isExpanded && (
        <div
          className="px-4 pb-3 pt-1 animate-in fade-in duration-300 space-y-3 border-t border-[#2a2a30]/60 mt-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* High-Resolution Dish Photograph with Zoom & Badges */}
          {item.image && !imgError ? (
            <div className="relative w-full h-44 sm:h-52 rounded-md overflow-hidden bg-[#0e0e11] border border-[#33333a] shadow-inner group/img">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-transparent to-transparent pointer-events-none" />

              {/* Friends Series 3-Dot Hallmark Overlay */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded bg-[#0e0e11]/80 backdrop-blur-md border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F32636] shadow-[0_0_6px_#F32636]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#16B9E8] shadow-[0_0_6px_#16B9E8]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD18] shadow-[0_0_6px_#FFBD18]" />
                <span className="text-[9px] font-headline uppercase tracking-widest text-[#ffe0aa] font-bold pl-1">
                  FRIENDS SPECIALTY
                </span>
              </div>

              {/* Badges on bottom of photo */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {tagsList.slice(0, 3).map((tag, tIdx) => {
                    const tagColor = friendsColors[tIdx % friendsColors.length];
                    return (
                      <span
                        key={tIdx}
                        className={`px-2 py-0.5 rounded text-[10px] font-headline uppercase font-bold tracking-wider backdrop-blur-md border ${tagColor.badgeBg}`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>

                <span className="px-2 py-0.5 rounded text-xs font-headline font-bold bg-[#FFBD18] text-black shadow-md">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-24 rounded-md bg-[#1c1c20] border border-[#2a2a30] flex flex-col items-center justify-center text-[#9d8f78] gap-1">
              <Utensils className="w-5 h-5 text-[#FFBD18]" />
              <span className="text-[11px] font-headline uppercase tracking-wider font-semibold">
                Artisanal Kitchen Harvest &bull; Prepared Fresh
              </span>
            </div>
          )}

          {/* Expanded Dietary Badges (Friends Red, Blue, Yellow) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-headline uppercase font-semibold border bg-[#F32636]/10 text-[#F32636] border-[#F32636]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F32636]" />
              Fresh Made To Order
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-headline uppercase font-semibold border bg-[#16B9E8]/10 text-[#16B9E8] border-[#16B9E8]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16B9E8]" />
              Natural Herbs &amp; Spices
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-headline uppercase font-semibold border bg-[#FFBD18]/10 text-[#FFBD18] border-[#FFBD18]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD18]" />
              Central Perk Signature
            </span>
          </div>

          {/* Quick Info Strip */}
          <div className="pt-2 border-t border-[#2a2a30] flex items-center justify-between text-xs text-[#9d8f78]">
            <div className="flex items-center gap-1.5">
              {item.isAvailable ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16B9E8]" />
                  <span className="text-[#ffe0aa] font-headline uppercase tracking-wider text-[11px] font-semibold">
                    In Stock &bull; Served Hot
                  </span>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-3.5 h-3.5 text-[#F32636]" />
                  <span className="text-[#F32636] font-headline uppercase tracking-wider text-[11px] font-bold">
                    Sold Out Today
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={toggleExpand}
              className="text-[#FFBD18] hover:underline font-headline uppercase text-[11px] tracking-wider font-bold"
            >
              Close Details ^
            </button>
          </div>
        </div>
      )}

      {/* Row 3: Bottom Footer Strip (Exact match to screenshot 1) */}
      <div className="px-4 py-2.5 border-t border-[#232328] bg-[#121215]/50 rounded-b-lg flex items-center justify-between">
        {/* Left: Category Subtitle with Glowing Friends Dot */}
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-300 ${colorTheme.dotGlow}`}
            style={{ backgroundColor: colorTheme.hex }}
          />
          <span className="text-[11px] font-headline uppercase tracking-wider text-[#9d8f78] truncate font-medium">
            {getSubtitleTag()}
          </span>
        </div>

        {/* Right: Select with upside-down Chevron ^ icon */}
        <button
          type="button"
          onClick={toggleExpand}
          className="inline-flex items-center gap-1 text-xs font-headline font-semibold uppercase tracking-wider text-[#d4c4ac] hover:text-[#FFBD18] transition-colors shrink-0 group/btn"
          aria-expanded={isExpanded}
        >
          <span>Select</span>
          {isFeaturedTopRow ? (
            <span className="text-[#FFBD18] font-bold text-sm transition-transform group-hover/btn:translate-x-1">
              &rarr;
            </span>
          ) : (
            <div
              className={`w-5 h-5 rounded flex items-center justify-center transition-transform duration-300 ${
                isExpanded ? 'rotate-180 text-[#FFBD18]' : 'text-[#9d8f78] group-hover/btn:text-[#FFBD18]'
              }`}
              title={isExpanded ? 'Collapse' : 'Expand dish details'}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
