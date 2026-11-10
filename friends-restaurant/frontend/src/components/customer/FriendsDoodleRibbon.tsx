import React from 'react';

export const FriendsDoodleRibbon: React.FC = () => {
  return (
    <div className="w-full bg-[#050505] border-t border-[#222222] py-10 overflow-hidden select-none relative">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        {/* Responsive flex ribbon of iconic doodles in casual luxury monochrome line-art */}
        <div className="flex flex-wrap items-center justify-around gap-8 sm:gap-10 opacity-75 hover:opacity-100 transition-opacity duration-300">
          {/* 1. Monica's Peephole Frame */}
          <div className="flex flex-col items-center gap-1.5 group text-center">
            <div className="w-8 h-10 border-2 border-[#FFBD18] rounded-[5px] flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full border border-[#FFBD18]" />
            </div>
            <span className="text-[10px] font-headline uppercase tracking-widest text-[#A1A1AA] font-bold">
              The Peephole Frame
            </span>
          </div>

          {/* 2. Nestlé Toulouse */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <span className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-white group-hover:text-white transition-colors">
              NESTLÉ TOULOUSE.
            </span>
            <span className="text-[10px] font-body text-[#A1A1AA] italic">
              Phoebe&apos;s secret cookie recipe
            </span>
          </div>

          {/* 3. Central Perk Coffee */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="px-3 py-1 rounded-full bg-[#121212] border border-[#222222] group-hover:border-[#333333] transition-colors">
              <span className="font-serif text-xs font-bold tracking-widest text-white uppercase">
                ☕ CENTRAL PERK
              </span>
            </div>
            <span className="text-[10px] font-body text-[#A1A1AA]">
              Garden lounge edition
            </span>
          </div>

          {/* 4. Joey Doesn't Share Food! */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <span className="font-headline text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors">
              JOEY DOESN&apos;T SHARE FOOD!
            </span>
            <span className="text-[10px] font-body text-[#A1A1AA] italic">
              Order extra for the table
            </span>
          </div>

          {/* 5. The Lobster */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="flex items-center gap-1.5 text-xs font-headline font-bold uppercase tracking-wider text-white">
              <span className="text-sm">🦞</span>
              <span>SEE? HE&apos;S HER LOBSTER</span>
            </div>
            <span className="text-[10px] font-body text-[#A1A1AA]">
              Friends for life
            </span>
          </div>

          {/* 6. We Were On A Break! */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <span className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors">
              WE WERE ON A BREAK!
            </span>
            <span className="text-[10px] font-body text-[#A1A1AA] italic">
              The eternal debate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
