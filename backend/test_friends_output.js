const { Friend } = require('./models/friend.model');

async function testGrid() {
  const userId = 'e70437f2-c7bf-4c7b-a53f-d3f64ebee1c5';
  try {
    const friends = await Friend.getFriendsByUserId(userId);
    console.log("Friends count:", friends.length);
    console.log("JSON:", JSON.stringify(friends, null, 2));
  } catch (e) {
    console.error(e);
  }
}

testGrid();
