import React from 'react';

const ProfileEditForm = ({ formData, setFormData, handleSaveProfile, setIsEditing }) => {
    return (
        <div className="bg-zinc-900/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Edit Identity</h2>
                <p className="text-zinc-500">Update your operative dossier and technical links.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Personal Intel</label>
                    <input 
                        placeholder="Full Name" 
                        value={formData.full_name} 
                        onChange={e => setFormData({...formData, full_name: e.target.value})} 
                        className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl focus:border-indigo-500/50 transition-colors outline-none text-white" 
                    />
                    <textarea 
                        placeholder="Bio" 
                        value={formData.bio} 
                        onChange={e => setFormData({...formData, bio: e.target.value})} 
                        className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl h-32 focus:border-indigo-500/50 transition-colors outline-none resize-none text-white" 
                    />
                </div>
                
                <div className="space-y-4">
                     <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Academic Logs</label>
                     <input 
                        placeholder="College" 
                        value={formData.college_name} 
                        onChange={e => setFormData({...formData, college_name: e.target.value})} 
                        className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl outline-none text-white" 
                    />
                     <div className="grid grid-cols-2 gap-4">
                        <input 
                            placeholder="Degree" 
                            value={formData.degree} 
                            onChange={e => setFormData({...formData, degree: e.target.value})} 
                            className="bg-black/40 border border-white/5 p-4 rounded-2xl outline-none text-white" 
                        />
                        <input 
                            placeholder="Branch" 
                            value={formData.branch} 
                            onChange={e => setFormData({...formData, branch: e.target.value})} 
                            className="bg-black/40 border border-white/5 p-4 rounded-2xl outline-none text-white" 
                        />
                        <input 
                            placeholder="Year" 
                            type="number"
                            value={formData.year_of_study} 
                            onChange={e => setFormData({...formData, year_of_study: e.target.value})} 
                            className="bg-black/40 border border-white/5 p-4 rounded-2xl outline-none text-white" 
                        />
                        <input 
                            placeholder="CGPA" 
                            type="number"
                            step="0.01"
                            value={formData.cgpa} 
                            onChange={e => setFormData({...formData, cgpa: e.target.value})} 
                            className="bg-black/40 border border-white/5 p-4 rounded-2xl outline-none text-white" 
                        />
                     </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                     <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Technical Ports</label>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input 
                            placeholder="Github URL" 
                            value={formData.github_url} 
                            onChange={e => setFormData({...formData, github_url: e.target.value})} 
                            className="bg-black/40 border border-white/5 p-4 rounded-2xl outline-none text-white" 
                        />
                        <input 
                            placeholder="LinkedIn URL" 
                            value={formData.linkedin_url} 
                            onChange={e => setFormData({...formData, linkedin_url: e.target.value})} 
                            className="bg-black/40 border border-white/5 p-4 rounded-2xl outline-none text-white" 
                        />
                        <input 
                            placeholder="Portfolio URL" 
                            value={formData.portfolio_url} 
                            onChange={e => setFormData({...formData, portfolio_url: e.target.value})} 
                            className="bg-black/40 border border-white/5 p-4 rounded-2xl outline-none text-white" 
                        />
                        <input 
                            placeholder="LeetCode URL (leetcode.com/u/username)" 
                            value={formData.leetcode_url} 
                            onChange={e => setFormData({...formData, leetcode_url: e.target.value})} 
                            className="bg-black/40 border border-yellow-500/20 p-4 rounded-2xl outline-none text-white focus:border-yellow-500/40" 
                        />
                     </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                     <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Neural Matrix (Skills)</label>
                     <input 
                        placeholder="React, Node, Rust, PostgreSQL..." 
                        value={formData.skills} 
                        onChange={e => setFormData({...formData, skills: e.target.value})} 
                        className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-indigo-500/50 text-white" 
                    />
                </div>
            </div>

            <div className="flex gap-4 mt-12">
                <button 
                    onClick={handleSaveProfile} 
                    className="bg-white text-black px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
                >
                    Sync Profile
                </button>
                <button 
                    onClick={() => setIsEditing(false)} 
                    className="text-zinc-500 hover:text-white px-8 py-3 font-bold uppercase text-[10px] tracking-widest transition-colors"
                >
                    Abort Changes
                </button>
            </div>
        </div>
    );
};

export default ProfileEditForm;
