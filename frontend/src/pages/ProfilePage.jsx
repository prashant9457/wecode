import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import IdentityCard from '@/components/profile/IdentityCard';
import LeetCodeHeatmap from '@/components/profile/LeetCodeHeatmap';
import { AcademicCredentials, NeuralMatrix } from '@/components/profile/InfoCards';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  
  const viewerUsername = localStorage.getItem('username');
  const isOwnProfile = viewerUsername === username;
  
  const [isEditing, setIsEditing] = useState(false);
  const [leetcodeStats, setLeetCodeStats] = useState(null);
  const [formData, setFormData] = useState({
      full_name: '',
      bio: '',
      avatar_url: '',
      college_name: '',
      degree: '',
      branch: '',
      year_of_study: '',
      cgpa: '',
      github_url: '',
      linkedin_url: '',
      portfolio_url: '',
      leetcode_url: '',
      skills: ''
  });

  useEffect(() => {
    const fetchLeetCodeData = async () => {
        const leetcodeUrl = profile?.technical_profiles?.leetcode_url;
        if (!leetcodeUrl) return;

        // Try to safe extract username
        const segments = leetcodeUrl.toString().replace(/\/$/, "").split('/');
        const username = segments[segments.length - 1];
        if (!username || username === 'leetcode.com' || username === 'u') return;

        try {
            const res = await fetch(`http://localhost:5000/api/profile/leetcode/${username}`);
            const data = await res.json();
            if (data.status === 'success') setLeetCodeStats(data);
        } catch (err) {
            console.error('LeetCode Page Fetch Error:', err);
        }
    };

    if (profile) fetchLeetCodeData();
    else setLeetCodeStats(null);
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/profile/${username}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Profile not found');
      
      setProfile(data);
      
      if (isOwnProfile) {
          setFormData({
              full_name: data.extended_profile?.full_name || '',
              bio: data.extended_profile?.bio || '',
              avatar_url: data.extended_profile?.avatar_url || '',
              college_name: data.academic_details?.college_name || '',
              degree: data.academic_details?.degree || '',
              branch: data.academic_details?.branch || '',
              year_of_study: data.academic_details?.year_of_study || '',
              cgpa: data.academic_details?.cgpa || '',
              github_url: data.technical_profiles?.github_url || '',
              linkedin_url: data.technical_profiles?.linkedin_url || '',
              portfolio_url: data.technical_profiles?.portfolio_url || '',
              leetcode_url: data.technical_profiles?.leetcode_url || '',
              skills: (data.skills || []).map(s => s.name).join(', ')
          });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const res = await fetch('http://localhost:5000/api/social/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ receiver_id: profile.id })
      });
      if (res.ok) setRequestSent(true);
    } catch (e) { console.error(e); }
  };

  const handleSaveProfile = async () => {
      try {
          const token = localStorage.getItem('token');
          const updatePayload = {
              extended_profile: { full_name: formData.full_name, bio: formData.bio, avatar_url: formData.avatar_url },
              academic_details: {
                  college_name: formData.college_name,
                  degree: formData.degree,
                  branch: formData.branch,
                  year_of_study: parseInt(formData.year_of_study) || null,
                  cgpa: parseFloat(formData.cgpa) || null
              },
              technical_profiles: {
                  github_url: formData.github_url,
                  linkedin_url: formData.linkedin_url,
                  portfolio_url: formData.portfolio_url,
                  leetcode_url: formData.leetcode_url
              },
              skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
          };
          const res = await fetch(`http://localhost:5000/api/profile/${username}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(updatePayload)
          });
          if(res.ok) {
              setIsEditing(false);
              fetchProfile();
          }
      } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Bio-Metric Data</p>
        </div>
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Profile Offline</h2>
            <p className="text-zinc-500 mb-8">{error || "The requested operative could not be located."}</p>
            <button onClick={() => navigate('/dashboard')} className="border border-white/10 text-white px-6 py-2 rounded-xl hover:bg-white/5 transition-colors uppercase text-xs font-bold tracking-widest">Return to Command</button>
        </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#1E1F22] text-[#DBDEE1] flex overflow-hidden">
        {/* Left Side: Fixed Identity Sidebar */}
        <div className="w-[340px] flex-shrink-0 bg-[#232428] border-r border-black/20 flex flex-col overflow-y-auto no-scrollbar">
            <IdentityCard 
                profile={profile} 
                isOwnProfile={isOwnProfile} 
                setIsEditing={setIsEditing} 
                leetcodeStats={leetcodeStats}
            />
            
            <div className="px-4 pb-12 space-y-4">
                <AcademicCredentials academic={profile.academic_details || {}} />
                <NeuralMatrix skills={profile.skills || []} />
            </div>
        </div>

        {/* Right Side: Scrollable Dashboard Content */}
        <div className="flex-1 flex flex-col bg-[#313338] overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8">
                <ProfileHeader 
                    isOwnProfile={isOwnProfile} 
                    isEditing={isEditing} 
                    setIsEditing={setIsEditing} 
                />

                <div className="mt-8 max-w-[1200px]">
                    {isEditing ? (
                        <ProfileEditForm 
                            formData={formData} 
                            setFormData={setFormData} 
                            handleSaveProfile={handleSaveProfile} 
                            setIsEditing={setIsEditing} 
                        />
                    ) : (
                        <div className="space-y-6">
                            <LeetCodeHeatmap 
                                profile={profile} 
                                isOwnProfile={isOwnProfile} 
                                setIsEditing={setIsEditing}
                                stats={leetcodeStats}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}