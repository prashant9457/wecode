import React from 'react';
import { Rocket, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardStats = ({ stats, isCollapsed, onToggle, width, onResize }) => {
    return (
        <div className="relative flex shrink-0 h-full">
            {/* Resize Handle */}
            {!isCollapsed && (
                <div
                    onMouseDown={() => {
                        const handleMouseMove = (e) => {
                            const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 240), 500);
                            onResize(newWidth);
                        };
                        const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                            document.body.style.cursor = 'default';
                        };
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                        document.body.style.cursor = 'ew-resize';
                    }}
                    className="absolute left-[-2px] top-0 bottom-0 w-[4px] cursor-ew-resize hover:bg-indigo-500/50 transition-colors z-[100]"
                />
            )}

            <aside
                style={{ width: isCollapsed ? '48px' : `${width}px` }}
                className={cn(
                    "bg-[#2b2d31] border-l border-[#1f2023] flex flex-col transition-all duration-300 hidden lg:flex relative overflow-hidden h-full"
                )}
            >
                {/* Statistics Fixed Header */}
                <div className={cn(
                    "h-10 px-4 flex items-center justify-between border-b border-[#1f2023] shrink-0 bg-[#2b2d31] z-10",
                    isCollapsed && "px-0 justify-center"
                )}>
                    {!isCollapsed && (
                        <h2 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic">Statistics</h2>
                    )}
                    <button
                        onClick={onToggle}
                        className={cn(
                            "flex items-center justify-center w-6 h-6 hover:text-white text-[#949ba4] transition-all hover:bg-[#35373c] rounded-md",
                            isCollapsed && "mx-auto"
                        )}
                    >
                        {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                </div>

            <div className={cn("flex-1 overflow-y-auto no-scrollbar border-l border-white/5", isCollapsed && "items-center")}>
                {isCollapsed ? (
                    /* Vertically Orientated Collapsed Content */
                    <div className="flex flex-col items-center gap-10 py-4 pt-6">
                        <Activity size={20} className="text-[#949ba4]" />
                        <div className="flex flex-col items-center gap-6 select-none">
                            <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black tracking-[0.3em] text-[#949ba4] uppercase hover:text-white transition-colors cursor-default">
                                Statistics Node
                            </span>
                        </div>
                    </div>
                    ) : (
                        /* Expanded Content */
                        <>
                            {/* Section 1: Performance Aggregate */}
                            <div className="p-5 border-b border-[#1f2023]">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="bg-[#1e1f22] p-4 rounded-xl border border-white/5 group hover:border-indigo-500/30 transition-all flex justify-between items-center shadow-lg">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#949ba4] uppercase tracking-widest mb-1">SOLVED TODAY</p>
                                            <p className="text-2xl font-black text-white">{String(stats.totalSolved || 0).padStart(2, '0')}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            <Rocket size={20} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-[#1e1f22] p-3 rounded-xl border border-white/5 text-center shadow-md">
                                            <p className="text-[9px] font-bold text-[#949ba4] uppercase tracking-widest mb-1">PAST MONTH</p>
                                            <p className="text-lg font-black text-white">128</p>
                                        </div>
                                        <div className="bg-[#1e1f22] p-3 rounded-xl border border-white/5 text-center shadow-md">
                                            <p className="text-[9px] font-bold text-[#949ba4] uppercase tracking-widest mb-1">OVERALL</p>
                                            <p className="text-lg font-black text-white">542</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Tactical Leaderboard */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-[0.2em]">LEADERBOARD</h3>
                                    <div className="flex bg-[#1e1f22] p-1 rounded-lg">
                                        <button className="text-[9px] font-black px-2 py-1 rounded-[4px] bg-[#3f4147] text-white uppercase tracking-widest">Friends</button>
                                        <button className="text-[9px] font-black px-2 py-1 rounded-[4px] text-[#949ba4] hover:text-white uppercase tracking-widest transition-colors">Global</button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    {[
                                        { rank: 1, user: "void_walker", solved: 12, active: true },
                                        { rank: 2, user: "zero_day", solved: 9, active: true },
                                        { rank: 3, user: "kernel_panic", solved: 7, active: false },
                                        { rank: 4, user: "root_access", solved: 4, active: true },
                                        { rank: 5, user: "shadow_node", solved: 2, active: false }
                                    ].map((competitor, i) => (
                                        <div key={i} className={cn(
                                            "flex items-center justify-between p-2 rounded-lg hover:bg-[#35373c] group transition-all cursor-pointer",
                                            width < 280 ? "flex-col gap-2 items-start" : "flex-row"
                                        )}>
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-[10px] font-black w-4 text-center",
                                                    i === 0 ? "text-yellow-400" : i === 1 ? "text-[#b5bac1]" : i === 2 ? "text-orange-500" : "text-[#4e5058]"
                                                )}>#{competitor.rank}</span>
                                                <div className="relative shrink-0">
                                                    <div className="w-8 h-8 rounded-full bg-[#1e1f22] border border-white/5 flex items-center justify-center font-bold text-[10px] text-white uppercase">
                                                        {competitor.user[0]}
                                                    </div>
                                                    {competitor.active && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#23a559] rounded-full border-[2px] border-[#2b2d31]"></div>}
                                                </div>
                                                <span className="text-sm font-bold text-[#949ba4] group-hover:text-white truncate max-w-[80px]">@{competitor.user}</span>
                                            </div>
                                            <div className={cn(
                                                "text-right",
                                                width < 280 && "w-full flex justify-between items-center px-4"
                                            )}>
                                                <span className="text-[11px] font-black text-indigo-400 tabular-nums block">{competitor.solved}</span>
                                                <span className="text-[8px] font-bold text-[#4e5058] uppercase tracking-widest">{competitor.solved === 1 ? 'Solve' : 'Solves'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="mt-6 w-full py-2 rounded-lg border border-dashed border-[#4e5058] text-[10px] font-black text-[#949ba4] uppercase tracking-[0.2em] hover:text-white hover:border-[#b5bac1] transition-all uppercase tracking-widest">
                                    {width < 280 ? 'More' : 'View Full Rankings'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default DashboardStats;
