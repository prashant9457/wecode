import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Rocket,
  LayoutDashboard,
  ShieldCheck,
  Trash2,
  Save,
  X,
  User as UserIcon,
  Phone,
  GraduationCap,
  Building,
  Hash,
  Activity,
  Trophy,
  Code2,
  Terminal,
  Link as LinkIcon,
  Plus,
  Globe,
  Code,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State matching exact DB schema
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    profile_picture: '',
    institute: '',
    department: '',
    year: '',
    links: [], // Handles the multiple user_links records
    created_at: null,
    last_login: null
  });

  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Real Leetcode Integration states
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Extract Leetcode Username helper
  const leetcodeLink = profileData?.links?.find(l => l.platform_name.toLowerCase() === 'leetcode');
  const getLeetcodeUsername = (url) => {
    if (!url) return null;
    const match = url.match(/leetcode\.com\/([^\/]+)/);
    return match ? match[1].replace(/\/$/, '') : null;
  };
  const leetcodeUsername = leetcodeLink ? getLeetcodeUsername(leetcodeLink.url) : null;

  // Effect to fetch Leetcode Stats
  useEffect(() => {
    if (!leetcodeUsername) {
      setLeetcodeStats(null);
      return;
    }
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`);
        const data = await res.json();
        if (data.status === "success") {
          setLeetcodeStats(data);
        } else {
          setLeetcodeStats(null);
        }
      } catch (err) {
        setLeetcodeStats(null);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [leetcodeUsername]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/profile/${username}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.details?.message || data.details || data.error || 'Profile not found');
        }
        
        const sanitizedData = Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, v === null ? '' : v])
        );
        // Ensure links array is present
        setProfileData(prev => ({...prev, ...sanitizedData, links: sanitizedData.links || []}));
        
        const loggedInUser = localStorage.getItem('username');
        if (loggedInUser === username) {
          setIsOwnProfile(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/profile/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setIsEditing(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      alert('An error occurred while saving profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Deleting your account is permanent. All your data will be wiped immediately. Are you absolutely certain?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/profile/${username}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.clear();
        navigate('/');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete account');
      }
    } catch (err) {
      alert('An error occurred while deleting account');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
      <div className="animate-spin text-[#3ecf8e]"><Rocket size={48} /></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#1c1c1c] flex flex-col items-center justify-center text-white gap-4">
      <X size={64} className="text-rose-500" />
      <h1 className="text-2xl font-bold">Profile request failed</h1>
      <pre className="text-sm text-rose-300 bg-[#161616] p-4 rounded-xl border border-rose-500/20 max-w-md overflow-auto font-mono">
        {error}
      </pre>
      <Button onClick={() => navigate('/')} className="bg-[#3ecf8e] text-black hover:bg-[#32a873]">Return Home</Button>
    </div>
  );

  // Process Heatmap Data based on actual LeetCode calendar
  let heatmapData = Array(364).fill(0);
  if (leetcodeStats && leetcodeStats.submissionCalendar) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const msPerDay = 24 * 60 * 60 * 1000;
    
    // Some versions of the API return parsed JSON, others return a stringified object.
    let calendar = leetcodeStats.submissionCalendar;
    if (typeof calendar === 'string') {
      try { calendar = JSON.parse(calendar); } catch(e) {}
    }

    for (const [timestampStr, count] of Object.entries(calendar)) {
      const pastDate = new Date(parseInt(timestampStr) * 1000);
      pastDate.setHours(0,0,0,0);
      const diffDays = Math.floor((today - pastDate) / msPerDay);
      
      // We map the last 364 days.
      if (diffDays >= 0 && diffDays < 364) {
        // Target index calculations: 363 is today, 0 is a year ago
        const targetIndex = 363 - diffDays;
        
        let intensity = 0;
        if (count > 0) intensity = 1;
        if (count >= 2) intensity = 2;
        if (count >= 4) intensity = 3;
        if (count >= 7) intensity = 4;
        
        heatmapData[targetIndex] = intensity;
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] text-[#ededed] font-sans selection:bg-[#3ecf8e]/30 pb-12">
      
      {/* Top Navbar */}
      <nav className="h-16 border-b border-[#2e2e2e] bg-[#1c1c1c] sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2 group">
          <Rocket className="h-6 w-6 text-[#3ecf8e] group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-lg tracking-tight">WeCode Platform</span>
        </Link>
        <div className="flex items-center gap-3">
          {localStorage.getItem('token') && (
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-[#a1a1a1] hover:text-white hover:bg-[#2e2e2e]">
                <LayoutDashboard size={16} />
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Container - Split Layout */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-8">
        
        {/* Page Header Area */}
        <div className="mb-8 pl-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium text-white mb-1 flex items-center gap-3">
               @{profileData.username}'s Arena
               {profileData.is_active && <ShieldCheck size={24} className="text-[#3ecf8e]" title="Active User" />}
            </h1>
            <p className="text-sm text-[#8b8b8b]">View stats, solve history, and personal details.</p>
          </div>
          
          {isOwnProfile && (
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="ghost" onClick={() => setIsEditing(false)} className="border border-[#3e3e3e] hover:bg-[#2e2e2e]">Cancel</Button>
                  <Button onClick={handleSave} className="bg-[#3ecf8e] hover:bg-[#32a873] text-black font-medium gap-2 shadow-[0_0_15px_rgba(62,207,142,0.2)]">
                    <Save size={16} /> Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-[#ededed] text-black hover:bg-[#d1d1d1] font-medium">Edit Profile</Button>
              )}
            </div>
          )}
        </div>

        {/* The Grid: Left 1/3 (Details), Right 2/3 (Stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT SIDE: Personal Details Grid */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Identity Card */}
            <SidebarCard title="Identity">
               <div className="flex flex-col items-center mb-6">
                  <div className="h-24 w-24 rounded-full border-2 border-[#3e3e3e] bg-[#141414] overflow-hidden flex items-center justify-center mb-4">
                    {profileData.profile_picture ? (
                      <img src={profileData.profile_picture} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-[#8b8b8b]">{profileData.first_name?.[0]?.toUpperCase() || '?'}</span>
                    )}
                  </div>
                  {isEditing && (
                     <Input 
                        placeholder="Avatar URL" 
                        className="h-8 text-xs bg-[#141414] border-[#3e3e3e] mb-2 text-center"
                        value={profileData.profile_picture}
                        onChange={e => setProfileData({...profileData, profile_picture: e.target.value})}
                     />
                  )}
                  {!isEditing && (
                    <div className="text-center">
                       <h2 className="text-lg font-medium text-white leading-tight">{profileData.first_name} {profileData.last_name}</h2>
                       <p className="text-sm text-[#8b8b8b] font-mono mt-1">@{profileData.username}</p>
                    </div>
                  )}
               </div>

               {isEditing && (
                 <div className="grid grid-cols-2 gap-2 mb-4">
                    <Input placeholder="First Name" value={profileData.first_name} onChange={e => setProfileData({...profileData, first_name: e.target.value})} className="h-8 text-xs bg-[#141414] border-[#3e3e3e]"/>
                    <Input placeholder="Last Name" value={profileData.last_name} onChange={e => setProfileData({...profileData, last_name: e.target.value})} className="h-8 text-xs bg-[#141414] border-[#3e3e3e]"/>
                 </div>
               )}

               <div className="space-y-3 pt-4 border-t border-[#2e2e2e]">
                  <DetailItem icon={<Phone size={14}/>} label="Phone">
                    {isEditing ? <Input type="tel" value={profileData.phone_number} onChange={e=>setProfileData({...profileData, phone_number: e.target.value})} className="h-7 text-xs bg-[#141414] border-[#3e3e3e]"/> : (profileData.phone_number || '-')}
                  </DetailItem>
                  <DetailItem icon={<UserIcon size={14}/>} label="Email">
                    <span className="text-xs truncate">{profileData.email}</span>
                  </DetailItem>
               </div>
            </SidebarCard>

            {/* Education Card */}
            <SidebarCard title="Education">
               <div className="space-y-4">
                  <DetailItem icon={<Building size={14}/>} label="Institute" stacked>
                    {isEditing ? <Input value={profileData.institute} onChange={e=>setProfileData({...profileData, institute: e.target.value})} className="h-8 text-xs bg-[#141414] border-[#3e3e3e] mt-1"/> : (profileData.institute || <span className="text-[#5e5e5e] italic text-xs">Not specified</span>)}
                  </DetailItem>
                  <DetailItem icon={<GraduationCap size={14}/>} label="Department" stacked>
                    {isEditing ? <Input value={profileData.department} onChange={e=>setProfileData({...profileData, department: e.target.value})} className="h-8 text-xs bg-[#141414] border-[#3e3e3e] mt-1"/> : (profileData.department || <span className="text-[#5e5e5e] italic text-xs">Not specified</span>)}
                  </DetailItem>
                  <DetailItem icon={<Activity size={14}/>} label="Academic Year" stacked>
                    {isEditing ? <Input value={profileData.year} onChange={e=>setProfileData({...profileData, year: e.target.value})} className="h-8 text-xs bg-[#141414] border-[#3e3e3e] mt-1"/> : (profileData.year || <span className="text-[#5e5e5e] italic text-xs">Not specified</span>)}
                  </DetailItem>
               </div>
            </SidebarCard>

            {/* Social & Portfolios Card */}
            <SidebarCard title="External Profiles">
               {isEditing && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setProfileData(p => ({...p, links: [...p.links, {platform_name: 'LeetCode', url: ''}]}))}
                    className="w-full mb-4 border-[#3e3e3e] text-[#ededed] hover:bg-[#2e2e2e] gap-1 bg-[#141414]"
                  >
                    <Plus size={14}/> Add Link
                  </Button>
               )}
               
               <div className="space-y-3">
                 {profileData.links.length === 0 && !isEditing && (
                    <span className="text-xs text-[#5e5e5e] italic block text-center py-2">No profiles linked yet.</span>
                 )}
                 
                 {/* Map over the dynamic links array */}
                 <div className="flex flex-col gap-3">
                   {profileData.links.map((link, index) => (
                      <div key={index} className="flex flex-col gap-2">
                         {isEditing ? (
                           <div className="flex flex-col gap-2 p-2 bg-[#141414] rounded-lg border border-[#2e2e2e]">
                             <div className="flex justify-between items-center">
                               <select 
                                 className="bg-[#1c1c1c] border-[#3e3e3e] border rounded-md h-8 text-[11px] text-white px-2 shrink-0 outline-none focus:border-[#3ecf8e]"
                                 value={link.platform_name}
                                 onChange={(e) => {
                                   const newLinks = [...profileData.links];
                                   newLinks[index].platform_name = e.target.value;
                                   setProfileData({...profileData, links: newLinks});
                                 }}
                               >
                                 <option value="LeetCode">LeetCode</option>
                                 <option value="GitHub">GitHub</option>
                                 <option value="LinkedIn">LinkedIn</option>
                                 <option value="Codeforces">Codeforces</option>
                                 <option value="Twitter">Twitter</option>
                                 <option value="Portfolio">Portfolio</option>
                                 <option value="Other">Other</option>
                               </select>
                               <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 shrink-0"
                                  onClick={() => {
                                    setProfileData(p => ({...p, links: p.links.filter((_, i) => i !== index)}));
                                  }}
                                  title="Remove Link"
                               >
                                 <Trash2 size={12} />
                               </Button>
                             </div>
                             <Input 
                               placeholder={`URL`} 
                               value={link.url} 
                               onChange={(e) => {
                                 const newLinks = [...profileData.links];
                                 newLinks[index].url = e.target.value;
                                 setProfileData({...profileData, links: newLinks});
                               }}
                               className="bg-[#1c1c1c] border-[#3e3e3e] focus-visible:ring-[#3ecf8e]/50 h-8 flex-1 text-xs"
                             />
                           </div>
                         ) : (
                           <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noreferrer" 
                              className="bg-[#141414] border border-[#2e2e2e] px-3 py-2 rounded-md text-sm text-[#ededed] hover:border-[#3ecf8e]/50 hover:text-[#3ecf8e] flex items-center gap-3 group transition-colors w-full"
                           >
                             <span className="text-[#8b8b8b] group-hover:text-[#3ecf8e] transition-colors">{getPlatformIcon(link.platform_name)}</span>
                             <div className="flex-1 truncate">
                                <div className="font-medium text-[12px] text-[#ededed] group-hover:text-white leading-tight">{link.platform_name}</div>
                             </div>
                             <LinkIcon size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#3ecf8e]"/>
                           </a>
                         )}
                      </div>
                   ))}
                 </div>
               </div>
            </SidebarCard>

            {/* Danger Zone */}
            {isOwnProfile && (
              <div className="bg-[#1c0f0f] border border-[#4a1c1c] rounded-xl p-5">
                 <h3 className="text-[#e5484d] font-medium text-sm mb-2 flex items-center gap-2"><Trash2 size={16}/> Danger Zone</h3>
                 <p className="text-xs text-[#a3686a] mb-4">Permanently remove this account and all associated data.</p>
                 <Button variant="destructive" size="sm" className="w-full bg-[#e5484d]/20 text-[#e5484d] hover:bg-[#e5484d] hover:text-white border border-[#e5484d]/50" onClick={handleDeleteAccount}>
                    Delete Account
                 </Button>
              </div>
            )}
            
            <div className="text-center text-[10px] text-[#5e5e5e] font-mono tracking-wider pt-2">
               UID: {profileData.username} <br/> Joined: {new Date(profileData.created_at || Date.now()).getFullYear()}
            </div>

          </div>


          {/* RIGHT SIDE: Stats & Heatmap (2/3 Ratio) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {loadingStats && (
                 <div className="absolute inset-0 bg-[#141414]/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl border border-[#2e2e2e]">
                    <div className="animate-spin text-[#3ecf8e]"><Rocket size={24} /></div>
                 </div>
              )}
              <StatBox icon={<Terminal size={18} className="text-indigo-400"/>} label="Total Solved" value={leetcodeStats ? leetcodeStats.totalSolved : '-'} />
              <StatBox icon={<Trophy size={18} className="text-amber-400"/>} label="Global Rank" value={leetcodeStats ? (leetcodeStats.ranking || "Unranked") : '-'} />
              <StatBox icon={<Activity size={18} className="text-emerald-400"/>} label="Acceptance Rate" value={leetcodeStats ? `${leetcodeStats.acceptanceRate}%` : '-'} />
              <StatBox icon={<Code2 size={18} className="text-rose-400"/>} label="Contribution Points" value={leetcodeStats ? leetcodeStats.contributionPoints : '-'} />
            </div>

            {/* Heatmap Section */}
            <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl p-6 shadow-sm overflow-hidden flex flex-col items-center relative">
               {loadingStats && (
                 <div className="absolute inset-0 bg-[#1c1c1c] z-10 flex items-center justify-center">
                    <div className="animate-pulse text-[#8b8b8b] text-sm">Fetching LeetCode heatmap...</div>
                 </div>
               )}
               <h2 className="text-lg font-medium text-white mb-6 w-full text-left">
                  LeetCode Activity Heatmap 
                  {!leetcodeUsername && <span className="text-[#5e5e5e] text-sm font-normal ml-2 italic">(Link LeetCode to see data)</span>}
               </h2>
               
               <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                 <div className="min-w-[700px]">
                   <div className="flex text-xs text-[#5e5e5e] mb-2 font-mono ml-8 justify-between pr-4">
                     <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                   </div>
                   <div className="flex gap-2">
                     {/* Days of week labels */}
                     <div className="flex flex-col gap-[6px] text-[10px] text-[#5e5e5e] font-mono mt-1 w-6 shrink-0">
                       <span className="h-3">Mon</span>
                       <span className="h-3 mt-[15px]">Wed</span>
                       <span className="h-3 mt-[15px]">Fri</span>
                     </div>
                     {/* Grid blocks */}
                     <div className="flex gap-[3px] flex-1">
                       {Array.from({ length: 52 }).map((_, colIndex) => (
                         <div key={colIndex} className="flex flex-col gap-[3px]">
                           {Array.from({ length: 7 }).map((_, rowIndex) => {
                             const idx = colIndex * 7 + rowIndex;
                             if (idx >= 364) return null; // cap at 364
                             const intensity = heatmapData[idx];
                             return (
                               <div 
                                 key={rowIndex} 
                                 className={cn(
                                   "w-[11px] h-[11px] rounded-sm transition-colors hover:ring-1 ring-white/30 cursor-crosshair",
                                   intensity === 0 && "bg-[#262626]",
                                   intensity === 1 && "bg-[#0e4429]",
                                   intensity === 2 && "bg-[#006d32]",
                                   intensity === 3 && "bg-[#26a641]",
                                   intensity === 4 && "bg-[#39d353]"
                                 )}
                                 title={`${intensity} contributions on Day ${idx+1}`}
                               />
                             );
                           })}
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Heatmap Legend */}
               <div className="flex items-center justify-end text-[10px] text-[#8b8b8b] mt-4 gap-2 font-mono w-full px-2">
                 <span>Less</span>
                 <div className="flex gap-1">
                   <div className="w-3 h-3 rounded-sm bg-[#262626]"></div>
                   <div className="w-[11px] h-[11px] rounded-[2px] bg-[#0e4429]"></div>
                   <div className="w-[11px] h-[11px] rounded-[2px] bg-[#006d32]"></div>
                   <div className="w-[11px] h-[11px] rounded-[2px] bg-[#26a641]"></div>
                   <div className="w-[11px] h-[11px] rounded-[2px] bg-[#39d353]"></div>
                 </div>
                 <span>More</span>
               </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

// --- Sub Components ---

const SidebarCard = ({ title, children }) => (
  <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl p-5 shadow-sm">
    <h3 className="text-[#ededed] font-medium text-sm mb-4 uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

const DetailItem = ({ icon, label, children, stacked }) => {
  if (stacked) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8b8b8b] uppercase tracking-wider mb-1 mt-3">
          {icon} <span>{label}</span>
        </div>
        <div className="text-[13px] font-medium text-[#ededed]">
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-between group py-1">
      <div className="flex items-center gap-2 text-[13px] text-[#8b8b8b]">
        {icon} <span>{label}</span>
      </div>
      <div className="text-[13px] font-medium text-[#ededed] text-right truncate max-w-[140px]">
        {children}
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value }) => (
  <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl p-5 flex flex-col items-start justify-center shadow-sm relative overflow-hidden group">
    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity scale-150">
      {icon}
    </div>
    <div className="mb-3 p-2.5 bg-[#262626] rounded-xl border border-[#3e3e3e]">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div className="text-3xl font-semibold text-white tracking-tight mb-1">{value}</div>
    <div className="text-[11px] text-[#8b8b8b] uppercase tracking-wider font-semibold">{label}</div>
  </div>
);

const getPlatformIcon = (name) => {
  switch(name.toLowerCase()) {
    case 'github': return <Code size={18} />;
    case 'linkedin': return <Briefcase size={18} />;
    case 'twitter': return <MessageSquare size={18} />;
    case 'leetcode': return <Code2 size={18} />;
    case 'portfolio': return <Globe size={18} />;
    default: return <LinkIcon size={18} />;
  }
};

export default ProfilePage;
