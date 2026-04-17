import React, { useState, useEffect } from 'react';
import { Search, X, UserPlus, UserMinus, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const AddFriendModal = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionId, setActionId] = useState(null);

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
                setResults(prev => prev.map(u => u.id === friendId ? { ...u, requestSent: true } : u));
            }
        } catch (e) {
            console.error('Add failed');
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
                setResults(prev => prev.map(u => u.id === friendId ? { ...u, is_friend: false, requestSent: false } : u));
            }
        } catch (e) {
            console.error('Remove failed');
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" onClick={onClose} />
            
            <div className="relative bg-[#313338] w-full max-w-[440px] rounded-[12px] shadow-2xl border border-[#1f2023] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 pb-2 border-b border-white/5 bg-[#2b2d31]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white text-[18px] font-black uppercase tracking-widest italic pt-0.5">Operative Discovery</h2>
                        <button onClick={onClose} className="text-[#949ba4] hover:text-white transition-colors"><X size={20} /></button>
                    </div>
                    <div className="relative group">
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

                <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto no-scrollbar p-0">
                    {results.length > 0 ? (
                        <div className="divide-y divide-white/10">
                            {results.map((user) => (
                                <div key={user.id} className="flex items-center gap-3 p-4 hover:bg-[#2b2d31] transition-all group">
                                    <div className="w-12 h-12 rounded-full bg-[#1e1f22] flex items-center justify-center text-white font-bold text-lg border border-white/5 shadow-inner">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold truncate">@{user.username}</p>
                                        <p className="text-[10px] text-[#949ba4] font-black tracking-widest uppercase">ID: {user.id.slice(0, 8)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            disabled={actionId === user.id || user.is_friend || user.request_status === 'pending' || user.requestSent}
                                            onClick={() => handleAddFriend(user.id)}
                                            className={cn(
                                                "w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95",
                                                user.is_friend || user.request_status === 'pending' || user.requestSent 
                                                    ? "bg-emerald-500/10 text-emerald-500 cursor-default" 
                                                    : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                                            )}
                                            title={user.is_friend ? "Already Synchronized" : (user.request_status === 'pending' ? "Invitation Pending" : "Send Neural Invitation")}
                                        >
                                            {user.is_friend || user.request_status === 'pending' || user.requestSent ? <Check size={18} /> : (actionId === user.id ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={18} />)}
                                        </button>
                                        <button 
                                            disabled={actionId === user.id || !user.is_friend}
                                            onClick={() => handleRemoveFriend(user.id)}
                                            className={cn(
                                                "w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95",
                                                user.is_friend 
                                                    ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" 
                                                    : "bg-white/5 text-[#4e5058] cursor-not-allowed"
                                            )}
                                            title="Sever Neural Link"
                                        >
                                            {actionId === user.id ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={18} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                
                <div className="bg-[#2b2d31] p-4 text-center border-t border-white/5">
                    <p className="text-[11px] text-[#4e5058] font-black uppercase tracking-[0.2em]">Authorized Sector Scan Active</p>
                </div>
            </div>
        </div>
    );
};

export default AddFriendModal;
