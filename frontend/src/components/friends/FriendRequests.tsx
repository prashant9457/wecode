import React, { useEffect, useState } from 'react';
import AddFriendButton from './AddFriendButton';
import { User, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RequestModel {
  id: string;
  sender_id: string;
  receiver_id: string;
  username: string;
  status: string;
}

export default function FriendRequests() {
  const [incoming, setIncoming] = useState<RequestModel[]>([]);
  const [sent, setSent] = useState<RequestModel[]>([]);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const loadRequests = async () => {
    try {
      const [incRes, sentRes] = await Promise.all([
        fetch("/api/friends/requests/incoming", { headers: getHeaders() }),
        fetch("/api/friends/requests/sent", { headers: getHeaders() })
      ]);
      
      if (incRes.ok) setIncoming(await incRes.json());
      if (sentRes.ok) setSent(await sentRes.json());
    } catch (error) {
      console.error("Failed to load requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return <div className="p-6 text-[#949ba4] text-xs font-black uppercase tracking-widest">Loading Requests...</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in duration-500">
      
      {/* Incoming Requests Panel */}
      <section>
        <h2 className="text-[#949ba4] text-[11px] font-black uppercase tracking-[0.2em] mb-4">
          Incoming Neural Links — {incoming.length}
        </h2>
        
        {incoming.length === 0 ? (
          <div className="bg-[#2b2d31] border border-[#1f2023] rounded-xl p-6 text-center shadow-inner">
             <p className="text-[#4e5058] text-xs font-bold uppercase tracking-widest">No pending incoming requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incoming.map(req => (
              <div key={req.id} className="bg-[#2b2d31] border border-[#1f2023] rounded-xl p-4 flex items-center justify-between group hover:border-[#4e5058] transition-all shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#1e1f22] border border-white/5 flex items-center justify-center font-bold text-white shadow-inner">
                    {req.username?.[0]?.toUpperCase() || <User size={16} />}
                  </div>
                  <div>
                    <Link to={`/${req.username}`} className="hover:underline text-white font-bold text-sm">@{req.username}</Link>
                    <p className="text-[9px] text-[#949ba4] font-black tracking-widest uppercase">Incoming</p>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <AddFriendButton 
                    receiverId={req.sender_id} 
                    requestId={req.id} 
                    initialState="incoming" 
                    onStateChange={() => loadRequests()}
                  />
                </div>
                {/* Glow effect */}
                <div className="absolute top-0 left-0 w-8 h-full bg-blue-500/5 blur-xl"></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sent Requests Panel */}
      <section>
        <h2 className="text-[#4e5058] text-[11px] font-black uppercase tracking-[0.2em] mb-4">
          Sent Link Transmissions — {sent.length}
        </h2>
        
        {sent.length === 0 ? (
          <div className="bg-[#2b2d31]/50 border border-[#1f2023]/50 rounded-xl p-6 text-center">
             <p className="text-[#4e5058] text-[10px] font-bold uppercase tracking-widest">No outgoing transmissions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
            {sent.map(req => (
              <div key={req.id} className="bg-[#2b2d31] border border-[#1f2023] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1e1f22] flex items-center justify-center text-[#949ba4]">
                    <Activity size={12} />
                  </div>
                  <div>
                    <Link to={`/${req.username}`} className="hover:underline text-[#dbdee1] font-bold text-xs">@{req.username}</Link>
                    <p className="text-[8px] text-[#4e5058] font-black tracking-widest uppercase">Awaiting Response</p>
                  </div>
                </div>
                
                <AddFriendButton 
                  receiverId={req.receiver_id} 
                  initialState="requested" 
                />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
