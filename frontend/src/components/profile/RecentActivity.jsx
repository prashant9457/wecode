import React from 'react';
import { cn } from '@/lib/utils';

export const RecentActivity = () => {
  return (
    <div className="bg-[#282828] rounded-xl overflow-hidden shadow-sm border border-white/5">
        <div className="flex items-center gap-10 px-6 h-12 bg-[#323232] border-b border-[#3e3e3e]">
           <span className="text-[13px] font-bold text-white border-b-2 border-indigo-500 h-full flex items-center pt-0.5 cursor-pointer">Recent AC</span>
           <span className="text-[13px] font-medium text-[#a1a1a1] hover:text-white cursor-pointer h-full flex items-center pt-0.5 transition-colors">Solutions</span>
           <span className="text-[13px] font-medium text-[#a1a1a1] hover:text-white cursor-pointer h-full flex items-center pt-0.5 transition-colors">Discuss</span>
        </div>
        <div className="divide-y divide-[#3e3e3e]">
          <SolvedItem title="Merge Sorted Array" time="3 hours ago" difficulty="Easy" />
          <SolvedItem title="Remove Duplicates from Sorted Array" time="1 day ago" difficulty="Easy" />
          <SolvedItem title="Next Permutation" time="2 days ago" difficulty="Medium" />
          <SolvedItem title="3Sum Closest" time="4 days ago" difficulty="Medium" />
          <SolvedItem title="Valid Parentheses" time="5 days ago" difficulty="Easy" />
        </div>
    </div>
  );
};

const SolvedItem = ({ title, time, difficulty }) => (
  <div className="flex justify-between items-center px-6 py-5 hover:bg-white/[0.03] transition-colors group cursor-pointer group">
     <div className="flex flex-col">
        <span className="text-[15px] font-bold text-[#eff1f6] group-hover:text-indigo-400 transition-colors tracking-tight">{title}</span>
        <span className={cn("text-[10px] font-bold uppercase mt-1 tracking-[0.2em]", difficulty === 'Easy' ? 'text-green-500' : 'text-orange-400')}>
           {difficulty}
        </span>
     </div>
     <span className="text-xs text-[#a1a1a1] group-hover:text-white transition-colors font-medium">{time}</span>
  </div>
);
