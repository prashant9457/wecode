const { supabase } = require('../../config/db');

class FriendService {
  async sendRequest(sender_id, receiver_id) {
    if (sender_id === receiver_id) {
      throw new Error("Cannot send friend request to yourself");
    }

    const { data: alreadyFriend } = await supabase
      .from('friends')
      .select('id')
      .eq('user_id', sender_id)
      .eq('friend_id', receiver_id)
      .maybeSingle();
      
    if (alreadyFriend) throw new Error("Already friends");

    const { data: existingRequest } = await supabase
      .from('friend_requests')
      .select('*')
      .or(`and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`)
      .maybeSingle();

    if (existingRequest) throw new Error("Friend request already exists");

    const { data, error } = await supabase
      .from('friend_requests')
      .insert({ sender_id, receiver_id, status: 'pending' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async acceptRequest(request_id) {
    const { data: request, error: fetchErr } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('id', request_id)
      .single();

    if (fetchErr || !request) throw new Error("Request not found");
    if (request.status !== 'pending') throw new Error("Request not pending");

    const { error: updErr } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', request_id);

    if (updErr) throw updErr;

    const { error: insertErr } = await supabase
      .from('friends')
      .insert([
        { user_id: request.sender_id, friend_id: request.receiver_id },
        { user_id: request.receiver_id, friend_id: request.sender_id }
      ]);
      
    if (insertErr) throw insertErr;
    return request;
  }

  async rejectRequest(request_id) {
    const { error: updErr } = await supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('id', request_id);

    if (updErr) throw updErr;
    return true;
  }

  async getIncoming(user_id) {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        *,
        users!friend_requests_sender_id_fkey (
          id,
          username
        )
      `)
      .eq('receiver_id', user_id)
      .eq('status', 'pending');

    if (error) {
      const { data: fallback, error: fallErr } = await supabase
        .from('friend_requests')
        .select(`*, users (*)`)
        .eq('receiver_id', user_id)
        .eq('status', 'pending');
        
      if (fallErr) throw fallErr;
      return fallback;
    }
    return data;
  }

  async getFriends(user_id) {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        friend_id,
        users!friends_friend_id_fkey (
          id,
          username
        )
      `)
      .eq('user_id', user_id);

    if (error) {
      const { data: fallback, error: fallErr } = await supabase
        .from('friends')
        .select(`friend_id, users (*)`)
        .eq('user_id', user_id);
        
      if (fallErr) throw fallErr;
      return fallback;
    }
    return data;
  }
}

module.exports = new FriendService();
