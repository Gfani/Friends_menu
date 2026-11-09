import React, { useState, useMemo } from 'react';
import {
  X,
  AlertCircle,
  UtensilsCrossed,
  Phone,
  Clock,
  MapPin,
  Lock,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { MenuHeader } from '../components/customer/MenuHeader';
import { CategoryTabs } from '../components/customer/CategoryTabs';
import { MenuItemRow } from '../components/customer/MenuItemRow';

export const CustomerMenu: React.FC = () => {
  const { data: categories = [], isLoading, error, refetch } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Total count of all items across categories
  const totalItemCount = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  }, [categories]);

  // Episode naming mapper for Friends themed category sections
  const getEpisodeTitle = (catName: string) => {
    const upper = catName.toUpperCase();
    if (upper === 'PASTA') return 'THE ONE WITH THE PASTA';
    if (upper === 'RICE') return 'THE ONE WITH SAVORY GRAINS';
    if (upper === 'SALAD') return 'THE ONE WITH FRESH GREENS';
    if (upper === 'SOUP') return 'THE ONE WITH WARM BROTHS';
    return `THE ONE WITH ${upper}`;
  };

  // Filter categories and items based on search and selected tab
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return categories
      .filter((cat) => {
        if (activeCategory === 'all') return true;
        return cat.id === activeCategory;
      })
      .map((cat) => {
        const items = (cat.items || []).filter((item) => {
          if (!q) return true;
          return (
            item.name.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q)) ||
            (item.tags && item.tags.toLowerCase().includes(q))
          );
        });

        return {
          ...cat,
          filteredItems: items,
        };
      })
      .filter((cat) => cat.filteredItems.length > 0);
  }, [categories, activeCategory, searchQuery]);

  const totalFilteredCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.filteredItems.length, 0);
  }, [filteredCategories]);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* 1. FIXED TOP NAVIGATION BAR (No reserving table, no calling waiter, no paying bill) */}
      <MenuHeader />

      {/* 2. CINEMATIC HERO SECTION */}
      <section
        id="hero"
        className="relative w-full min-h-[82vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-surface-container-lowest"
      >
        {/* Cinematic Backdrop Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQjFdPMT6MPSHhfz3xGny9WhrG0tunD7080m7gHIi0Gw3GWKM-NFf0vC4OqNPCH1p3qkDdwVVN7YQ1c0lXtKHvWMvrTuBidUrbUJKP5jWzTk8iBuzCrogtwBOBnB69cpI8eVw6laEf0iutrBtdi864k1vWS2csrdQrXOCSKE30tHIDMBaHP5mDX-dxfZgKP2U_cjYScmZyPENOnrAONzFLEfyKJ4lCIBGcZKWSj2ly')`,
          }}
        >
          {/* Vignette and Dark Tint Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface-container-lowest/80 to-surface-container-lowest/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(14,14,17,0.92)_100%)]" />
        </div>

        {/* Ambient Subtle Glow Circles */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-container/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          {/* Hallmark Heritage Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container/70 backdrop-blur-md border border-outline-variant/30 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            <span className="font-headline text-[11px] uppercase tracking-[0.25em] text-on-surface-variant font-semibold pl-1">
              BISTRO &amp; LOUNGE &bull; EST. ADDIS ABABA
            </span>
          </div>

          {/* Main Theatrical Friends Title */}
          <div className="flex flex-col items-center mb-4">
            <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl tracking-widest uppercase font-bold text-center leading-tight text-primary">
              THE ONE
              <span className="inline-flex items-center mx-2 align-middle">
                <span className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-secondary-container shadow-[0_0_12px_rgba(214,2,38,0.7)] mx-1" />
                <span className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-tertiary-container shadow-[0_0_12px_rgba(104,213,255,0.7)] mx-1" />
                <span className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-primary-container shadow-[0_0_12px_rgba(255,189,24,0.7)] mx-1" />
              </span>
              WITH THE FOOD
            </h1>
          </div>

          {/* Velvet Couch Motif */}
          <div className="flex items-center justify-center gap-2 mb-4 opacity-85">
            <svg className="w-7 h-7 text-primary-container" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 10V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v3a4 4 0 0 0-2 3.44V18a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h14v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4.56A4 4 0 0 0 20 10zM6 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3H6V7zm14 8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V15z" />
            </svg>
          </div>

          <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 tracking-wide leading-relaxed">
            Good food, great company, and memories worth sharing. Explore our authentic slow-cooked pastas, fragrant rice platters, crisp garden salads, and warming broths.
          </p>

          {/* Direct CTA to Menu */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <a
              href="#menu-section"
              className="w-full sm:w-auto inline-flex items-center justify-center font-headline text-xs uppercase tracking-widest px-8 py-3.5 rounded bg-primary-container text-on-primary-container font-semibold hover:brightness-110 shadow-glow-yellow transition-all"
            >
              BROWSE OUR MENU
            </a>
            <a
              href="#location-section"
              className="w-full sm:w-auto inline-flex items-center justify-center font-headline text-xs uppercase tracking-widest px-8 py-3.5 rounded bg-surface-container-high/80 backdrop-blur-md text-primary hover:text-white border border-outline-variant/40 hover:border-primary-container/60 transition-all font-semibold"
            >
              LOCATION &amp; HOURS
            </a>
          </div>

          {/* Quick Micro-Stats Bar */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mt-12 pt-6 border-t border-outline-variant/20 text-center w-full">
            <div>
              <p className="font-headline text-2xl text-primary font-bold">11:00</p>
              <p className="font-headline text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
                AM &bull; Daily Open
              </p>
            </div>
            <div className="border-x border-outline-variant/20">
              <p className="font-headline text-2xl text-primary-container font-bold">100%</p>
              <p className="font-headline text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
                Fresh Artisan
              </p>
            </div>
            <div>
              <p className="font-headline text-2xl text-secondary font-bold">230+</p>
              <p className="font-headline text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
                ETB Starting
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE THREE-DOT HERO SEPARATOR */}
      <div className="w-full py-4 bg-surface flex items-center justify-center gap-3">
        <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-outline-variant" />
        <span className="w-2 h-2 rounded-full bg-secondary-container shadow-glow-red" />
        <span className="w-2 h-2 rounded-full bg-tertiary-container shadow-glow-blue" />
        <span className="w-2 h-2 rounded-full bg-primary-container shadow-glow-yellow" />
        <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-outline-variant" />
      </div>

      {/* 4. DIGITAL MENU SECTION (Compact Expandable Rows with ^ Icon) */}
      <section id="menu-section" className="w-full py-12 bg-surface relative">
        <div className="max-w-[960px] mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 font-headline text-xs uppercase tracking-widest text-primary mb-1 font-semibold">
              <span>Artisanal Kitchen</span>
              <span className="w-1 h-1 rounded-full bg-primary-container" />
              <span>Addis Ababa</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl text-on-surface tracking-wide uppercase font-bold">
              THE ONE WITH THE MENU
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
              Tap any dish or the <span className="font-mono text-primary font-bold">^</span> icon to view photo, description, and dietary details.
            </p>

            {/* Live Search Bar */}
            <div className="mt-6 relative max-w-md mx-auto">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search pasta, rice, salad, soup by name or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded bg-surface-container text-on-surface text-body-sm placeholder:text-outline border border-outline-variant/30 focus:border-primary-container focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="mt-4 flex justify-center">
              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                totalItemCount={totalItemCount}
              />
            </div>
          </div>

          {/* Search Result Summary */}
          {searchQuery.trim() !== '' && (
            <div className="flex items-center justify-between text-xs text-on-surface-variant pb-4 px-1">
              <span>
                Found <strong className="text-primary">{totalFilteredCount}</strong> {totalFilteredCount === 1 ? 'dish' : 'dishes'} matching &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-tertiary-container hover:underline font-headline uppercase tracking-wider text-[11px]"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary-container animate-ping" />
                <span className="w-3 h-3 rounded-full bg-tertiary-container animate-ping delay-100" />
                <span className="w-3 h-3 rounded-full bg-primary-container animate-ping delay-200" />
              </div>
              <p className="font-headline text-xs uppercase tracking-widest text-outline">
                Loading Kitchen Menu...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-6 bg-surface-container border border-secondary-container/40 rounded text-center space-y-3 max-w-md mx-auto">
              <AlertCircle className="w-8 h-8 text-secondary-container mx-auto" />
              <h4 className="font-headline text-lg font-bold text-white">Could not load the menu</h4>
              <p className="text-xs text-on-surface-variant">{(error as any)?.message}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-secondary-container text-white text-xs font-headline uppercase font-semibold rounded hover:brightness-110"
              >
                Retry
              </button>
            </div>
          )}

          {/* No results */}
          {!isLoading && !error && filteredCategories.length === 0 && (
            <div className="py-16 text-center bg-surface-container-low rounded border border-outline-variant/20 p-8">
              <span className="material-symbols-outlined text-[48px] text-outline mb-2">
                sentiment_dissatisfied
              </span>
              <p className="font-headline text-lg text-on-surface">No dishes match your search.</p>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                Try another keyword or switch category tabs above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-primary-container text-on-primary-container text-xs font-headline uppercase font-bold rounded"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* COMPACT EXPANDABLE CATEGORY SECTIONS (Ultra-clean, fast scanning with ^ accordion toggle) */}
          {!isLoading &&
            !error &&
            filteredCategories.map((cat, catIdx) => (
              <div
                key={cat.id}
                className="bg-surface-container-low/90 rounded border border-outline-variant/25 overflow-hidden mb-6 shadow-sm"
              >
                {/* Category Header */}
                <div className="p-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            catIdx % 3 === 0
                              ? '#d60226'
                              : catIdx % 3 === 1
                              ? '#68d5ff'
                              : '#ffbd18',
                        }}
                      />
                      <span className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                        {getEpisodeTitle(cat.name)}
                      </span>
                    </div>
                    <h3 className="font-headline text-lg uppercase font-bold text-on-surface tracking-wider">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="font-body text-xs text-on-surface-variant mt-0.5 max-w-xl">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <span className="font-headline text-xs text-outline font-mono bg-surface-container-high px-2 py-1 rounded">
                    {cat.filteredItems.length} {cat.filteredItems.length === 1 ? 'dish' : 'dishes'}
                  </span>
                </div>

                {/* Items in Category (Ultra-compact expandable rows) */}
                <div className="divide-y divide-outline-variant/15">
                  {cat.filteredItems.map((item) => (
                    <MenuItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 5. ABOUT US & NARRATIVE STORYTELLING */}
      <section
        id="about-section"
        className="w-full py-16 bg-surface-container-lowest relative overflow-hidden border-t border-outline-variant/20"
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 font-headline text-xs text-secondary tracking-widest uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-secondary-container" />
                Our Philosophy
              </div>
              <h2 className="font-headline text-2xl sm:text-4xl text-on-surface uppercase font-bold leading-tight mb-4">
                MORE THAN FOOD.
                <br />
                <span className="text-primary">IT’S ABOUT FRIENDSHIP.</span>
              </h2>
              <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed mb-4">
                Central Perk meets modern gastronomy. Designed as a sanctuary for heartfelt conversations, spontaneous laughter, and unforgettable comfort food.
              </p>

              <div className="p-4 rounded bg-surface-container-low border border-outline-variant/20 w-full mb-4">
                <p className="font-headline text-base text-primary-container italic font-medium">
                  &ldquo;Because Joey doesn’t share food, but we definitely think you should.&rdquo;
                </p>
                <p className="font-headline text-[11px] text-outline uppercase tracking-wider mt-2">
                  &mdash; The Kitchen Manifesto
                </p>
              </div>

              {/* Velvet Nook Lounge */}
              <div className="flex items-center gap-4 pt-1">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30 text-primary-container">
                  <span className="material-symbols-outlined text-[24px]">chair</span>
                </div>
                <div>
                  <p className="font-headline text-xs uppercase tracking-wider text-on-surface font-semibold">
                    The Velvet Nook Lounge
                  </p>
                  <p className="font-body text-xs text-outline">
                    Intimate booths &amp; acoustic jazz evenings
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Feature Cards Bento */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 p-6 rounded-xl bg-surface-container-low/80 backdrop-blur-md border border-outline-variant/25 hover:border-outline-variant/50 transition-all flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-surface-container-high flex-shrink-0 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[32px]">dinner_dining</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-on-surface mb-1 font-semibold">
                    The Central Table
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant">
                    Community seating and private candlelight setups modeled after comfortable Greenwich Village gathering spots.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-surface-container-low/80 backdrop-blur-md border border-outline-variant/25 hover:border-outline-variant/50 transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary mb-4">
                  <span className="material-symbols-outlined text-[28px]">skillet</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-on-surface mb-1 font-semibold">
                    Handcrafted Flavors
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant">
                    Authentic slow-cooked pastas, fragrant poultry risottos, and farm-fresh organic salads assembled à la minute.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-surface-container-low/80 backdrop-blur-md border border-outline-variant/25 hover:border-outline-variant/50 transition-all flex flex-col justify-between">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary mb-4">
                  <span className="material-symbols-outlined text-[28px]">nightlife</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg text-on-surface mb-1 font-semibold">
                    Could This BE Any Cozier?
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant">
                    Warm retro Edison bulbs, velvet textures, low ambient acoustics, and an extensive specialty cocktail cellar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL GALLERY SECTION: THE ONE WITH THE GOOD TIMES */}
      <section id="gallery-section" className="w-full py-16 bg-surface border-t border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 font-headline text-xs text-primary-container tracking-widest uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                Atmosphere &amp; Plates
              </div>
              <h2 className="font-headline text-2xl sm:text-4xl text-on-surface uppercase font-bold tracking-wide">
                THE ONE WITH THE GOOD TIMES
              </h2>
            </div>
            <p className="font-body text-xs text-on-surface-variant max-w-md">
              A glimpse into our candlelit tables, laughter-filled dinners, and passionate artisan cooking in the heart of Addis Ababa.
            </p>
          </div>

          {/* Masonry Style Bento Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 h-[380px] md:h-[460px] rounded-xl overflow-hidden relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChzIo3fvLtHNTV_NV_TQKQHIHbHJa_DoJd67cOCdkiGWSXw3yYggSTldhqldn7AnLZlsHLoS2Gtr6Wot94LNbgCk87skihTLsswinnxcmcDKwcxGyEt6rS5Lmaec7piE1L4UPxY-1udCVfMZ8s9CmYt0yozYw4TdNkZ3p9cTuUiqKmvJ-AjYgl3V4PUcyEXVXUUem7_VrWyXLQCMv1uhmUJs1-ds0GX55O3LkGoC6Q"
                alt="Dimly lit atmospheric bistro dining room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-surface-container-lowest/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-headline text-xs text-primary-container tracking-widest uppercase mb-1 block">
                  Nocturnal Sanctuary
                </span>
                <h3 className="font-headline text-xl text-white font-semibold">
                  Candlelit Conversation Tables
                </h3>
                <p className="font-body text-xs text-on-surface-variant/90 max-w-sm mt-1">
                  Designed for long evening talks, birthday toasts, and timeless nostalgia.
                </p>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="h-[180px] md:h-[222px] rounded-xl overflow-hidden relative group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7e0kf06W5SHAj1eENzX5m7AAUfsxKxkNxcD5fmFGi5ZUtwwez8ZP3cxMJzV0UcelksPuY5HbF2TQ9I4Lcamkslpfbr4Az7zL60yfol09XN-QsKww9w6BNJvulqrLCfNYIi2EMs0lmJq_jS9lH6HsF-m2-zX_h4rMwbyiC8Tf2tXqoI5y8vxpLvF2ZwE9w6QdUvSUMJ6R-bna1AJPozvHP6oG8dgh6Xt9AuGsgOu2a"
                  alt="Artisanal spaghetti pasta plated exquisitely"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="font-headline text-[10px] text-secondary tracking-wider uppercase">
                    Handmade Daily
                  </span>
                  <p className="font-headline text-base text-white font-medium">Pasta Perfection</p>
                </div>
              </div>

              <div className="h-[180px] md:h-[222px] rounded-xl overflow-hidden relative group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdOLhUHY5ZMo-brlPq6JwTqL9LYQ9IpeGtwdffKrX4HL3sSounm1BEU_7pnA1srIyq1P8dKgh5R9IxYJr2U4KGsGBl7kr_A0EBRHFD3nLhjmnoRK0BWKLEwM-OiYDNeZ9E9267bT3zjzKPaXlfnGMP6wvNsL_AtR6xO2zOum9LUkQ1-Q25pg4a-6L-2aY5vs04EKefElAwb2F5-pvHlVB_YjlY-q0s9JbeJJPNKfgH"
                  alt="Seasoned savory rice with chicken fillet slices"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="font-headline text-[10px] text-tertiary tracking-wider uppercase">
                    Chef Recommendation
                  </span>
                  <p className="font-headline text-base text-white font-medium">Signature Herb Chicken Pilaf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOCATION & OPERATING HOURS (Replaced reservation form with clean, elegant dining info) */}
      <section
        id="location-section"
        className="w-full py-16 bg-surface-container-lowest relative border-t border-outline-variant/20"
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 font-headline text-xs text-primary tracking-widest uppercase mb-1">
              <span>Mereba Friends Garden &bull; Addis Ababa</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl text-on-surface uppercase font-bold tracking-wide">
              THE ONE WHERE YOU VISIT US
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-2">
              Walk-ins are welcomed with open arms. Enjoy outdoor garden seating and intimate indoor dining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Location Card */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary-container/15 flex items-center justify-center text-primary-container mx-auto">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Our Location</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Mereba Friends Garden<br />
                Addis Ababa, Ethiopia<br />
                <span className="text-outline">Valet &amp; private parking available on site</span>
              </p>
            </div>

            {/* Operating Hours */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-tertiary-container/15 flex items-center justify-center text-tertiary-container mx-auto">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Dining Hours</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Monday &ndash; Sunday<br />
                <strong className="text-primary font-headline">11:00 AM &ndash; 11:00 PM</strong><br />
                <span className="text-outline">Kitchen closes at 10:30 PM</span>
              </p>
            </div>

            {/* Phone Lines & Social */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary-container/15 flex items-center justify-center text-secondary mx-auto">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Concierge</h3>
              <div className="flex flex-col gap-1 text-xs">
                <a href="tel:0970700488" className="text-primary hover:underline font-mono font-bold">
                  0970700488
                </a>
                <a href="tel:0945986349" className="text-primary hover:underline font-mono font-bold">
                  0945986349
                </a>
                <span className="text-[11px] text-outline mt-1 font-mono">
                  IG: @mereba_friends_garden
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20">
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
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
              <span className="font-headline text-lg sm:text-xl text-primary tracking-widest uppercase font-bold">
                &ldquo;WE&apos;LL BE THERE FOR YOU.&rdquo;
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            </div>

            <p className="font-body text-xs text-on-surface-variant max-w-md mb-6">
              Intimate metropolitan dining, artisan kitchen recipes, and tactile nostalgia in dark luxury.
            </p>

            <nav className="flex flex-wrap items-center justify-center gap-6 mb-6 font-headline text-xs uppercase tracking-widest">
              <a href="#hero" className="text-primary hover:text-primary-fixed transition-colors">
                Home
              </a>
              <a href="#menu-section" className="text-on-surface-variant hover:text-white transition-colors">
                Our Menu
              </a>
              <a href="#about-section" className="text-on-surface-variant hover:text-white transition-colors">
                About Us
              </a>
              <a href="#gallery-section" className="text-on-surface-variant hover:text-white transition-colors">
                Atmosphere
              </a>
              <a href="#location-section" className="text-on-surface-variant hover:text-white transition-colors">
                Location &amp; Hours
              </a>
            </nav>

            <div className="pt-4 border-t border-outline-variant/15 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-on-surface-variant/70 gap-2">
              <p>Copyright &copy; F.R.I.E.N.D.S Mereba Friends Garden. All rights reserved.</p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-headline uppercase tracking-wider"
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
