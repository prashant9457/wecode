const axios = require('axios');

async function testFetch() {
  try {
    const res = await axios.get('http://localhost:5000/api/profile/prashant');
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error fetching:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
}

testFetch();
