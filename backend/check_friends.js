const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllFriends() {
    const { data } = await supabase.from('friends').select('*');
    console.log('ALL FRIENDSHIPS IN DB:', data);
}

checkAllFriends();
