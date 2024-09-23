const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const taskRoutes = require('./Routes/taskRoutes');
const userRoutes = require('./Routes/userRoutes');
const { verifyToken, isAdmin } = require('./middleware/authMiddleware');
const serviceAccount = require('./firebase-service-account.json');
const admin = require('firebase-admin');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const cron = require('node-cron');

app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
const server = http.createServer(app);
const io = socketIo(server,{
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
    credentials: true 
  },
});
  
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/taskManagement', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', verifyToken, taskRoutes);
app.use('/api/users',  userRoutes);
 

cron.schedule('0 8 * * *', async () => { 
    const tasks = await Task.find({ dueDate: { $lte: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) } });
    tasks.forEach(task => {
        if (task.assignedTo) {
            User.findById(task.assignedTo).then(user => {
                if (user && user.token) {
                    const payload = {
                        notification: {
                            title: 'Task Due Reminder',
                            body: `Your task "${task.description}" is due tomorrow.`
                        }
                    };
                    messaging.sendToDevice(user.token, payload);
                }
            });
        }
    });
});

// Socket.IO Setup
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Listen for task updates and broadcast to all clients
    socket.on('updateTask', (task) => {
        io.emit('taskUpdated', task);
    });

    // Listen for new tasks and broadcast to all clients
    socket.on('newTask', (task) => {
        io.emit('taskCreated', task);
    });

    // Listen for task deletion and broadcast to all clients
    socket.on('deleteTask', (taskId) => {
        io.emit('taskDeleted', taskId);
    });
});

// Use server.listen to start both HTTP and Socket.IO
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
