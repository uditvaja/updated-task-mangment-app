import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Ensure this URL is correct

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch initial tasks
    fetch('/api/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));

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

  return (
    <div>
      <h3>Task List</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>{task.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
