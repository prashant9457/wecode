import React, { useEffect, useState } from 'react';
import { User, Activity, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
interface FriendModel {
  id: string;
  username: string;
}
export default function FriendList() {
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [loading, setLoading] = useState(true);
  const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });
  const loadFriends = async () => {
    try {
      const res = await fetch("/api/friends", { headers: getHeaders() });
      if (res.ok) {
        setFriends(await res.json());
      }
    } catch (error) {
      console.error("Failed to load friend list", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadFriends();
  }, []);
  if (loading) {
    return <div className="p-6 text-[#949ba4] text-xs font-black uppercase tracking-widest">Compiling Roster...</div>;
  }
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#313338] animate-in fade-in duration-500">
      <div className="h-12 border-b border-[#1f2023] flex items-center px-4 gap-6 shrink-0 bg-[#313338] z-10 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-500 pr-4 border-r border-white/5">
            <User size={18} />
            <span className="text-[12px] font-black uppercase tracking-widest pt-0.5">Active Friends</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-6 opacity-80">
                <p className="text-[11px] font-black text-[#949ba4] uppercase tracking-[0.2em]">Synchronized Operatives — {friends.length}</p>
            </div>
            {friends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {friends.map((friend) => (
                    <div 
                      key={friend.id} 
                      className="bg-[#2b2d31] border border-[#1f2023] rounded-xl p-4 hover:border-emerald-500/50 transition-all group relative overflow-hidden flex flex-col gap-4 shadow-lg cursor-pointer"
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-full bg-[#1e1f22] border border-white/5 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                                    {friend.username?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#23a559] rounded-full border-[3px] border-[#2b2d31]"></div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <Link to={`/${friend.username}`} className="hover:underline text-white font-bold text-[15px] truncate block">@{friend.username}</Link>
                                <p className="text-[10px] text-[#949ba4] font-black tracking-widest uppercase">ID: {friend.id.slice(0, 8)}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2 text-emerald-500/70">
                                <Activity size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Active Link</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="w-8 h-8 rounded-full bg-[#1e1f22] flex items-center justify-center text-[#949ba4] hover:text-white hover:bg-indigo-500/20 transition-colors">
                                    <MessageSquare size={14} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 blur-2xl rounded-full" />
                    </div>
                ))}
                </div>
            ) : (
                <div className="py-40 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-[#313338] border border-dashed border-[#4e5058] flex items-center justify-center text-[#4e5058] mb-6 opacity-40">
                        <User size={40} />
                    </div>
                    <h3 className="text-[12px] font-black text-[#949ba4] uppercase tracking-[0.3em]">No Friends Found</h3>
                    <p className="max-w-xs text-xs text-[#4e5058] mt-3 font-bold">Add friends to build your network.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}