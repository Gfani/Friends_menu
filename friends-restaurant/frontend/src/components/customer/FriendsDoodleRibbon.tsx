import React from 'react';

export const FriendsDoodleRibbon: React.FC = () => {
  return (
    <div className="w-full bg-[#0a0a0d] border-t border-[#202026] py-8 overflow-hidden select-none relative">
      {/* Background subtle noise and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,189,24,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        {/* Responsive flex ribbon of iconic doodles from the physical restaurant poster */}
        <div className="flex flex-wrap items-center justify-around gap-6 sm:gap-8 opacity-80 hover:opacity-100 transition-opacity duration-300">
          {/* 1. Monica's Yellow Peephole Frame */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="w-9 h-11 border-[3px] border-[#FFBD18] rounded-[6px] shadow-[0_0_12px_rgba(255,189,24,0.35)] flex items-center justify-center p-1 relative group-hover:scale-110 transition-transform">
              <span className="w-2 h-2 rounded-full bg-black border border-[#FFBD18]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#16B9E8]" />
            </div>
            <span className="text-[10px] font-headline uppercase tracking-widest text-[#d4c4ac] font-bold">
              The Peephole Frame
            </span>
          </div>

          {/* 2. Nestlé Toulouse with Red Dot */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F32636] shadow-[0_0_6px_#F32636]" />
              <span className="font-headline text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-[#FFBD18] transition-colors">
                NESTLÉ TOULOUSE.
              </span>
            </div>
            <span className="text-[9px] font-body text-[#8e8e96] italic">
              Phoebe&apos;s secret cookie recipe
            </span>
          </div>

          {/* 3. Central Perk Coffee Mug */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#16161a] border border-[#2d2d35] group-hover:border-[#FFBD18]/50 transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#16B9E8] shadow-[0_0_6px_#16B9E8]" />
              <span className="font-serif text-xs font-black tracking-widest text-white uppercase">
                ☕ CENTRAL PERK
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FFBD18] shadow-[0_0_6px_#FFBD18]" />
            </div>
            <span className="text-[9px] font-body text-[#8e8e96]">
              Mereba garden edition
            </span>
          </div>

          {/* 4. Joey Doesn't Share Food! */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F32636] shadow-[0_0_6px_#F32636]" />
              <span className="font-headline text-xs font-black uppercase tracking-[0.18em] text-white group-hover:text-[#F32636] transition-colors">
                JOEY DOESN&apos;T SHARE FOOD!
              </span>
            </div>
            <span className="text-[9px] font-body text-[#8e8e96] italic">
              Order extra for the table
            </span>
          </div>

          {/* 5. The Lobster ("See? He's her Lobster") */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-wider text-white">
              <span className="text-base">🦞</span>
              <span className="group-hover:text-[#FFBD18] transition-colors">SEE? HE&apos;S HER LOBSTER</span>
              <span className="w-2 h-2 rounded-full bg-[#16B9E8] shadow-[0_0_6px_#16B9E8]" />
            </div>
            <span className="text-[9px] font-body text-[#8e8e96]">
              Friends for life
            </span>
          </div>

          {/* 6. We Were On A Break! */}
          <div className="flex flex-col items-center gap-1 group text-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFBD18] shadow-[0_0_6px_#FFBD18]" />
              <span className="font-headline text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-[#16B9E8] transition-colors">
                WE WERE ON A BREAK!
              </span>
              <span className="w-2 h-2 rounded-full bg-[#F32636] shadow-[0_0_6px_#F32636]" />
            </div>
            <span className="text-[9px] font-body text-[#8e8e96] italic">
              The ultimate eternal debate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

