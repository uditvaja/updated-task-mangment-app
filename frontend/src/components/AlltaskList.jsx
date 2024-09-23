// TaskList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './allTasks.css'; // Ensure your styles are imported
import ExportTasksButton from './Exporttasks';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

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
  }, []);

  return (
    <div className="task-list-container">
      <h3>Task List</h3>
      <Link to="/createtask" className="btn-create">Create Task</Link>
   
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <div className="task-details">
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {task.status}</p>
            </div>
          </li>
        ))}
      </ul>
     
    </div>
  );
};

export default TaskList;
