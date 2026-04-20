import React, { useState, useEffect } from 'react';
import { Check, X, User, Loader2, Inbox, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

import { getSocket } from '@/socket';
 
 const FriendRequestsModal = ({ onClose, onUpdate, isModal = true }) => {
     const [requests, setRequests] = useState([]);
     const [loading, setLoading] = useState(true);
     const [actioningId, setActioningId] = useState(null);
     const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'sent'
 
     useEffect(() => {
         fetchRequests();
     }, [activeTab]);
 
     useEffect(() => {
         const socket = getSocket();
         if (socket) {
             const handleRefresh = () => fetchRequests();
             socket.on('friend_request_received', handleRefresh);
             socket.on('friend_request_canceled', handleRefresh);
             socket.on('friend_request_accepted', handleRefresh);
             socket.on('friend_request_rejected', handleRefresh);

             return () => {
                 socket.off('friend_request_received', handleRefresh);
                 socket.off('friend_request_canceled', handleRefresh);
                 socket.off('friend_request_accepted', handleRefresh);
                 socket.off('friend_request_rejected', handleRefresh);
             };
         }
     }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = activeTab === 'incoming' ? '/api/requests/pending' : '/api/requests/sent';
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setRequests(data);
        } catch (e) {
            console.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, action) => {
        setActioningId(requestId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/requests/action', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ requestId, action })
            });

            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== requestId));
                onUpdate?.(); // Notify parent to refresh list/count
            }
        } catch (e) {
            console.error('Action failed');
        } finally {
            setActioningId(null);
        }
    };

    const content = (
        <div className={cn(
            "bg-[#313338] flex flex-col overflow-hidden animate-in fade-in duration-500",
            isModal ? "w-full max-w-[440px] rounded-[12px] shadow-2xl border border-[#1f2023] relative z-10" : "flex-1 h-full"
        )}>
            {/* Header */}
            <div className="p-6 pb-4 bg-[#2b2d31] border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Inbox className="text-indigo-400" size={22} />
                        <h2 className={cn(
                            "text-white font-black uppercase tracking-widest italic pt-0.5",
                            isModal ? "text-[18px]" : "text-[24px]"
                        )}>Neural Invitations</h2>
                    </div>
                    {isModal && <button onClick={onClose} className="text-[#949ba4] hover:text-white transition-colors"><X size={20} /></button>}
                </div>

                {/* Tabs */}
                <div className={cn(
                    "flex gap-1 bg-[#1e1f22] p-1 rounded-[8px]",
                    !isModal && "max-w-[400px]"
                )}>
                    <button 
                        onClick={() => setActiveTab('incoming')}
                        className={cn(
                            "flex-1 py-2 px-3 rounded-[6px] text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            activeTab === 'incoming' ? "bg-[#313338] text-white shadow-sm" : "text-[#949ba4] hover:text-[#dbdee1]"
                        )}
                    >
                        <Inbox size={14} /> Incoming
                    </button>
                    <button 
                        onClick={() => setActiveTab('sent')}
                        className={cn(
                            "flex-1 py-2 px-3 rounded-[6px] text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            activeTab === 'sent' ? "bg-[#313338] text-white shadow-sm" : "text-[#949ba4] hover:text-[#dbdee1]"
                        )}
                    >
                        <Send size={14} /> Sent
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={cn(
                "flex-1 overflow-y-auto no-scrollbar p-0 bg-[#313338]",
                isModal ? "min-h-[360px] max-h-[460px]" : "p-6"
            )}>
                <div className={cn(!isModal && "max-w-[800px] mx-auto")}>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-[#4e5058]">
                            <Loader2 size={32} className="animate-spin mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Scanning Frequencies...</p>
                        </div>
                    ) : requests.length > 0 ? (
                        <div className={cn(
                            "divide-y divide-white/5",
                            !isModal && "bg-[#2b2d31] rounded-xl border border-[#1f2023] overflow-hidden shadow-xl"
                        )}>
                            {requests.map((req) => (
                                <div key={req.id} className="flex items-center gap-3 p-4 hover:bg-[#2e3035] transition-all group">
                                    <div className="w-12 h-12 rounded-full bg-[#1e1f22] flex items-center justify-center text-white font-bold text-lg border border-white/5 ring-0 group-hover:ring-2 ring-indigo-500/20 transition-all overflow-hidden">
                                        {req.profile_picture ? <img src={req.profile_picture} className="w-full h-full object-cover" /> : req.username[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold truncate">
                                            <Link to={`/${req.username}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>@{req.username}</Link>
                                        </p>
                                        <p className="text-[10px] text-[#949ba4] font-black uppercase tracking-widest">
                                            {activeTab === 'incoming' ? 'Incoming Neural Sync' : 'Outbound Transmission'}
                                        </p>
                                    </div>
                                    
                                    {activeTab === 'incoming' ? (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                disabled={actioningId === req.id}
                                                onClick={() => handleAction(req.id, 'accepted')}
                                                className="w-9 h-9 flex items-center justify-center bg-emerald-500/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-full transition-all active:scale-95"
                                                title="Accept Link"
                                            >
                                                {actioningId === req.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} />}
                                            </button>
                                            <button 
                                                disabled={actioningId === req.id}
                                                onClick={() => handleAction(req.id, 'rejected')}
                                                className="w-9 h-9 flex items-center justify-center bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full transition-all active:scale-95"
                                                title="Reject Link"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-[#4e5058] group-hover:text-indigo-400 transition-colors pr-2">
                                            <ArrowRight size={18} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-[#4e5058]">
                            <div className="w-16 h-16 rounded-full bg-[#1e1f22] flex items-center justify-center mb-4 opacity-30 shadow-inner">
                                {activeTab === 'incoming' ? <Inbox size={32} /> : <Send size={32} />}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest">
                                {activeTab === 'incoming' ? 'No Active Invitations' : 'No Outbound Signals'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer */}
            <div className="bg-[#2b2d31] px-6 py-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] text-[#4e5058] font-black uppercase tracking-[0.2em]">Status: Operational</p>
                <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] text-[#949ba4] font-bold uppercase">Real-time sync</span>
                </div>
            </div>
        </div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                {content}
            </div>
        );
    }

    return content;
};

export default FriendRequestsModal;
