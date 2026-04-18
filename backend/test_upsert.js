const { supabase } = require('./config/db');

async function testUpdate() {
  const userId = 'f23525e5-2de3-4ea2-b28e-fdaa3dd95f38'; // user 'abc'
  try {
    // Simulate what updateProfile does
    console.log("Upserting academic_details...");
    const { data: existing } = await supabase.from('academic_details').select('id').eq('user_id', userId).maybeSingle();
    console.log("Existing record:", existing);

    const payload = {
        user_id: userId,
        college_name: "Test College",
        degree: "B.Tech"
    };

    if (existing) {
        const { error } = await supabase.from('academic_details').update(payload).eq('id', existing.id);
        if (error) throw error;
    } else {
        const { error } = await supabase.from('academic_details').insert(payload);
        if (error) throw error;
    }
    console.log("SUCCESS");
  } catch (err) {
    console.error("FAILURE:", err.message);
  }
}

testUpdate();
