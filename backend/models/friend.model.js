const { supabase } = require('../config/db');
const fs = require('fs');
const path = require('path');

const Friend = {
  async getFriendsByUserId(userId) {
    try {
      const fs = require('fs');
      const path = require('path');
      const logPath = path.join(__dirname, '../debug.log');
      
      // 1. Fetch from 'friends'
      const { data: pNodes } = await supabase.from('friends').select('friend_id').eq('user_id', userId);
      const { data: iNodes } = await supabase.from('friends').select('user_id').eq('friend_id', userId);
      
      // 2. Fetch from 'friend_requests'
      const { data: sReqs } = await supabase.from('friend_requests').select('receiver_id').eq('sender_id', userId).eq('status', 'accepted');
      const { data: rReqs } = await supabase.from('friend_requests').select('sender_id').eq('receiver_id', userId).eq('status', 'accepted');

      const ids = new Set();
      if (pNodes) pNodes.forEach(n => ids.add(n.friend_id));
      if (iNodes) iNodes.forEach(n => ids.add(n.user_id));
      if (sReqs) sReqs.forEach(n => ids.add(n.receiver_id));
      if (rReqs) rReqs.forEach(n => ids.add(n.sender_id));

      const friendIds = Array.from(ids);
      fs.appendFileSync(logPath, `[FRIEND_MODEL] Simple Sync: Found ${friendIds.length} unique IDs for ${userId}\n`);

      if (friendIds.length === 0) return [];

      // 3. Resolve Users
      const { data: userData, error: uErr } = await supabase.from('users').select('id, username, email').in('id', friendIds);
      if (uErr) fs.appendFileSync(logPath, `[FRIEND_MODEL] RESOLVE ERROR: ${uErr.message}\n`);
      
      return friendIds.map(id => {
        const u = userData?.find(user => user.id === id);
        return {
          id: id,
          username: u?.username || 'Unknown Operative',
          email: u?.email || '',
          profile_picture: null,
          status: 'online'
        };
      });
    } catch (e) {
      return [];
    }
  },

  async addFriend(userId, friendId) {
    // Insert bidirectional friendship
    const { data, error } = await supabase
      .from('friends')
      .insert([
        { user_id: userId, friend_id: friendId },
        { user_id: friendId, friend_id: userId }
      ])
      .select();
    
    if (error) {
      if (error.code === '23505') return { message: 'Already friends' };
      throw error;
    }
    return data;
  },

  async isFriend(userId, friendId) {
    const { data, error } = await supabase
      .from('friends')
      .select('id')
      .eq('user_id', userId)
      .eq('friend_id', friendId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  },

  async getFriendIds(userId) {
    try {
        const { data, error } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', userId);
        if (error) return [];
        return data ? data.map(f => f.friend_id) : [];
    } catch (e) {
        return [];
    }
  },

  async removeFriend(userId, friendId) {
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);
    
    if (error) throw error;
    return true;
  }
};

const Submission = {
  async getFeed(friendIds) {
    if (!friendIds || friendIds.length === 0) return [];
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .in('user_id', friendIds)
        .order('solved_at', { ascending: false })
        .limit(20);
      
      if (error) {
         console.warn("Feed table might be missing or schema differs:", error.message);
         return [];
      }
      if (!data || data.length === 0) return [];

      // Manual join logic for user and problem info (resilient to missing foreign keys)
      const userIds = [...new Set(data.map(s => s.user_id))];
      const problemIds = [...new Set(data.map(s => s.problem_id))].filter(Boolean);

      const [usersRes, problemsRes] = await Promise.all([
        supabase.from('users').select('id, username, profile_picture').in('id', userIds),
        problemIds.length > 0 ? supabase.from('problems').select('id, title, platform').in('id', problemIds) : { data: [] }
      ]);

      const users = usersRes.data || [];
      const problems = problemsRes.data || [];

      return data.map(sub => {
        const u = users.find(user => user.id === sub.user_id);
        const p = problems.find(prob => prob.id === sub.problem_id);
        return {
          id: sub.id,
          username: u?.username || 'Unknown',
          profile_picture: u?.profile_picture || null,
          title: p?.title || sub.problem_title || 'Unknown Problem',
          platform: p?.platform || 'Arena',
          solved_at: sub.solved_at
        };
      });
    } catch (e) {
      console.error('Error in getFeed:', e);
      return [];
    }
  },

  async getTotalSolved(userId) {
    try {
      const { count, error } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (error) {
          console.warn("Submissions table missing or access denied:", error.message);
          return 0;
      }
      return count || 0;
    } catch (e) {
      return 0;
    }
  },

  async getRecentSolved(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .order('solved_at', { ascending: false })
        .limit(limit);
      
      if (error) {
          console.warn("Submissions table unreachable for recent sync:", error.message);
          return [];
      }
      if (!data || data.length === 0) return [];

      const problemIds = [...new Set(data.map(s => s.problem_id))].filter(Boolean);
      const { data: problems } = problemIds.length > 0 
        ? await supabase.from('problems').select('id, title, platform').in('id', problemIds)
        : { data: [] };

      return data.map(sub => {
        const p = problems?.find(prob => prob.id === sub.problem_id);
        return {
          id: sub.id,
          title: p?.title || sub.problem_title || 'Unknown Problem',
          platform: p?.platform || 'Arena',
          solved_at: sub.solved_at
        };
      });
    } catch (e) {
      console.error('Error in getRecentSolved:', e);
      return [];
    }
  }
};

const FriendRequest = {
  async sendRequest(senderId, receiverId) {
    // Attempt to upsert: if it exists, update it to 'pending'
    const { data, error } = await supabase
      .from('friend_requests')
      .upsert(
        { sender_id: senderId, receiver_id: receiverId, status: 'pending', created_at: new Date() },
        { onConflict: 'sender_id, receiver_id' }
      )
      .select()
      .single();

    if (error) {
      // In case the unique constraint is different (e.g. bidirectional)
      if (error.code === '23505') throw new Error('Request already exists and is immutable');
      throw error;
    }
    return data;
  },

  async getPendingRequests(userId) {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('id, sender_id, created_at, users!friend_requests_sender_id_fkey(username, email)')
      .eq('receiver_id', userId)
      .eq('status', 'pending');
    if (error) throw error;
    
    return data.map(req => ({
      id: req.id,
      sender_id: req.sender_id,
      username: req.users?.username || 'Unknown',
      created_at: req.created_at
    }));
  },

  async getSentRequests(userId) {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('id, receiver_id, created_at, users!friend_requests_receiver_id_fkey(username, email)')
      .eq('sender_id', userId)
      .eq('status', 'pending');
    if (error) throw error;
    
    return data.map(req => ({
      id: req.id,
      receiver_id: req.receiver_id,
      username: req.users?.username || 'Unknown',
      created_at: req.created_at
    }));
  },

  async updateRequestStatus(requestId, status, userId) {
    // 1. Update status
    const { data: request, error } = await supabase
      .from('friend_requests')
      .update({ status })
      .eq('id', requestId)
      .eq('receiver_id', userId) // Security: only receiver can update
      .select()
      .single();
    
    if (error) throw error;

    // 2. If accepted, establish friendship
    if (status === 'accepted') {
      await Friend.addFriend(request.sender_id, request.receiver_id);
    }
    
    return request;
  },

  async cancelRequest(senderId, receiverId) {
    const { error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('status', 'pending');
    if (error) throw error;
    return true;
  },

  async getRequestStatus(user1Id, user2Id) {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('status')
      .or(`and(sender_id.eq.${user1Id},receiver_id.eq.${user2Id}),and(sender_id.eq.${user2Id},receiver_id.eq.${user1Id})`)
      .maybeSingle();
    
    if (error) return null;
    return data ? data.status : null;
  }
};

module.exports = { Friend, Submission, FriendRequest };
