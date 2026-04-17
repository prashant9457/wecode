const { supabase } = require('../config/db');

const User = {
  async findByEmailOrUsername(email, username) {
    const { data } = await supabase
      .from('users')
      .select('email, username')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();
    return data;
  },

  async findByEmail(email) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return data;
  },

  async findByUsername(username) {
    const { data } = await supabase
      .from('users')
      .select('id, username, email, is_verified, created_at')
      .ilike('username', username.trim())
      .single();
    return data;
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateUser(userId, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async searchUsers(query, excludeId = null) {
    let baseQuery = supabase
      .from('users')
      .select('id, username, email')
      .ilike('username', `%${query}%`);
    
    if (excludeId) {
      baseQuery = baseQuery.neq('id', excludeId);
    }

    const { data, error } = await baseQuery.limit(10);
    if (error) throw error;
    return data;
  },

  async deleteByUsername(username) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('username', username);
    if (error) throw error;
    return true;
  }
};

const CodingProfile = {
  async findByUserId(userId) {
    const { data } = await supabase
      .from('coding_profiles')
      .select('platform, platform_username, last_synced_at')
      .eq('user_id', userId);
    return data || [];
  },

  async updateProfiles(userId, profiles) {
    // Delete old
    await supabase.from('coding_profiles').delete().eq('user_id', userId);
    
    // Insert new
    if (profiles.length > 0) {
      const { error } = await supabase.from('coding_profiles').insert(
        profiles.map(p => ({
          user_id: userId,
          platform: p.platform,
          platform_username: p.platform_username,
          last_synced_at: new Date()
        }))
      );
      if (error) throw error;
    }
    
    const { data } = await supabase.from('coding_profiles').select('*').eq('user_id', userId);
    return data;
  }
};

module.exports = { User, CodingProfile };
