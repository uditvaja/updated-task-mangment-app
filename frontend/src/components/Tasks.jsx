import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Tasks.css';
const socket = io('http://localhost:3000');

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ description: '', category: '' });
  const [editingTask, setEditingTask] = useState(null);

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
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
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

  const handleCreateTask = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const createdTask = await response.json();
      setNewTask({ description: '', category: '' }); // Clear input fields
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdateTask = async (task) => {
    setEditingTask(task);
    setNewTask({ description: task.description, category: task.category });
  };

  const handleSaveTask = async (taskId, updatedTask) => {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        const data = await response.json();
        console.log('Task updated:', data);
        // Update local state if necessary
    } catch (error) {
        console.error('Failed to update task:', error);
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

      const data = await response.json();
      console.log(data.message); // Log success message
      // Update local state to remove the deleted task if necessary
  } catch (error) {
      console.error('Failed to delete task:', error);
  }
};


  return (
    <div>
      <h3>Task List</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.description} ({task.category})
            <button onClick={() => handleUpdateTask(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
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
      <button onClick={editingTask ? handleSaveTask : handleCreateTask}>
        {editingTask ? 'Save' : 'Add Task'}
      </button>
    </div>
  );
};

export default TaskList;
