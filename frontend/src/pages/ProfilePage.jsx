import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DiscordLayout from '@/components/layout/DiscordLayout';
import { 
  Rocket, 
  ShieldCheck, 
  Plus, 
  PlusCircle, 
  ExternalLink, 
  Terminal, 
  Code,
  AlertCircle,
  Activity,
  UserPlus,
  ChevronRight,
  Hash,
  AtSign,
  Bell,
  Pin,
  Inbox,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewerUsername = localStorage.getItem('username');
  const isOwnProfile = viewerUsername === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/profile/${username}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Profile not found');
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/friends/add', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ friendId: profile.id })
      });
      if (res.ok) {
        setProfile(prev => ({ ...prev, is_friend: true }));
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

  if (error || !profile) return (
    <div className="h-screen bg-[#313338] flex flex-col items-center justify-center p-10 text-center">
       <AlertCircle size={48} className="text-rose-500 mb-4 opacity-50" />
       <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Node Synchronization Failed</h1>
       <p className="text-[#949ba4] mb-8 font-medium max-w-md">{error || "The requested operative node could not be localized on the global grid."}</p>
       <Button onClick={() => navigate('/dashboard')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-8 rounded-[4px]">Return to Ops</Button>
    </div>
  );

  const hasLeetCode = profile.coding_profiles?.some(p => p.platform.toLowerCase() === 'leetcode');

  return (
    <DiscordLayout>
        {/* Thin Optimized Header */}
        <header className="h-12 border-b border-[#1f2023] shadow-sm flex items-center justify-between px-4 shrink-0 bg-[#313338] z-20">
             <div className="flex items-center gap-2">
                 <AtSign size={20} className="text-[#80848e] mr-1" />
                 <span className="font-bold text-white text-[15px]">{profile.username}</span>
                 <div className="w-[1px] h-6 bg-[#3f4147] mx-2" />
                 <div className="w-2 h-2 bg-[#23a559] rounded-full" />
                 <span className="text-[12px] font-bold text-[#949ba4] uppercase tracking-widest">Active Node</span>
             </div>

             <div className="flex items-center gap-4 text-[#b5bac1]">
                <button title="Mute Notification" className="hover:text-[#dbdee1] transition-colors"><Bell size={20} /></button>
                <button title="Pinned Hub" className="hover:text-[#dbdee1] transition-colors"><Pin size={20} /></button>
                <button title="Inbox" className="hover:text-[#dbdee1] transition-colors"><Inbox size={20} /></button>
                <button title="Help" className="hover:text-[#dbdee1] transition-colors"><HelpCircle size={20} /></button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* Gradient Header */}
            <div className="h-40 bg-gradient-to-r from-indigo-900 via-indigo-600 to-indigo-900 group relative">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <main className="max-w-4xl mx-auto px-6 -mt-16 relative z-10 pb-20">
                
                {/* Profile Identity section */}
                <div className="bg-[#1e1f22] rounded-2xl p-6 border border-[#1f2023] shadow-2xl mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="w-32 h-32 rounded-full bg-[#1e1f22] border-[6px] border-[#1e1f22] -mt-20 overflow-hidden shadow-2xl relative shrink-0">
                            {profile.profile_picture ? (
                                <img src={profile.profile_picture} className="w-full h-full object-cover" alt={profile.username} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-indigo-500 bg-[#2b2d31]">
                                    {profile.username[0].toUpperCase()}
                                </div>
                            )}
                            <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#23a559] rounded-full border-[6px] border-[#1e1f22]"></div>
                        </div>
                        
                        <div className="flex-1 pb-1">
                            <div className="flex items-center flex-wrap gap-4 mb-1">
                                <h1 className="text-3xl font-black text-white tracking-tighter">@{profile.username}</h1>
                                <ShieldCheck className="text-indigo-400" size={24} />
                                {!isOwnProfile && !profile.is_friend && (
                                    <Button 
                                        onClick={handleAddFriend}
                                        className="h-8 bg-[#248046] hover:bg-[#1a5e34] text-white text-[12px] font-bold px-4 rounded-[3px]"
                                    >
                                        Add Path
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm font-medium text-[#dbdee1]">{profile.extra_data?.college || 'Elite Node'}</p>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-[#2b2d31] my-6" />

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-widest mb-1.5 px-0.5">ABOUT ME</h3>
                            <p className="text-[#dbdee1] leading-relaxed text-sm whitespace-pre-wrap">
                                {profile.extra_data?.bio || 'Competitive Programming || System Optimization || Algorithmic Analysis.\nThis node has not provided a detailed bio yet.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-10 pt-2 font-mono">
                            <div>
                                <p className="text-[10px] text-[#b5bac1] font-bold uppercase tracking-widest mb-0.5">SOLVED NODES</p>
                                <p className="text-xl font-black text-white">{profile.solved_count || 0}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-[#b5bac1] font-bold uppercase tracking-widest mb-0.5">ARENA STATUS</p>
                                <p className="text-xl font-black text-white">ELITE</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscriptions Grid (Horizontal) */}
                <h2 className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-[0.2em] mb-4 px-1">CODING INFRASTRUCTURE</h2>
                <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                    {isOwnProfile && !hasLeetCode && (
                        <ProfileCTA 
                            title="Link LeetCode"
                            desc="Sync your primary engine."
                            color="from-orange-500 to-amber-600"
                            action={() => navigate('/settings')}
                        />
                    )}

                    {profile.coding_profiles?.length > 0 ? profile.coding_profiles.map((cp, idx) => (
                        <CodingCard key={idx} platform={cp.platform} username={cp.platform_username} />
                    )) : !isOwnProfile && (
                        <div className="min-w-[280px] h-[160px] rounded-2xl bg-[#1e1f22] border border-[#2b2d31] flex flex-col items-center justify-center text-center p-6 border-dashed">
                           <Activity className="text-[#313338] mb-2" size={32} />
                           <p className="text-[10px] font-bold text-[#949ba4] uppercase tracking-widest">NO NODES LINKED</p>
                        </div>
                    )}

                    {isOwnProfile && (
                        <button 
                            onClick={() => navigate('/settings')}
                            className="min-w-[280px] h-[160px] rounded-2xl border-2 border-dashed border-[#2b2d31] hover:border-[#4e5058] hover:bg-[#2b2d31]/30 transition-all flex flex-col items-center justify-center group"
                        >
                            <PlusCircle size={24} className="text-[#4e5058] group-hover:text-[#dbdee1] mb-2 transition-colors" />
                            <span className="text-[11px] font-bold text-[#949ba4] uppercase tracking-widest group-hover:text-[#dbdee1] transition-colors">Add Profile Node</span>
                        </button>
                    )}
                </div>

            </main>
        </div>
    </DiscordLayout>
  );
};

const CodingCard = ({ platform, username }) => (
    <div className="min-w-[280px] h-[160px] rounded-2xl bg-[#1e1f22] border border-[#2b2d31] p-6 flex flex-col justify-between hover:bg-[#2b2d31] transition-colors relative overflow-hidden group">
        <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            {platform.toLowerCase() === 'leetcode' ? <Code size={48} /> : <Terminal size={48} />}
        </div>
        <div>
           <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <p className="text-[10px] font-bold text-[#b5bac1] uppercase tracking-widest">{platform}</p>
           </div>
           <h3 className="text-xl font-bold text-white truncate">@{username}</h3>
        </div>
        <div className="flex items-center justify-between text-[#8b949e]">
           <span className="text-[10px] font-bold tracking-widest">ACTIVE NODE</span>
           <ExternalLink size={14} className="text-indigo-400" />
        </div>
    </div>
);

const ProfileCTA = ({ title, desc, color, action }) => (
    <button 
        onClick={action}
        className={cn("min-w-[280px] h-[160px] rounded-2xl bg-gradient-to-br p-6 text-left hover:scale-[1.02] transition-transform active:scale-95 group shadow-xl", color)}
    >
        <h3 className="text-lg font-black text-white tracking-tight mb-1">{title}</h3>
        <p className="text-[11px] font-medium text-white/80 leading-snug mb-4">{desc}</p>
        <div className="flex items-center gap-1.5 text-white font-black text-[10px] uppercase tracking-widest bg-black/20 w-fit px-3 py-1.5 rounded-full">
            INITIALIZE <Rocket size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
    </button>
);

export default ProfilePage;
