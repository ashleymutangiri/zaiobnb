import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { inMemoryUsers } from '../dbFallback.js';

const JWT_SECRET = process.env.JWT_SECRET || 'zaiobnb_secret_key_123';

export const signup = async (req: any, res: any) => {
  try {
    const { username, password, role } = req.body;
    let user: any = null;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const assignedRole = role || 'user';

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      user = new User({ username, password, role: assignedRole });
      await user.save();
    } else {
      console.log('MongoDB not connected, using in-memory fallback for signup');
      const existingUser = inMemoryUsers.find(u => u.username === username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      user = {
        id: 'u' + (inMemoryUsers.length + 1).toString(),
        username,
        password,
        role: assignedRole
      };
      inMemoryUsers.push(user);
    }
    
    if (user) {
      const id = user._id || user.id;
      const isMongo = mongoose.connection.readyState === 1;
      const token = jwt.sign({ id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id, username: user.username, role: user.role }, isMongo });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};
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

