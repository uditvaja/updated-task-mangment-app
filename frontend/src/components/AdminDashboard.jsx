import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Error fetching users');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      setError('Error deleting user');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="user-list">
        {users.map(user => (
          <div key={user._id} className="user-item">
            <p>{user.username} ({user.email})</p>
            <button 
              className="delete-user-button" 
              onClick={() => handleDeleteUser(user._id)}
            >
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
