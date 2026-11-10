import React from 'react';
import {
  TrendingUp,
  QrCode,
  Eye,
  Utensils,
  Sparkles,
  Layers,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { useAnalyticsSummary } from '../../hooks/useMenu';

export const AnalyticsDashboard: React.FC = () => {
  const { data: analytics, isLoading } = useAnalyticsSummary();

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#FFBD18] animate-spin" />
        <p className="font-headline text-xs uppercase tracking-widest text-[#A1A1AA]">
          Loading Analytics...
        </p>
      </div>
    );
  }

  const totalPageViews = analytics?.totalPageViews || 0;
  const totalTableScans = analytics?.totalTableScans || 0;
  const totalDishViews = analytics?.totalDishViews || 0;
  const topDishes = analytics?.topDishes || [];
  const topTables = analytics?.topTables || [];

  const maxDishViews = Math.max(...topDishes.map((d) => d.viewsCount), 1);

  return (
    <div className="space-y-6">
      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total QR Scans */}
        <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">
              Total Table QR Scans
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFBD18]/10 text-[#FFBD18] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold font-mono text-white">
              {totalTableScans}
            </span>
            <span className="text-xs text-green-400 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Physical QR codes scanned at dining tables
          </p>
        </div>

        {/* Total Menu Views */}
        <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">
              Total Menu Impressions
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#16B9E8]/10 text-[#16B9E8] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold font-mono text-white">
              {totalPageViews}
            </span>
            <span className="text-xs text-green-400 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Digital menu page loads across all sessions
          </p>
        </div>

        {/* Total Dish Interactions */}
        <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">
              Dish Detail Taps
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold font-mono text-white">
              {totalDishViews}
            </span>
            <span className="text-xs text-[#FFBD18] font-bold">
              High Interest
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Customers expanded dish cards to view photos
          </p>
        </div>

        {/* Most Active Table */}
        <div className="bg-[#121212] border border-[#222222] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">
              Most Active Table
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFBD18]/10 text-[#FFBD18] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold font-mono text-white">
              {topTables[0] ? `Table #${topTables[0].tableNumber}` : 'Table #4'}
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            {topTables[0] ? `${topTables[0].count} visits recorded` : 'Garden center table'}
          </p>
        </div>
      </div>

      {/* Main Grid: Most Popular Dishes + Table Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Viewed Dishes (8 Cols) */}
        <div className="lg:col-span-8 bg-[#121212] border border-[#222222] rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
            <div>
              <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FFBD18]" />
                <span>Top Most Popular Dishes &amp; Drinks</span>
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Real customer interest based on card expansions &amp; photo views
              </p>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-headline font-bold uppercase tracking-wider">
              Live Ranking
            </span>
          </div>

          <div className="space-y-4">
            {topDishes.map((dish, index) => {
              const percentage = Math.round((dish.viewsCount / maxDishViews) * 100);

              return (
                <div
                  key={dish.id}
                  className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#222222] hover:border-[#333333] transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank badge */}
                      <span className="w-6 h-6 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center font-headline text-xs font-bold text-white shrink-0">
                        #{index + 1}
                      </span>

                      {/* Thumbnail if present */}
                      {dish.image && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#222222] shrink-0 bg-[#141414]">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-headline text-sm font-bold text-white truncate">
                          {dish.name}
                        </p>
                        <p className="text-[11px] text-[#A1A1AA]">
                          {dish.category?.name} &bull; {dish.price ? `${dish.price} ETB` : 'Market Price'}
                        </p>
                      </div>
                    </div>

                    {/* Views Count */}
                    <div className="text-right shrink-0">
                      <span className="font-headline text-base font-bold text-[#FFBD18] font-mono">
                        {dish.viewsCount}
                      </span>
                      <span className="text-[10px] text-[#71717A] uppercase font-headline font-bold block">
                        Views
                      </span>
                    </div>
                  </div>

                  {/* Visual popularity progress bar */}
                  <div className="w-full bg-[#181818] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#FFBD18] to-amber-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {topDishes.length === 0 && (
              <div className="py-12 text-center text-[#A1A1AA] text-xs">
                Views are automatically tracked as customers browse the digital menu.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Table QR Scans Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-[#121212] border border-[#222222] rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-5">
          <div className="pb-4 border-b border-[#222222]">
            <h3 className="font-headline text-base font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#16B9E8]" />
              <span>Table Activity</span>
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Busiest tables in the garden
            </p>
          </div>

          <div className="space-y-2.5">
            {topTables.map((t, idx) => (
              <div
                key={t.tableNumber}
                className="p-3 rounded-xl bg-[#0a0a0a] border border-[#222222] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#181818] border border-[#282828] text-white font-headline font-bold flex items-center justify-center">
                    #{t.tableNumber}
                  </span>
                  <div>
                    <span className="text-white font-bold block">Table #{t.tableNumber}</span>
                    <span className="text-[10px] text-[#71717A]">Garden Section</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#16B9E8] px-2 py-0.5 rounded-md bg-[#16B9E8]/10 border border-[#16B9E8]/30">
                  {t.count} scans
                </span>
              </div>
            ))}

            {topTables.length === 0 && (
              <div className="py-8 text-center text-[#71717A] text-xs">
                Scans are tracked whenever customers open a table QR URL.
              </div>
            )}
          </div>

          {/* Business Pitch Tip for Restaurant Owner */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs text-[#d4d4d8]">
            <p className="font-headline font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFBD18]" />
              <span>Manager Insight</span>
            </p>
            <p className="text-[#A1A1AA] text-[11px] leading-relaxed">
              Dishes with the highest views are prime candidates for promotional discounts or kitchen prep prioritization during peak evening hours!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
