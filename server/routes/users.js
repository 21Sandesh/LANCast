// server/routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Routes
router.get('/', usersController.getAllUsers);
router.post('/login', usersController.loginUser);
router.post('/logout', usersController.logoutUser);
router.get('/check-connection', usersController.checkConnection);
router.get('/check-user', usersController.checkUser);

module.exports = router;