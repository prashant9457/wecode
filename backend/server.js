const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const friendRoutes = require('./routes/friend.routes');

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use('/api', friendRoutes);

// App Listen
const server = app.listen(PORT, () => {
  console.log(`Server optimized and running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});
