import React from 'react';
import { Users, Shield, Plus, Lock, Globe, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const GroupsGrid = ({ groups = [], onSelect, activeId }) => {
  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Study Citadels</h2>
          <p className="text-[#949ba4] text-sm">Collaborative clusters and algorithmic study groups</p>
        </div>
        <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold text-xs px-6 h-9 rounded-[4px] shadow-lg shadow-indigo-500/20">
           <Plus size={16} className="mr-2" /> CREATE CITADEL
        </Button>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {groups.map((group, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelect(group.id)}
              className={cn(
                "bg-[#1e1f22] border border-[#2b2d31] rounded-3xl p-6 hover:border-indigo-500/50 transition-all group cursor-pointer relative overflow-hidden",
                activeId === group.id && "border-indigo-500 bg-[#2b2d31]"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                   {group.name[0]}
                </div>
                <div className="flex gap-2">
                    {group.isPrivate ? <Lock size={14} className="text-[#4e5058]" /> : <Globe size={14} className="text-[#23a559]" />}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white mb-1">#{group.name}</h3>
                <p className="text-sm text-[#949ba4] line-clamp-2 font-medium mb-6">
                  {group.description || "A tactical clustering for advanced algorithmic problem solving and resource sharing."}
                </p>
                
                <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-[#313338] border-2 border-[#1e1f22] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-[#2b2d31] border-2 border-[#1e1f22] flex items-center justify-center text-[10px] font-bold text-[#b5bac1]">
                            +12
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-400 font-black text-[10px] uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                        SYNC <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
              </div>

              {/* Backglow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-[60px] group-hover:bg-indigo-600/10 transition-all" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
           <Shield size={64} className="text-[#4e5058] mb-4" />
           <h3 className="text-lg font-bold text-[#b5bac1] uppercase tracking-[0.2em]">Citadel Grid Is Empty</h3>
           <p className="max-w-xs text-sm text-[#949ba4] mt-2 font-medium">You are not currently part of any study groups. Join a citadel or create your own to begin collaborative conquest.</p>
        </div>
      )}
    </div>
  );
};

export default GroupsGrid;
