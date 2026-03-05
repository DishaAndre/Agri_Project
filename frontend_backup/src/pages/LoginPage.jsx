import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');

  // Predefined credentials
  const credentials = {
    farmer: { email: 'farmer@example.com', password: '23431515Sm' },
    pharma: { email: 'pharma@example.com', password: '23431515Sm' },
    admin: { email: 'admin@example.com', password: '23431515Sm' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
        const { token } = response.data;
        console.log('Received token from API:', token);
        localStorage.setItem('token', token);
        console.log('Stored token:', localStorage.getItem('token'));
        const dashboardMap = {
          farmer: '/farmer-dashboard',
          pharma: '/pharma-dashboard',
          admin: '/admin'
        };
        // For demo, assume role from selection, but actually from token
        window.location.href = dashboardMap[role] || '/';
      } catch (err) {
        console.error('Login failed', err);
        alert('Login failed. Please check credentials or register first.');
      }
    } else {
      try {
        await axios.post('http://localhost:5000/api/register', { email, password, role });
        alert('Registration successful! Please login.');
        setIsLogin(true);
      } catch (err) {
        console.error('Registration failed', err);
        alert('Registration failed: Database not configured.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-l`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 ${!isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-r`}
          >
            Sign Up
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (isLogin) {
                  setEmail(credentials[e.target.value].email);
                  setPassword(credentials[e.target.value].password);
                }
              }}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="farmer">Farmer</option>
              <option value="pharma">Pharma Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;