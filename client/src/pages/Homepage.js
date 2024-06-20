// client/src/pages/Homepage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Homepage = () => {
  const [wifiIP, setWifiIP] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await api.get('/api/users/check-connection');
        const { wifi_ip, exists, username } = response.data;
        setWifiIP(wifi_ip);
        if (exists) {
          setUsername(username);
        }
        setIsConnected(true);
      } catch (error) {
        console.error('Error fetching WiFi IP:', error);
      }
    };

    checkConnection();
  }, []);

  const connect = async () => {
    try {
      await api.post('/api/users/login', { username, wifi_ip: wifiIP });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to LANCast</h1>
      <p>Some information about the web app...</p>
      {isConnected ? (
        <>
          <div>Your WiFi IP: {wifiIP}</div>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={connect}>Connect</button>
        </>
      ) : (
        <button onClick={() => setIsConnected(true)}>Check Connection</button>
      )}
    </div>
  );
};

export default Homepage;
