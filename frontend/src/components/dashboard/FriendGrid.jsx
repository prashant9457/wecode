import React, { useState } from 'react';
import { User, MessageSquare, ChevronRight, Activity, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const FriendGrid = ({ friends = [], onSelect, activeId }) => {
  const [filter, setFilter] = useState('all');

  const filteredFriends = filter === 'all' ? friends : friends.filter(f => f.status === filter);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#313338] animate-in fade-in duration-500">
      {/* Tactical Sub-Header (Friends Tabs) */}
      <div className="h-12 border-b border-[#1f2023] flex items-center px-4 gap-6 shrink-0 bg-[#313338] z-10 shadow-sm">
        <div className="flex items-center gap-2 text-[#949ba4] pr-4 border-r border-white/5">
            <User size={18} />
            <span className="text-[12px] font-black uppercase tracking-widest pt-0.5 italic">Neural Network</span>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setFilter('online')}
                className={cn(
                    "px-3 py-1 rounded-[4px] text-[13px] font-bold transition-all",
                    filter === 'online' ? "bg-[#3f4147] text-white" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                )}
            >
                Online
            </button>
            <button 
                onClick={() => setFilter('all')}
                className={cn(
                    "px-3 py-1 rounded-[4px] text-[13px] font-bold transition-all",
                    filter === 'all' ? "bg-[#3f4147] text-white" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                )}
            >
                All
            </button>
            <button 
                className="px-3 py-1 rounded-[4px] text-[13px] font-bold text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1] transition-all"
            >
                Pending
            </button>
        </div>

        <button className="bg-[#248046] hover:bg-[#1a6334] text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-[3px] transition-all ml-4">
            Add Friend
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-6 opacity-80">
                <p className="text-[11px] font-black text-[#949ba4] uppercase tracking-[0.2em]">{filter} Operatives — {filteredFriends.length}</p>
            </div>

            {filteredFriends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFriends.map((friend) => (
                    <div 
                    key={friend.id} 
                    onClick={() => onSelect(friend)}
                    className={cn(
                        "bg-[#2b2d31] border border-[#1f2023] rounded-xl p-4 hover:border-indigo-500/50 transition-all group cursor-pointer relative overflow-hidden flex flex-col gap-4 shadow-lg",
                        activeId === friend.username && "border-indigo-500 bg-[#35373c]"
                    )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-full bg-[#1e1f22] border border-white/5 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                                    {friend.username[0].toUpperCase()}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#23a559] rounded-full border-[3px] border-[#2b2d31]"></div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-white font-bold text-[15px] truncate">@{friend.username}</h3>
                                <p className="text-[10px] text-[#949ba4] font-black tracking-widest uppercase">ID: {friend.id.slice(0, 8)}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[#949ba4]">
                                <Activity size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Active Link</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-8 h-8 rounded-full bg-[#1e1f22] flex items-center justify-center text-[#949ba4] hover:text-white transition-colors">
                                    <MessageSquare size={14} />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#1e1f22] flex items-center justify-center text-[#949ba4] hover:text-white transition-colors">
                                    <Activity size={14} />
                                </div>
                            </div>
                        </div>
                        
                        {/* Status Glow */}
                        <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 blur-2xl rounded-full" />
                    </div>
                ))}
                </div>
            ) : (
                <div className="py-40 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-[#313338] border border-dashed border-[#4e5058] flex items-center justify-center text-[#4e5058] mb-6 opacity-40">
                        <User size={40} />
                    </div>
                    <h3 className="text-[12px] font-black text-[#949ba4] uppercase tracking-[0.3em]">Neural Silence Detected</h3>
                    <p className="max-w-xs text-xs text-[#4e5058] mt-3 font-bold uppercase tracking-tight">No operatives synchronized in the current sector.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FriendGrid;
