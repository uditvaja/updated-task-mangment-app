// CreateTask.jsx
import React, { useState } from 'react';
import CSVUpload from './CSVUpload';
import { Link, redirect, useNavigate } from 'react-router-dom';
import Alltasklist from '../components/AlltaskList'
const CreateTask = () => {
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState({
    description: '',
    category: '',
    assignedTo: '',
    dueDate: '',
    status: '',
  });
  const [error, setError] = useState('');

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
      // Redirect or reset the form as needed
      setNewTask({ description: '', category: '', assignedTo: '', dueDate: '', status: '' });
      setError('');
    } catch (error) {
      console.error(error.message);
      setError('Failed to create task');
    }
  };

  return (
    <div className="create-task-container">
      <h4>Create Task</h4>
      {error && <p className="error-message">{error}</p>}
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
      <button onClick={handleCreateTask} className="btn-submit">Add Task</button>
      
      <div>
        <CSVUpload/>
      </div>
    </div>
  );
};

export default CreateTask;
