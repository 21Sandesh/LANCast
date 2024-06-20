// client/src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import ConfigPage from './pages/ConfigPage';

const App = () => {
  const [proxyConfig, setProxyConfig] = useState(null);

  useEffect(() => {
    fetchProxyConfiguration();
  }, []);

  const fetchProxyConfiguration = async () => {
    try {
      const response = await fetch('/api/proxy');
      if (response.ok) {
        const data = await response.json();
        setProxyConfig(data.proxy);
      } else {
        console.error('Failed to fetch proxy configuration');
      }
    } catch (error) {
      console.error('Error fetching proxy configuration:', error);
    }
  };

  if (!proxyConfig) {
    return <div>Loading...</div>; // Optional loading state while fetching configuration
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConfigPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
