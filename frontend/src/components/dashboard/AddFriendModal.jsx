import React, { useState, useEffect } from 'react';
import { Search, X, UserPlus, UserMinus, Loader2, Check, Clock, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSocket } from '@/socket';

const AddFriendModal = ({ onClose, isModal = true }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        const socket = getSocket();
        if (socket) {
            const handleUpdate = () => {
                if (query.trim().length >= 2) handleSearch();
            };
            socket.on('friend_request_accepted', handleUpdate);
            socket.on('friend_request_rejected', handleUpdate);
            return () => {
                socket.off('friend_request_accepted', handleUpdate);
                socket.off('friend_request_rejected', handleUpdate);
            };
        }
    }, [query]);

    const handleSearch = async () => {
        if (query.trim().length < 2) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/users/search?q=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setResults(data);
        } catch (e) {
            console.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length >= 2) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleAddFriend = async (friendId) => {
        setActionId(friendId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/friends/add', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ friendId })
            });

            if (res.ok) {
                setResults(prev => prev.map(u => u.id === friendId ? { ...u, request_status: 'pending', request_sender_id: localStorage.getItem('user_id'), requestSent: true } : u));
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Link transmission failed');
            }
        } catch (e) {
            console.error('Add failed:', e);
            alert('Neural Network transmission failure');
        } finally {
            setActionId(null);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        setActionId(friendId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/friends/remove', {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ friendId })
            });
            if (res.ok) {
                setResults(prev => prev.map(u => u.id === friendId ? { ...u, is_friend: false, request_status: null, requestSent: false } : u));
            }
        } catch (e) {
            console.error('Remove failed');
        } finally {
            setActionId(null);
        }
    };

    const handleCancelRequest = async (friendId) => {
        setActionId(friendId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/requests/cancel', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ friendId })
            });
            if (res.ok) {
                setResults(prev => prev.map(u => u.id === friendId ? { ...u, request_status: null, requestSent: false } : u));
            }
        } catch (e) {
            console.error('Cancel failed:', e);
        } finally {
            setActionId(null);
        }
    };

    const content = (
        <div className={cn(
            "bg-[#313338] flex flex-col overflow-hidden animate-in fade-in duration-500",
            isModal ? "w-full max-w-[440px] rounded-[12px] shadow-2xl border border-[#1f2023] relative z-10" : "flex-1 h-full"
        )}>
            <div className="p-6 pb-2 border-b border-white/5 bg-[#2b2d31]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className={cn(
                        "text-white font-black uppercase tracking-widest italic pt-0.5",
                        isModal ? "text-[18px]" : "text-[24px]"
                    )}>Operative Discovery</h2>
                    {isModal && <button onClick={onClose} className="text-[#949ba4] hover:text-white transition-colors"><X size={20} /></button>}
                </div>
                <div className={cn("relative group", !isModal && "max-w-[480px]")}>
                    <input 
                        autoFocus
                        type="text"
                        placeholder="Search by Operative ID or Username..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-[#1e1f22] text-[#dbdee1] text-[14px] font-bold p-3 pr-10 rounded-[4px] border border-[#1f2023] focus:outline-none focus:border-indigo-500 transition-all placeholder:text-[#4e5058] placeholder:italic"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4e5058] group-focus-within:text-indigo-500 transition-colors">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    </div>
                </div>
            </div>

            <div className={cn(
                "flex-1 overflow-y-auto no-scrollbar bg-[#313338]",
                isModal ? "min-h-[300px] max-h-[400px]" : "p-6"
            )}>
                <div className={cn(!isModal && "max-w-[800px] mx-auto")}>
                    {results.length > 0 ? (
                        <div className={cn(
                            "divide-y divide-white/10",
                            !isModal && "bg-[#2b2d31] rounded-xl border border-[#1f2023] overflow-hidden shadow-xl"
                        )}>
                            {results.map((user) => {
                                const currentUserId = localStorage.getItem('user_id');
                                const isOutgoingPending = user.request_status === 'pending' && user.request_sender_id === currentUserId;
                                const isIncomingPending = user.request_status === 'pending' && user.request_sender_id !== currentUserId;

                                return (
                                <div key={user.id} className="flex items-center gap-3 p-4 hover:bg-[#2b2d31] transition-all group">
                                    <div className="w-12 h-12 rounded-full bg-[#1e1f22] flex items-center justify-center text-white font-bold text-lg border border-white/5 shadow-inner">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold truncate">@{user.username}</p>
                                        <p className="text-[10px] text-[#949ba4] font-black tracking-widest uppercase">ID: {user.id.slice(0, 8)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {user.is_friend ? (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                <Check size={14} /> Synchronized
                                            </div>
                                        ) : isOutgoingPending || user.requestSent ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-500/10 text-orange-400" title="Neural Link Pending">
                                                    <Clock size={18} className="animate-pulse" />
                                                </div>
                                                <button 
                                                    disabled={actionId === user.id}
                                                    onClick={() => handleCancelRequest(user.id)}
                                                    className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-all border border-rose-500/20"
                                                >
                                                    {actionId === user.id ? <Loader2 size={12} className="animate-spin" /> : "Retrieve Invitation"}
                                                </button>
                                            </div>
                                        ) : isIncomingPending ? (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                                                <Inbox size={14} /> Neural Request Received
                                            </div>
                                        ) : (
                                            <button 
                                                disabled={actionId === user.id}
                                                onClick={() => handleAddFriend(user.id)}
                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all active:scale-95 border border-indigo-500/10"
                                                title="Send Neural Invitation"
                                            >
                                                {actionId === user.id ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={18} />}
                                            </button>
                                        )}
                                        
                                        <button 
                                            disabled={actionId === user.id || !user.is_friend}
                                            onClick={() => handleRemoveFriend(user.id)}
                                            className={cn(
                                                "w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95",
                                                user.is_friend 
                                                    ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" 
                                                    : "bg-white/5 text-[#4e5058] cursor-not-allowed opacity-0 group-hover:opacity-20"
                                            )}
                                            title="Sever Neural Link"
                                        >
                                            {actionId === user.id ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={18} />}
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    ) : query.length >= 2 && !loading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-[#4e5058]">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Operatives Found</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-[#4e5058]">
                            <div className="w-16 h-16 rounded-full bg-[#1e1f22] flex items-center justify-center mb-6 opacity-40">
                                <Search size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest italic">Awaiting Sector Coordinates...</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-[#2b2d31] p-4 text-center border-t border-white/5">
                <p className="text-[11px] text-[#4e5058] font-black uppercase tracking-[0.2em]">Authorized Sector Scan Active</p>
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

export default AddFriendModal;
