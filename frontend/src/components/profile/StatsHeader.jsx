import React from 'react';
import { cn } from '@/lib/utils';

export const StatsHeader = ({ leetcodeStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
       <div className="md:col-span-8 bg-[#282828] rounded-xl p-6 shadow-sm min-h-[220px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[13px] text-[#a1a1a1] font-medium uppercase tracking-widest">Contest Rating</p>
              <h2 className="text-3xl font-bold mt-1 tracking-tight">1,894</h2>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-[#a1a1a1] font-medium">Global Ranking</p>
              <p className="text-sm text-white font-bold">{leetcodeStats?.ranking || 'N/A'}</p>
            </div>
          </div>
          {/* Mock Chart Area */}
          <div className="h-24 w-full flex items-end gap-1 px-2 mb-2">
            {Array.from({length: 30}).map((_, i) => (
              <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm hover:bg-indigo-500 transition-all border-b-2 border-indigo-500" style={{height: `${40 + Math.sin(i*0.5)*30 + Math.random()*20}%`}}></div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-[#a1a1a1] px-2 font-mono">
            <span>2024</span>
            <span>2025</span>
          </div>
       </div>

       <div className="md:col-span-4 bg-[#282828] rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-[13px] text-[#a1a1a1] font-medium mb-1 uppercase tracking-widest">Top Percentile</p>
          <h2 className="text-4xl font-black text-white tracking-tighter">4.32%</h2>
          <div className="mt-6 h-32 w-full flex flex-row items-end gap-[3px] py-1 transition-all">
            {Array.from({length: 20}).map((_, i) => (
               <div key={i} className={cn("w-full rounded-sm transition-all duration-500", i === 12 ? "bg-orange-500 h-[80%]" : "bg-white/5 h-[20%]")} style={{height: `${10 + (i > 8 && i < 16 ? Math.random()*60 + 20 : Math.random()*20)}%`}}></div>
            ))}
          </div>
       </div>
    </div>
  );
};
