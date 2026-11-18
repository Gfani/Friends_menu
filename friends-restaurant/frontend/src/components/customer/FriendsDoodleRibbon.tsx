import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const FriendsDoodleRibbon: React.FC = () => {
  let isLightMode = false;
  try {
    const themeContext = useTheme();
    isLightMode = themeContext.isLightMode;
  } catch {}

  return (
    <div className={`w-full border-t py-10 overflow-hidden select-none relative transition-colors ${
      isLightMode ? 'bg-[#F8F9FA] border-zinc-200' : 'bg-[#050505] border-[#222222]'
    }`}>
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        {/* Responsive flex ribbon of iconic doodles in casual luxury monochrome line-art */}
        <div className="flex flex-wrap items-center justify-around gap-8 sm:gap-10 opacity-75 hover:opacity-100 transition-opacity duration-300">
          {/* 1. Monica's Peephole Frame */}
          <div className="flex flex-col items-center gap-1.5 group text-center">
            <div className="w-8 h-10 border-2 border-[#FFBD18] rounded-[5px] flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full border border-[#FFBD18]" />
            </div>
            <span className={`text-[10px] font-headline uppercase tracking-widest font-bold ${
              isLightMode ? 'text-zinc-600' : 'text-[#A1A1AA]'
            }`}>
              The Peephole Frame
            </span>
          </div>

          {/* 2. Nestlé Toulouse */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <span className={`font-headline text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isLightMode ? 'text-zinc-900' : 'text-white'
            }`}>
              NESTLÉ TOULOUSE.
            </span>
            <span className={`text-[10px] font-body italic ${
              isLightMode ? 'text-zinc-500' : 'text-[#A1A1AA]'
            }`}>
              Phoebe&apos;s secret cookie recipe
            </span>
          </div>

          {/* 3. Central Perk Coffee */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className={`px-3 py-1 rounded-full border transition-colors ${
              isLightMode ? 'bg-white border-zinc-300' : 'bg-[#121212] border-[#222222] group-hover:border-[#333333]'
            }`}>
              <span className={`font-serif text-xs font-bold tracking-widest uppercase ${
                isLightMode ? 'text-zinc-900' : 'text-white'
              }`}>
                ☕ CENTRAL PERK
              </span>
            </div>
            <span className={`text-[10px] font-body ${
              isLightMode ? 'text-zinc-500' : 'text-[#A1A1AA]'
            }`}>
              Garden lounge edition
            </span>
          </div>

          {/* 4. Joey Doesn't Share Food! */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <span className={`font-headline text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
              isLightMode ? 'text-zinc-900' : 'text-white'
            }`}>
              JOEY DOESN&apos;T SHARE FOOD!
            </span>
            <span className={`text-[10px] font-body italic ${
              isLightMode ? 'text-zinc-500' : 'text-[#A1A1AA]'
            }`}>
              Order extra for the table
            </span>
          </div>

          {/* 5. The Lobster */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className={`flex items-center gap-1.5 text-xs font-headline font-bold uppercase tracking-wider ${
              isLightMode ? 'text-zinc-900' : 'text-white'
            }`}>
              <span className="text-sm">🦞</span>
              <span>SEE? HE&apos;S HER LOBSTER</span>
            </div>
            <span className={`text-[10px] font-body ${
              isLightMode ? 'text-zinc-500' : 'text-[#A1A1AA]'
            }`}>
              Friends for life
            </span>
          </div>

          {/* 6. We Were On A Break! */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <span className={`font-headline text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isLightMode ? 'text-zinc-900' : 'text-white'
            }`}>
              WE WERE ON A BREAK!
            </span>
            <span className={`text-[10px] font-body italic ${
              isLightMode ? 'text-zinc-500' : 'text-[#A1A1AA]'
            }`}>
              The eternal debate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
