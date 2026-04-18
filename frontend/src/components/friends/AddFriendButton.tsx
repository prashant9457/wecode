import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserPlus, Clock, Check, X, Users } from 'lucide-react';

type ConnectionState = 'none' | 'requested' | 'incoming' | 'friends';

interface AddFriendButtonProps {
  receiverId: string;
  initialState?: ConnectionState;
  requestId?: string; // Needed for accepting/rejecting if state is incoming
  onStateChange?: (newState: ConnectionState) => void;
}

export default function AddFriendButton({ 
  receiverId, 
  initialState = 'none', 
  requestId,
  onStateChange 
}: AddFriendButtonProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(initialState);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ receiver_id: receiverId })
      });
      if (!res.ok) throw new Error("Failed to send request");
      
      setConnectionState('requested');
      onStateChange?.('requested');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!requestId) return;
    try {
      setLoading(true);
      const res = await fetch("/api/friends/accept", {
         method: "POST", 
         headers: getHeaders(),
         body: JSON.stringify({ request_id: requestId }) 
      });
      if (!res.ok) throw new Error("Failed to accept");
      
      setConnectionState('friends');
      onStateChange?.('friends');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!requestId) return;
    try {
      setLoading(true);
      const res = await fetch("/api/friends/reject", {
         method: "POST", 
         headers: getHeaders(),
         body: JSON.stringify({ request_id: requestId }) 
      });
      if (!res.ok) throw new Error("Failed to reject");
      
      setConnectionState('none');
      onStateChange?.('none');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (connectionState === 'none') {
    return (
      <button 
        onClick={handleSendRequest}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-[#248046] hover:bg-[#1a6334] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-sm transition-all shadow-emerald-900/20 disabled:opacity-50"
      >
        <UserPlus size={14} /> Add Friend
      </button>
    );
  }

  if (connectionState === 'requested') {
    return (
      <button 
        disabled
        className="flex items-center justify-center gap-2 bg-[#313338] border border-[#1f2023] text-[#949ba4] text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-sm transition-all"
      >
        <Clock size={14} /> Requested
      </button>
    );
  }

  if (connectionState === 'incoming') {
    return (
      <div className="flex items-center gap-2">
        <button 
          onClick={handleAccept}
          disabled={loading}
          className="flex items-center justify-center gap-1 bg-[#248046] hover:bg-[#1a6334] text-white text-[11px] font-black uppercase tracking-widest px-3 py-2 rounded transition-all shadow-md disabled:opacity-50"
        >
          <Check size={14} /> Accept
        </button>
        <button 
          onClick={handleReject}
          disabled={loading}
          className="flex items-center justify-center gap-1 bg-[#da373c] hover:bg-[#a1282c] text-white text-[11px] font-black uppercase tracking-widest px-3 py-2 rounded transition-all shadow-md disabled:opacity-50"
        >
          <X size={14} /> Reject
        </button>
      </div>
    );
  }

  if (connectionState === 'friends') {
    return (
      <button 
        disabled
        className="flex items-center justify-center gap-2 bg-[#2b2d31] border border-emerald-500/30 text-emerald-500 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded shadow-sm transition-all"
      >
        <Users size={14} /> Friends
      </button>
    );
  }

  return null;
}
