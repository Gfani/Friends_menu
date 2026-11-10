import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  AlertCircle,
  ArrowUp,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { MenuHeader } from '../components/customer/MenuHeader';
import { CategoryTabs } from '../components/customer/CategoryTabs';
import { MenuCard } from '../components/customer/MenuCard';
import { MenuItem } from '../types/menu';
import { MerebaLogo } from '../components/common/MerebaLogo';
import { FriendsDoodleRibbon } from '../components/customer/FriendsDoodleRibbon';

export const CustomerMenu: React.FC = () => {
  const { data: categories = [], isLoading, error, refetch } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

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

  // Total count of all items across categories
  const totalItemCount = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  }, [categories]);

  // Episode naming mapper for Friends themed category headers
  const getEpisodeTitle = (catSlugOrName: string) => {
    const upper = catSlugOrName.toUpperCase();
    if (upper === 'PASTA' || upper.includes('PASTA')) return 'THE ONE WITH THE PASTA';
    if (upper === 'RICE' || upper.includes('RICE')) return 'THE ONE WITH SAVORY GRAINS';
    if (upper === 'SALAD' || upper.includes('SALAD')) return 'THE ONE WITH FRESH GREENS';
    if (upper === 'SOUP' || upper.includes('SOUP')) return 'THE ONE WITH WARM BROTHS';
    return `THE ONE WITH ${upper}`;
  };

  // Compile all items in the exact layout order of physical menu
  const allOrderedItems = useMemo(() => {
    const pastaCat = categories.find((c) => c.slug === 'pasta' || c.name.toLowerCase() === 'pasta');
    const riceCat = categories.find((c) => c.slug === 'rice' || c.name.toLowerCase() === 'rice');
    const saladCat = categories.find((c) => c.slug === 'salad' || c.name.toLowerCase() === 'salad');
    const soupCat = categories.find((c) => c.slug === 'soup' || c.name.toLowerCase() === 'soup');

    const pastaItems = pastaCat?.items ? [...pastaCat.items] : [];
    const riceItems = riceCat?.items ? [...riceCat.items] : [];
    const saladItems = saladCat?.items ? [...saladCat.items] : [];
    const soupItems = soupCat?.items ? [...soupCat.items] : [];

    const carbonara = pastaItems.find((i) => i.name.toLowerCase().includes('carbonara'));
    const chickenRice = riceItems.find((i) => i.name.toLowerCase().includes('rice with chicken'));
    const specialSalad = saladItems.find((i) => i.name.toLowerCase().includes('special salad'));

    const remainingPasta = pastaItems.filter((i) => i !== carbonara);
    const remainingRice = riceItems.filter((i) => i !== chickenRice);
    const remainingSalad = saladItems.filter((i) => i !== specialSalad);

    const ordered: MenuItem[] = [];

    if (carbonara) ordered.push(carbonara);
    if (chickenRice) ordered.push(chickenRice);
    if (specialSalad) ordered.push(specialSalad);

    ordered.push(...remainingPasta);
    ordered.push(...remainingRice);
    ordered.push(...remainingSalad);
    ordered.push(...soupItems);

    return ordered;
  }, [categories]);

  // Filter items based on activeCategory tab and search query
  const displayedItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let itemsToFilter: MenuItem[] = [];

    if (activeCategory === 'all') {
      itemsToFilter = allOrderedItems;
    } else {
      const selectedCat = categories.find((c) => c.id === activeCategory);
      itemsToFilter = selectedCat?.items ? [...selectedCat.items] : [];
    }

    if (!q) return itemsToFilter;

    return itemsToFilter.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchTags = item.tags?.toLowerCase().includes(q) || false;
      const matchCat = item.category?.name.toLowerCase().includes(q) || false;
      return matchName || matchDesc || matchTags || matchCat;
    });
  }, [allOrderedItems, categories, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#050505] font-body text-[#A1A1AA] antialiased selection:bg-[#FFBD18] selection:text-black">
      {/* 1. FIXED TOP NAVIGATION BAR */}
      <MenuHeader />

      {/* 2. CINEMATIC HERO SECTION */}
      <section
        id="hero"
        className="relative w-full min-h-[75vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#050505]"
      >
        {/* Cinematic Backdrop Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQjFdPMT6MPSHhfz3xGny9WhrG0tunD7080m7gHIi0Gw3GWKM-NFf0vC4OqNPCH1p3qkDdwVVN7YQ1c0lXtKHvWMvrTuBidUrbUJKP5jWzTk8iBuzCrogtwBOBnB69cpI8eVw6laEf0iutrBtdi864k1vWS2csrdQrXOCSKE30tHIDMBaHP5mDX-dxfZgKP2U_cjYScmZyPENOnrAONzFLEfyKJ4lCIBGcZKWSj2ly')`,
          }}
        >
          {/* Vignette and Dark Tint Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-[#050505]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.95)_100%)]" />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          {/* Hallmark Heritage Badge (Clean Monochrome Luxury) */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#121212] border border-[#222222] mb-6">
            <span className="font-headline text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA] font-bold">
              BISTRO &bull; GARDEN &bull; CASUAL LUXURY
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
                <span>THE ONE</span>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-1">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#F32636]" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#16B9E8]" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFBD18]" />
                </span>
                <span>WITH</span>
              </span>

              {/* Line 2: THE FOOD */}
              <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.22em] sm:tracking-[0.28em] mt-1 sm:mt-2 leading-none text-white">
                THE FOOD
              </span>
            </h1>

            {/* Line 3: Tiny Golden Central Perk Couch Outline */}
            <div className="mt-3 text-[#FFBD18] opacity-80 hover:opacity-100 transition-opacity">
              <svg
                className="w-7 h-4 sm:w-8 sm:h-5 text-[#FFBD18]"
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
            Good food, great company, and timeless memories. Browse our hand-rolled pastas, hearty pilafs, fresh garden bowls, and slow-simmered broths.
          </p>

          {/* Primary CTA (Gold strictly restricted to primary action) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <a
              href="#menu-section"
              className="w-full sm:w-auto inline-flex items-center justify-center font-headline text-xs uppercase tracking-widest px-8 py-3.5 rounded-full bg-[#FFBD18] text-black font-extrabold hover:brightness-110 shadow-[0_0_20px_rgba(255,189,24,0.3)] transition-all cursor-pointer"
            >
              EXPLORE OUR MENU
            </a>
            <a
              href="#location-section"
              className="w-full sm:w-auto inline-flex items-center justify-center font-headline text-xs uppercase tracking-widest px-8 py-3.5 rounded-full bg-[#121212] text-white hover:bg-[#1a1a1a] border border-[#222222] hover:border-[#333333] transition-all font-semibold"
            >
              VISIT OUR GARDEN
            </a>
          </div>

          {/* Clean Stat Counters (Unified Luxury Typography: Crisp White Numbers + Gray Labels) */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mt-14 pt-8 border-t border-[#222222] text-center w-full">
            <div>
              <p className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight">11:00</p>
              <p className="font-headline text-[10px] sm:text-[11px] text-[#A1A1AA] uppercase tracking-widest mt-1 font-semibold">
                AM &bull; Daily Open
              </p>
            </div>
            <div className="border-x border-[#222222]">
              <p className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight">29+</p>
              <p className="font-headline text-[10px] sm:text-[11px] text-[#A1A1AA] uppercase tracking-widest mt-1 font-semibold">
                Artisan Dishes
              </p>
            </div>
            <div>
              <p className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight">100%</p>
              <p className="font-headline text-[10px] sm:text-[11px] text-[#A1A1AA] uppercase tracking-widest mt-1 font-semibold">
                Fresh To Order
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="w-16 h-[1px] bg-[#222222] mx-auto my-4" />

      {/* 3. DIGITAL MENU SECTION */}
      <section id="menu-section" className="w-full py-12 sm:py-16 bg-[#050505] relative">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 font-headline text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2 font-semibold">
              <span>Mereba Friends Garden &bull; Artisanal Kitchen</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl text-white tracking-wider uppercase font-extrabold">
              {activeCategory === 'all'
                ? 'THE ONE WITH THE MENU'
                : getEpisodeTitle(
                    categories.find((c) => c.id === activeCategory)?.name || activeCategory
                  )}
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#A1A1AA] mt-2">
              Explore our chef-curated dishes. Tap any card to view full photography and preparation details.
            </p>
          </div>

          {/* STICKY FILTER & SEARCH BAR */}
          <div className="sticky top-20 z-40 bg-[#050505]/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:-mx-8 sm:px-8 border-y border-[#222222] shadow-[0_12px_28px_rgba(0,0,0,0.8)] mb-10 transition-all">
            <div className="max-w-xl mx-auto space-y-3.5">
              {/* Search Bar */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] text-[20px] pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search pasta, rice, salad, soup..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-xl bg-[#121212] text-white text-sm placeholder:text-[#71717A] border border-[#222222] focus:border-[#FFBD18] focus:outline-none transition-colors shadow-inner font-body"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Buttons Underneath */}
              <div className="flex justify-center">
                <CategoryTabs
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelectCategory={setActiveCategory}
                  totalItemCount={totalItemCount}
                />
              </div>
            </div>
          </div>

          {/* Search Result Feedback */}
          {searchQuery.trim() !== '' && (
            <div className="flex items-center justify-between text-xs text-[#A1A1AA] pb-4 px-1 max-w-xl mx-auto">
              <span>
                Found <strong className="text-white">{displayedItems.length}</strong> {displayedItems.length === 1 ? 'dish' : 'dishes'} matching &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-white hover:underline font-headline uppercase tracking-wider text-[11px] font-semibold"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-24 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#FFBD18] animate-spin" />
              <p className="font-headline text-xs uppercase tracking-widest text-[#A1A1AA] pt-2">
                Loading Menu...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-6 bg-[#121212] border border-[#222222] rounded-xl text-center space-y-3 max-w-md mx-auto">
              <AlertCircle className="w-8 h-8 text-[#A1A1AA] mx-auto" />
              <h4 className="font-headline text-lg font-bold text-white">Could not load the menu</h4>
              <p className="text-xs text-[#A1A1AA]">{(error as any)?.message}</p>
              <button
                onClick={() => refetch()}
                className="px-5 py-2 bg-[#181818] border border-[#282828] text-white text-xs font-headline uppercase font-semibold rounded-lg hover:bg-[#222222]"
              >
                Retry
              </button>
            </div>
          )}

          {/* No Search Results */}
          {!isLoading && !error && displayedItems.length === 0 && (
            <div className="py-16 text-center bg-[#121212] rounded-2xl border border-[#222222] p-8 max-w-lg mx-auto">
              <p className="font-headline text-lg text-white font-bold">No dishes match your search.</p>
              <p className="font-body text-xs text-[#A1A1AA] mt-1">
                Try searching for pasta, rice, salad, soup, or select another section tab above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-5 px-6 py-2.5 bg-[#FFBD18] text-black text-xs font-headline uppercase font-extrabold rounded-full hover:brightness-110 transition-all cursor-pointer"
              >
                Show All Dishes
              </button>
            </div>
          )}

          {/* 3-COLUMN LUXURY MENU CARDS GRID (Generous Whitespace & Padding) */}
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
        className="w-full py-20 sm:py-24 bg-[#080808] relative overflow-hidden border-t border-[#222222]"
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 font-headline text-xs text-[#A1A1AA] tracking-[0.2em] uppercase mb-2 font-semibold">
                Our Philosophy
              </div>
              <h2 className="font-headline text-2xl sm:text-4xl text-white uppercase font-extrabold leading-tight mb-4 tracking-wide">
                MORE THAN FOOD.
                <br />
                <span>IT’S ABOUT FRIENDSHIP.</span>
              </h2>
              <p className="font-body text-sm sm:text-base text-[#A1A1AA] leading-relaxed mb-6">
                Central Perk meets modern boutique lounge. Designed as a sanctuary for heartfelt conversations, spontaneous laughter, and unforgettable comfort food in our garden.
              </p>

              <div className="p-5 rounded-2xl bg-[#121212] border border-[#222222] w-full mb-6">
                <p className="font-headline text-base text-white italic font-semibold">
                  &ldquo;Because Joey doesn’t share food, but we definitely think you should.&rdquo;
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
              <div className="sm:col-span-2 p-6 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#333333] transition-all flex flex-col md:flex-row items-start md:items-center gap-5">
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

              <div className="p-6 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mb-4">
                  <span className="material-symbols-outlined text-[26px]">skillet</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-white mb-1 font-bold">
                    Handcrafted Flavors
                  </h3>
                  <p className="font-body text-xs text-[#A1A1AA] leading-relaxed">
                    Authentic slow-cooked pastas, fragrant poultry risottos, and garden-fresh salads assembled à la minute.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mb-4">
                  <span className="material-symbols-outlined text-[26px]">nightlife</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-white mb-1 font-bold">
                    Could This BE Any Cozier?
                  </h3>
                  <p className="font-body text-xs text-[#A1A1AA] leading-relaxed">
                    Warm Edison lights, velvet textures, low ambient acoustics, and a relaxed garden sanctuary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL GALLERY SECTION: THE ONE WITH THE GOOD TIMES */}
      <section id="gallery-section" className="w-full py-20 sm:py-24 bg-[#050505] border-t border-[#222222]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 font-headline text-xs text-[#A1A1AA] tracking-[0.2em] uppercase mb-2 font-semibold">
                Atmosphere &amp; Plates
              </div>
              <h2 className="font-headline text-2xl sm:text-4xl text-white uppercase font-extrabold tracking-wide">
                THE ONE WITH THE GOOD TIMES
              </h2>
            </div>
            <p className="font-body text-xs text-[#A1A1AA] max-w-md leading-relaxed">
              A glimpse into our candlelit tables, laughter-filled dinners, and passionate artisan cooking in Mereba Friends Garden.
            </p>
          </div>

          {/* Bento Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7 h-[380px] md:h-[460px] rounded-2xl overflow-hidden relative group border border-[#222222]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChzIo3fvLtHNTV_NV_TQKQHIHbHJa_DoJd67cOCdkiGWSXw3yYggSTldhqldn7AnLZlsHLoS2Gtr6Wot94LNbgCk87skihTLsswinnxcmcDKwcxGyEt6rS5Lmaec7piE1L4UPxY-1udCVfMZ8s9CmYt0yozYw4TdNkZ3p9cTuUiqKmvJ-AjYgl3V4PUcyEXVXUUem7_VrWyXLQCMv1uhmUJs1-ds0GX55O3LkGoC6Q"
                alt="Atmospheric dining room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-headline text-xs text-[#A1A1AA] tracking-widest uppercase mb-1 block font-bold">
                  Nocturnal Sanctuary
                </span>
                <h3 className="font-headline text-xl text-white font-extrabold">
                  Candlelit Conversation Tables
                </h3>
                <p className="font-body text-xs text-[#A1A1AA] max-w-sm mt-1">
                  Designed for evening talks, toasts, and timeless nostalgia.
                </p>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-5">
              <div className="h-[180px] md:h-[218px] rounded-2xl overflow-hidden relative group border border-[#222222]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7e0kf06W5SHAj1eENzX5m7AAUfsxKxkNxcD5fmFGi5ZUtwwez8ZP3cxMJzV0UcelksPuY5HbF2TQ9I4Lcamkslpfbr4Az7zL60yfol09XN-QsKww9w6BNJvulqrLCfNYIi2EMs0lmJq_jS9lH6HsF-m2-zX_h4rMwbyiC8Tf2tXqoI5y8vxpLvF2ZwE9w6QdUvSUMJ6R-bna1AJPozvHP6oG8dgh6Xt9AuGsgOu2a"
                  alt="Pasta plated exquisitely"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-headline text-[10px] text-[#A1A1AA] tracking-wider uppercase font-bold">
                    Handmade Daily
                  </span>
                  <p className="font-headline text-base text-white font-bold">Pasta Perfection</p>
                </div>
              </div>

              <div className="h-[180px] md:h-[218px] rounded-2xl overflow-hidden relative group border border-[#222222]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdOLhUHY5ZMo-brlPq6JwTqL9LYQ9IpeGtwdffKrX4HL3sSounm1BEU_7pnA1srIyq1P8dKgh5R9IxYJr2U4KGsGBl7kr_A0EBRHFD3nLhjmnoRK0BWKLEwM-OiYDNeZ9E9267bT3zjzKPaXlfnGMP6wvNsL_AtR6xO2zOum9LUkQ1-Q25pg4a-6L-2aY5vs04EKefElAwb2F5-pvHlVB_YjlY-q0s9JbeJJPNKfgH"
                  alt="Savory rice with chicken"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-headline text-[10px] text-[#A1A1AA] tracking-wider uppercase font-bold">
                    Chef Recommendation
                  </span>
                  <p className="font-headline text-base text-white font-bold">Signature Herb Chicken Pilaf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCATION & OPERATING HOURS */}
      <section
        id="location-section"
        className="w-full py-20 sm:py-24 bg-[#080808] relative border-t border-[#222222]"
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 font-headline text-xs text-[#A1A1AA] tracking-[0.2em] uppercase mb-2 font-semibold">
              <span>Mereba Friends Garden</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl text-white uppercase font-extrabold tracking-wide">
              THE ONE WHERE YOU VISIT US
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#A1A1AA] mt-2 leading-relaxed">
              Walk-ins are welcomed with open arms. Enjoy outdoor garden seating and intimate indoor dining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Location Card */}
            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-7 text-center space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mx-auto">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Our Address</h3>
              <p className="font-body text-xs text-[#A1A1AA] leading-relaxed">
                <strong className="text-white">17 ቀበሌ፣ ፊትለፊት በሰበርደ</strong><br />
                <span>ናይቀደም ገዛ ተጋሩ</span>
              </p>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-7 text-center space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mx-auto">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Dining Hours</h3>
              <p className="font-body text-xs text-[#A1A1AA] leading-relaxed">
                Monday &ndash; Sunday<br />
                <strong className="text-white font-headline text-sm font-bold">11:00 AM &ndash; 11:00 PM</strong><br />
                <span className="text-[#71717A]">Kitchen closes at 10:30 PM</span>
              </p>
            </div>

            {/* Phone Lines & Socials */}
            <div className="bg-[#121212] border border-[#222222] rounded-2xl p-7 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-white mx-auto">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Contact &amp; Social</h3>

              <div className="flex flex-col gap-2 text-xs">
                {/* Direct Dial Phone Links */}
                <div className="flex items-center justify-center gap-2">
                  <a
                    href="tel:0970700488"
                    className="inline-flex items-center gap-1 text-white hover:text-[#FFBD18] font-mono font-bold transition-colors py-0.5"
                    title="Call 0970700488"
                  >
                    <span>0970700488</span>
                  </a>
                  <span className="text-zinc-600">&bull;</span>
                  <a
                    href="tel:0945986349"
                    className="inline-flex items-center gap-1 text-white hover:text-[#FFBD18] font-mono font-bold transition-colors py-0.5"
                    title="Call 0945986349"
                  >
                    <span>0945986349</span>
                  </a>
                </div>

                {/* Clickable Social Media Links */}
                <div className="pt-2 flex flex-col gap-2 text-xs">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/mereba_friends_garden/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#161616] hover:bg-[#1c1c1c] border border-[#222222] hover:border-[#333333] text-[#A1A1AA] hover:text-white transition-all text-[11px]"
                    title="Visit our Instagram @MEREBA_FRIENDS_GARDEN"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#A1A1AA] group-hover:text-white transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                      <span>IG: @MEREBA_FRIENDS_GARDEN</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@friends_garden"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#161616] hover:bg-[#1c1c1c] border border-[#222222] hover:border-[#333333] text-[#A1A1AA] hover:text-white transition-all text-[11px]"
                    title="Visit our TikTok @FRIENDS_GARDEN"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#A1A1AA] group-hover:text-white transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                      </svg>
                      <span>TikTok: @FRIENDS_GARDEN</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/search/top?q=FRIENDS%20GARDEN%20-%20%E1%88%98%E1%88%A8%E1%89%A3%20%E1%87%8D%E1%88%AC%E1%8A%95%E1%8B%95%E1%88%B5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#161616] hover:bg-[#1c1c1c] border border-[#222222] hover:border-[#333333] text-[#A1A1AA] hover:text-white transition-all text-[11px]"
                    title="Visit our Facebook Page"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#A1A1AA] group-hover:text-white transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="truncate">FB: FRIENDS GARDEN - መረባ ፍሬንድስ</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AUTHENTIC FRIENDS DOODLE RIBBON (Casual Luxury Monochrome) */}
      <FriendsDoodleRibbon />

      {/* 8. FOOTER */}
      <footer className="w-full bg-[#050505] border-t border-[#222222]">
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
                className="w-10 h-10 rounded-full bg-[#121212] border border-[#222222] hover:border-[#333333] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all hover:scale-105"
                title="Instagram @MEREBA_FRIENDS_GARDEN"
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
                className="w-10 h-10 rounded-full bg-[#121212] border border-[#222222] hover:border-[#333333] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all hover:scale-105"
                title="TikTok @FRIENDS_GARDEN"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                </svg>
              </a>

              <a
                href="https://www.facebook.com/search/top?q=FRIENDS%20GARDEN%20-%20%E1%88%98%E1%88%A8%E1%89%A3%20%E1%87%8D%E1%88%AC%E1%8A%95%E1%8B%95%E1%88%B5"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#121212] border border-[#222222] hover:border-[#333333] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all hover:scale-105"
                title="Facebook FRIENDS GARDEN"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="tel:0970700488"
                className="w-10 h-10 rounded-full bg-[#121212] border border-[#222222] hover:border-[#333333] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all hover:scale-105"
                title="Call 0970700488"
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
              <p>Copyright &copy; F.R.I.E.N.D.S Mereba Friends Garden. All rights reserved.</p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors font-headline uppercase tracking-wider font-semibold"
              >
                <Lock className="w-3 h-3" />
                <span>Staff Console</span>
              </Link>
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
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#121212]/90 backdrop-blur-md border border-[#222222] text-white shadow-[0_10px_25px_rgba(0,0,0,0.8)] hover:bg-[#FFBD18] hover:text-black hover:border-[#FFBD18] hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer animate-in fade-in"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
