import React, { useState, useEffect } from 'react';
import { User, UserPlus, Inbox, Search, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/common/UserAvatar';

const SidebarFriends = ({ friends, onSelect, onViewChange, activeId, pendingCount, onRefresh, onlineUsers = new Set() }) => {
  useEffect(() => {
    // We can still trigger a fetch on mount if needed, 
    // but Dashboard normally handles it.
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pt-2 px-2">
      <div className="space-y-[2px] mb-4">
        <button 
            onClick={() => onViewChange?.('friends')}
            className={cn(
                "w-full flex items-center gap-3 px-2 py-2 rounded-[4px] transition-all group",
                activeId === 'friends_grid_global' ? "bg-[#3f4147] text-white" : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#35373c]"
            )}
        >
            <User size={20} />
            <span className="text-[14px] font-bold">Friends</span>
            {pendingCount > 0 && (
                <div className="ml-auto bg-rose-500 text-white text-[10px] font-black px-1.5 rounded-full min-w-[20px] text-center">
                    {pendingCount}
                </div>
            )}
        </button>
      </div>

      <div className="px-2 mb-2 flex items-center justify-between group/label">
        <h3 className="text-[11px] font-black text-[#949ba4] uppercase tracking-widest leading-tight">Direct Messages</h3>
        <button 
            onClick={() => onViewChange?.('friends', 'add_friend')}
            className="text-[#949ba4] hover:text-white transition-colors opacity-0 group-hover/label:opacity-100"
            title="Create DM"
        >
            <Search size={14} />
        </button>
      </div>
      

      <div className="space-y-[2px] pb-4">
        {friends.length > 0 && friends.map((friend, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(friend)}
            className={cn(
              "w-full flex items-center gap-3 px-2 py-2 rounded-[6px] group transition-all duration-200",
              activeId === friend.username ? "bg-[#3f4147] text-white shadow-md translate-x-1" : "hover:bg-[#35373c] text-[#949ba4] hover:text-[#dbdee1]"
            )}
          >
            <UserAvatar 
                username={friend.username} 
                profilePicture={friend.profile_picture} 
                isOnline={onlineUsers.has(friend.id)} 
                size="md" 
            />
            <div className="flex-1 text-left min-w-0">
               <p className="text-[14px] font-bold truncate">
                  <Link to={`/${friend.username}`} onClick={(e) => e.stopPropagation()} className="hover:underline">@{friend.username}</Link>
               </p>
               <p className={cn(
                   "text-[10px] font-black uppercase tracking-wider",
                   onlineUsers.has(friend.id) ? "text-emerald-500" : "text-[#949ba4]/60"
               )}>
                   {onlineUsers.has(friend.id) ? "Online" : "Offline"}
               </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarFriends;
