const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  tasks: [TaskSchema]
});

module.exports = mongoose.model('User', UserSchema);