import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  User as UserIcon,
  Eye,
  CheckCircle2,
  MessageSquare,
  Star,
  Terminal,
  Code2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProfileSidebar = ({ profileData, leetcodeStats, isOwnProfile, isEditing, setIsEditing, handleSave }) => {
  return (
    <aside className="lg:col-span-3 space-y-6">
      
      {/* Identity Card */}
      <div className="bg-[#282828] rounded-xl p-4 shadow-sm border border-white/5">
         <div className="flex gap-4 mb-4">
            <div className="w-[85px] h-[85px] rounded-lg bg-[#3e3e3e] overflow-hidden shrink-0 shadow-lg border border-white/5">
              {profileData.profile_picture ? (
                <img src={profileData.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-600 font-bold text-2xl text-white">
                  {profileData.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h1 className="text-xl font-bold leading-tight truncate">
                {profileData.username} <ShieldCheck size={18} className="inline text-green-500 ml-1" />
              </h1>
              <p className="text-sm text-[#a1a1a1] truncate">{profileData.first_name} {profileData.last_name}</p>
              <div className="mt-2 text-[13px] font-medium text-[#eff1f6]">Rank <span className="text-white ml-2">{leetcodeStats?.ranking || 'Unranked'}</span></div>
            </div>
         </div>

         <div className="text-[13px] text-[#eff1f6] leading-relaxed mb-4">
            Elite Competitive Programmer || {profileData.institute || 'Arena'} || Focused on LeetCode & Codeforces.
         </div>

         <div className="flex gap-4 text-sm font-bold text-[#eff1f6] mb-6 border-b border-[#3e3e3e] pb-4">
            <div className="flex gap-1 hover:text-indigo-400 cursor-pointer transition-colors">4 <span className="text-[#a1a1a1] font-normal">Following</span></div>
            <div className="flex gap-1 hover:text-indigo-400 cursor-pointer transition-colors">12 <span className="text-[#a1a1a1] font-normal">Followers</span></div>
         </div>

         {isOwnProfile && (
           <Button 
             className={cn("w-full h-9 rounded-lg font-bold transition-all", 
               isEditing ? "bg-green-600 hover:bg-green-500 text-white" : "bg-[#323232] hover:bg-[#3e3e3e] text-white border border-[#3e3e3e]"
             )} 
             onClick={isEditing ? handleSave : () => setIsEditing(true)}
           >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
           </Button>
         )}

         <div className="mt-6 space-y-3">
            <SidebarInfo icon={<MapPin size={16}/>} text={profileData.institute || 'India'} />
            <SidebarInfo icon={<GraduationCap size={16}/>} text={profileData.department || 'Institute'} />
            
            {/* Arena Links */}
            <div className="pt-4 border-t border-[#3e3e3e] space-y-2">
               <h3 className="text-[10px] font-bold text-[#a1a1a1] uppercase tracking-widest mb-2 px-1">Arena Profiles</h3>
               <ArenaLink icon={<Code2 size={16} className="text-orange-400"/>} label="LeetCode" url={`https://leetcode.com/${profileData.username}`} />
               <ArenaLink icon={<Terminal size={16} className="text-blue-400"/>} label="Codeforces" url={`https://codeforces.com/profile/${profileData.username}`} />
            </div>
         </div>
      </div>

      {/* Community Stats */}
      <div className="bg-[#282828] rounded-xl p-4 shadow-sm border border-white/5">
         <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-[#a1a1a1]">Community Stats</h3>
         <div className="space-y-4">
            <CommunityItem icon={<Eye size={16} className="text-blue-400"/>} label="Views" value="431" sub="Last week +12" />
            <CommunityItem icon={<CheckCircle2 size={16} className="text-green-500"/>} label="Solution" value="28" sub="Last week 0" />
            <CommunityItem icon={<MessageSquare size={16} className="text-yellow-500"/>} label="Discuss" value="14" sub="Last week +2" />
            <CommunityItem icon={<Star size={16} className="text-orange-400"/>} label="Reputation" value={leetcodeStats?.contributionPoints || '0'} />
         </div>
      </div>

    </aside>
  );
};

const SidebarInfo = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-[#eff1f6] hover:text-indigo-400 transition-colors cursor-pointer group px-1">
     <span className="text-[#a1a1a1] group-hover:text-indigo-400 shrink-0">{icon}</span>
     <span className="truncate">{text}</span>
  </div>
);

const ArenaLink = ({ icon, label, url }) => (
  <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded-lg bg-[#323232] border border-white/5 hover:border-indigo-500/30 group transition-all">
     <div className="flex items-center gap-3 min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="text-xs font-bold truncate group-hover:text-white transition-colors">{label}</span>
     </div>
     <ExternalLink size={14} className="text-[#a1a1a1] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
  </a>
);

const CommunityItem = ({ icon, label, value, sub }) => (
  <div className="flex justify-between items-start group cursor-pointer px-1">
    <div className="flex gap-4">
       <div className="mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity shrink-0">{icon}</div>
       <div className="min-w-0">
          <p className="text-[11px] font-bold text-[#a1a1a1] uppercase tracking-wider mb-0.5 mt-0.5">{label}</p>
          <p className="text-sm font-bold tracking-tight">{value}</p>
       </div>
    </div>
    {sub && <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/10">{sub}</span>}
  </div>
);
