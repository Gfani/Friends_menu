import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  AlertCircle,
  ArrowUp,
  ExternalLink,
  Wifi,
  Check,
  Copy,
} from 'lucide-react';
import { useMenu, useSiteSettings } from '../hooks/useMenu';
import { MenuHeader } from '../components/customer/MenuHeader';
import { CategoryTabs } from '../components/customer/CategoryTabs';
import { MenuCard } from '../components/customer/MenuCard';
import { MenuItem } from '../types/menu';
import { MerebaLogo } from '../components/common/MerebaLogo';
import { FriendsDoodleRibbon } from '../components/customer/FriendsDoodleRibbon';
import { api } from '../api/client';
import { Language, translations } from '../i18n/translations';

export const CustomerMenu: React.FC = () => {
  const { data: categories = [], isLoading, error, refetch } = useMenu();
  const { data: settings } = useSiteSettings();

  // Language state
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('friends_language') as Language) || 'en';
  });
  const t = translations[currentLang];

  // Primary Department: FOOD vs DRINKS
  const [activeParent, setActiveParent] = useState<'FOOD' | 'DRINKS'>('FOOD');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [copiedWifi, setCopiedWifi] = useState<boolean>(false);

  // Track visit on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    api.trackEvent({
      type: table ? 'TABLE_SCAN' : 'PAGE_VIEW',
      tableNumber: table || undefined,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic theme values from CMS settings
  const accentColor = settings?.accentColor || '#FFBD18';
  const bgColor = settings?.backgroundColor || '#050505';
  const cardColor = settings?.cardColor || '#121212';
  const fontFamily = settings?.fontFamily || 'Inter, sans-serif';

  const wifiSsid = settings?.wifiSsid || 'Mereba_Friends_Garden_5G';
  const wifiPassword = settings?.wifiPassword || 'friends2025';

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2500);
  };

  // Partition categories and items by FOOD vs DRINKS
  const { foodCategories, drinkCategories, totalFoodCount, totalDrinkCount } = useMemo(() => {
    const foods = categories.filter((c) => (c.parentCategory || 'FOOD') === 'FOOD');
    const drinks = categories.filter((c) => c.parentCategory === 'DRINKS');

    const foodCount = foods.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
    const drinkCount = drinks.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);

    return {
      foodCategories: foods,
      drinkCategories: drinks,
      totalFoodCount: foodCount,
      totalDrinkCount: drinkCount,
    };
  }, [categories]);

  // Episode naming mapper for Friends themed category headers
  const getEpisodeTitle = (catSlugOrName: string) => {
    const upper = catSlugOrName.toUpperCase();
    if (upper.includes('PASTA')) return 'THE ONE WITH THE PASTA';
    if (upper.includes('RICE')) return 'THE ONE WITH SAVORY GRAINS';
    if (upper.includes('SALAD')) return 'THE ONE WITH FRESH GREENS';
    if (upper.includes('SOUP')) return 'THE ONE WITH WARM BROTHS';
    if (upper.includes('BURGER')) return 'THE ONE WITH GOURMET BURGERS';
    if (upper.includes('PIZZA')) return 'THE ONE WITH WOOD-FIRED PIZZA';
    if (upper.includes('TIBS')) return 'THE ONE WITH SIZZLING TIBS';
    if (upper.includes('MOJITO')) return 'THE ONE WITH REFRESHING MOJITOS';
    if (upper.includes('BEER') || upper.includes('ALCOHOL')) return 'THE ONE WITH DRAFT BEERS';
    if (upper.includes('JUICE')) return 'THE ONE WITH FRESH JUICES';
    if (upper.includes('SOFT')) return 'THE ONE WITH CHILLED DRINKS';
    if (upper.includes('HOT')) return 'THE ONE WITH STEAMING COFFEE';
    return `THE ONE WITH ${upper}`;
  };

  // Compile items for active parent and active subcategory
  const displayedItems = useMemo(() => {
    const currentCategories = activeParent === 'FOOD' ? foodCategories : drinkCategories;
    const q = searchQuery.toLowerCase().trim();

    let itemsToFilter: MenuItem[] = [];

    if (activeCategory === 'all') {
      itemsToFilter = currentCategories.flatMap((c) => (c.items ? [...c.items] : []));
    } else {
      const selectedCat = currentCategories.find((c) => c.id === activeCategory);
      itemsToFilter = selectedCat?.items ? [...selectedCat.items] : [];
    }

    if (!q) return itemsToFilter;

    // Filter by search query
    return itemsToFilter.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchTags = item.tags?.toLowerCase().includes(q) || false;
      const matchCat = item.category?.name.toLowerCase().includes(q) || false;
      return matchName || matchDesc || matchTags || matchCat;
    });
  }, [activeParent, foodCategories, drinkCategories, activeCategory, searchQuery]);

  return (
    <div
      className="min-h-screen text-[#A1A1AA] antialiased selection:bg-[#FFBD18] selection:text-black transition-colors duration-300"
      style={{
        backgroundColor: bgColor,
        fontFamily,
      }}
    >
      {/* 1. FIXED TOP NAVIGATION BAR */}
      <MenuHeader currentLang={currentLang} onLanguageChange={setCurrentLang} />

      {/* 2. CINEMATIC HERO SECTION */}
      <section
        id="hero"
        className="relative w-full min-h-[75vh] flex items-center justify-center pt-28 pb-20 overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Cinematic Backdrop Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('/assets/real/friends-vibe-couch.jpg')`,
          }}
        >
          {/* Vignette and Dark Tint Overlays */}
          <div
            className="absolute inset-0 bg-gradient-to-t"
            style={{
              backgroundImage: `linear-gradient(to top, ${bgColor}, ${bgColor}D9, ${bgColor}F2)`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.95)_100%)]" />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          {/* Hallmark Heritage Badge (Clean Luxury) */}
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#222222] mb-6 shadow-sm"
            style={{ backgroundColor: cardColor }}
          >
            <span className="font-headline text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA] font-bold">
              {settings?.tagline || 'BISTRO • GARDEN • CASUAL LUXURY'}
            </span>
          </div>

          {/* Official Restaurant Master Emblem - Compact & Detailed */}
          <div className="relative flex flex-col items-center justify-center mb-6 text-center w-full max-w-xs mx-auto">
            <MerebaLogo variant="full" className="w-28 sm:w-36 md:w-40 max-w-[160px]" />
          </div>

          {/* THE ONE [Red] [Blue] [Yellow] WITH THE FOOD - Brand Dots Isolated Here */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="flex flex-col items-center text-center font-headline font-black uppercase text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              {/* Line 1: THE ONE [Red dot] [Blue dot] [Yellow dot] WITH */}
              <span className="flex items-center justify-center gap-2 sm:gap-3 text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.18em] sm:tracking-[0.24em] leading-tight">
                <span>{settings?.heroTitle1 || 'THE ONE'}</span>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-1">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#F32636]" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#16B9E8]" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                </span>
                <span>WITH</span>
              </span>

              {/* Line 2: THE FOOD / THE FLAVORS */}
              <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.22em] sm:tracking-[0.28em] mt-1 sm:mt-2 leading-none text-white">
                {settings?.heroTitle2 || 'THE FOOD'}
              </span>
            </h1>

            {/* Line 3: Tiny Golden Central Perk Couch Outline */}
            <div className="mt-3 opacity-80 hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
              <svg
                className="w-7 h-4 sm:w-8 sm:h-5"
                viewBox="0 0 32 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 12V6a3 3 0 0 1 6-1h8a3 3 0 0 1 6 1v6" />
                <path d="M11 8h.01M16 8h.01M21 8h.01" />
                <path d="M3 10c0-1.5 1.5-2 3-2v4c-1.5 0-3-.5-3-2z" />
                <path d="M29 10c0-1.5-1.5-2-3-2v4c1.5 0 3-.5 3-2z" />
                <path d="M5 12h22v3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3z" />
                <path d="M6 16v2M26 16v2" />
              </svg>
            </div>
          </div>

          <p className="font-body text-sm sm:text-base text-[#A1A1AA] max-w-2xl mx-auto mb-8 tracking-wide leading-relaxed">
            {settings?.heroDescription ||
              'Good food, great company, and timeless memories. Browse our hand-rolled pastas, hearty pilafs, fresh garden bowls, and slow-simmered broths.'}
          </p>

          {/* Primary CTA (Gold strictly restricted to primary action) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <a
              href="#menu-section"
              className="w-full sm:w-auto inline-flex items-center justify-center font-headline text-xs uppercase tracking-widest px-8 py-3.5 rounded-full text-black font-extrabold hover:brightness-110 shadow-[0_0_20px_rgba(255,189,24,0.3)] transition-all cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              {t.exploreMenu}
            </a>
            <a
              href="#location-section"
              className="w-full sm:w-auto inline-flex items-center justify-center font-headline text-xs uppercase tracking-widest px-8 py-3.5 rounded-full text-white hover:bg-[#1a1a1a] border border-[#222222] hover:border-[#333333] transition-all font-semibold"
              style={{ backgroundColor: cardColor }}
            >
              {t.visitGarden}
            </a>
          </div>

          {/* Clean Stat Counters (Unified Luxury Typography: Crisp White Numbers + Gray Labels) */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mt-14 pt-8 border-t border-[#222222] text-center w-full">
            <div>
              <p className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight">11:00</p>
              <p className="font-headline text-[10px] sm:text-[11px] text-[#A1A1AA] uppercase tracking-widest mt-1 font-semibold">
                {t.dailyOpen}
              </p>
            </div>
            <div className="border-x border-[#222222]">
              <p className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight">
                {totalFoodCount + totalDrinkCount}+
              </p>
              <p className="font-headline text-[10px] sm:text-[11px] text-[#A1A1AA] uppercase tracking-widest mt-1 font-semibold">
                {t.artisanDishes}
              </p>
            </div>
            <div>
              <p className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight">100%</p>
              <p className="font-headline text-[10px] sm:text-[11px] text-[#A1A1AA] uppercase tracking-widest mt-1 font-semibold">
                {t.freshToOrder}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="w-16 h-[1px] bg-[#222222] mx-auto my-4" />

      {/* 3. DIGITAL MENU SECTION */}
      <section id="menu-section" className="w-full py-12 sm:py-16 relative" style={{ backgroundColor: bgColor }}>
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 font-headline text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2 font-semibold">
              <span>{settings?.restaurantName || 'Mereba Friends Garden'} &bull; Artisanal Kitchen</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl text-white tracking-wider uppercase font-extrabold">
              {activeCategory === 'all'
                ? activeParent === 'FOOD'
                  ? 'THE ONE WITH THE FOOD'
                  : 'THE ONE WITH THE DRINKS'
                : getEpisodeTitle(
                    categories.find((c) => c.id === activeCategory)?.name || activeCategory
                  )}
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#A1A1AA] mt-2">
              Explore our chef-curated selections. Tap any card to view photography and ingredients.
            </p>
          </div>

          {/* STICKY FILTER & SEARCH BAR WITH FOOD & DRINKS SWITCHER */}
          <div
            className="sticky top-20 z-40 backdrop-blur-xl py-4 -mx-4 px-4 sm:-mx-8 sm:px-8 border-y border-[#222222] shadow-[0_12px_28px_rgba(0,0,0,0.8)] mb-10 transition-all"
            style={{ backgroundColor: `${bgColor}F2` }}
          >
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] text-[20px] pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  placeholder={activeParent === 'FOOD' ? t.searchPlaceholderFood : t.searchPlaceholderDrinks}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-xl text-white text-sm placeholder:text-[#71717A] border border-[#222222] focus:outline-none transition-colors shadow-inner font-body"
                  style={{
                    backgroundColor: cardColor,
                    borderColor: '#222222',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white transition-colors"
                    title={t.clearSearch}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Two-tier Food vs Drinks + Subcategories */}
              <CategoryTabs
                categories={categories}
                activeParent={activeParent}
                onSelectParent={(parent) => {
                  setActiveParent(parent);
                  setActiveCategory('all');
                }}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                totalFoodCount={totalFoodCount}
                totalDrinkCount={totalDrinkCount}
                currentLang={currentLang}
              />
            </div>
          </div>

          {/* Search Result Feedback */}
          {searchQuery.trim() !== '' && (
            <div className="flex items-center justify-between text-xs text-[#A1A1AA] pb-4 px-1 max-w-xl mx-auto">
              <span>
                Found <strong className="text-white">{displayedItems.length}</strong> {displayedItems.length === 1 ? 'item' : 'items'} matching &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-white hover:underline font-headline uppercase tracking-wider text-[11px] font-semibold"
              >
                {t.clearSearch}
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-24 flex flex-col items-center justify-center space-y-3 text-center">
              <div
                className="w-8 h-8 rounded-full border-2 border-white/20 animate-spin"
                style={{ borderTopColor: accentColor }}
              />
              <p className="font-headline text-xs uppercase tracking-widest text-[#A1A1AA] pt-2">
                Loading Menu...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="p-6 border border-[#222222] rounded-xl text-center space-y-3 max-w-md mx-auto"
              style={{ backgroundColor: cardColor }}
            >
              <AlertCircle className="w-8 h-8 text-[#A1A1AA] mx-auto" />
              <h4 className="font-headline text-lg font-bold text-white">Could not load the menu</h4>
              <p className="text-xs text-[#A1A1AA]">{(error as any)?.message}</p>
              <button
                onClick={() => refetch()}
                className="px-5 py-2 bg-[#181818] border border-[#282828] text-white text-xs font-headline uppercase font-semibold rounded-lg hover:bg-[#222222] cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* No Search Results */}
          {!isLoading && !error && displayedItems.length === 0 && (
            <div
              className="py-16 text-center rounded-2xl border border-[#222222] p-8 max-w-lg mx-auto"
              style={{ backgroundColor: cardColor }}
            >
              <p className="font-headline text-lg text-white font-bold">{t.noDishesFound}</p>
              <p className="font-body text-xs text-[#A1A1AA] mt-1">
                {t.trySearching}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-5 px-6 py-2.5 text-black text-xs font-headline uppercase font-extrabold rounded-full hover:brightness-110 transition-all cursor-pointer shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                {t.showAll} {activeParent === 'FOOD' ? t.food : t.drinks}
              </button>
            </div>
          )}

          {/* 3-COLUMN LUXURY MENU CARDS GRID */}
          {!isLoading && !error && displayedItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedItems.map((item, index) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. ABOUT US & NARRATIVE STORYTELLING */}
      <section
        id="about-section"
        className="w-full py-20 sm:py-24 relative overflow-hidden border-t border-[#222222]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 font-headline text-xs text-[#A1A1AA] tracking-[0.2em] uppercase mb-2 font-semibold">
                Our Philosophy
              </div>
              <h2 className="font-headline text-2xl sm:text-4xl text-white uppercase font-extrabold leading-tight mb-4 tracking-wide whitespace-pre-line">
                {settings?.philosophyTitle || 'MORE THAN FOOD.\nIT’S ABOUT FRIENDSHIP.'}
              </h2>
              <p className="font-body text-sm sm:text-base text-[#A1A1AA] leading-relaxed mb-6">
                {settings?.philosophyDescription ||
                  'Central Perk meets modern boutique lounge. Designed as a sanctuary for heartfelt conversations, spontaneous laughter, and unforgettable comfort food in our garden.'}
              </p>

              <div
                className="p-5 rounded-2xl border border-[#222222] w-full mb-6"
                style={{ backgroundColor: cardColor }}
              >
                <p className="font-headline text-base text-white italic font-semibold">
                  &ldquo;{settings?.manifestoQuote || 'Because Joey doesn’t share food, but we definitely think you should.'}&rdquo;
                </p>
                <p className="font-headline text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-2 font-bold">
                  &mdash; The Kitchen Manifesto
                </p>
              </div>

              {/* Velvet Nook Lounge */}
              <div className="flex items-center gap-4 pt-1">
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[24px]">chair</span>
                </div>
                <div>
                  <p className="font-headline text-xs uppercase tracking-wider text-white font-bold">
                    The Velvet Nook Lounge
                  </p>
                  <p className="font-body text-xs text-[#A1A1AA]">
                    Intimate booths &amp; acoustic jazz evenings
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Feature Cards Bento */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div
                className="sm:col-span-2 p-6 rounded-2xl border border-[#222222] hover:border-[#333333] transition-all flex flex-col md:flex-row items-start md:items-center gap-5"
                style={{ backgroundColor: cardColor }}
              >
                <div className="w-14 h-14 rounded-xl bg-[#181818] border border-[#222222] flex-shrink-0 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[30px]">dinner_dining</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-white mb-1 font-bold">
                    The Central Table
                  </h3>
                  <p className="font-body text-xs text-[#A1A1AA] leading-relaxed">
                    Community seating and private candlelight setups modeled after comfortable Greenwich Village gathering spots.
                  </p>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between"
                style={{ backgroundColor: cardColor }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mb-4">
                  <span className="material-symbols-outlined text-[26px]">skillet</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-white mb-1 font-bold">
                    Handcrafted Flavors
                  </h3>
                  <p className="font-body text-xs text-[#A1A1AA] leading-relaxed">
                    Authentic slow-cooked pastas, fragrant poultry risottos, sizzling Ethiopian beef tibs, and garden-fresh salads.
                  </p>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between"
                style={{ backgroundColor: cardColor }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mb-4">
                  <span className="material-symbols-outlined text-[26px]">nightlife</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-white mb-1 font-bold">
                    Could This BE Any Cozier?
                  </h3>
                  <p className="font-body text-xs text-[#A1A1AA] leading-relaxed">
                    Warm Edison lights, draft beers on tap, signature mojito mason jars, and a relaxed garden sanctuary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL GALLERY SECTION: REAL PHOTOS FROM FRIENDS GARDEN */}
      <section
        id="gallery-section"
        className="w-full py-20 sm:py-24 border-t border-[#222222]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 font-headline text-xs text-[#A1A1AA] tracking-[0.2em] uppercase mb-2 font-semibold">
                Atmosphere &amp; Plates &bull; Real Moments
              </div>
              <h2 className="font-headline text-2xl sm:text-4xl text-white uppercase font-extrabold tracking-wide">
                THE ONE WITH THE REAL GOOD TIMES
              </h2>
            </div>
            <p className="font-body text-xs text-[#A1A1AA] max-w-md leading-relaxed">
              Authentic moments captured directly at Mereba Friends Garden &mdash; heartfelt conversations on the iconic couch, outdoor garden feasts, and handcrafted cocktails.
            </p>
          </div>

          {/* Bento Gallery Featuring User's Real Photos */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Real Photo 1: Friends Laughing on Couch with Draft Beers */}
            <div className="md:col-span-7 h-[380px] md:h-[460px] rounded-2xl overflow-hidden relative group border border-[#222222]">
              <img
                src="/assets/real/friends-vibe-couch.jpg"
                alt="Friends laughing on couch with beer mugs at Friends Garden"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-headline text-xs text-[#A1A1AA] tracking-widest uppercase mb-1 block font-bold">
                  The Orange Couch &bull; Friends Garden
                </span>
                <h3 className="font-headline text-xl text-white font-extrabold">
                  Laughter, Draft Beers &amp; Good Times
                </h3>
                <p className="font-body text-xs text-[#A1A1AA] max-w-sm mt-1">
                  &ldquo;I’ll be there for you&rdquo; &mdash; cold draft mugs, warm memories, and friends who become family.
                </p>
              </div>
            </div>

            {/* Right Stack: 2 Real Photos */}
            <div className="md:col-span-5 flex flex-col gap-5">
              {/* Real Photo 2: Mojito Mason Jars */}
              <div className="h-[180px] md:h-[218px] rounded-2xl overflow-hidden relative group border border-[#222222]">
                <img
                  src="/assets/real/friends-mojito-jars.jpg"
                  alt="Friends Signature Mojito Jars"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-headline text-[10px] text-[#A1A1AA] tracking-wider uppercase font-bold">
                    Signature Cocktails &amp; Cold Sips
                  </span>
                  <p className="font-headline text-base text-white font-bold">Fresh Mint Mojito Jars</p>
                </div>
              </div>

              {/* Real Photo 3: Garden Feast Table */}
              <div className="h-[180px] md:h-[218px] rounded-2xl overflow-hidden relative group border border-[#222222]">
                <img
                  src="/assets/real/friends-garden-feast.jpg"
                  alt="Outdoor Garden Feast Table at Friends Garden"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-headline text-[10px] text-[#A1A1AA] tracking-wider uppercase font-bold">
                    Outdoor Garden Table
                  </span>
                  <p className="font-headline text-base text-white font-bold">Fresh Garden Bowl &amp; Feast</p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Tibs & Rice + Folded Pizza Special */}
            <div className="md:col-span-6 h-[220px] rounded-2xl overflow-hidden relative group border border-[#222222]">
              <img
                src="/assets/real/friends-tibs-rice.jpg"
                alt="Ethiopian Sizzling Tibs with Spiced Rice and Injera"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="font-headline text-[10px] text-[#A1A1AA] tracking-wider uppercase font-bold">
                  Chef&apos;s Special
                </span>
                <p className="font-headline text-base text-white font-bold">Sizzling Tibs &amp; Spiced Rice</p>
              </div>
            </div>

            <div className="md:col-span-6 h-[220px] rounded-2xl overflow-hidden relative group border border-[#222222]">
              <img
                src="/assets/real/friends-special-pizza.jpg"
                alt="Friends Special Folded Calzone Pizza Platter"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="font-headline text-[10px] text-[#A1A1AA] tracking-wider uppercase font-bold">
                  House Signature Platter
                </span>
                <p className="font-headline text-base text-white font-bold">Friends Special Calzone Pizza &amp; Fries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCATION, OPERATING HOURS & GUEST WI-FI */}
      <section
        id="location-section"
        className="w-full py-20 sm:py-24 relative border-t border-[#222222]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 font-headline text-xs text-[#A1A1AA] tracking-[0.2em] uppercase mb-2 font-semibold">
              <span>{settings?.restaurantName || 'Mereba Friends Garden'}</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl text-white uppercase font-extrabold tracking-wide">
              THE ONE WHERE YOU VISIT US
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#A1A1AA] mt-2 leading-relaxed">
              Walk-ins are welcomed with open arms. Enjoy outdoor garden seating, high-speed Wi-Fi, and intimate dining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Location Card */}
            <div
              className="border border-[#222222] rounded-2xl p-6 text-center space-y-3"
              style={{ backgroundColor: cardColor }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mx-auto">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <h3 className="font-headline text-base font-bold text-white">Our Address</h3>
              <p className="font-body text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                <strong className="text-white">
                  {[settings?.addressLine1, settings?.addressLine2].filter(Boolean).join('\n') || '17 ቀበሌ፣ ፊትለፊት በሰበርደ\nናይቀደም ገዛ ተጋሩ'}
                </strong>
              </p>
            </div>

            {/* Operating Hours */}
            <div
              className="border border-[#222222] rounded-2xl p-6 text-center space-y-3"
              style={{ backgroundColor: cardColor }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mx-auto">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <h3 className="font-headline text-base font-bold text-white">Dining Hours</h3>
              <p className="font-body text-xs text-[#A1A1AA] leading-relaxed">
                <strong className="text-white font-headline text-xs font-bold block mb-1">
                  {settings?.openingHours || 'Monday – Sunday\n11:00 AM – 11:00 PM'}
                </strong>
                <span className="text-[#71717A]">Kitchen closes 10:30 PM</span>
              </p>
            </div>

            {/* Free Guest Wi-Fi Card */}
            <div
              className="border border-[#222222] rounded-2xl p-6 text-center space-y-3"
              style={{ backgroundColor: cardColor }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-[#FFBD18] mx-auto">
                <Wifi className="w-5 h-5 text-[#FFBD18]" />
              </div>
              <h3 className="font-headline text-base font-bold text-white">Free Guest Wi-Fi</h3>
              <p className="font-mono text-xs text-[#A1A1AA] truncate">
                {wifiSsid}
              </p>
              <button
                type="button"
                onClick={handleCopyWifi}
                className="w-full py-2 px-3 rounded-lg text-black font-headline text-[11px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                {copiedWifi ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Password Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Password</span>
                  </>
                )}
              </button>
            </div>

            {/* Phone Lines & Socials */}
            <div
              className="border border-[#222222] rounded-2xl p-6 text-center space-y-3"
              style={{ backgroundColor: cardColor }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mx-auto">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <h3 className="font-headline text-base font-bold text-white">Contact &amp; Social</h3>

              <div className="flex flex-col gap-1.5 text-xs">
                {/* Direct Dial Phone Links */}
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={`tel:${settings?.phone1 || '0970700488'}`}
                    className="inline-flex items-center gap-1 text-white hover:text-[#FFBD18] font-mono font-bold transition-colors py-0.5"
                  >
                    <span>{settings?.phone1 || '0970700488'}</span>
                  </a>
                  <span className="text-zinc-600">&bull;</span>
                  <a
                    href={`tel:${settings?.phone2 || '0945986349'}`}
                    className="inline-flex items-center gap-1 text-white hover:text-[#FFBD18] font-mono font-bold transition-colors py-0.5"
                  >
                    <span>{settings?.phone2 || '0945986349'}</span>
                  </a>
                </div>

                {/* Clickable Social Media Links */}
                <div className="pt-1 flex flex-col gap-1 text-xs">
                  <a
                    href="https://www.instagram.com/mereba_friends_garden/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161616] hover:bg-[#1c1c1c] border border-[#222222] text-[#A1A1AA] hover:text-white transition-all text-[10px]"
                  >
                    <span className="truncate">IG: {settings?.instagramHandle || '@MEREBA_FRIENDS_GARDEN'}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-zinc-600 group-hover:text-white shrink-0" />
                  </a>

                  <a
                    href="https://www.tiktok.com/@friends_garden"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161616] hover:bg-[#1c1c1c] border border-[#222222] text-[#A1A1AA] hover:text-white transition-all text-[10px]"
                  >
                    <span className="truncate">TikTok: {settings?.tiktokHandle || '@FRIENDS_GARDEN'}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-zinc-600 group-hover:text-white shrink-0" />
                  </a>

                  <a
                    href="https://www.facebook.com/search/top?q=FRIENDS%20GARDEN%20-%20%E1%88%98%E1%88%A8%E1%89%A3%20%E1%87%8D%E1%88%AC%E1%8A%95%E1%8B%95%E1%88%B5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161616] hover:bg-[#1c1c1c] border border-[#222222] text-[#A1A1AA] hover:text-white transition-all text-[10px]"
                  >
                    <span className="truncate">FB: {settings?.facebookHandle || 'FRIENDS GARDEN - መረባ ፍሬንድስ'}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-zinc-600 group-hover:text-white shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AUTHENTIC FRIENDS DOODLE RIBBON (Monochrome) */}
      <FriendsDoodleRibbon />

      {/* 8. FOOTER */}
      <footer className="w-full border-t border-[#222222]" style={{ backgroundColor: bgColor }}>
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-16">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 relative">
              <MerebaLogo variant="full" className="w-40 sm:w-48" />
            </div>

            <p className="font-body text-xs text-[#A1A1AA] max-w-md mb-8">
              Intimate garden dining, artisan kitchen recipes, and timeless nostalgia.
            </p>

            {/* Clickable Social Bar in Footer */}
            <div className="flex items-center justify-center gap-3.5 mb-8">
              <a
                href="https://www.instagram.com/mereba_friends_garden/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#222222] hover:border-[#333333] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all hover:scale-105"
                style={{ backgroundColor: cardColor }}
                title="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@friends_garden"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#222222] hover:border-[#333333] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all hover:scale-105"
                style={{ backgroundColor: cardColor }}
                title="TikTok"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                </svg>
              </a>

              <a
                href="https://www.facebook.com/search/top?q=FRIENDS%20GARDEN%20-%20%E1%88%98%E1%88%A8%E1%89%A3%20%E1%87%8D%E1%88%AC%E1%8A%95%E1%8B%95%E1%88%B5"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#222222] hover:border-[#333333] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all hover:scale-105"
                style={{ backgroundColor: cardColor }}
                title="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href={`tel:${settings?.phone1 || '0970700488'}`}
                className="w-10 h-10 rounded-full border border-[#222222] hover:border-[#333333] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all hover:scale-105"
                style={{ backgroundColor: cardColor }}
                title="Call"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </a>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-7 mb-8 font-headline text-xs uppercase tracking-widest font-semibold">
              <a href="#hero" className="text-white hover:text-white transition-colors">
                Home
              </a>
              <a href="#menu-section" className="text-[#A1A1AA] hover:text-white transition-colors">
                Our Menu
              </a>
              <a href="#about-section" className="text-[#A1A1AA] hover:text-white transition-colors">
                About Us
              </a>
              <a href="#gallery-section" className="text-[#A1A1AA] hover:text-white transition-colors">
                Atmosphere
              </a>
              <a href="#location-section" className="text-[#A1A1AA] hover:text-white transition-colors">
                Location &amp; Hours
              </a>
            </nav>

            <div className="pt-6 border-t border-[#222222] w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71717A] gap-2">
              <p>Copyright &copy; F.R.I.E.N.D.S {settings?.restaurantName || 'Mereba Friends Garden'}. All rights reserved.</p>
              <p className="text-[#52525B]">Casual Luxury Dining &bull; Kebele 17, Mekelle</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full backdrop-blur-md border border-[#222222] text-white shadow-[0_10px_25px_rgba(0,0,0,0.8)] hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer animate-in fade-in"
          style={{
            backgroundColor: `${cardColor}E6`,
          }}
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
