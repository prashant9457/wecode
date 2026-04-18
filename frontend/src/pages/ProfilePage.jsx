import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
      skills: ''
  });

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
                  portfolio_url: formData.portfolio_url
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

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Module...</div>;
  if (error || !profile) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error || "Profile not found"}</div>;

  const extended = profile.extended_profile || {};
  const academic = profile.academic_details || {};
  const technical = profile.technical_profiles || {};

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
        <button onClick={() => navigate('/dashboard')} className="mb-8 text-zinc-500 hover:text-white transition-colors">← Back to Dashboard</button>

        <div className="max-w-4xl mx-auto">
            {isEditing ? (
                <div className="bg-zinc-900 p-8 rounded-2xl border border-white/10">
                    <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
                    <div className="space-y-4">
                        <input placeholder="Full Name" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-black border border-white/10 p-3 rounded-lg" />
                        <textarea placeholder="Bio" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-black border border-white/10 p-3 rounded-lg h-24" />
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="College" value={formData.college_name} onChange={e => setFormData({...formData, college_name: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg" />
                            <input placeholder="Degree" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Github URL" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg" />
                            <input placeholder="LinkedIn URL" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="bg-black border border-white/10 p-3 rounded-lg" />
                        </div>
                        <input placeholder="Skills (React, Node...)" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-black border border-white/10 p-3 rounded-lg" />
                        <div className="flex gap-4 pt-4">
                            <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-500">Save Changes</Button>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
                        <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center text-4xl font-bold border-4 border-black shadow-xl">
                            {extended.avatar_url ? <img src={extended.avatar_url} className="w-full h-full rounded-full object-cover" /> : profile.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-black mb-1">{extended.full_name || profile.username}</h1>
                            <p className="text-zinc-500 font-mono">@{profile.username}</p>
                            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                                {!isOwnProfile && (
                                    <>
                                        {profile.is_friend ? (
                                            <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/20 text-sm font-bold">✓ Already Friend</span>
                                        ) : (profile.request_status === 'pending' || requestSent) ? (
                                            <span className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-lg border border-amber-500/20 text-sm font-bold">Pending Request</span>
                                        ) : (
                                            <Button onClick={handleAddFriend} className="bg-white text-black hover:bg-zinc-200">Add Friend</Button>
                                        )}
                                    </>
                                )}
                                {isOwnProfile && <Button onClick={() => setIsEditing(true)} variant="outline" className="border-white/10">Edit Profile</Button>}
                            </div>
                        </div>
                        <div className="bg-black/40 p-6 rounded-2xl text-center border border-white/5 min-w-[120px]">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Solved</p>
                            <p className="text-4xl font-black text-blue-500">{profile.solved_count || 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <div>
                            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Identity</h3>
                            <p className="text-zinc-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{extended.bio || "No biography provided."}</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Academic</h3>
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
                                <p className="text-sm"><span className="text-zinc-500">Institution:</span> {academic.college_name || 'N/A'}</p>
                                <p className="text-sm"><span className="text-zinc-500">Degree/Branch:</span> {academic.degree} {academic.branch}</p>
                            </div>
                        </div>
                    </div>

                    {profile.skills?.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map(s => <span key={s.id} className="bg-zinc-800 px-3 py-1 rounded-md text-sm border border-white/5">{s.name}</span>)}
                            </div>
                        </div>
                    )}

                    {(technical.github_url || technical.linkedin_url) && (
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Links</h3>
                            <div className="flex gap-4">
                                {technical.github_url && <a href={technical.github_url} className="text-blue-400 hover:underline text-sm">GitHub</a>}
                                {technical.linkedin_url && <a href={technical.linkedin_url} className="text-blue-400 hover:underline text-sm">LinkedIn</a>}
                                {technical.portfolio_url && <a href={technical.portfolio_url} className="text-blue-400 hover:underline text-sm">Portfolio</a>}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
}