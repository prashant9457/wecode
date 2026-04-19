const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking columns of technical_profiles...");
    const { data, error } = await supabase.from('technical_profiles').select('*').limit(1);
    if (error) {
        console.error("ERROR:", error.message);
    } else {
        console.log("COLUMNS FOUND:", Object.keys(data[0] || {}).join(', '));
    }
}

check();
