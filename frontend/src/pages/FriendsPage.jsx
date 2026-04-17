import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DiscordLayout from '@/components/layout/DiscordLayout';
import { 
  Users, 
  Search, 
  UserPlus, 
  Check, 
  Terminal,
  MessageSquare,
  MoreVertical,
  Hash,
  AtSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const FriendsPage = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('all');

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/friends', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setFriends(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    const search = async () => {
       if (searchQuery.length < 2) {
          setSearchResults([]);
          return;
       }
       setSearching(true);
       try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:5000/api/users/search?q=${searchQuery}`, {
             headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) setSearchResults(data);
       } catch (e) {} finally {
          setSearching(false);
       }
    };

    const delayDebounce = setTimeout(search, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleAddFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/friends/add', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ friendId })
      });
      if (res.ok) {
        fetchFriends();
        setSearchResults(prev => prev.filter(u => u.id !== friendId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
     <div className="h-screen bg-[#313338] flex items-center justify-center">
       <div className="animate-spin text-indigo-500"><Terminal size={48} /></div>
     </div>
  );

  return (
    <DiscordLayout>
        {/* Friends Top Bar */}
        <header className="h-12 border-b border-[#1f2023] shadow-sm flex items-center justify-between px-4 shrink-0 bg-[#313338]">
             <div className="flex items-center gap-4 h-full">
                <div className="flex items-center gap-2 pr-4 border-r border-[#44464d]">
                    <Users size={24} className="text-[#80848e]" />
                    <span className="font-bold text-white text-[15px]">Combatants</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium h-full">
                    <TabItem label="Online" active={activeSubTab === 'online'} onClick={() => setActiveSubTab('online')} />
                    <TabItem label="All" active={activeSubTab === 'all'} onClick={() => setActiveSubTab('all')} />
                    <TabItem label="Pending" active={activeSubTab === 'pending'} onClick={() => setActiveSubTab('pending')} />
                    <TabItem label="Blocked" active={activeSubTab === 'blocked'} onClick={() => setActiveSubTab('blocked')} />
                    <button 
                        onClick={() => setActiveSubTab('add')}
                        className={cn(
                            "px-2 py-0.5 rounded-[4px] font-bold text-[14px] transition-all",
                            activeSubTab === 'add' ? "bg-transparent text-[#23a559]" : "bg-[#248046] text-white"
                        )}
                    >
                        Add Combatant
                    </button>
                </div>
             </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto no-scrollbar pt-2 flex flex-col">
                
                {activeSubTab === 'add' ? (
                    <div className="p-8">
                        <h2 className="text-white font-black text-2xl mb-2 uppercase tracking-tight">ADD COMBATANT</h2>
                        <p className="text-[14px] text-[#b5bac1] mb-8 font-medium">Identify and link global tactical nodes via their unique handle string.</p>
                        
                        <div className="relative mb-12 max-w-2xl group">
                            <Input 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Enter an operative handle..."
                                className="h-14 bg-[#1e1f22] border-[#1f2023] text-white rounded-xl focus-visible:ring-indigo-500 pr-40 text-lg font-bold placeholder:text-[#3f4147]"
                            />
                            <Button disabled={searching} className="absolute right-2 top-2 h-10 bg-[#5865f2] hover:bg-[#4752c4] text-white font-black text-xs rounded-lg px-6 shadow-xl shadow-indigo-600/20">
                                INITIALIZE SYNC
                            </Button>
                        </div>

                        <div className="space-y-3 max-w-2xl">
                            {searchResults.map((user, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-[#1e1f22] rounded-xl border border-transparent hover:border-indigo-500/30 transition-all group shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#313338] overflow-hidden border border-white/5 font-bold text-white flex items-center justify-center text-xl">
                                            {user.profile_picture ? <img src={user.profile_picture} className="w-full h-full object-cover" /> : user.username[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg leading-tight">@{user.username}</p>
                                            <p className="text-[12px] text-[#b5bac1] uppercase font-bold tracking-widest">Global Node Detected</p>
                                        </div>
                                    </div>
                                    {friends.some(f => f.username === user.username) ? (
                                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                            <Check size={20} />
                                        </div>
                                    ) : (
                                        <button onClick={() => handleAddFriend(user.id)} className="p-3 bg-indigo-500/10 hover:bg-indigo-500 rounded-xl transition-all text-indigo-400 hover:text-white shadow-lg">
                                            <UserPlus size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="px-8 py-6">
                            <div className="relative">
                               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#80848e]" size={20} />
                               <Input 
                                 placeholder="Filter combatants..." 
                                 className="h-10 bg-[#1e1f22] border-none text-[15px] text-white placeholder:text-[#4e5058] focus-visible:ring-1 ring-white/5 rounded-lg shadow-inner"
                               />
                            </div>
                            <div className="flex items-center justify-between mt-8 mb-4">
                                <p className="text-[11px] font-black text-[#949ba4] uppercase tracking-[0.2em]">IDENTIFIED NODES — {friends.length}</p>
                                <p className="text-[11px] font-black text-[#4e5058] uppercase tracking-[0.2em]">ACTIVE PROTOCOL</p>
                            </div>
                        </div>

                        <div className="divide-y divide-[#3f4147]/20 border-t border-[#3f4147]/20">
                            {friends.map((friend, idx) => (
                                <div key={idx} className="flex items-center justify-between px-8 py-4 hover:bg-[#35373c]/50 transition-all group cursor-pointer">
                                   <div className="flex items-center gap-4 min-w-0">
                                      <p className="text-xs font-black text-[#4e5058] w-6 shrink-0 group-hover:text-indigo-400 transition-colors">{(idx + 1).toString().padStart(2, '0')}</p>
                                      <div className="relative shrink-0">
                                         <div className="w-10 h-10 rounded-full bg-[#1e1f22] overflow-hidden border border-white/5 flex items-center justify-center font-bold text-white text-lg">
                                            {friend.profile_picture ? <img src={friend.profile_picture} className="w-full h-full object-cover" /> : friend.username[0]}
                                         </div>
                                         <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3.5px] border-[#313338]"></div>
                                      </div>
                                      <div className="min-w-0">
                                         <p className="font-bold text-white text-lg leading-tight group-hover:text-white truncate">@{friend.username}</p>
                                         <p className="text-[11px] text-[#b5bac1] font-medium leading-tight truncate uppercase tracking-widest mt-0.5">Arena Status: Synchronized</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                      <ActionButton icon={<MessageSquare size={18}/>} />
                                      <ActionButton icon={<MoreVertical size={18}/>} />
                                   </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <aside className="w-[350px] border-l border-[#3f4147]/30 hidden xl:flex flex-col p-8 bg-[#313338]">
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">GRID ACTIVITY</h2>
                <p className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-[0.3em] mb-8">Live Roster Status</p>
                <div className="bg-[#1e1f22] rounded-[2rem] p-10 shadow-2xl border border-[#1f2023] text-center flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-[#2b2d31] flex items-center justify-center text-[#4e5058] mb-6 border border-white/5 shadow-inner">
                        <AtSign size={40} />
                    </div>
                    <p className="font-black text-white text-lg mb-2 uppercase tracking-tight leading-tight">Tactical Roster Quiet</p>
                    <p className="text-[13px] text-[#949ba4] font-medium leading-relaxed italic">"Optimal focus achieved in 92% of active nodes. No disturbances detected in the grid."</p>
                </div>
            </aside>
        </div>
    </DiscordLayout>
  );
};

const TabItem = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={cn(
            "px-2 py-0.5 rounded-[4px] transition-colors font-bold tracking-tight",
            active ? "bg-[#3f4147] text-white" : "text-[#b5bac1] hover:bg-[#35373c] hover:text-white"
        )}
    >
        {label}
    </button>
);

const ActionButton = ({ icon }) => (
    <div className="w-10 h-10 flex items-center justify-center bg-[#2b2d31] rounded-xl text-[#b5bac1] hover:text-white hover:bg-indigo-500 transition-all shadow-lg border border-white/5">
        {icon}
    </div>
);

export default FriendsPage;
