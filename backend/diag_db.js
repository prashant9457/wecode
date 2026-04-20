const { supabase } = require('./config/db');
require('dotenv').config();

async function test() {
    const userId = 'f23525e5-2de3-4ea2-b28e-fdaa3dd95f38';
    console.log('Testing Friends for:', userId);

    const { data: friends, error: fErr } = await supabase
        .from('friends')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
    
    console.log('Friends Table results:', friends?.length || 0);
    console.log(JSON.stringify(friends, null, 2));

    const { data: requests, error: rErr } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'accepted');
    
    console.log('Accepted Requests results:', requests?.length || 0);
    console.log(JSON.stringify(requests, null, 2));
}

test();
