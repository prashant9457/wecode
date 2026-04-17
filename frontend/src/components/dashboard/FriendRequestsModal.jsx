import React, { useState, useEffect } from 'react';
import { Check, X, User, Loader2, Inbox } from 'lucide-react';

const FriendRequestsModal = ({ onClose, onUpdate }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actioningId, setActioningId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/requests/pending', {
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

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-[#313338] w-full max-w-[440px] rounded-[12px] shadow-2xl border border-[#1f2023] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 pb-2 border-b border-white/5 bg-[#2b2d31]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Inbox className="text-[#949ba4]" size={22} />
                            <h2 className="text-white text-[18px] font-black uppercase tracking-widest italic pt-0.5">Neural Invitations</h2>
                        </div>
                        <button onClick={onClose} className="text-[#949ba4] hover:text-white transition-colors"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto no-scrollbar p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#4e5058]">
                            <Loader2 size={32} className="animate-spin mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Transmissions...</p>
                        </div>
                    ) : requests.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {requests.map((req) => (
                                <div key={req.id} className="flex items-center gap-3 p-4 hover:bg-[#2b2d31] transition-all group">
                                    <div className="w-12 h-12 rounded-full bg-[#1e1f22] flex items-center justify-center text-white font-bold text-lg border border-white/5 ring-0 group-hover:ring-2 ring-indigo-500/20 transition-all">
                                        {req.username[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold truncate">@{req.username}</p>
                                        <p className="text-[11px] text-[#949ba4] font-bold uppercase tracking-tighter">Incoming Neural Sync</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            disabled={actioningId === req.id}
                                            onClick={() => handleAction(req.id, 'accepted')}
                                            className="w-9 h-9 flex items-center justify-center bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-full transition-all active:scale-90"
                                            title="Accept Link"
                                        >
                                            {actioningId === req.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} />}
                                        </button>
                                        <button 
                                            disabled={actioningId === req.id}
                                            onClick={() => handleAction(req.id, 'rejected')}
                                            className="w-9 h-9 flex items-center justify-center bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full transition-all active:scale-90"
                                            title="Reject Link"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-[#4e5058]">
                            <div className="w-16 h-16 rounded-full bg-[#1e1f22] flex items-center justify-center mb-4 opacity-30">
                                <Inbox size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest">No Active Invitations</p>
                        </div>
                    )}
                </div>
                
                <div className="bg-[#2b2d31] p-4 text-center border-t border-white/5">
                    <p className="text-[10px] text-[#4e5058] font-black uppercase tracking-[0.2em]">Operational Integrity: Verified</p>
                </div>
            </div>
        </div>
    );
};

export default FriendRequestsModal;
