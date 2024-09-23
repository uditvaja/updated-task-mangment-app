const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendNotification } = require('../services/firebaseService');

// Register User
const user = await User.findById(assignedTo);
if (user && user.fcmToken) {
  const message = {
    notification: {
      title: 'New Task Assigned',
      body: `You have been assigned a task: ${description}`,
    },
    token: user.fcmToken, // Use the FCM token stored in the user's document
  };
  await messaging.send(message);
}
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const user = new User({ username, email, password, role });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const fcmToken = req.body.fcmToken;
if (fcmToken) {
  user.fcmToken = fcmToken;
  await user.save();
}


const assignTask = async (req, res) => {
    try {
      const { taskId, assignedTo, description } = req.body;
      // Assign task to the user
      const task = await Task.findById(taskId);
      task.assignedTo = assignedTo;
      await task.save();
  
      // Fetch FCM token for assigned user from DB
      const user = await User.findById(assignedTo);
      const fcmToken = user.fcmToken; // Assume users have an fcmToken field
  
      // Send Notification
      const message = {
        title: 'New Task Assigned',
        body: `You have been assigned a new task: ${description}`,
      };
      sendNotification(fcmToken, message);
  
      res.status(200).json({ message: 'Task assigned successfully', task });
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign task' });
    }
  };
// Login User
// Login User
exports.login = async (req, res) => {
    const { email, password, fcmToken } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        user.fcmToken = fcmToken;
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTask = async (req, res) => {
    const { description, category } = req.body;
    
    // Validate input
    if (!description || !category) {
        return res.status(400).json({ message: 'Description and category are required' });
    }
    
    try {
        const task = new Task({ description, category, user: req.user.id });
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};