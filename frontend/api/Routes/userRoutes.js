const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Get all users
// Get all users and populate tasks
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('tasks'); // This is critical for populating tasks
        res.json(users);
        console.log(`Updated user tasks: ${users.tasks}`);
    } catch (error) {
        console.error('Error fetching users and tasks:', error);
        res.status(500).send('Error fetching users and tasks');
    }
  
});



// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.send('User deleted');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

module.exports = router;
