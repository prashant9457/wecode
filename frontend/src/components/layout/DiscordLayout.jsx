import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  Settings,
  Plus,
  LogOut,
  Hash,
  Search,
  X,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Shield,
  Mic,
  Headphones
} from 'lucide-react';
import { cn } from '@/lib/utils';

import SidebarFriends from '@/components/dashboard/SidebarFriends';
import SidebarGroups from '@/components/dashboard/SidebarGroups';
import UserAvatar from '@/components/common/UserAvatar';

const DiscordLayout = ({ 
    children, 
    activeCategory = 'dms', 
    onCategoryChange,
    onSelectionChange,
    onViewChange,
    activeSelectionId,
    friends = [],
    pendingCount = 0,
    onRefresh,
    onlineUsers = new Set()
}) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const [navWidth, setNavWidth] = useState(() => Number(localStorage.getItem('wecode_nav_width')) || 240);
  const [isNavCollapsed, setIsNavCollapsed] = useState(() => localStorage.getItem('wecode_nav_collapsed') === 'true');
  const [profilePicture, setProfilePicture] = useState(null);
  const [fetchedFriends, setFetchedFriends] = useState([]);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [spotlightResults, setSpotlightResults] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutToggle = () => setShowLogoutConfirm(!showLogoutConfirm);
  
  const performLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const spotlightInputRef = useRef(null);

  // Global Search Interface Trigger
  const openSearch = () => setIsSpotlightOpen(true);

  useEffect(() => {
    localStorage.setItem('wecode_nav_width', navWidth);
  }, [navWidth]);

  useEffect(() => {
    localStorage.setItem('wecode_nav_collapsed', isNavCollapsed);
  }, [isNavCollapsed]);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userRes, friendsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/profile/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/friends`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const userData = await userRes.json();
        const friendsData = await friendsRes.json();

        if (userRes.ok) setProfilePicture(userData.profile_picture);
        if (friendsRes.ok) setFetchedFriends(friendsData);
      } catch (e) { }
    };
    if (username) fetchUserAndFriends();
  }, [username]);

  // Command Palette Keyboard Subsystem
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isSpotlightOpen) return;
    const search = async () => {
      if (spotlightQuery.length < 2) {
        setSpotlightResults([]);
        return;
      }
      setSearching(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/users/search?q=${spotlightQuery}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setSpotlightResults(data);
      } catch (e) { } finally {
        setSearching(false);
      }
    };
    const delayDebounce = setTimeout(search, 300);
    return () => clearTimeout(delayDebounce);
  }, [spotlightQuery, isSpotlightOpen]);

  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => spotlightInputRef.current?.focus(), 50);
    } else {
      setSpotlightQuery('');
      setSpotlightResults([]);
    }
  }, [isSpotlightOpen]);

  return (
    <div className="flex h-full bg-[#313338] text-[#dbdee1] font-sans overflow-hidden select-none text-[15px]">

      {/* Spotlight Backdrop */}
      {isSpotlightOpen && (
        <div className="fixed inset-0 z-[500] flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setIsSpotlightOpen(false)} />
          <div className="w-full max-w-[640px] bg-[#1e1f22] rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-[#303135] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 h-16 border-b border-[#303135]">
              <Search className="text-[#949ba4] mr-4" size={24} />
              <input
                ref={spotlightInputRef}
                value={spotlightQuery}
                onChange={e => setSpotlightQuery(e.target.value)}
                placeholder="Find a friend or start a mission..."
                className="flex-1 bg-transparent border-none outline-none text-[20px] text-white placeholder:text-[#4e5058]"
              />
              <div className="flex items-center gap-1.5 px-2 py-1 bg-[#2b2d31] rounded-[4px] text-[12px] font-bold text-[#949ba4] uppercase tracking-widest">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-4 px-2">
              {searching ? (
                <p className="text-center py-10 text-[13px] text-[#949ba4] font-bold uppercase tracking-widest animate-pulse">Scanning Neural Network...</p>
              ) : spotlightResults.length > 0 ? (
                <div className="space-y-1">
                  {spotlightResults.map((user, idx) => (
                    <div
                      key={idx}
                      onClick={() => { navigate(`/${user.username}`); setIsSpotlightOpen(false); }}
                      className="px-4 py-3 rounded-lg hover:bg-indigo-500 group flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <UserAvatar 
                          username={user.username} 
                          profilePicture={user.profile_picture} 
                          isOnline={onlineUsers.has(user.id)} 
                          size="md" 
                          className="group-hover:scale-110 duration-300"
                        />
                        <div>
                          <p className="font-bold text-white leading-tight">@{user.username}</p>
                          <p className={cn(
                              "text-[10px] font-black uppercase tracking-wider",
                              onlineUsers.has(user.id) ? "text-emerald-400 group-hover:text-emerald-200" : "text-[#949ba4] group-hover:text-white/60"
                          )}>
                              {onlineUsers.has(user.id) ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white font-bold text-[11px] uppercase tracking-widest">
                        INITIALIZE <Plus size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <Search size={48} className="mx-auto text-[#4e5058] mb-4 opacity-20" />
                  <p className="text-[13px] text-[#949ba4] font-bold uppercase tracking-widest opacity-40">Ready to search global nodes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1st Column: Server Sidebar */}
      <aside className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 gap-2 shrink-0">
        <SidebarIcon 
            icon={<MessageSquare size={28}/>} 
            active={activeCategory === 'dms'} 
            onClick={() => onCategoryChange?.('dms')}
            label="Direct Messages"
        />
        <SidebarIcon 
            icon={<Users size={26}/>} 
            active={activeCategory === 'groups'} 
            onClick={() => onCategoryChange?.('groups')}
            label="Study Groups"
            color="bg-emerald-500 rounded-[16px]" 
        />
        <div className="w-8 h-[2px] bg-[#35363c] rounded-[1px] my-1" />
        <SidebarIcon 
            icon={<Search size={24}/>} 
            onClick={openSearch}
            label="Search Neural Network"
            color="bg-orange-500 rounded-[16px]" 
        />
        <div className="mt-auto flex flex-col gap-2 pb-4">
           <SidebarIcon icon={<Settings size={22}/>} label="User Settings" onClick={() => navigate('/settings')} />
           
           {/* Tactical Identity Node */}
           <div className="relative group/profile px-2 w-full flex justify-center py-2 transition-all">
                <div 
                    onClick={() => navigate(`/${username}`)}
                    className="cursor-pointer"
                >
                    <UserAvatar 
                        username={username} 
                        profilePicture={profilePicture} 
                        isOnline={true} 
                        size="lg" 
                        className="transition-all duration-300 hover:rounded-[16px]"
                    />
                </div>

                {/* High-Fidelity Profile Expansion Bar with Hover Bridge */}
                <div className="absolute bottom-[-12px] left-[64px] h-[80px] bg-transparent flex items-center group-hover/profile:opacity-100 opacity-0 transition-opacity duration-300 z-50 pointer-events-none group-hover/profile:pointer-events-auto">
                    {/* Persistent Invisible Bridge (Larger Target Area) */}
                    <div className="absolute left-[-40px] top-0 bottom-0 w-[40px] bg-transparent pointer-events-auto" />
                    
                    <div className="bg-[#232428] border border-[#1f2023] shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-[8px] flex items-center px-4 py-2 min-w-[300px] translate-x-[-10px] group-hover/profile:translate-x-0 transition-transform duration-300 h-16 pointer-events-auto">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <UserAvatar 
                                username={username} 
                                profilePicture={profilePicture} 
                                isOnline={true} 
                                size="md" 
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                                <button 
                                    onClick={() => navigate(`/${username}`)}
                                    className="text-white font-bold text-[14px] truncate leading-tight hover:underline text-left cursor-pointer transition-colors hover:text-indigo-400"
                                >
                                    {username}
                                </button>
                                <span className="text-[#949ba4] text-[11px] truncate leading-tight">Arena Operative</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center text-[#b5bac1] gap-1 ml-4 pt-1">
                            <button 
                                className="p-2 hover:bg-[#3f4147] rounded-[4px] transition-colors"
                                onClick={() => navigate('/settings')}
                                title="User Settings"
                            >
                                <Settings size={20} />
                            </button>
                            <button 
                                className="p-2 hover:bg-rose-500/10 text-[#f23f42] rounded-[4px] transition-colors"
                                onClick={handleLogoutToggle}
                                title="Log Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
           </div>
        </div>
      </aside>

      {/* 2nd Column: Channel Sidebar */}
      <aside
        style={{ width: isNavCollapsed ? '48px' : `${navWidth}px` }}
        className={cn(
          "bg-[#2b2d31] flex flex-col shrink-0 relative border-r border-[#1f2023] transition-all duration-200"
        )}
      >
        <div className={cn("flex-1 flex flex-col overflow-hidden")}>
            {isNavCollapsed ? (
                <div className="flex flex-col items-center h-full">
                    {/* Header in Collapsed State */}
                    <div className="h-10 w-full flex items-center justify-center border-b border-[#1f2023] mb-4">
                        <button
                            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                            className="flex items-center justify-center w-6 h-6 hover:text-white text-[#949ba4] transition-all hover:bg-[#35373c] rounded-md"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-6 select-none overflow-y-auto no-scrollbar border-r border-white/5 w-full">
                        <Users size={20} className="text-[#949ba4] mb-2" />
                        <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black tracking-[0.3em] text-[#949ba4] uppercase hover:text-white transition-colors cursor-default">
                            {activeCategory === 'dms' ? 'Communication Node' : 'Citadel Grid'}
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Synchronized Sidebar Header (Fixed Frame) */}
                    <div className="h-10 px-4 flex items-center justify-between border-b border-[#1f2023] shrink-0 bg-[#2b2d31] z-10">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic">
                                {activeCategory === 'dms' ? "Direct Messages" : "Citadels"}
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                            className="flex items-center justify-center w-6 h-6 hover:text-white text-[#949ba4] transition-all hover:bg-[#35373c] rounded-md"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                       {activeCategory === 'dms' ? (
                         <SidebarFriends 
                            friends={friends?.length > 0 ? friends : fetchedFriends} 
                            pendingCount={pendingCount}
                            onRefresh={onRefresh}
                            onSelect={(f) => onSelectionChange?.('friend', f)} 
                            onViewChange={onViewChange}
                            activeId={activeSelectionId} 
                            onlineUsers={onlineUsers}
                         />
                       ) : (
                         <SidebarGroups 
                            onSelect={(g) => onSelectionChange?.('group', g)} 
                            activeId={activeSelectionId} 
                         />
                       )}
                    </div>
                </>
            )}
        </div>

        {!isNavCollapsed && (
          <div
            onMouseDown={() => {
              const handleMouseMove = (e) => {
                const newWidth = Math.min(Math.max(e.clientX - 72, 160), 480);
                setNavWidth(newWidth);
              };
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = 'default';
              };
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
              document.body.style.cursor = 'ew-resize';
            }}
            className="absolute right-0 top-0 bottom-0 w-[4px] cursor-ew-resize hover:bg-indigo-500/50 transition-colors z-[100]"
          />
        )}
      </aside>

      <main className="flex-1 flex flex-col bg-[#313338] min-w-0 overflow-hidden">
        {React.Children.map(children, child => 
          React.isValidElement(child) && typeof child.type !== 'string' 
            ? React.cloneElement(child, { openSearch }) 
            : child
        )}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={handleLogoutToggle}
            />
            <div className="relative bg-[#313338] w-full max-w-[400px] rounded-[8px] shadow-2xl border border-[#1f2023] animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <h2 className="text-white text-[16px] font-bold mb-4">Log Out</h2>
                    <p className="text-[#dbdee1] text-[15px]">Are you sure you want to logout?</p>
                </div>
                <div className="bg-[#2b2d31] p-4 flex justify-end gap-4">
                    <button 
                        onClick={handleLogoutToggle}
                        className="text-white text-[14px] font-medium hover:underline px-2"
                    >
                        No
                    </button>
                    <button 
                        onClick={performLogout}
                        className="bg-[#f23f42] hover:bg-[#d83c3e] text-white text-[14px] font-medium px-6 py-2 rounded-[3px] transition-all"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const SidebarIcon = ({ icon, to, active, color, label, onClick }) => {
  const content = (
    <div 
      onClick={onClick}
      className={cn(
        "w-12 h-12 flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden",
        active ? (color || "bg-indigo-500 rounded-[16px]") : ("bg-[#313338] rounded-[24px] hover:rounded-[16px] hover:bg-indigo-500 text-[#dbdee1] hover:text-white")
      )}
    >
      {icon}
    </div>
  );

  return (
    <div className="relative flex items-center justify-center group font-bold">
      {active && <div className="absolute -left-3 w-2 h-10 bg-white rounded-r-[4px]" />}
      {!active && <div className="absolute -left-3 w-2 h-5 bg-white rounded-r-[4px] opacity-0 group-hover:opacity-100 transition-all transform scale-0 group-hover:scale-100" />}
      <div className="absolute left-[76px] bg-[#232428] text-white text-[15px] font-black uppercase tracking-widest px-4 py-2 rounded-[6px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-2xl z-[600] border border-[#1f2023]">
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-[#232428]" />
          {label}
      </div>
      {to ? <Link to={to}>{content}</Link> : content}
    </div>
  );
};

export default DiscordLayout;
