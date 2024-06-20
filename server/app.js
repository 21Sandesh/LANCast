const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/files');
const configRoutes = require('./routes/config');
require('dotenv').config();
const http = require('http');
const { initSocket } = require('./utils/socket');
const { getLocalIP } = require('./utils/ipUtils');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', true);

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/config', configRoutes); // Mount configuration endpoint

// Connect to Database
connectDB();

// Initialize Socket
initSocket(server);

// Serve proxy configuration dynamically
app.get('/api/proxy', (req, res) => {
  const localIP = getLocalIP();
  const proxyConfig = `http://${localIP}:${process.env.PORT || 8800}`;
  res.json({ proxy: proxyConfig });
});

// Start server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Server running - http://localhost:${PORT}`);
});
