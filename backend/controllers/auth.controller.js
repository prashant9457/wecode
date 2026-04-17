const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const existingUser = await User.findByEmailOrUsername(email, username);
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ error: `${field} already exists` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = await User.createUser({ email, username, password_hash: hashedPassword });

    const token = jwt.sign(
      { userId: data.id, email: data.email, username: data.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User created successfully', 
      token, 
      user: { id: data.id, email: data.email, username: data.username } 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);
  try {
    const user = await User.findByEmail(email);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Password match:', isMatch);
    
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, email: user.email, username: user.username } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server synchronization error.' });
  }
};

const googleAuth = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload); // debug
    const email = payload.email;

    let user = await User.findByEmail(email);

    if (!user) {
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.createUser({
        email,
        username,
        password_hash: hashedPassword,
        is_verified: true
      });
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Google login success",
      token: jwtToken,
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        googlePayload: payload 
      }
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
};

module.exports = { signup, login, googleAuth };
