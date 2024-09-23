import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Tasks from './components/Tasks';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import Navbar from './components/Navbar';
import { requestPermission, onMessageListener } from './firebase';
import { io } from 'socket.io-client';
import './App.css';
import CSVUpload from './components/CSVUpload';
import ExportTasksButton from './components/Exporttasks';
import CreateTask from './components/Createtask';
import TaskList from './components/Tasks';
import AlltaskList from './components/AllTaskList';
const socket = io('http://localhost:3000'); 

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
  const [tasks, setTasks] = useState([]); 

  useEffect(() => {
    requestPermission();
    onMessageListener().then((payload) => {
      console.log('Message received:', payload);
    });

  
    socket.on('task-updated', (taskData) => {
      console.log('Task updated:', taskData);
      setTasks((prevTasks) => [...prevTasks, taskData]);
    });

    
    return () => {
      socket.disconnect();
    };
  }, []);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
  
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/csv" element={<CSVUpload />} />
        <Route path="/alltasklist" element={<AlltaskList/>} />
        <Route path="/createtask" element={<CreateTask />} />
        
        <Route path="/csvexport" element={<ExportTasksButton />} />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks tasks={tasks} /> 
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
