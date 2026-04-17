import React from 'react';
import { User, Activity, Clock, Award, ChevronRight, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContentProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-500">
      <div className="h-48 bg-gradient-to-r from-indigo-900 to-slate-900 relative">
          <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full bg-[#1e1f22] border-[6px] border-[#313338] overflow-hidden shadow-2xl">
                  {user.profile_picture ? <img src={user.profile_picture} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white bg-indigo-600">{user.username[0]}</div>}
              </div>
          </div>
      </div>

      <div className="pt-20 px-10">
          <div className="flex justify-between items-start mb-10">
              <div>
                  <h1 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">@{user.username}</h1>
                  <div className="flex items-center gap-2 text-[#949ba4] font-medium">
                      <Hash size={16} />
                      <span>Arena Operative Node // {user.username}</span>
                  </div>
              </div>
              <div className="flex gap-3">
                  <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold h-10 px-6">MESSAGE</Button>
                  <Button variant="outline" className="border-[#4e5058] text-white hover:bg-[#3f4147] h-10 px-6">SYNC DATA</Button>
              </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-[#2b2d31] p-6 rounded-2xl border border-white/5">
                  <Activity size={24} className="text-indigo-400 mb-4" />
                  <p className="text-[10px] font-bold text-[#949ba4] uppercase tracking-widest mb-1">Total Solved</p>
                  <p className="text-3xl font-black text-white italic">142</p>
              </div>
              <div className="bg-[#2b2d31] p-6 rounded-2xl border border-white/5">
                  <Clock size={24} className="text-emerald-400 mb-4" />
                  <p className="text-[10px] font-bold text-[#949ba4] uppercase tracking-widest mb-1">Node Activity</p>
                  <p className="text-3xl font-black text-white italic">High</p>
              </div>
              <div className="bg-[#2b2d31] p-6 rounded-2xl border border-white/5">
                  <Award size={24} className="text-yellow-400 mb-4" />
                  <p className="text-[10px] font-bold text-[#949ba4] uppercase tracking-widest mb-1">Arena Rank</p>
                  <p className="text-3xl font-black text-white italic">Gold</p>
              </div>
          </div>

          <div className="bg-[#1e1f22] rounded-3xl p-8 border border-[#2b2d31]">
              <h3 className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-[0.2em] mb-6">MISSION LOG (RECENT)</h3>
              <div className="py-10 text-center opacity-20 italic">
                 <p className="text-sm font-medium text-[#949ba4]">Synchronization in progress... awaiting tactical data packets from {user.username}.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ContentProfile;
