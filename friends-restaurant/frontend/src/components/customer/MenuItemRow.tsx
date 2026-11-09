import React, { useState } from 'react';
import { ChevronDown, Utensils, AlertOctagon } from 'lucide-react';
import { MenuItem } from '../../types/menu';

interface MenuItemRowProps {
  item: MenuItem;
  defaultExpanded?: boolean;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({
  item,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [imgError, setImgError] = useState(false);

  const tagsList = item.tags
    ? item.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) {
      return 'Price on Request';
    }
    return `${price.toLocaleString()} ETB`;
  };

  return (
    <div
      className={`border-b border-outline-variant/20 transition-all duration-200 ${
        isExpanded ? 'bg-surface-container/70' : 'hover:bg-surface-container-low/70'
      } ${!item.isAvailable ? 'opacity-60' : ''}`}
    >
      {/* Compact Default State Row */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left py-3.5 px-4 flex items-center justify-between gap-3 focus:outline-none select-none group cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          {/* Availability dot */}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              item.isAvailable ? 'bg-primary-container shadow-glow-yellow' : 'bg-secondary-container shadow-glow-red'
            }`}
          />
          <div className="min-w-0">
            <span
              className={`font-headline text-sm sm:text-base font-semibold tracking-wide block truncate transition-colors ${
                isExpanded ? 'text-primary' : 'text-on-surface group-hover:text-primary-fixed'
              } ${!item.isAvailable ? 'line-through text-outline' : ''}`}
            >
              {item.name}
            </span>
            {!item.isAvailable ? (
              <span className="font-headline text-[10px] uppercase font-bold tracking-wider text-secondary-container block">
                Sold Out
              </span>
            ) : tagsList.length > 0 && !isExpanded ? (
              <span className="font-headline text-[10px] text-outline uppercase tracking-wider block truncate">
                {tagsList[0]}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Price display in ETB */}
          <span
            className={`font-headline text-sm sm:text-base font-bold whitespace-nowrap ${
              item.price === null ? 'text-tertiary-container text-xs' : 'text-primary-container'
            }`}
          >
            {formatPrice(item.price)}
          </span>

          {/* Upside-down chevron icon (^) that smoothly rotates when toggled */}
          <div
            className={`w-7 h-7 rounded flex items-center justify-center border transition-all duration-300 ${
              isExpanded
                ? 'rotate-180 bg-primary-container/20 border-primary-container/50 text-primary-container shadow-glow-yellow'
                : 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant group-hover:text-white group-hover:border-primary-container/40'
            }`}
            title={isExpanded ? 'Hide photo & description' : 'View photo & description'}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Expanded State: Reveals high-res dish photo, description, dietary badges & dynamic price */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
          {/* High-Resolution Dish Photograph */}
          {item.image && !imgError ? (
            <div className="relative w-full h-48 sm:h-64 rounded overflow-hidden border border-outline-variant/30 bg-surface-container shadow-lg">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent pointer-events-none" />

              {/* Badges on image */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {tagsList.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-headline uppercase font-semibold tracking-wider bg-surface-container-lowest/80 backdrop-blur-md text-primary border border-outline-variant/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-headline font-bold bg-primary-container text-on-primary-container shadow-sm">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-20 rounded bg-surface-container border border-outline-variant/20 flex items-center justify-center text-outline gap-2">
              <Utensils className="w-5 h-5 text-primary-container" />
              <span className="text-body-sm font-medium">Artisanal Garden Harvest</span>
            </div>
          )}

          {/* Detailed Gourmet Description */}
          {item.description ? (
            <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {item.description}
            </p>
          ) : (
            <p className="font-body text-xs text-outline italic">
              Crafted with garden-fresh ingredients and house seasoning.
            </p>
          )}

          {/* Tags list if not on image */}
          {tagsList.length > 0 && !item.image && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tagsList.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-headline uppercase font-semibold tracking-wider bg-surface-container-high text-on-surface-variant border border-outline-variant/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Details / Availability footer */}
          <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              {item.isAvailable ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                  <span className="font-headline uppercase tracking-wider text-[11px] font-semibold text-primary">
                    Available Today
                  </span>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-3.5 h-3.5 text-secondary-container" />
                  <span className="text-secondary-container font-headline uppercase tracking-wider text-[11px] font-bold">
                    Currently Sold Out
                  </span>
                </>
              )}
            </div>

            <span className="text-[11px] text-outline italic">
              Mereba Friends Garden Signature
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
