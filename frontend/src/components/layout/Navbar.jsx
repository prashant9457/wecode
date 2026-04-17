import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, User, Settings, Users, MessageSquare, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const username = localStorage.getItem('username');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    // Optionally fetch latest profile pic here if not in localStorage
    const fetchUser = async () => {
       try {
         const res = await fetch(`http://localhost:5000/api/profile/${username}`);
         const data = await res.json();
         if (res.ok) setProfilePicture(data.profile_picture);
       } catch (e) {}
    };
    if (username) fetchUser();
  }, [username]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="h-16 border-b border-[#30363d] bg-[#161b22] sticky top-0 z-[100] px-6 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">WeCode</span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8b949e]">
          <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link to="/friends" className="hover:text-white transition-colors">Combatants</Link>
          <Link to="/groups" className="hover:text-white transition-colors">Groups</Link>
        </div>

        {/* User Menu Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#30363d] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#30363d] overflow-hidden border border-[#444c56]">
                {profilePicture ? (
                    <img src={profilePicture} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8b949e]">
                        <User size={16} />
                    </div>
                )}
            </div>
            <ChevronDown size={14} className={cn("text-[#8b949e] transition-transform", isMenuOpen && "rotate-180")} />
          </button>

          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-[#30363d] mb-2">
                    <p className="text-xs text-[#8b949e] font-bold uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{username}</p>
                </div>
                
                <DropdownItem icon={<User size={16}/>} label="Your Profile" to={`/${username}`} onClick={() => setIsMenuOpen(false)} />
                <DropdownItem icon={<Settings size={16}/>} label="Settings" to="/settings" onClick={() => setIsMenuOpen(false)} />
                <DropdownItem icon={<Users size={16}/>} label="Friends" to="/friends" onClick={() => setIsMenuOpen(false)} />
                <DropdownItem icon={<MessageSquare size={16}/>} label="Recent Questions" to="/dashboard" onClick={() => setIsMenuOpen(false)} />
                
                <div className="border-t border-[#30363d] mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const DropdownItem = ({ icon, label, to, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2 text-sm text-[#c9d1d9] hover:bg-[#30363d] hover:text-white transition-colors"
  >
    {icon} {label}
  </Link>
);

export default Navbar;
