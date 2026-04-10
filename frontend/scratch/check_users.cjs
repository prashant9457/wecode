const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'd:/lenovo/code/Chalo kuch develop kren/wecode/backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('username');
  if (error) {
    console.error('Error fetching users:', error);
  } else {
    console.log('Existing users in DB:', data.map(u => u.username));
  }
}

checkUsers();
