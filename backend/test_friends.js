const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testStats() {
    // Current user id (from my earlier check_users test, let's use dukestark's id or abc's id)
    const userId = 'f23525e5-2de3-4ea2-b28e-fdaa3dd95f38'; // abc
    
    // 1. Get friends
    const { data: relationData } = await supabase.from('friends').select('friend_id').eq('user_id', userId);
    console.log('RELATIONS:', relationData);

    const friendIds = relationData.map(f => f.friend_id);
    const { data: userData } = await supabase.from('users').select('id, username').in('id', friendIds);
    console.log('FRIEND USERS IN DB:', userData);
}

testStats();
