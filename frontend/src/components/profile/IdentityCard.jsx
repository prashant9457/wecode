import React from 'react';
import { 
    MapPin, 
    Globe, 
    GraduationCap, 
    Eye, 
    CheckSquare, 
    MessageSquare, 
    Star,
    Edit3,
    Activity,
    Calendar,
    Crown
} from 'lucide-react';

const IdentityCard = ({ profile, isOwnProfile, setIsEditing, leetcodeStats }) => {
    const technical = profile?.technical_profiles || {};
    const academic = profile?.academic_details || {};
    const skills = profile?.skills || [];

    const SectionHeader = ({ children }) => (
        <h3 className="text-[10px] font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">{children}</h3>
    );

    const StatItem = ({ icon: Icon, label, value, color }) => (
        <div className="flex items-center justify-between group/stat py-1">
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-[#80848E]" />
                <span className="text-[11px] font-bold text-[#B5BAC1] tracking-tight">{label}</span>
            </div>
            <span className="text-xs font-bold text-white tracking-tight">{value}</span>
        </div>
    );

    return (
        <div className="w-full flex flex-col relative">
            {/* Banner Area */}
            <div className="h-24 w-full bg-gradient-to-r from-orange-500 to-yellow-600 relative">
                {isOwnProfile && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute top-2 right-2 p-1.5 bg-black/30 hover:bg-black/50 rounded-full text-white transition-all backdrop-blur-sm"
                        title="Edit Profile"
                    >
                        <Edit3 size={14} />
                    </button>
                )}
            </div>

            {/* Profile Avatar Overlap */}
            <div className="px-4 -mt-12 mb-4 relative">
                <div className="relative inline-block group">
                    <img 
                        src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.username || 'user'}`} 
                        alt={profile?.full_name} 
                        className="w-24 h-24 rounded-full border-[6px] border-[#2B2D31] bg-[#1E1F22] object-cover ring-1 ring-black/10"
                    />
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-[4px] border-[#2B2D31]"></div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="px-4 pb-6 space-y-5">
                {/* Name & Basic Info */}
                <div className="space-y-0.5">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        {profile?.full_name || profile?.username || 'Operative'}
                        <Crown size={14} className="text-yellow-500" />
                    </h1>
                    <p className="text-xs font-medium text-zinc-300">@{profile?.username || 'unknown'}</p>
                </div>

                <div className="h-[1px] w-full bg-white/5"></div>

                {/* About Me Section */}
                <div>
                    <SectionHeader>About Me</SectionHeader>
                    <p className="text-sm text-zinc-300 leading-snug">
                        {profile?.bio || 'Professional developer and problem solver in the making.'}
                    </p>
                </div>

                {/* Member Since / Date */}
                <div>
                    <SectionHeader>Member Since</SectionHeader>
                    <div className="flex items-center gap-2 text-zinc-300">
                        <Calendar size={14} className="text-zinc-500" />
                        <span className="text-xs font-medium">May 24, 2023</span>
                    </div>
                </div>

                {/* Identity Intel / Academic */}
                {academic.university && (
                    <div>
                        <SectionHeader>Affiliation</SectionHeader>
                        <div className="flex items-center gap-2 text-zinc-300">
                            <GraduationCap size={14} className="text-zinc-500" />
                            <span className="text-xs font-medium">{academic.university}</span>
                        </div>
                    </div>
                )}

                <div className="h-[1px] w-full bg-white/5"></div>

                {/* Community Stats */}
                <div>
                    <SectionHeader>Competency Matrix</SectionHeader>
                    <div className="space-y-1">
                        <StatItem icon={Crown} label="Global Rank" value={leetcodeStats?.ranking ? `#${leetcodeStats.ranking.toLocaleString()}` : '---'} />
                        <StatItem icon={CheckSquare} label="Problems Solved" value={leetcodeStats?.totalSolved || '0'} />
                        <StatItem icon={Star} label="Reputation" value="156" />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-white/5"></div>

                {/* Social Tier */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-2 bg-black/20 rounded-lg">
                        <span className="text-xs font-bold text-white">{profile?.followers_count || 0}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Followers</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-black/20 rounded-lg">
                        <span className="text-xs font-bold text-white">{profile?.following_count || 0}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Following</span>
                    </div>
                </div>

                {/* Source Sync */}
                {technical.github_url && (
                    <a 
                        href={technical.github_url} target="_blank" rel="noreferrer" 
                        className="w-full py-2.5 bg-[#5865F2] hover:bg-[#4752C4] rounded-md font-bold text-white text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Globe size={14} /> Open System Source
                    </a>
                )}
            </div>
        </div>
    );
};

export default IdentityCard;
