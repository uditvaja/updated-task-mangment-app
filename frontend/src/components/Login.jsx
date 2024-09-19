import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.user.role);
      
          // Request push notification permission after login
          const fcmToken = await requestPermission();
          
          // Send the FCM token to backend
          await axios.post('http://localhost:3000/api/users/save-fcm-token', { fcmToken });
          
          // Redirect based on role
          if (response.data.user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/tasks');
          }
        } catch (error) {
          setError('Login failed. Please check your credentials.');
        }
      };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
