import React from 'react';
import { Users, Lock, Globe, MessageSquare, Code, CheckCircle, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContentGroup = ({ group }) => {
  if (!group) return null;

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500 bg-[#313338]">
      {/* Group Header (Centered Optimized) */}
      <div className="h-10 border-b border-[#1f2023] flex items-center justify-between px-6 shrink-0 relative z-10">
          <div className="flex items-center gap-2 w-1/4">
               <Hash size={18} className="text-[#b5bac1]" />
          </div>

          <div className="flex-1 flex justify-center">
               <h2 className="text-white font-black text-[13px] uppercase tracking-[0.15em] italic">{group.name}</h2>
          </div>

          <div className="flex items-center justify-end gap-6 text-[#b5bac1] w-1/4">
              <div className="flex items-center gap-2 px-2 py-0.5 bg-[#2b2d31] rounded-full border border-white/5 shadow-inner shrink-0">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{group.members} Operatives</span>
              </div>
              <Button onClick={() => {}} className="bg-[#248046] hover:bg-[#1a5e34] text-white font-black h-6 text-[9px] px-3 rounded-[3px] uppercase italic">Sync Hub</Button>
          </div>
      </div>

      {/* Main Group Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-10 px-10 pb-20">
          <div className="mb-12">
               <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6 shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-0">
                  {group.name[0]}
               </div>
               <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Welcome to #{group.name}!</h1>
               <p className="max-w-xl text-[#b5bac1] text-lg font-medium leading-relaxed">
                  Initializing collaborative cluster for tactical algorithm conquest. This is the start of the #{group.name} operational channel.
               </p>
          </div>

          <div className="w-full h-[1px] bg-[#3f4147] mb-12 relative">
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#313338] px-4 text-[11px] font-black text-[#4e5058] uppercase tracking-[0.3em]">Neural Interface Log</span>
          </div>

          <div className="space-y-6">
              {[1, 2].map(i => (
                  <div key={i} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 shrink-0 border border-white/10 flex items-center justify-center font-bold text-white text-sm">
                          {String.fromCharCode(65 + i)}
                      </div>
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white hover:underline cursor-pointer">@operative_{i}</span>
                              <span className="text-[10px] text-[#949ba4] font-medium uppercase tracking-widest">Yesterday at 15:32</span>
                          </div>
                          <div className="text-[#dbdee1] leading-relaxed mb-3">
                              Successfully synchronized tactical data for mission: <span className="text-indigo-400 font-bold">Dynamic Programming Mastery #42</span>.
                          </div>
                          <div className="bg-[#1e1f22] border border-[#2b2d31] rounded-2xl p-4 max-w-sm hover:border-indigo-500/30 transition-all border-l-4 border-l-indigo-600 shadow-xl">
                              <div className="flex items-center justify-between mb-4">
                                 <Code size={16} className="text-indigo-400" />
                                 <CheckCircle size={14} className="text-emerald-500" />
                              </div>
                              <h4 className="text-white font-bold mb-1">Matrix Chain Multiplier</h4>
                              <p className="text-[10px] text-[#949ba4] font-bold uppercase tracking-widest">Status: COMPLETED // 98ms</p>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default ContentGroup;
