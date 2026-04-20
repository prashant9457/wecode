import React, { useState } from 'react';
import { User, MessageSquare, Activity, Loader2, Inbox, UserPlus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/common/UserAvatar';
import AddFriendModal from './AddFriendModal';
import FriendRequestsModal from './FriendRequestsModal';

const FriendGrid = ({ 
  friends = [], 
  onSelect, 
  activeId, 
  pendingCount = 0, 
  onRefresh,
  activeTab = 'all',
  onTabChange,
  onlineUsers = new Set()
}) => {
  const safeFriends = Array.isArray(friends) ? friends : [];
  const currentTab = activeTab || 'all';
  
  const filteredFriends = currentTab === 'online' 
    ? safeFriends.filter(f => f && f.id && onlineUsers?.has(String(f.id)))
    : safeFriends;

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
                onClick={() => onTabChange?.('online')}
                className={cn(
                    "px-3 py-1 rounded-[4px] text-[13px] font-bold transition-all",
                    activeTab === 'online' ? "bg-[#3f4147] text-white" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                )}
            >
                Online
            </button>
            <button 
                onClick={() => onTabChange?.('all')}
                className={cn(
                    "px-3 py-1 rounded-[4px] text-[13px] font-bold transition-all",
                    activeTab === 'all' ? "bg-[#3f4147] text-white" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                )}
            >
                All
            </button>
            <button 
                onClick={() => onTabChange?.('pending')}
                className={cn(
                    "px-3 py-1 rounded-[4px] text-[13px] font-bold transition-all flex items-center gap-2",
                    activeTab === 'pending' ? "bg-[#3f4147] text-white" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                )}
            >
                Pending
                {pendingCount > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 rounded-full font-black min-w-[16px] text-center">{pendingCount}</span>
                )}
            </button>
        </div>

        <button 
            onClick={() => onTabChange?.('add_friend')}
            className={cn(
                "text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-[3px] transition-all ml-4",
                activeTab === 'add_friend' ? "text-[#248046] bg-transparent" : "bg-[#248046] hover:bg-[#1a6334] text-white shadow-lg"
            )}
        >
            {activeTab === 'add_friend' ? "Discovery Mode" : "Add Friend"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {activeTab === 'add_friend' ? (
            <AddFriendModal isModal={false} onlineUsers={onlineUsers} />
        ) : activeTab === 'pending' ? (
            <FriendRequestsModal isModal={false} onUpdate={onRefresh} onlineUsers={onlineUsers} />
        ) : (
            <div className="p-6">
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex items-center justify-between mb-6 opacity-80 border-b border-white/5 pb-4">
                        <p className="text-[11px] font-black text-[#949ba4] uppercase tracking-[0.2em]">{activeTab} Operatives — {filteredFriends.length}</p>
                    </div>

                    {filteredFriends.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredFriends.map((friend, idx) => (
                            <div 
                            key={friend.id || friend.username || idx} 
                            onClick={() => onSelect(friend)}
                            className={cn(
                                "bg-[#2b2d31] border border-[#1f2023] rounded-xl p-4 hover:border-indigo-500/50 transition-all group cursor-pointer relative overflow-hidden flex flex-col gap-4 shadow-lg hover:translate-y-[-2px]",
                                activeId === friend.username && "border-indigo-500 bg-[#35373c]"
                            )}
                            >
                                <div className="flex items-center gap-3">
                                    <UserAvatar 
                                        username={friend.username} 
                                        profilePicture={friend.profile_picture} 
                                        isOnline={onlineUsers?.has(String(friend.id))} 
                                        size="lg" 
                                    />
                                    <div className="min-w-0 flex-1">
                                        <Link to={`/${friend.username}`} onClick={(e) => e.stopPropagation()} className="hover:underline text-white font-bold text-[15px] truncate block">@{friend.username}</Link>
                                        <p className="text-[10px] text-[#949ba4] font-black tracking-widest uppercase opacity-60">ID: {String(friend.id || '').slice(0, 8) || 'Unknown'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Activity size={12} className={cn(onlineUsers?.has(String(friend.id)) ? "text-emerald-500 animate-pulse" : "text-[#4e5058]")} />
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            onlineUsers?.has(String(friend.id)) ? "text-emerald-500" : "text-[#949ba4]/60"
                                        )}>
                                            {onlineUsers?.has(String(friend.id)) ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-8 h-8 rounded-full bg-[#1e1f22] flex items-center justify-center text-[#949ba4] hover:text-white transition-colors border border-white/5 shadow-inner">
                                            <MessageSquare size={14} />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[#1e1f22] flex items-center justify-center text-[#949ba4] hover:text-white transition-colors border border-white/5 shadow-inner">
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
                            <div className="w-20 h-20 rounded-full bg-[#313338] border border-dashed border-[#4e5058] flex items-center justify-center text-[#4e5058] mb-6 opacity-40 shadow-inner">
                                <User size={40} />
                            </div>
                            <h3 className="text-[12px] font-black text-[#949ba4] uppercase tracking-[0.3em]">Neural Silence Detected</h3>
                            <p className="max-w-xs text-xs text-[#4e5058] mt-3 font-bold uppercase tracking-tight">No operatives synchronized in the current sector.</p>
                            <button 
                                onClick={() => onTabChange?.('add_friend')}
                                className="mt-8 text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:underline"
                            >
                                Discovery Discovery Mode // Engage
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FriendGrid;
