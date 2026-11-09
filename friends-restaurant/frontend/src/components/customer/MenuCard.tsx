import React, { useState } from 'react';
import { MenuItem } from '../../types/menu';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) {
      return 'Price on Request';
    }
    return `${price.toLocaleString()} ETB`;
  };

  const hasImage = Boolean(item.image) && !imgError;

  // Derive badge from tags or default
  const getBadge = () => {
    if (!item.tags) return null;
    const lower = item.tags.toLowerCase();
    if (lower.includes('bestseller') || lower.includes('favorite') || lower.includes('signature')) {
      return { text: 'Bestseller', color: 'text-primary-container border-primary-container/30' };
    }
    if (lower.includes('chef') || lower.includes('special')) {
      return { text: 'Chef Pick', color: 'text-tertiary border-tertiary-container/30' };
    }
    if (lower.includes('vegetarian')) {
      return { text: 'Vegetarian', color: 'text-secondary border-secondary-container/30' };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <div
      className={`menu-card group rounded-lg p-4 border transition-all duration-300 flex flex-col justify-between ${
        hasImage
          ? 'bg-surface-container-low/90 border-outline-variant/25 hover:border-primary-container/40'
          : item.price === null
          ? 'bg-surface-container/60 border-primary-container/30 hover:border-primary-container/70'
          : 'bg-surface-container-low/70 border-outline-variant/20 hover:border-outline-variant/50'
      } ${!item.isAvailable ? 'opacity-60' : ''}`}
    >
      <div>
        {/* Optional Image */}
        {hasImage && (
          <div className="relative w-full h-44 rounded overflow-hidden mb-3 bg-surface-container">
            <img
              src={item.image!}
              alt={item.name}
              onError={() => setImgError(true)}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {badge && (
              <span
                className={`absolute top-2 right-2 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded font-headline text-[10px] uppercase font-bold tracking-wider border ${badge.color}`}
              >
                {badge.text}
              </span>
            )}
            {!item.isAvailable && (
              <span className="absolute bottom-2 left-2 bg-secondary-container text-white px-2 py-0.5 rounded text-[10px] font-headline uppercase font-bold tracking-wider">
                Sold Out
              </span>
            )}
          </div>
        )}

        {/* Title and Price */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3
            className={`font-headline text-lg text-on-surface group-hover:text-primary transition-colors ${
              item.price === null ? 'text-primary' : ''
            } ${!item.isAvailable ? 'line-through text-outline' : ''}`}
          >
            {item.name}
          </h3>
          <span
            className={`font-headline text-base font-semibold whitespace-nowrap ${
              item.price === null ? 'text-primary-fixed text-xs font-headline' : 'text-primary-container'
            }`}
          >
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Footer Strip */}
      <div className="mt-3 pt-2 border-t border-outline-variant/15 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-outline flex items-center gap-1.5 font-headline text-[11px]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.isAvailable ? 'bg-primary-container' : 'bg-secondary-container'
            }`}
          />
          <span>{item.category?.name || 'Artisan Special'}</span>
        </span>

        <button
          type="button"
          onClick={() => onSelect(item)}
          className="text-primary hover:text-primary-container text-xs font-headline font-semibold uppercase tracking-wider transition-colors"
        >
          Select →
        </button>
      </div>
    </div>
  );
};

