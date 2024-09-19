// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // We'll define styles in Navbar.css

const Navbar = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Task Management</Link>
      </div>
      <div className="navbar-links">
        {token && role === 'admin' && <Link to="/admin-dashboard">Admin Dashboard</Link>}
        {token && <Link to="/tasks">Tasks</Link>}
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
