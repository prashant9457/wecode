const axios = require('axios');

async function testSearch() {
    try {
        const res = await axios.get('http://localhost:5000/api/users/search?q=abc', {
            headers: { 'Authorization': 'Bearer YOUR_TOKEN_HERE' }
        });
        console.log('SEARCH RESULTS:', res.data);
    } catch (e) {
        console.error('SEARCH ERROR:', e.response?.data || e.message);
    }
}

// I need a real token to test this, which I don't have.
// But I can check if it returns 401/403 (meaning auth is working but I'm just not sending a token).
testSearch();
