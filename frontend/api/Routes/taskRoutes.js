const express = require('express');
const Task = require('../models/task');
const User = require('../models/user');  // Import User model
const messaging = require('../firebase');  // Import Firebase messaging
const router = express.Router();
const upload = require('../middleware/multer');
const taskController = require('../controllers/taskController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Import Tasks (with CSV upload)
router.post('/import-csv', verifyToken, upload, taskController.importTasksFromCSV);


// Export Tasks (with CSV download)
router.get('/export-csv', verifyToken,  taskController.exportTasksToCSV);
router.post('/', async (req, res) => {
    const { description, category, assignedTo, dueDate } = req.body;

    if (!description || !category || !assignedTo) {
        return res.status(400).json({ message: 'Description, category, and assignedTo are required.' });
    }

    try {
        const task = new Task({ description, category, assignedTo, dueDate });
        await task.save();

        const user = await User.findById(assignedTo);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.tasks.push(task._id); // Push the task ID to the user's tasks array
        await user.save(); // Save the user after updating

        console.log(`Updated user tasks: ${user.tasks}`); // This should now log the updated tasks array
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
});



// Update Task and notify users
// Update Task and notify users
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, category, assignedTo, status } = req.body;

  try {
      const task = await Task.findByIdAndUpdate(id, { description, category, assignedTo, status }, { new: true });
      
      if (!task) {
          return res.status(404).json({ message: 'Task not found' });
      }

      const user = await User.findById(assignedTo);
      if (user && user.fcmToken) {
          const message = {
              notification: {
                  title: 'Task Updated',
                  body: `Task: ${task.description} has been updated`,
              },
              token: user.fcmToken,
          };

          await messaging.send(message);
          console.log('Notification sent');
      }

      req.io.emit('updateTask', task);
      res.status(200).json(task);
  } catch (error) {
      console.error('Error updating task:', error); // Log the error
      res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});


// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo');  // Populate assignedTo (User)
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
    }
});

// Delete Task

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const task = await Task.findByIdAndDelete(id);
      
      if (!task) {
          return res.status(404).json({ message: 'Task not found' });
      }

      req.io.emit('deleteTask', task);
      res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});


module.exports = router;
