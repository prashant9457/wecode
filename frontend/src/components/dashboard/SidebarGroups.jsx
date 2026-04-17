import React from 'react';
import { Shield, Plus, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const SidebarGroups = ({ onSelect, activeId }) => {
  // Fake data as requested
  const fakeGroups = [
    { id: 'g1', name: 'Alpha-Coders', members: 12, isPrivate: false },
    { id: 'g2', name: 'Bit-Crushers', members: 8, isPrivate: true }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pt-4 px-2">
      <div className="px-2 mb-4">
        <Button className="w-full bg-[#248046] hover:bg-[#1a5e34] text-white font-black text-[11px] h-9 rounded-[4px] shadow-lg shadow-emerald-900/10 uppercase tracking-widest gap-2">
           <Plus size={16} /> Create Citadel
        </Button>
      </div>

      <div className="mb-2 px-2 flex items-center justify-between group cursor-default">
        <span className="text-[11px] font-bold text-[#949ba4] uppercase tracking-[0.05em] group-hover:text-white transition-colors tracking-widest">Active Citadels</span>
      </div>

      <div className="space-y-[2px] pb-4">
        {fakeGroups.map((group, idx) => (
          <button
            key={group.id}
            onClick={() => onSelect(group)}
            className={cn(
              "w-full flex items-center gap-3 px-2 py-2.5 rounded-[6px] group transition-all duration-200",
              activeId === group.id ? "bg-[#3f4147] text-white shadow-md translate-x-1" : "hover:bg-[#35373c] text-[#949ba4] hover:text-[#dbdee1]"
            )}
          >
            <div className={cn(
               "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 border border-white/5 flex items-center justify-center font-black text-white text-lg shadow-xl shrink-0 group-hover:rotate-3 transition-transform",
               activeId === group.id && "from-indigo-500 to-purple-500 ring-2 ring-indigo-500/20"
            )}>
              {group.name[0]}
            </div>
            <div className="flex-1 text-left min-w-0">
               <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-bold truncate">#{group.name}</p>
                  {group.isPrivate && <Lock size={10} className="text-[#4e5058]" />}
               </div>
               <p className="text-[10px] text-[#949ba4] font-medium uppercase tracking-wider">{group.members} Members Sync'd</p>
            </div>
          </button>
        ))}

        <div className="mt-6 pt-6 border-t border-[#3f4147]/50 px-2">
            <div className="p-4 rounded-xl bg-[#1e1f22] border border-[#2b2d31] text-center border-dashed opacity-50">
                <Globe size={24} className="mx-auto mb-2 text-[#4e5058]" />
                <p className="text-[10px] font-bold text-[#4e5058] uppercase tracking-widest">Explore public nodes</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarGroups;
