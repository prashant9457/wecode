const { supabase } = require('./config/db');

async function checkTables() {
  const tables = ['user_profiles', 'academic_details', 'technical_profiles', 'skills', 'user_skills'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table} check failed:`, error.message);
    } else {
      console.log(`Table ${table} exists.`);
    }
  }
}

checkTables();
