const User = require('../models/user');

let io;

const initSocket = (server) => {
  const socketIo = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io = socketIo;

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

  });
};

const emitUserStatusUpdate = async () => {
  if (!io) {
    console.error('Socket.io is not initialized');
    return;
  }
  try {
    const users = await User.findAll();
    io.emit('userStatusUpdate', users);
  } catch (err) {
    console.error('Error emitting user status update:', err);
  }
};

const emitFileUpload = (file) => {
  if (!io) {
    console.error('Socket.io is not initialized');
    return;
  }
  io.emit('fileUpload', file);
};

const emitFileDelete = (fileIds) => {
  if (!io) {
    console.error('Socket.io is not initialized');
    return;
  }
  io.emit('fileDelete', fileIds);
};

module.exports = { initSocket, emitUserStatusUpdate, emitFileUpload, emitFileDelete };
