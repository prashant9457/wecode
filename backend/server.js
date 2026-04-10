const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

let supabase;
try {
  if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
    console.error('CRITICAL: Invalid or missing SUPABASE_URL in .env');
  } else if (!supabaseKey || supabaseKey === 'your_supabase_anon_key') {
    console.error('CRITICAL: Invalid or missing SUPABASE_ANON_KEY in .env');
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully.');
  }
} catch (err) {
  console.error('Failed to initialize Supabase:', err.message);
}

app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Auth Routes (Custom implementation with hashing and JWT)
app.post('/api/signup', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  const { email, password, username, first_name, last_name, institute, department, year } = req.body;

  try {
    // 1. Check if user/email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email, username')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ error: `${field} already exists` });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save user to database
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        email, 
        username,
        password_hash: hashedPassword, 
        first_name, 
        last_name,
        institute,
        department,
        year,
        last_login: new Date()
      }])
      .select()
      .single();

    if (error) throw error;

    // 4. Generate JWT
    const token = jwt.sign({ userId: data.user_id, email: data.email, username: data.username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ message: 'User created successfully', token, user: { email: data.email, username: data.username } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  const { email, password } = req.body;

  try {
    // 1. Find user in 'users' table
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(400).json({ error: 'Invalid credentials' });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // 3. Update last_login
    await supabase
      .from('users')
      .update({ last_login: new Date() })
      .eq('user_id', user.user_id);

    // 4. Generate JWT
    const token = jwt.sign({ userId: user.user_id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: 'Login successful', token, user: { email: user.email, username: user.username } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Profile Routes
app.get('/api/profile/:username', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  const { username } = req.params;

  try {
    const cleanUsername = username.trim();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', cleanUsername)
      .single();

    // Let's also fetch all users to see if it's a structural issue
    let allUsersSnippet = [];
    if (error || !data) {
       const { data: allUsers } = await supabase.from('users').select('username').limit(5);
       allUsersSnippet = allUsers || [];
       console.error('Profile fetch error for', cleanUsername, ':', error);
       console.error('Available first 5 users:', allUsersSnippet);
       return res.status(404).json({ error: 'Profile not found', details: error, available: allUsersSnippet, attemptedUser: cleanUsername });
    }

    // Fetch user links
    const { data: linksData } = await supabase
      .from('user_links')
      .select('platform_name, url')
      .eq('user_id', data.user_id);
    
    data.links = linksData || [];

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profile/:username', authenticateToken, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  const { username } = req.params;
  const updateData = req.body;

  // Ensure user is only updating their own profile
  if (req.user.username !== username) {
    return res.status(403).json({ error: 'Unauthorized to update this profile' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: updateData.first_name,
        last_name: updateData.last_name,
        phone_number: updateData.phone_number,
        profile_picture: updateData.profile_picture,
        institute: updateData.institute,
        department: updateData.department,
        year: updateData.year,
      })
      .eq('username', username)
      .select()
      .single();

    if (error) throw error;

    // Handle user links updating
    if (updateData.links && Array.isArray(updateData.links)) {
      // 1. Delete old links
      await supabase.from('user_links').delete().eq('user_id', req.user.userId);
      
      // 2. Insert new ones if there are any
      if (updateData.links.length > 0) {
        const linksToInsert = updateData.links.map(l => ({
          user_id: req.user.userId,
          platform_name: l.platform_name,
          url: l.url
        }));
        await supabase.from('user_links').insert(linksToInsert);
      }
    }

    res.status(200).json({ message: 'Profile updated successfully', profile: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/profile/:username', authenticateToken, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  const { username } = req.params;

  // Ensure user is only deleting their own profile
  if (req.user.username !== username) {
    return res.status(403).json({ error: 'Unauthorized to delete this profile' });
  }

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('username', username);

    if (error) throw error;

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
