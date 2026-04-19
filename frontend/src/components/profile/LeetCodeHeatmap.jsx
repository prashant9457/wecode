import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Plus, Trophy, Activity, Target, CheckCircle2 } from 'lucide-react';

const LeetCodeHeatmap = ({ profile, isOwnProfile, setIsEditing, stats }) => {
    // PRE-CALCULATE HEATMAP DATA
    const heatmapData = useMemo(() => {
        if (!stats?.submissionCalendar) return null;
        const data = JSON.parse(stats.submissionCalendar);
        
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const dayOfWeek = today.getUTCDay();
        const lastSunday = new Date(today);
        lastSunday.setUTCDate(today.getUTCDate() - dayOfWeek);

        const startDate = new Date(lastSunday);
        startDate.setUTCDate(lastSunday.getUTCDate() - (52 * 7));

        const weeks = [];
        for (let w = 0; w <= 52; w++) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(startDate);
                date.setUTCDate(startDate.getUTCDate() + (w * 7) + d);
                const timestamp = Math.floor(date.getTime() / 1000).toString();
                week.push({
                    date: date.toUTCString().split(' ').slice(0, 4).join(' '),
                    count: data[timestamp] || 0
                });
            }
            weeks.push(week);
        }
        return weeks;
    }, [stats]);

    const getIntensity = (count) => {
        if (count === 0) return 'bg-[#313338]';
        if (count < 3) return 'bg-emerald-900/60';
        if (count < 6) return 'bg-emerald-700/80';
        return 'bg-emerald-500';
    };

    if (!stats) return (
        <div className="discord-card p-12 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#5865F2]/20 border-t-[#5865F2] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Retrieving Coding Intel</p>
            </div>
        </div>
    );

    const solvedPercentage = stats ? (stats.totalSolved / stats.totalQuestions) * 100 : 0;
    const strokeDasharray = 251.2; 
    const strokeDashoffset = strokeDasharray - (strokeDasharray * solvedPercentage) / 100;

    return (
        <div className="w-full flex flex-col">
            {/* HER0 SECTION */}
            <div className="pb-10 border-b border-white/5">
                <div className="flex items-center gap-3 mb-8">
                    <Trophy size={16} className="text-[#F0B232]" />
                    <h2 className="text-xl font-bold text-white tracking-tight uppercase italic">Coding Performance Analysis</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* GAUGE */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center bg-[#2B2D31] rounded-2xl p-8 border border-white/[0.03] shadow-lg">
                        <div className="relative w-44 h-44">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-[#1E1F22]" />
                                <circle 
                                    cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="10" fill="transparent" 
                                    className="text-[#5865F2] transition-all duration-1000 ease-out"
                                    style={{ strokeDasharray, strokeDashoffset }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-white italic leading-none">{stats?.totalSolved || 0}</span>
                                <span className="text-[10px] font-black text-[#80848E] uppercase tracking-widest mt-2">Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* DIFFICULTY BREAKDOWN */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Easy', solved: stats?.easySolved, total: stats?.totalEasy, color: 'text-[#23A55A]', bar: 'bg-[#23A55A]', bg: 'bg-[#23A55A]/5' },
                            { label: 'Medium', solved: stats?.mediumSolved, total: stats?.totalMedium, color: 'text-[#F0B232]', bar: 'bg-[#F0B232]', bg: 'bg-[#F0B232]/5' },
                            { label: 'Hard', solved: stats?.hardSolved, total: stats?.totalHard, color: 'text-[#F23F43]', bar: 'bg-[#F23F43]', bg: 'bg-[#F23F43]/5' }
                        ].map((d) => (
                            <div key={d.label} className={`${d.bg} p-6 rounded-2xl border border-white/[0.03] flex flex-col justify-between hover:bg-black/20 transition-all cursor-default`}>
                                <div className="flex justify-between items-center mb-4 text-[11px] font-bold uppercase tracking-widest text-[#B5BAC1]">
                                    {d.label}
                                    <CheckCircle2 size={12} className={d.color} />
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-3xl font-black text-white italic">{d.solved || 0}</span>
                                        <span className="text-xs font-bold text-[#80848E]">/ {d.total || 0}</span>
                                    </div>
                                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                        <div className={`h-full ${d.bar}`} style={{ width: `${(d.solved / d.total) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* HEATMAP SECTION */}
            <div className="py-12 border-b border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Activity size={14} className="text-[#5865F2]" />
                        <h4 className="text-[10px] font-black text-[#B5BAC1] uppercase tracking-[0.2em]">Temporal Frequency Synapse</h4>
                    </div>
                </div>
                
                <div className="overflow-x-auto no-scrollbar">
                    <div className="min-w-[800px] flex gap-4">
                        <div className="flex flex-col justify-between py-1 text-[8px] font-bold text-zinc-600 uppercase h-[105px]">
                            <span>Mon</span><span>Wed</span><span>Fri</span>
                        </div>
                        <div className="flex flex-1 gap-[4px]">
                            {heatmapData?.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[4px]">
                                    {week.map((day, di) => (
                                        <div 
                                            key={di} 
                                            className={`w-[11.5px] h-[11.5px] rounded-[2px] border border-black/10 transition-all cursor-pointer ${getIntensity(day.count)}`}
                                            title={`${day.date}: ${day.count} submissions`}
                                        ></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RECENT AC SECTION */}
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                        <Target size={14} className="text-emerald-500" /> RECENTLY COMPLETED MISSIONS
                    </h4>
                    {stats?.username && (
                        <a href={`https://leetcode.com/u/${stats.username}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#5865F2] hover:underline uppercase tracking-widest flex items-center gap-2">
                            VIEW FULL LOG <ExternalLink size={10} />
                        </a>
                    )}
                </div>
                <div className="space-y-1.5">
                    {stats?.recentSubmissions?.map((sub, i) => (
                        <a 
                            key={i} href={`https://leetcode.com/problems/${sub.titleSlug}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3 bg-[#313338]/50 hover:bg-[#313338] border border-white/[0.02] rounded-md transition-all group"
                        >
                            <span className="text-xs font-bold text-zinc-300 group-hover:text-white">{sub.title}</span>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tabular-nums">
                                {(() => {
                                    const diff = Math.floor(Date.now() / 1000) - parseInt(sub.timestamp);
                                    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
                                    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
                                    return `${Math.floor(diff/86400)}d ago`;
                                })()}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeetCodeHeatmap;
