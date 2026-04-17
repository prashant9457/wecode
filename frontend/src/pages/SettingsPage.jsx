import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscordLayout from '@/components/layout/DiscordLayout';
import { 
  Settings as SettingsIcon, 
  Terminal, 
  Plus, 
  Trash2, 
  Save, 
  Globe,
  Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const myUsername = localStorage.getItem('username');

  const [formData, setFormData] = useState({
    username: '',
    profile_picture: '',
    extra_data: { college: '', bio: '' },
    coding_profiles: []
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/profile/${myUsername}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
           setFormData({
             username: data.username,
             profile_picture: data.profile_picture || '',
             extra_data: data.extra_data || { college: '', bio: '' },
             coding_profiles: data.coding_profiles || []
           });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [myUsername]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/profile/${myUsername}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('username', data.user.username);
        alert('System configuration synchronized.');
        navigate('/dashboard');
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert('Sync failed.');
    } finally {
      setSaving(false);
    }
  };

  const addCodingProfile = () => {
    setFormData(prev => ({
       ...prev,
       coding_profiles: [...prev.coding_profiles, { platform: 'LeetCode', platform_username: '' }]
    }));
  };

  const removeCodingProfile = (index) => {
    setFormData(prev => ({
       ...prev,
       coding_profiles: prev.coding_profiles.filter((_, i) => i !== index)
    }));
  };

  const updateCodingProfile = (index, field, value) => {
    const newProfiles = [...formData.coding_profiles];
    newProfiles[index][field] = value;
    setFormData(prev => ({ ...prev, coding_profiles: newProfiles }));
  };

  if (loading) return (
    <div className="h-screen bg-[#313338] flex items-center justify-center">
      <div className="animate-spin text-indigo-500"><SettingsIcon size={48} /></div>
    </div>
  );

  return (
    <DiscordLayout>
        <header className="h-12 border-b border-[#1f2023] shadow-sm flex items-center px-4 shrink-0 bg-[#313338]">
             <Sliders size={20} className="text-[#80848e] mr-2" />
             <span className="font-bold text-white text-[15px]">USER SETTINGS</span>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10">
            <div className="max-w-3xl">
                <h1 className="text-xl font-bold text-white mb-8">My Account</h1>
                
                <section className="bg-[#1e1f22] rounded-lg p-6 mb-10 border border-[#1f2023]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-indigo-600 overflow-hidden border-4 border-[#1e1f22]">
                                {formData.profile_picture ? <img src={formData.profile_picture} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">{formData.username?.[0]}</div>}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white leading-tight">{formData.username}</h2>
                                <p className="text-[#b5bac1] text-sm leading-tight">Administrator Status</p>
                            </div>
                        </div>
                        <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold h-8 px-5 rounded-[3px]">Edit User Profile</Button>
                    </div>

                    <div className="bg-[#2b2d31] rounded-lg p-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ConfigField label="USERNAME" value={formData.username} onEdit={v => setFormData({...formData, username: v})} />
                            <ConfigField label="AVATAR URL" value={formData.profile_picture} onEdit={v => setFormData({...formData, profile_picture: v})} border={false} />
                            <ConfigField label="COLLEGE" value={formData.extra_data.college} onEdit={v => setFormData({...formData, extra_data: {...formData.extra_data, college: v}})} />
                            <ConfigField label="BIO" value={formData.extra_data.bio} onEdit={v => setFormData({...formData, extra_data: {...formData.extra_data, bio: v}})} border={false} />
                        </div>
                    </div>
                </section>

                <h1 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">External Nodes</h1>
                <section className="bg-[#1e1f22] rounded-lg p-6 border border-[#1f2023] mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-[#b5bac1]">Configure connections to external algorithmic platforms.</p>
                        <Button onClick={addCodingProfile} className="bg-[#5865f2] hover:bg-[#4752c4] text-white h-7 px-3 text-[11px] font-bold rounded-[3px]">ADD NODE</Button>
                    </div>

                    <div className="space-y-3">
                        {formData.coding_profiles.map((cp, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-[#2b2d31] p-3 rounded-lg border border-[#1f2023]">
                                <Globe size={18} className="text-[#80848e] shrink-0" />
                                <select 
                                    value={cp.platform}
                                    onChange={e => updateCodingProfile(idx, 'platform', e.target.value)}
                                    className="bg-[#1e1f22] border-[#1f2023] rounded-[4px] h-8 px-2 text-sm text-white outline-none w-32"
                                >
                                    <option value="LeetCode">LeetCode</option>
                                    <option value="Codeforces">Codeforces</option>
                                </select>
                                <Input 
                                    value={cp.platform_username} 
                                    onChange={e => updateCodingProfile(idx, 'platform_username', e.target.value)}
                                    className="bg-[#1e1f22] border-[#1f2023] h-8 text-sm text-white rounded-[4px]"
                                    placeholder="Username"
                                />
                                <button onClick={() => removeCodingProfile(idx)} className="p-1 hover:text-rose-400 transition-colors"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end gap-3 mt-10">
                    <button onClick={() => navigate('/dashboard')} className="text-[#dbdee1] text-sm font-medium hover:underline px-4">Cancel</button>
                    <Button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold h-10 px-8 rounded-[3px]"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    </DiscordLayout>
  );
};

const ConfigField = ({ label, value, onEdit, border = true }) => (
    <div className={cn("flex flex-col gap-2 pb-4", border && "border-b border-[#3f4147]")}>
        <p className="text-[12px] font-bold text-[#b5bac1] uppercase tracking-wide">{label}</p>
        <div className="flex items-center justify-between">
            <Input 
                value={value} 
                onChange={e => onEdit(e.target.value)} 
                className="bg-transparent border-none p-0 h-auto text-sm text-white focus:ring-0 placeholder:text-[#4e5058]"
                placeholder={`Set ${label.toLowerCase()}...`}
            />
        </div>
    </div>
);

export default SettingsPage;
