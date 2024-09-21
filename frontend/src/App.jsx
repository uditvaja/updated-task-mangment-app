import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Tasks from './components/Tasks';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import Navbar from './components/Navbar';
import { requestPermission, onMessageListener } from './firebase';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust this URL based on your backend

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return token && role === 'admin' ? children : <Navigate to="/login" />;
};

const App = () => {
  const [tasks, setTasks] = useState([]); // State to manage tasks

  useEffect(() => {
    requestPermission();
    onMessageListener().then((payload) => {
      console.log('Message received:', payload);
    });

    // Listen for task updates from the server
    socket.on('task-updated', (taskData) => {
      console.log('Task updated:', taskData);
      setTasks((prevTasks) => [...prevTasks, taskData]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks tasks={tasks} /> {/* Pass tasks to Tasks component */}
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
