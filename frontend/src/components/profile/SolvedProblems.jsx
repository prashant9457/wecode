import React from 'react';
import { ChevronRight, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SolvedProblems = ({ leetcodeStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-[#282828] rounded-xl p-8 shadow-sm">
           <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Circular Progress */}
              <div className="relative w-44 h-44 shrink-0">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="88" cy="88" r="78" className="stroke-[#3e3e3e]/50" strokeWidth="10" fill="none" />
                    <circle cx="88" cy="88" r="78" className="stroke-indigo-500 transition-all duration-1000" strokeWidth="10" fill="none" strokeDasharray="490" strokeDashoffset={490 - (490 * (leetcodeStats?.totalSolved || 0)) / (leetcodeStats?.totalQuestions || 3000)} strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white tracking-tighter">{leetcodeStats?.totalSolved || 0}</span>
                    <span className="text-[11px] text-[#a1a1a1] font-bold mt-1 uppercase tracking-[0.2em]">Solved</span>
                 </div>
              </div>
              
              {/* Difficulty Split */}
              <div className="flex-1 w-full space-y-6">
                 <DifficultyRow label="Easy" solved={leetcodeStats?.easySolved || 0} total={leetcodeStats?.totalEasy || 800} color="text-green-500" bg="bg-green-500/10" />
                 <DifficultyRow label="Medium" solved={leetcodeStats?.mediumSolved || 0} total={leetcodeStats?.totalMedium || 1500} color="text-orange-400" bg="bg-orange-400/10" />
                 <DifficultyRow label="Hard" solved={leetcodeStats?.hardSolved || 0} total={leetcodeStats?.totalHard || 700} color="text-rose-500" bg="bg-rose-500/10" />
              </div>
           </div>
        </div>

        {/* Badges */}
        <div className="md:col-span-4 bg-[#282828] rounded-xl p-6 shadow-sm group">
           <div className="flex justify-between items-center mb-6 px-1">
              <h3 className="text-sm font-bold text-[#a1a1a1] tracking-widest uppercase">Badges <span className="text-white ml-2 text-base font-black">14</span></h3>
              <ChevronRight size={20} className="text-[#a1a1a1] hover:text-white cursor-pointer transition-colors" />
           </div>
           <div className="grid grid-cols-3 gap-3">
              <BadgeItem color="bg-green-500/20" />
              <BadgeItem color="bg-blue-500/20" />
              <BadgeItem color="bg-orange-500/20" />
           </div>
           <div className="mt-8 px-1">
              <p className="text-[10px] text-[#a1a1a1] font-bold uppercase tracking-[0.3em] mb-1">Most Recent Activation</p>
              <h4 className="text-sm font-bold text-white tracking-tight">Daily Streak Relic 2026</h4>
           </div>
        </div>
    </div>
  );
};

const DifficultyRow = ({ label, solved, total, color, bg }) => (
  <div className="flex-1">
     <div className="flex justify-between text-[13px] font-bold mb-2">
        <span className="text-[#a1a1a1] uppercase tracking-widest text-[11px]">{label}</span>
        <span className="tracking-tighter">{solved} <span className="text-[#a1a1a1] font-normal">/{total}</span></span>
     </div>
     <div className={cn("h-2 w-full rounded-full", bg)}>
        <div className={cn("h-full rounded-full transition-all duration-1000", color.replace('text', 'bg'))} style={{width: `${(solved/total)*100}%`}}></div>
     </div>
  </div>
);

const BadgeItem = ({ color }) => (
  <div className="relative group">
     <div className={cn("w-full aspect-square rounded-xl border border-white/5 flex items-center justify-center bg-gradient-to-tr from-black/0 via-black/40 to-white/5 transition-all group-hover:scale-105 cursor-pointer shadow-lg overflow-hidden group-hover:border-white/20")}>
        <div className={cn("w-12 h-12 rounded-full blur-[15px] opacity-20 transition-opacity group-hover:opacity-40", color.replace('bg', 'bg'))}></div>
        <Rocket size={28} className="absolute text-[#a1a1a1] group-hover:text-white transition-all transform group-hover:rotate-12" />
     </div>
  </div>
);
