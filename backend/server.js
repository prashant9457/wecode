const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const oldFriendRoutes = require('./routes/friend.routes');
const friendRoutes = require('./src/routes/friendRoutes');

const http = require('http');
const socketManager = require('./src/socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
socketManager.init(server);

// Global Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('WeCode API is running smoothly...');
});

// Mounting Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', oldFriendRoutes); // Dashboard needs /api/feed, /api/friends, /api/dashboard/stats
app.use("/api/social", friendRoutes); // New system at /api/social

// App Listen
server.listen(PORT, () => {
  console.log(`Server optimized and running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});
