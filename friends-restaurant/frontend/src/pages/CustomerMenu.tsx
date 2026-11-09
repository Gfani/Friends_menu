import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  AlertCircle,
  UtensilsCrossed,
  Sparkles,
  Search,
  Lock,
  ArrowUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { MenuHeader } from '../components/customer/MenuHeader';
import { CategoryTabs } from '../components/customer/CategoryTabs';
import { MenuCard } from '../components/customer/MenuCard';
import { MenuItem } from '../types/menu';
import { MerebaLogo } from '../components/common/MerebaLogo';

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

          {/* Official Restaurant Master Emblem Matching Menu Poster */}
          <div className="relative flex flex-col items-center justify-center mb-6 text-center w-full max-w-sm sm:max-w-md mx-auto">
            <MerebaLogo variant="full" />
          </div>

          {/* THE ONE WITH THE FOOD - Exact Title from Poster */}
          <div className="flex flex-col items-center mb-5">
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl tracking-[0.16em] uppercase font-bold text-center leading-tight text-white border-y border-[#303038] py-3.5 px-6 sm:px-12 bg-black/40 backdrop-blur-sm rounded-sm">
              THE ONE WITH THE FOOD
            </h1>
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
          <div className="text-center max-w-3xl mx-auto mb-6">
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
              Explore our chef-curated dishes. Tap any card to view full photography and preparation details.
            </p>
          </div>

          {/* STICKY FILTER & SEARCH BAR (Locks to top of viewport on scroll) */}
          <div className="sticky top-20 z-40 bg-[#131316]/95 backdrop-blur-xl py-3.5 -mx-4 px-4 sm:-mx-8 sm:px-8 border-y border-[#24242b]/90 shadow-[0_12px_28px_rgba(0,0,0,0.6)] mb-8 transition-all">
            <div className="max-w-xl mx-auto space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a] text-[20px] pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search pasta, rice, salad, soup..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-lg bg-[#19191d] text-white text-sm placeholder:text-[#71717a] border border-[#2b2b31] focus:border-[#FFBD18] focus:outline-none focus:ring-1 focus:ring-[#FFBD18]/50 transition-colors shadow-inner font-body"
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

              {/* Category Buttons Directly Underneath */}
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
              <h3 className="font-headline text-lg font-bold text-white">Our Address</h3>
              <p className="font-body text-xs text-[#a1a1aa] leading-relaxed">
                <strong className="text-white">17 ቀበሌ፣ ፊትለፊት በሰበርደ</strong><br />
                ናይቀደም ገዛ ተጋሩ<br />
                <span className="text-[#9d8f78]">Addis Ababa, Ethiopia</span>
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

            {/* Phone Lines & Socials */}
            <div className="bg-[#161619] border border-[#2b2b31] rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F32636]/15 flex items-center justify-center text-[#F32636] mx-auto">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-white">Contact &amp; Social</h3>
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-center gap-2">
                  <a href="tel:0970700488" className="text-[#FFBD18] hover:underline font-mono font-bold">
                    0970700488
                  </a>
                  <span className="text-zinc-600">&bull;</span>
                  <a href="tel:0945986349" className="text-[#FFBD18] hover:underline font-mono font-bold">
                    0945986349
                  </a>
                </div>
                <div className="pt-1.5 flex flex-col gap-0.5 text-[11px] text-[#9d8f78]">
                  <span>IG: @MEREBA_FRIENDS_GARDEN</span>
                  <span>TikTok: @FRIENDS_GARDEN</span>
                  <span>FB: FRIENDS GARDEN - መረባ ፍሬንድስ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="w-full bg-[#0e0e11] border-t border-[#26262d]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-14">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 relative">
              <MerebaLogo variant="full" className="w-44 sm:w-56" />
            </div>

            <p className="font-body text-xs text-[#a1a1aa] max-w-md mb-6">
              Intimate garden dining, artisan kitchen recipes, and timeless nostalgia in Addis Ababa.
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

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#18181d]/90 backdrop-blur-md border border-[#383842] text-[#FFBD18] shadow-[0_10px_25px_rgba(0,0,0,0.65)] hover:bg-[#FFBD18] hover:text-black hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer animate-in fade-in"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
