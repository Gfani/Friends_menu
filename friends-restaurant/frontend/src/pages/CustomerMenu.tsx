import React, { useState, useMemo } from 'react';
import {
  X,
  AlertCircle,
  UtensilsCrossed,
  Sparkles,
  Search,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { MenuHeader } from '../components/customer/MenuHeader';
import { CategoryTabs } from '../components/customer/CategoryTabs';
import { MenuCard } from '../components/customer/MenuCard';
import { MenuItem } from '../types/menu';

export const CustomerMenu: React.FC = () => {
  const { data: categories = [], isLoading, error, refetch } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Compile all items in the exact layout order of Screenshot 1:
  // Top 3 featured headliners: Spaghetti Carbonara, Rice with Chicken, Special Salad
  // Followed by the rest of Pasta, then Rice, then Salad, then Soup
  const allOrderedItems = useMemo(() => {
    const pastaCat = categories.find((c) => c.slug === 'pasta' || c.name.toLowerCase() === 'pasta');
    const riceCat = categories.find((c) => c.slug === 'rice' || c.name.toLowerCase() === 'rice');
    const saladCat = categories.find((c) => c.slug === 'salad' || c.name.toLowerCase() === 'salad');
    const soupCat = categories.find((c) => c.slug === 'soup' || c.name.toLowerCase() === 'soup');

    const pastaItems = pastaCat?.items ? [...pastaCat.items] : [];
    const riceItems = riceCat?.items ? [...riceCat.items] : [];
    const saladItems = saladCat?.items ? [...saladCat.items] : [];
    const soupItems = soupCat?.items ? [...soupCat.items] : [];

    // Find the 3 top featured dishes
    const carbonara = pastaItems.find((i) => i.name.toLowerCase().includes('carbonara'));
    const chickenRice = riceItems.find((i) => i.name.toLowerCase().includes('rice with chicken'));
    const specialSalad = saladItems.find((i) => i.name.toLowerCase().includes('special salad'));

    // Remaining items excluding the featured headliners
    const remainingPasta = pastaItems.filter((i) => i !== carbonara);
    const remainingRice = riceItems.filter((i) => i !== chickenRice);
    const remainingSalad = saladItems.filter((i) => i !== specialSalad);

    const ordered: MenuItem[] = [];

    // Row 1: Top 3 Headliners
    if (carbonara) ordered.push(carbonara);
    if (chickenRice) ordered.push(chickenRice);
    if (specialSalad) ordered.push(specialSalad);

    // Remaining categories in structured order
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
    <div className="min-h-screen bg-[#131316] font-body text-[#e4e1e6] antialiased selection:bg-[#FFBD18] selection:text-black">
      {/* 1. FIXED TOP NAVIGATION BAR */}
      <MenuHeader />

      {/* 2. CINEMATIC HERO SECTION */}
      <section
        id="hero"
        className="relative w-full min-h-[75vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0e0e11]"
      >
        {/* Cinematic Backdrop Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQjFdPMT6MPSHhfz3xGny9WhrG0tunD7080m7gHIi0Gw3GWKM-NFf0vC4OqNPCH1p3qkDdwVVN7YQ1c0lXtKHvWMvrTuBidUrbUJKP5jWzTk8iBuzCrogtwBOBnB69cpI8eVw6laEf0iutrBtdi864k1vWS2csrdQrXOCSKE30tHIDMBaHP5mDX-dxfZgKP2U_cjYScmZyPENOnrAONzFLEfyKJ4lCIBGcZKWSj2ly')`,
          }}
        >
          {/* Vignette and Dark Tint Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#0e0e11]/85 to-[#0e0e11]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(14,14,17,0.92)_100%)]" />
        </div>

        {/* Friends Signature Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#F32636]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#16B9E8]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFBD18]/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          {/* Hallmark Heritage Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1b1f]/80 backdrop-blur-md border border-[#35353d] mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#F32636] shadow-[0_0_8px_#F32636]" />
            <span className="w-2 h-2 rounded-full bg-[#16B9E8] shadow-[0_0_8px_#16B9E8]" />
            <span className="w-2 h-2 rounded-full bg-[#FFBD18] shadow-[0_0_8px_#FFBD18]" />
            <span className="font-headline text-[11px] uppercase tracking-[0.25em] text-[#d4c4ac] font-bold pl-1">
              BISTRO &bull; GARDEN &bull; EST. ADDIS ABABA
            </span>
          </div>

          {/* Main Theatrical Friends Title */}
          <div className="flex flex-col items-center mb-3">
            <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl tracking-widest uppercase font-extrabold text-center leading-tight text-white">
              THE ONE
              <span className="inline-flex items-center mx-2.5 align-middle">
                <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F32636] shadow-[0_0_12px_rgba(243,38,54,0.8)] mx-1" />
                <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#16B9E8] shadow-[0_0_12px_rgba(22,185,232,0.8)] mx-1" />
                <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#FFBD18] shadow-[0_0_12px_rgba(255,189,24,0.8)] mx-1" />
              </span>
              WITH THE FOOD
            </h1>
          </div>

          {/* Velvet Couch Motif */}
          <div className="flex items-center justify-center gap-2 mb-4 text-[#FFBD18]">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 10V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v3a4 4 0 0 0-2 3.44V18a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h14v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4.56A4 4 0 0 0 20 10zM6 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3H6V7zm14 8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V15z" />
            </svg>
          </div>

          <p className="font-body text-sm sm:text-base text-[#a1a1aa] max-w-2xl mx-auto mb-8 tracking-wide leading-relaxed">
            Good food, great company, and timeless memories. Browse our hand-rolled pastas, hearty pilafs, fresh garden bowls, and slow-simmered broths.
          </p>

          {/* Direct CTA to Menu */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <a
              href="#menu-section"
              className="w-full sm:w-auto inline-flex items-center justify-center font-headline text-xs uppercase tracking-widest px-8 py-3.5 rounded bg-[#FFBD18] text-black font-extrabold hover:brightness-110 shadow-[0_0_20px_rgba(255,189,24,0.4)] transition-all"
            >
              EXPLORE OUR MENU
            </a>
            <a
              href="#location-section"
              className="w-full sm:w-auto inline-flex items-center justify-center font-headline text-xs uppercase tracking-widest px-8 py-3.5 rounded bg-[#1f1f24] text-[#ffe0aa] hover:text-white border border-[#35353d] hover:border-[#FFBD18]/60 transition-all font-semibold"
            >
              VISIT OUR GARDEN
            </a>
          </div>

          {/* Micro Stats Bar */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mt-12 pt-6 border-t border-[#26262d] text-center w-full">
            <div>
              <p className="font-headline text-2xl text-white font-extrabold">11:00</p>
              <p className="font-headline text-[10px] text-[#9d8f78] uppercase tracking-widest mt-0.5 font-semibold">
                AM &bull; Daily Open
              </p>
            </div>
            <div className="border-x border-[#26262d]">
              <p className="font-headline text-2xl text-[#FFBD18] font-extrabold">29+</p>
              <p className="font-headline text-[10px] text-[#9d8f78] uppercase tracking-widest mt-0.5 font-semibold">
                Artisan Dishes
              </p>
            </div>
            <div>
              <p className="font-headline text-2xl text-[#16B9E8] font-extrabold">100%</p>
              <p className="font-headline text-[10px] text-[#9d8f78] uppercase tracking-widest mt-0.5 font-semibold">
                Fresh To Order
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE THREE-DOT HERO SEPARATOR */}
      <div className="w-full py-3 bg-[#131316] flex items-center justify-center gap-3">
        <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#33333a]" />
        <span className="w-2 h-2 rounded-full bg-[#F32636] shadow-[0_0_8px_#F32636]" />
        <span className="w-2 h-2 rounded-full bg-[#16B9E8] shadow-[0_0_8px_#16B9E8]" />
        <span className="w-2 h-2 rounded-full bg-[#FFBD18] shadow-[0_0_8px_#FFBD18]" />
        <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#33333a]" />
      </div>

      {/* 4. DIGITAL MENU SECTION (EXACT MATCH TO SCREENSHOTS 1, 2 & 3) */}
      <section id="menu-section" className="w-full py-10 bg-[#131316] relative">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 font-headline text-xs uppercase tracking-widest text-[#FFBD18] mb-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F32636]" />
              <span>Mereba Friends Garden &bull; Artisanal Kitchen</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#16B9E8]" />
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl text-white tracking-wide uppercase font-extrabold">
              {activeCategory === 'all'
                ? 'THE ONE WITH THE MENU'
                : getEpisodeTitle(
                    categories.find((c) => c.id === activeCategory)?.name || activeCategory
                  )}
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#a1a1aa] mt-1.5">
              Tap any dish card or the <span className="font-mono text-[#FFBD18] font-bold">^</span> icon to view photo, full description, and fresh ingredients.
            </p>

            {/* SCREENSHOT 2: SEARCH BAR */}
            <div className="mt-6 relative max-w-xl mx-auto">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a] text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search pasta, rice, salad, soup..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-md bg-[#19191d] text-white text-sm placeholder:text-[#71717a] border border-[#2b2b31] focus:border-[#FFBD18] focus:outline-none focus:ring-1 focus:ring-[#FFBD18]/50 transition-colors shadow-inner font-body"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* SCREENSHOT 2: RECTANGULAR CATEGORY BUTTONS DIRECTLY UNDERNEATH */}
            <div className="mt-4 flex justify-center">
              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                totalItemCount={totalItemCount}
              />
            </div>
          </div>

          {/* Search Result Feedback */}
          {searchQuery.trim() !== '' && (
            <div className="flex items-center justify-between text-xs text-[#a1a1aa] pb-4 px-1 max-w-xl mx-auto">
              <span>
                Found <strong className="text-[#FFBD18]">{displayedItems.length}</strong> {displayedItems.length === 1 ? 'dish' : 'dishes'} matching &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#16B9E8] hover:underline font-headline uppercase tracking-wider text-[11px] font-semibold"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#F32636] animate-ping" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#16B9E8] animate-ping delay-100" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD18] animate-ping delay-200" />
              </div>
              <p className="font-headline text-xs uppercase tracking-widest text-[#9d8f78] pt-2">
                Loading Mereba Kitchen Menu...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-6 bg-[#18181c] border border-[#F32636]/40 rounded-lg text-center space-y-3 max-w-md mx-auto">
              <AlertCircle className="w-8 h-8 text-[#F32636] mx-auto" />
              <h4 className="font-headline text-lg font-bold text-white">Could not load the menu</h4>
              <p className="text-xs text-[#a1a1aa]">{(error as any)?.message}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[#F32636] text-white text-xs font-headline uppercase font-semibold rounded hover:brightness-110"
              >
                Retry
              </button>
            </div>
          )}

          {/* No Search Results */}
          {!isLoading && !error && displayedItems.length === 0 && (
            <div className="py-16 text-center bg-[#161619] rounded-lg border border-[#2b2b31] p-8 max-w-lg mx-auto">
              <span className="material-symbols-outlined text-[48px] text-[#9d8f78] mb-2">
                sentiment_dissatisfied
              </span>
              <p className="font-headline text-lg text-white font-bold">No dishes match your search.</p>
              <p className="font-body text-xs text-[#a1a1aa] mt-1">
                Try searching for pasta, rice, salad, soup, or select another category tab above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-5 py-2.5 bg-[#FFBD18] text-black text-xs font-headline uppercase font-bold rounded hover:brightness-110 transition-all"
              >
                Show All Dishes
              </button>
            </div>
          )}

          {/* 3-COLUMN LUXURY BENTO MENU CARDS GRID */}
          {!isLoading && !error && displayedItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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

      {/* 5. ABOUT US & NARRATIVE STORYTELLING */}
      <section
        id="about-section"
        className="w-full py-16 bg-[#0e0e11] relative overflow-hidden border-t border-[#26262d]"
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 font-headline text-xs text-[#F32636] tracking-widest uppercase mb-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#F32636] shadow-[0_0_8px_#F32636]" />
                Our Philosophy
              </div>
              <h2 className="font-headline text-2xl sm:text-4xl text-white uppercase font-extrabold leading-tight mb-4">
                MORE THAN FOOD.
                <br />
                <span className="text-[#FFBD18]">IT’S ABOUT FRIENDSHIP.</span>
              </h2>
              <p className="font-body text-sm sm:text-base text-[#a1a1aa] leading-relaxed mb-4">
                Central Perk meets modern gastronomy. Designed as a sanctuary for heartfelt conversations, spontaneous laughter, and unforgettable comfort food in Addis Ababa.
              </p>

              <div className="p-4 rounded-lg bg-[#161619] border border-[#2b2b31] w-full mb-4">
                <p className="font-headline text-base text-[#FFBD18] italic font-semibold">
                  &ldquo;Because Joey doesn’t share food, but we definitely think you should.&rdquo;
                </p>
                <p className="font-headline text-[11px] text-[#9d8f78] uppercase tracking-wider mt-2 font-bold">
                  &mdash; The Kitchen Manifesto
                </p>
              </div>

              {/* Velvet Nook Lounge */}
              <div className="flex items-center gap-4 pt-1">
                <div className="w-12 h-12 rounded-full bg-[#1b1b1f] flex items-center justify-center border border-[#35353d] text-[#FFBD18]">
                  <span className="material-symbols-outlined text-[24px]">chair</span>
                </div>
                <div>
                  <p className="font-headline text-xs uppercase tracking-wider text-white font-bold">
                    The Velvet Nook Lounge
                  </p>
                  <p className="font-body text-xs text-[#9d8f78]">
                    Intimate booths &amp; acoustic jazz evenings
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Feature Cards Bento */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 p-6 rounded-xl bg-[#161619] border border-[#2b2b31] hover:border-[#FFBD18]/50 transition-all flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#1f1f24] flex-shrink-0 flex items-center justify-center text-[#FFBD18]">
                  <span className="material-symbols-outlined text-[32px]">dinner_dining</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-white mb-1 font-bold">
                    The Central Table
                  </h3>
                  <p className="font-body text-xs text-[#a1a1aa]">
                    Community seating and private candlelight setups modeled after comfortable Greenwich Village gathering spots.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#161619] border border-[#2b2b31] hover:border-[#F32636]/50 transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#1f1f24] flex items-center justify-center text-[#F32636] mb-4">
                  <span className="material-symbols-outlined text-[28px]">skillet</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-white mb-1 font-bold">
                    Handcrafted Flavors
                  </h3>
                  <p className="font-body text-xs text-[#a1a1aa]">
                    Authentic slow-cooked pastas, fragrant poultry risottos, and farm-fresh organic salads assembled à la minute.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#161619] border border-[#2b2b31] hover:border-[#16B9E8]/50 transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#1f1f24] flex items-center justify-center text-[#16B9E8] mb-4">
                  <span className="material-symbols-outlined text-[28px]">nightlife</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-white mb-1 font-bold">
                    Could This BE Any Cozier?
                  </h3>
                  <p className="font-body text-xs text-[#a1a1aa]">
                    Warm retro Edison bulbs, velvet textures, low ambient acoustics, and a warm welcoming garden atmosphere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL GALLERY SECTION: THE ONE WITH THE GOOD TIMES */}
      <section id="gallery-section" className="w-full py-16 bg-[#131316] border-t border-[#26262d]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 font-headline text-xs text-[#FFBD18] tracking-widest uppercase mb-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD18]" />
                Atmosphere &amp; Plates
              </div>
              <h2 className="font-headline text-2xl sm:text-4xl text-white uppercase font-extrabold tracking-wide">
                THE ONE WITH THE GOOD TIMES
              </h2>
            </div>
            <p className="font-body text-xs text-[#a1a1aa] max-w-md">
              A glimpse into our candlelit tables, laughter-filled dinners, and passionate artisan cooking in Mereba Friends Garden.
            </p>
          </div>

          {/* Masonry Style Bento Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 h-[380px] md:h-[460px] rounded-xl overflow-hidden relative group border border-[#2b2b31]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChzIo3fvLtHNTV_NV_TQKQHIHbHJa_DoJd67cOCdkiGWSXw3yYggSTldhqldn7AnLZlsHLoS2Gtr6Wot94LNbgCk87skihTLsswinnxcmcDKwcxGyEt6rS5Lmaec7piE1L4UPxY-1udCVfMZ8s9CmYt0yozYw4TdNkZ3p9cTuUiqKmvJ-AjYgl3V4PUcyEXVXUUem7_VrWyXLQCMv1uhmUJs1-ds0GX55O3LkGoC6Q"
                alt="Atmospheric dining room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11]/90 via-[#0e0e11]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-headline text-xs text-[#FFBD18] tracking-widest uppercase mb-1 block font-bold">
                  Nocturnal Sanctuary
                </span>
                <h3 className="font-headline text-xl text-white font-extrabold">
                  Candlelit Conversation Tables
                </h3>
                <p className="font-body text-xs text-[#a1a1aa] max-w-sm mt-1">
                  Designed for long evening talks, birthday toasts, and timeless nostalgia.
                </p>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="h-[180px] md:h-[222px] rounded-xl overflow-hidden relative group border border-[#2b2b31]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7e0kf06W5SHAj1eENzX5m7AAUfsxKxkNxcD5fmFGi5ZUtwwez8ZP3cxMJzV0UcelksPuY5HbF2TQ9I4Lcamkslpfbr4Az7zL60yfol09XN-QsKww9w6BNJvulqrLCfNYIi2EMs0lmJq_jS9lH6HsF-m2-zX_h4rMwbyiC8Tf2tXqoI5y8vxpLvF2ZwE9w6QdUvSUMJ6R-bna1AJPozvHP6oG8dgh6Xt9AuGsgOu2a"
                  alt="Pasta plated exquisitely"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="font-headline text-[10px] text-[#F32636] tracking-wider uppercase font-bold">
                    Handmade Daily
                  </span>
                  <p className="font-headline text-base text-white font-bold">Pasta Perfection</p>
                </div>
              </div>

              <div className="h-[180px] md:h-[222px] rounded-xl overflow-hidden relative group border border-[#2b2b31]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdOLhUHY5ZMo-brlPq6JwTqL9LYQ9IpeGtwdffKrX4HL3sSounm1BEU_7pnA1srIyq1P8dKgh5R9IxYJr2U4KGsGBl7kr_A0EBRHFD3nLhjmnoRK0BWKLEwM-OiYDNeZ9E9267bT3zjzKPaXlfnGMP6wvNsL_AtR6xO2zOum9LUkQ1-Q25pg4a-6L-2aY5vs04EKefElAwb2F5-pvHlVB_YjlY-q0s9JbeJJPNKfgH"
                  alt="Savory rice with chicken"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="font-headline text-[10px] text-[#16B9E8] tracking-wider uppercase font-bold">
                    Chef Recommendation
                  </span>
                  <p className="font-headline text-base text-white font-bold">Signature Herb Chicken Pilaf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOCATION & OPERATING HOURS */}
      <section
        id="location-section"
        className="w-full py-16 bg-[#0e0e11] relative border-t border-[#26262d]"
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 font-headline text-xs text-[#FFBD18] tracking-widest uppercase mb-1 font-bold">
              <span>Mereba Friends Garden &bull; Addis Ababa</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl text-white uppercase font-extrabold tracking-wide">
              THE ONE WHERE YOU VISIT US
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#a1a1aa] mt-2">
              Walk-ins are welcomed with open arms. Enjoy outdoor garden seating and intimate indoor dining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Location Card */}
            <div className="bg-[#161619] border border-[#2b2b31] rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FFBD18]/15 flex items-center justify-center text-[#FFBD18] mx-auto">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Our Location</h3>
              <p className="font-body text-xs text-[#a1a1aa] leading-relaxed">
                Mereba Friends Garden<br />
                Addis Ababa, Ethiopia<br />
                <span className="text-[#9d8f78]">Valet &amp; private parking available on site</span>
              </p>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#161619] border border-[#2b2b31] rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#16B9E8]/15 flex items-center justify-center text-[#16B9E8] mx-auto">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Dining Hours</h3>
              <p className="font-body text-xs text-[#a1a1aa] leading-relaxed">
                Monday &ndash; Sunday<br />
                <strong className="text-[#FFBD18] font-headline">11:00 AM &ndash; 11:00 PM</strong><br />
                <span className="text-[#9d8f78]">Kitchen closes at 10:30 PM</span>
              </p>
            </div>

            {/* Phone Lines */}
            <div className="bg-[#161619] border border-[#2b2b31] rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F32636]/15 flex items-center justify-center text-[#F32636] mx-auto">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Concierge</h3>
              <div className="flex flex-col gap-1 text-xs">
                <a href="tel:0970700488" className="text-[#ffe0aa] hover:underline font-mono font-bold">
                  0970700488
                </a>
                <a href="tel:0945986349" className="text-[#ffe0aa] hover:underline font-mono font-bold">
                  0945986349
                </a>
                <span className="text-[11px] text-[#9d8f78] mt-1 font-mono">
                  IG: @mereba_friends_garden
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="w-full bg-[#0e0e11] border-t border-[#26262d]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-14">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <img
                src="https://lh3.googleusercontent.com/aida/ALJJyrDUr9Msf7Rqm_xrgJk3zZrkdpeOrE-c1lC2_A-j4OKxzMBp6I4bibtzvT_w1OqHHkn-0lziRaVWAxMZgxaB3oVgXL6k1LeiYXmNt9o6Hr_h032NTfUS2xfu3t3LdZqIY3S3ekiA1pgztls8hPtxmdMphFdw0Z51dI3Ge8rPUtHLT5qrnGDjRtNDhxVL_KzURJVH4eTEwkt_zStL7ldsBaW2F2KK4Kvq3tOkF65Xzbtq"
                alt="F.R.I.E.N.D.S Restaurant Logo Dark"
                className="h-10 w-auto object-contain mx-auto"
              />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#F32636] shadow-[0_0_8px_#F32636]" />
              <span className="font-headline text-lg sm:text-xl text-[#FFBD18] tracking-widest uppercase font-extrabold">
                &ldquo;WE&apos;LL BE THERE FOR YOU.&rdquo;
              </span>
              <span className="w-2 h-2 rounded-full bg-[#16B9E8] shadow-[0_0_8px_#16B9E8]" />
              <span className="w-2 h-2 rounded-full bg-[#FFBD18] shadow-[0_0_8px_#FFBD18]" />
            </div>

            <p className="font-body text-xs text-[#a1a1aa] max-w-md mb-6">
              Intimate metropolitan dining, artisan kitchen recipes, and tactile nostalgia in dark luxury.
            </p>

            <nav className="flex flex-wrap items-center justify-center gap-6 mb-6 font-headline text-xs uppercase tracking-widest font-semibold">
              <a href="#hero" className="text-[#ffe0aa] hover:text-white transition-colors">
                Home
              </a>
              <a href="#menu-section" className="text-[#a1a1aa] hover:text-white transition-colors">
                Our Menu
              </a>
              <a href="#about-section" className="text-[#a1a1aa] hover:text-white transition-colors">
                About Us
              </a>
              <a href="#gallery-section" className="text-[#a1a1aa] hover:text-white transition-colors">
                Atmosphere
              </a>
              <a href="#location-section" className="text-[#a1a1aa] hover:text-white transition-colors">
                Location &amp; Hours
              </a>
            </nav>

            <div className="pt-4 border-t border-[#26262d] w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71717a] gap-2">
              <p>Copyright &copy; F.R.I.E.N.D.S Mereba Friends Garden. All rights reserved.</p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-[#a1a1aa] hover:text-[#FFBD18] transition-colors font-headline uppercase tracking-wider font-semibold"
              >
                <Lock className="w-3 h-3" />
                <span>Staff &amp; Admin Console</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
