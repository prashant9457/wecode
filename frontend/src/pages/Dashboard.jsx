import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscordLayout from '@/components/layout/DiscordLayout';
import {
    Users,
    Hash,
    HelpCircle,
    Terminal,
    Search,
    MessageSquare,
    PlusCircle,
    ArrowRight,
    AtSign,
    UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

import ContentProfile from '@/components/dashboard/ContentProfile';
import ContentGroup from '@/components/dashboard/ContentGroup';
import DashboardStats from '@/components/dashboard/DashboardStats';

import FriendGrid from '@/components/dashboard/FriendGrid';
import GroupsGrid from '@/components/dashboard/GroupsGrid';

import WebGLLoader from '@/components/common/WebGLLoader';

const Dashboard = ({ openSearch }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSolved: 0,
    recentSolved: [],
    friends: [],
    totalFriends: 0,
    pendingCount: 0
  });
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Column 1 State
  const [activeCategory, setActiveCategory] = useState('dms');
  
  // Column 2 & 3 Selection State
  const [activeSelection, setActiveSelection] = useState(null); 
  
  // Column 3 Sub-View State (for Feed/Overview)
  const [activeView, setActiveView] = useState('launchpad'); 
  
  // Column 4 Panel State
  const [rightWidth, setRightWidth] = useState(() => Number(localStorage.getItem('wecode_right_width')) || 340);
  const [isRightCollapsed, setIsRightCollapsed] = useState(() => localStorage.getItem('wecode_right_collapsed') === 'true');

    useEffect(() => {
        localStorage.setItem('wecode_right_width', rightWidth);
    }, [rightWidth]);

    useEffect(() => {
        localStorage.setItem('wecode_right_collapsed', isRightCollapsed);
    }, [isRightCollapsed]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [statsRes, feedRes, friendsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/dashboard/stats', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:5000/api/feed', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:5000/api/friends', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (statsRes.status === 401 || feedRes.status === 401 || friendsRes.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                    return;
                }

                if (statsRes.ok && friendsRes.ok) {
                    const statsData = await statsRes.json();
                    const friendsData = await friendsRes.json();
                    
                    setStats({
                        totalFriends: statsData.totalFriends || 0,
                        pendingCount: statsData.pendingCount || 0,
                        friends: Array.isArray(friendsData) ? friendsData : [],
                        totalSolved: statsData.totalSolved || 0,
                        recentSolved: Array.isArray(statsData.recentSolved) ? statsData.recentSolved : []
                    });
                }

                if (feedRes.ok) {
                    const feedData = await feedRes.json();
                    setFeed(Array.isArray(feedData) ? feedData : []);
                }
            } catch (err) {
                console.error('Teletransmission Sync Failure:', err.message);
            } finally {
                // Keep loading for a tactical second to show off the WebGL
                setTimeout(() => setLoading(false), 1200);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) return (
        <div className="h-screen bg-[#313338] flex flex-col items-center justify-center gap-6">
            <WebGLLoader size={120} />
            <div className="flex flex-col items-center animate-pulse">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic mb-1">Synchronizing Neural Hub</p>
                <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-indigo-500 w-1/3 animate-progress-flow" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-[#313338] overflow-hidden">
            {/* Pure Minimalist Mission Header (Text Only Centered) */}
            <header className="h-10 border-b border-[#1f2023] flex items-center justify-center px-3 shrink-0 bg-[#313338] z-20">
                {/* Middle Part: Dynamic Centered Field Identity */}
                <div className="flex items-center gap-2">
                    <span className="font-black text-white text-[13px] uppercase tracking-[0.15em] truncate">
                        {activeView === 'selection' && activeSelection?.data
                            ? (activeSelection.type === 'friend' ? activeSelection.data.username : activeSelection.data.name) 
                            : (activeCategory === 'dms' ? "FRIENDS" : "CITADELS")}
                    </span>
                    {activeView === 'selection' && activeSelection?.data && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                </div>
            </header>

            <div className="flex-1 overflow-hidden">
                <DiscordLayout 
                    friends={stats.friends}
                    activeCategory={activeCategory}
                    activeSelectionId={activeView === 'friends' ? 'friends_grid_global' : (activeSelection?.type === 'friend' ? activeSelection.data.username : activeSelection?.data.id)}
                    onCategoryChange={(cat) => {
                        setActiveCategory(cat);
                        setActiveSelection(null);
                        setActiveView(cat === 'dms' ? 'launchpad' : 'groups_grid');
                    }}
                    onSelectionChange={(type, data) => {
                        setActiveSelection({ type, data });
                        setActiveView('selection');
                    }}
                    onViewChange={(view) => {
                        setActiveView(view);
                        if (view !== 'selection') setActiveSelection(null);
                    }}
                >
                    <div className="flex-1 flex overflow-hidden relative">
                        <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative bg-[#313338]">
                            {activeView === 'selection' && activeSelection?.type === 'friend' && (
                                <ContentProfile user={activeSelection.data} />
                            )}

                            {activeView === 'selection' && activeSelection?.type === 'group' && (
                                <ContentGroup group={activeSelection.data} />
                            )}

                            {activeView === 'friends' && (
                                <FriendGrid 
                                    friends={stats.friends} 
                                    onSelect={(f) => { setActiveSelection({ type: 'friend', data: f }); setActiveView('selection'); }} 
                                    activeId={activeSelection?.data?.username} 
                                />
                            )}

                            {activeView === 'groups_grid' && (
                                <GroupsGrid 
                                    groups={[
                                        { id: 'g1', name: 'Alpha-Coders', description: 'Advanced tactical algorithm conquest cluster.', members: 12, isPrivate: false },
                                        { id: 'g2', name: 'Bit-Crushers', description: 'High-speed bit manipulation and system design study node.', members: 8, isPrivate: true }
                                    ]} 
                                    onSelect={(g) => { setActiveSelection({ type: 'group', data: g }); setActiveView('selection'); }} 
                                    activeId={activeSelection?.data?.id}
                                />
                            )}

                            {activeView === 'launchpad' && (
                                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center max-w-2xl mx-auto">
                                    <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 border border-indigo-500/20 shadow-xl shadow-indigo-500/5 rotate-3 hover:rotate-0 transition-transform duration-500">
                                        <MessageSquare size={48} />
                                    </div>
                                    <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">Start Convo</h1>
                                    <p className="text-[#b5bac1] text-lg mb-10 leading-relaxed font-medium">Connect with tactical peers, synchronize results, and dominate the algorithmic arena through collaborative insight.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <button
                                            onClick={() => setActiveView('friends')}
                                            className="bg-indigo-500 hover:bg-indigo-400 text-white p-6 rounded-2xl flex flex-col items-start gap-3 transition-all group border border-white/10 shadow-lg hover:translate-y-[-2px]"
                                        >
                                            <PlusCircle size={24} />
                                            <div className="text-left">
                                                <span className="block font-black uppercase text-[12px] tracking-widest opacity-80">Action // Start</span>
                                                <span className="block font-bold text-xl">New Conversation</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setActiveView('friends')}
                                            className="bg-[#2b2d31] hover:bg-[#35373c] text-white p-6 rounded-2xl flex flex-col items-start gap-3 transition-all group border border-[#1f2023] shadow-lg hover:translate-y-[-2px]"
                                        >
                                            <Users size={24} className="text-indigo-400" />
                                            <div className="text-left">
                                                <span className="block font-black uppercase text-[12px] tracking-widest text-[#949ba4]">Action // Grid</span>
                                                <span className="block font-bold text-xl">Sync Combatants</span>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="mt-12 w-full pt-10 border-t border-[#3f4147]/30">
                                        <p className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-[0.3em] mb-6">Recent Combatant Nodes</p>
                                        <div className="flex flex-wrap justify-center gap-4">
                                            {stats?.friends?.slice(0, 4).map((f, i) => (
                                                <div key={i} onClick={() => { setActiveSelection({ type: 'friend', data: f }); setActiveView('selection'); }} className="flex items-center gap-3 bg-[#1e1f22] p-2 pr-4 rounded-xl border border-[#2b2d31] hover:border-indigo-500/50 transition-all hover:bg-[#2b2d31] cursor-pointer">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#2b2d31]">
                                                        {f.profile_picture ? <img src={f.profile_picture} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white">{f.username ? f.username[0] : '?'}</div>}
                                                    </div>
                                                    <span className="text-xs font-bold text-white">@{f.username}</span>
                                                </div>
                                            ))}
                                            <button onClick={() => setActiveView('friends')} className="w-8 h-8 rounded-full border border-dashed border-[#4e5058] flex items-center justify-center text-[#4e5058] hover:text-white hover:border-white transition-all">
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeView === 'feed' && (
                                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pt-6 pb-12 px-6 gap-6">
                                    <div className="mb-8">
                                        <div className="w-16 h-16 rounded-full bg-[#404249] flex items-center justify-center text-white mb-4">
                                            <Hash size={40} />
                                        </div>
                                        <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Welcome to #operational-feed!</h1>
                                        <p className="text-[#b5bac1]">This is the start of the #operational-feed channel. Tracking all system conquests.</p>
                                    </div>

                                    <div className="w-full h-[1px] bg-[#3f4147] my-2 relative">
                                        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#313338] px-2 text-[11px] font-black text-[#4e5058] uppercase tracking-widest">System Log</span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                                        <div className="max-w-[700px] mx-auto space-y-4">
                                            {feed && feed.length > 0 ? feed.map((msg, i) => (
                                                <div key={i} className="group hover:bg-[#2e3035] -mx-6 px-6 py-1 transition-colors flex gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 shrink-0 mt-0.5 overflow-hidden">
                                                        {msg.profile_picture ? <img src={msg.profile_picture} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-bold">{msg.username[0]}</div>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-white hover:underline cursor-pointer">@{msg.username}</span>
                                                            <span className="text-[11px] text-[#949ba4] font-medium">{new Date(msg.solved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <div className="text-[#dbdee1] leading-relaxed">
                                                            Solved <span className="text-indigo-400 font-black">[{msg.title}]</span> on <span className="font-bold text-emerald-400">{msg.platform}</span>.
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="py-20 text-center">
                                                    <MessageSquare size={48} className="mx-auto text-[#4e5058] mb-4 opacity-20" />
                                                    <p className="text-[13px] text-[#949ba4] font-bold uppercase tracking-widest opacity-40">Operational feed is silent.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </main>

                        <DashboardStats 
                            stats={stats}
                            isCollapsed={isRightCollapsed}
                            onToggle={() => setIsRightCollapsed(!isRightCollapsed)}
                            width={rightWidth}
                            onResize={setRightWidth}
                        />
                    </div>
                </DiscordLayout>
            </div>
        </div>
    );
};

export default Dashboard;
