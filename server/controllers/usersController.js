// server/controllers/usersController.js
const User = require('../models/user');
const { emitUserStatusUpdate } = require('../utils/socket');
const os = require('os');

// Helper function to extract clean IP address
const getClientIp = (req) => {
  let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // If IP address is IPv6, it may be prefixed with '::ffff:'
  if (ipAddress && ipAddress.substr(0, 7) === '::ffff:') {
    ipAddress = ipAddress.substr(7);
  }

  return ipAddress;
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { username, wifi_ip } = req.body;

  try {
    let user = await User.findOne({ where: { wifi_ip } });

    if (!user) {
      user = await User.create({ username, wifi_ip, isLoggedIn: true });
    } else {
      await User.update({ isLoggedIn: true }, { where: { wifi_ip } });
    }

    await emitUserStatusUpdate(); // Emit user status update to all clients
    res.json({ message: 'Login successful', user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// User logout
exports.logoutUser = async (req, res) => {
  const wifi_ip = getClientIp(req);

  try {
    const user = await User.findOne({ where: { wifi_ip } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.update({ isLoggedIn: false }, { where: { wifi_ip } });
    await emitUserStatusUpdate(); // Emit user status update to all clients
    res.json({ message: 'Logout successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Fetch WiFi IP
// Check user by IP and return username if exists
exports.checkConnection = async (req, res) => {
  try {
    const clientIP = getClientIp(req);

    const user = await User.findOne({ where: { wifi_ip: clientIP } });

    if (user) {
      res.json({ wifi_ip: clientIP, exists: true, username: user.username });
    } else {
      res.json({ wifi_ip: clientIP, exists: false });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Check if user exists by IP and return username if exists
exports.checkUser = async (req, res) => {
  const wifi_ip = getClientIp(req);

  try {
    const user = await User.findOne({ where: { wifi_ip } });

    if (!user) {
      return res.json({ exists: false });
    }

    res.json({ exists: true, username: user.username });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};