const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zfbqwanbvrohklthmobh.supabase.co';
const supabaseKey = 'sb_publishable_ODYD3W5GZLdgYjtTMxA4Cg_C84l9EZP';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*').eq('username', 'Codernotfound').single();
  if (error) {
    console.error('Error fetching user Codernotfound:', error);
  } else {
    console.log('User data:', data);
  }
}

checkUsers();
