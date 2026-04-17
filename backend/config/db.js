const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('CRITICAL: Invalid or missing SUPABASE_URL in .env');
}

if (!supabaseKey) {
  console.error('CRITICAL: Invalid or missing SUPABASE_ANON_KEY in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
