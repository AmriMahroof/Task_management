const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get tasks
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Add task
router.post('/', async (req, res) => {
  const { userId, text } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.tasks.push({ text, completed: false });
    await user.save();
    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error adding task' });
  }
});

// Toggle task
router.put('/toggle', async (req, res) => {
  const { userId, index } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || index < 0 || index >= user.tasks.length) return res.status(400).json({ message: 'Invalid task index' });
    user.tasks[index].completed = !user.tasks[index].completed;
    await user.save();
    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error toggling task' });
  }
});

// Delete task
router.delete('/', async (req, res) => {
  const { userId, index } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || index < 0 || index >= user.tasks.length) return res.status(400).json({ message: 'Invalid task index' });
    user.tasks.splice(index, 1);
    await user.save();
    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;