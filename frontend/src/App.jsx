import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Tasks from './components/Tasks';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import Navbar from './components/Navbar';
import { requestPermission, onMessageListener } from './firebase';

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
  useEffect(() => {
    // Request permission and listen for messages
    requestPermission();
    onMessageListener().then((payload) => {
      console.log('Message received:', payload);
      // Handle the received notification here
    });
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
              <Tasks />
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
