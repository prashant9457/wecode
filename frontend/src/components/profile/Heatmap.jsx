import React from 'react';
import { cn } from '@/lib/utils';

export const Heatmap = ({ heatmapData }) => {
  return (
    <div className="bg-[#282828] rounded-xl p-6 shadow-sm overflow-hidden border border-white/5 shadow-indigo-500/5">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-[#eff1f6] tracking-tight">432 <span className="text-[#a1a1a1] font-normal">submissions in the past one year</span></h3>
          <div className="hidden sm:flex gap-5 text-[10px] font-bold uppercase tracking-widest text-[#a1a1a1]">
            <div>Active days: <span className="text-white">212</span></div>
            <div>Max streak: <span className="text-indigo-400">54</span></div>
          </div>
       </div>
       
       <div className="w-full overflow-x-auto no-scrollbar py-2">
          <div className="min-w-[850px]">
            <div className="flex text-[10px] text-[#a1a1a1] mb-2 px-1 justify-between w-full font-mono">
              <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
            </div>
            <div className="flex gap-[3.5px]">
               {Array.from({ length: 52 }).map((_, col) => (
                 <div key={col} className="flex flex-col gap-[3.5px]">
                   {Array.from({ length: 7 }).map((_, row) => {
                     const idx = col * 7 + row;
                     const intensity = heatmapData[idx];
                     return (
                       <div key={row} className={cn("w-[12px] h-[12px] rounded-[2px] transition-all hover:ring-1 ring-white/30 cursor-crosshair", intensity === 0 ? "bg-[#3e3e3e]/30" : (intensity === 1 ? "bg-[#0e4429]" : (intensity === 2 ? "bg-[#006d32]" : (intensity === 3 ? "bg-[#26a641]" : "bg-[#39d353]"))))} />
                     )
                   })}
                 </div>
               ))}
            </div>
          </div>
       </div>
    </div>
  );
};
