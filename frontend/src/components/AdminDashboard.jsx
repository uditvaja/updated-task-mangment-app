import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is passed
        },
      });
      setUsers(response.data); // Set the fetched data to state
      console.log(response.data); // Check response
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      setError('Error fetching users');
    }
    console.log("token ", token);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers(); // Refresh user list after deleting
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
            {user.tasks && user.tasks.length > 0 ? (
              <div className="task-list">
                <h4>Tasks assigned to {user.username}:</h4>
                <ul>
                  {user.tasks.map(task => (
                    <li key={task._id}>
                      <p><strong>Task:</strong> {task.description}</p>
                      <p><strong>Status:</strong> {task.status}</p>
                      <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No tasks assigned</p>
            )}
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
