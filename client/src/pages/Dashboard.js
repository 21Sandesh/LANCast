// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import io from 'socket.io-client';
import Chat from '../components/Chat';

const socket = io(process.env.REACT_APP_BACKEND_URL);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    socket.on('userStatusUpdate', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.off('userStatusUpdate');
    };

  }, []);

  const logout = async () => {
    try {
      await api.post('/api/users/logout');
      navigate('/home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <h2>Connected Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.isLoggedIn ? 'Online' : 'Offline'}
            <button onClick={() => setSelectedUser(user)}>Share Files</button>
          </li>
        ))}
      </ul>
      {selectedUser && <Chat user={selectedUser} />}
    </div>
  );
};

export default Dashboard;