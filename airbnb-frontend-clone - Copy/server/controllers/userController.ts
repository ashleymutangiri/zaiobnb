import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { inMemoryUsers } from '../dbFallback.js';

const JWT_SECRET = process.env.JWT_SECRET || 'zaiobnb_secret_key_123';

export const login = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    let user: any = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ username, password });
    } else {
      console.log('MongoDB not connected, checking in-memory users fallback');
      user = inMemoryUsers.find(u => u.username === username && u.password === password);
    }
    
    if (user) {
      const id = user._id || user.id;
      const isMongo = mongoose.connection.readyState === 1;
      const token = jwt.sign({ id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id, username: user.username, role: user.role }, isMongo });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

