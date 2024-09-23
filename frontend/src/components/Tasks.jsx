import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Tasks.css'; // Make sure to style this file properly for better UI

const socket = io('http://localhost:3000');

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ description: '', category: '', assignedTo: '', dueDate: '', status: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchTasks();

    // Socket.io event listeners
    socket.on('taskCreated', (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on('taskDeleted', (deletedTaskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletedTaskId));
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, []);

  const user = localStorage.getItem('user');

  const handleCreateTask = async () => {
    try {
      if (!newTask.description || !newTask.category || !newTask.dueDate || !newTask.status) {
        setError('All fields are required.');
        return;
      }

      const taskToCreate = {
        ...newTask,
        assignedTo: user, // Automatically set assignedTo based on logged-in user
      };

      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToCreate),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTask({ description: '', category: '', assignedTo: '', dueDate: '', status: '' });
      setError('');
    } catch (error) {
      console.error(error.message);
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = (task) => {
    setEditingTask(task);
    setNewTask({
      description: task.description,
      category: task.category,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      status: task.status,
    });
  };

  const handleSaveTask = async () => {
    try {
      if (!newTask.description || !newTask.category || !newTask.dueDate || !newTask.status) {
        setError('All fields are required.');
        return;
      }

      const taskToUpdate = {
        ...newTask,
        assignedTo: user,
      };

      const response = await fetch(`http://localhost:3000/api/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      setEditingTask(null);
      setNewTask({ description: '', category: '', assignedTo: '', dueDate: '', status: '' });
      setError('');
    } catch (error) {
      console.error('Failed to update task:', error);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="task-container">
    <h4>{editingTask ? 'Edit Task' : 'Create Task'}</h4>
    <input
      type="text"
      placeholder="Description"
      value={newTask.description}
      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
    />
    <input
      type="text"
      placeholder="Category"
      value={newTask.category}
      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
    />
    <input
      type="date"
      placeholder="Due Date"
      value={newTask.dueDate}
      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
    />
    <select
      value={newTask.status}
      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
    >
      <option value="">Select Status</option>
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>
    <button onClick={editingTask ? handleSaveTask : handleCreateTask} className="btn-submit">
      {editingTask ? 'Save Task' : 'Add Task'}
    </button>
  
    <h3>Task List</h3>
    {error && <p className="error-message">{error}</p>}
    <ul className="task-list">
    {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <div className="task-details">
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {task.status}</p>
            </div>
            <div className="task-actions">
              <button onClick={() => handleUpdateTask(task)} className="btn-edit">Edit</button>
              <button onClick={() => handleDeleteTask(task._id)} className="btn-delete">Delete</button>
            </div>
          </li>
        ))}

    </ul>
  </div>
  
  );
};

export default TaskList;
