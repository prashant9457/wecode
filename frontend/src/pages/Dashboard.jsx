import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  Home, 
  Plus, 
  Settings, 
  LogOut, 
  User, 
  Users, 
  MessageSquare, 
  Hash, 
  Compass, 
  Bell,
  Search,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { username: urlUsername } = useParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedEmail = localStorage.getItem('userEmail');
    const storedUsername = localStorage.getItem('username');
    
    setUser({ 
      email: storedEmail || 'user@example.com', 
      username: storedUsername || urlUsername || 'Guest' 
    });
  }, [navigate, urlUsername]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    navigate('/');
  };

  const servers = [
    { id: '1', name: 'Web Devs', initial: 'W', color: 'bg-indigo-500' },
    { id: '2', name: 'React Pros', initial: 'R', color: 'bg-emerald-500' },
    { id: '3', name: 'Design Hub', initial: 'D', color: 'bg-rose-500' },
    { id: '4', name: 'Study Group', initial: 'S', color: 'bg-amber-500' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#313338] text-[#dbdee1] overflow-hidden">
      
      {/* 1. Server Sidebar (Narrow) */}
      <nav className="w-[72px] flex flex-col items-center py-3 space-y-2 bg-[#1e1f22] shrink-0">
        <ServerIcon icon={<Home size={28} />} active={activeTab === 'home'} onClick={() => setActiveTab('home')} color="bg-[#313338] text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-[24px] hover:rounded-[16px]" />
        
        <div className="w-8 h-[2px] bg-[#35363c] rounded-full mx-auto my-2" />
        
        {servers.map((server) => (
          <ServerIcon 
            key={server.id} 
            text={server.initial} 
            tooltip={server.name}
            active={activeTab === server.id} 
            onClick={() => setActiveTab(server.id)}
            color={server.color}
          />
        ))}
        
        <ServerIcon icon={<Plus size={24} />} color="bg-[#313338] text-emerald-500 hover:bg-emerald-500 hover:text-white" tooltip="Add a Server" />
        <ServerIcon icon={<Compass size={24} />} color="bg-[#313338] text-emerald-500 hover:bg-emerald-500 hover:text-white" tooltip="Explore Discoverable Servers" />

        <div className="mt-auto pt-2 space-y-2">
           <div className="w-8 h-[2px] bg-[#35363c] rounded-full mx-auto my-2" />
           <ServerIcon 
            icon={<User size={24} />} 
            tooltip="ProfileSettings"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            color="bg-slate-700"
          />
        </div>
      </nav>

      {/* 2. Channel Sidebar (Wide) */}
      <aside className="w-[240px] flex flex-col bg-[#2b2d31] shrink-0">
        <header className="h-12 px-4 flex items-center shadow-sm border-b border-[#1e1f22] font-semibold text-white truncate">
          {activeTab === 'home' ? 'Direct Messages' : servers.find(s => s.id === activeTab)?.name || 'Server'}
        </header>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {activeTab === 'home' ? (
            <>
              <ChannelLink icon={<Users size={18} />} label="Friends" active />
              <ChannelLink icon={<Rocket size={18} />} label="Nitro" />
              <ChannelLink icon={<MessageSquare size={18} />} label="Message Requests" />
              
              <div className="pt-4 pb-1 px-2 text-xs font-semibold text-[#949ba4] uppercase flex justify-between items-center group">
                Direct Messages
                <Plus size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer" />
              </div>
              <DMUser name="Prasant" status="online" />
              <DMUser name="Wecode Support" status="idle" />
            </>
          ) : (
            <>
              <div className="pt-4 pb-1 px-2 text-xs font-semibold text-[#949ba4] uppercase flex justify-between items-center group">
                Text Channels
                <Plus size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer" />
              </div>
              <ChannelLink icon={<Hash size={18} />} label="general" active />
              <ChannelLink icon={<Hash size={18} />} label="announcements" />
              <ChannelLink icon={<Hash size={18} />} label="resources" />
              
              <div className="pt-4 pb-1 px-2 text-xs font-semibold text-[#949ba4] uppercase flex justify-between items-center group">
                Voice Channels
                <Plus size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer" />
              </div>
              <ChannelLink icon={<Bell size={18} />} label="General Voice" />
            </>
          )}
        </div>

        {/* User Profile Bar at Bottom of Sidebar */}
        <footer className="h-14 bg-[#232428] px-2 flex items-center gap-2 group shrink-0">
          <div className="relative cursor-pointer" onClick={() => navigate(`/${user?.username}`)}>
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase transition-opacity hover:opacity-80">
              {user?.username?.[0] || 'U'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-[3px] border-[#232428]" />
          </div>
          <div className="flex-1 min-w-0 pr-1 cursor-pointer" onClick={() => navigate(`/${user?.username}`)}>
            <div className="text-sm font-semibold text-white truncate hover:underline">{user?.username}</div>
            <div className="text-[11px] text-[#949ba4] truncate">Online</div>
          </div>
          <div className="flex items-center gap-0.5">
            <div 
              className="p-1.5 rounded-md hover:bg-[#35373c] text-[#b5bac1] cursor-pointer" 
              onClick={() => navigate(`/${user?.username}`)}
              title="Profile Settings"
            >
              <Settings size={16} />
            </div>
            <div className="p-1.5 rounded-md hover:bg-[#35373c] text-[#b5bac1] cursor-pointer" onClick={handleLogout} title="Logout">
              <LogOut size={16} className="text-rose-400" />
            </div>
          </div>
        </footer>
      </aside>

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#313338] min-w-0">
        <header className="h-12 px-4 flex items-center shadow-sm border-b border-[#1e1f22] shrink-0">
          <Hash size={24} className="text-[#80848e] mr-2" />
          <span className="font-semibold text-white mr-auto">general</span>
          
          <div className="flex items-center gap-4 text-[#b5bac1]">
            <Bell size={20} className="hover:text-white cursor-pointer" />
            <Search size={20} className="hover:text-white cursor-pointer" />
            <Users size={20} className="hover:text-white cursor-pointer" />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to #general</h1>
            <p className="text-[#b5bac1] mb-8">This is the start of the #general channel.</p>
            
            <div className="space-y-4">
              <Message author="System" time="Today at 4:20 PM" content="Welcome to the new WeCode platform! Start building something amazing." />
              <Message author="Prasant" time="Today at 4:22 PM" content="The UI looks amazing! Very smooth." />
              <Message author={user?.username || 'User'} time="Just now" content="Testing the new Discord-like layout. Everything is working perfectly." isOwn />
            </div>
          </div>
        </div>

        {/* Message Input Container */}
        <div className="px-4 pb-6 shrink-0">
          <div className="bg-[#383a40] rounded-lg p-2.5 flex items-center gap-4">
            <Plus className="bg-[#b5bac1] text-[#383a40] rounded-full p-0.5 cursor-pointer hover:bg-white" size={20} />
            <input 
              type="text" 
              placeholder={`Message #general`}
              className="bg-transparent border-none text-[15px] focus:ring-0 text-[#dbdee1] w-full placeholder:text-[#6d6f78]"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// UI Components
const ServerIcon = ({ icon, text, active, onClick, color, tooltip }) => (
  <div className="relative group flex items-center justify-center">
    {active && <div className="absolute left-0 w-1 h-10 bg-white rounded-r-full" />}
    {!active && <div className="absolute left-0 w-1 h-0 bg-white rounded-r-full group-hover:h-5 transition-all duration-200" />}
    <div 
      onClick={onClick}
      className={cn(
        "w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200",
        active ? "rounded-[16px]" : "rounded-[24px]",
        "group-hover:rounded-[16px]",
        color,
        "text-white font-bold text-lg"
      )}
    >
      {icon || text}
    </div>
    {tooltip && (
      <div className="absolute left-16 px-3 py-2 bg-black text-white text-xs font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
        {tooltip}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-black" />
      </div>
    )}
  </div>
);

const ChannelLink = ({ icon, label, active }) => (
  <div className={cn(
    "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors mb-0.5 group",
    active ? "bg-[#3f4147] text-white" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
  )}>
    <div className={active ? "text-[#dbdee1]" : "text-[#80848e] group-hover:text-[#dbdee1]"}>
      {icon}
    </div>
    <span className="text-[15px] font-medium truncate">{label}</span>
  </div>
);

const DMUser = ({ name, status }) => (
  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[#35373c] group mb-0.5">
    <div className="relative shrink-0">
      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white uppercase group-hover:bg-slate-500 transition-colors">
        {name[0]}
      </div>
      <div className={cn(
        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-[2.5px] border-[#2b2d31] group-hover:border-[#35373c]",
        status === 'online' ? 'bg-emerald-500' : status === 'idle' ? 'bg-amber-500' : 'bg-rose-500'
      )} />
    </div>
    <span className="text-[15px] font-medium text-[#949ba4] group-hover:text-[#dbdee1] truncate">{name}</span>
  </div>
);

const Message = ({ author, time, content, isOwn }) => (
  <div className="flex gap-4 group hover:bg-[#2e3035] -mx-4 px-4 py-1 mt-2">
    <div className="w-10 h-10 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white font-bold text-sm uppercase cursor-pointer">
      {author[0]}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={cn("font-semibold hover:underline cursor-pointer", isOwn ? "text-emerald-400" : "text-white")}>
          {author}
        </span>
        <span className="text-[11px] text-[#949ba4] font-medium">{time}</span>
      </div>
      <div className="text-[15px] text-[#dbdee1] leading-normal">{content}</div>
    </div>
  </div>
);

export default Dashboard;
