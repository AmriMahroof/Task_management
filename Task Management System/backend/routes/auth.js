const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, tasks: [] });
    await user.save();
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password, otp } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid credentials' });

    if (otp !== '123456') return res.status(400).json({ message: 'Invalid 2FA code' });

    res.json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;