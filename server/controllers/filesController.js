// server/controllers/filesController.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/file');
const { emitFileUpload, emitFileDelete } = require('../utils/socket');

const getClientIp = (req) => {
  let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (ipAddress && ipAddress.substr(0, 7) === '::ffff:') {
    ipAddress = ipAddress.substr(7);
  }

  return ipAddress;
};

// Upload File
exports.uploadFile = async (req, res) => {
  const { receiverIp } = req.body;
  const file = req.file;
  const senderIp = getClientIp(req);

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const uniqueName = uuidv4();
  const uploadDir = path.join(__dirname, '..', 'uploads', senderIp);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, uniqueName);

  fs.renameSync(file.path, filePath);

  try {
    const newFile = await File.create({
      uniqueName,
      originalName: file.originalname,
      senderIp,
      receiverIp,
      filePath,
    });

    // Emit file upload event to WebSocket clients
    emitFileUpload(newFile);

    res.status(201).json({ message: 'File uploaded successfully', file: newFile });

  } catch (error) {
    console.error('Error saving file to database:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Get File History
exports.getFileHistory = async (req, res) => {
  const { receiverIp } = req.params;
  const userIp = getClientIp(req);

  try {
    const filesSent = await File.findAll({
      where: {
        senderIp: userIp,
        receiverIp,
      },
      order: [['createdAt', 'ASC']],
    });

    const filesReceived = await File.findAll({
      where: {
        senderIp: receiverIp,
        receiverIp: userIp,
      },
      order: [['createdAt', 'ASC']],
    });

    const files = [...filesSent, ...filesReceived];

    res.json({ files });

  } catch (error) {
    console.error('Error fetching file history:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Download File
exports.downloadFile = async (req, res) => {
  const { uniqueName } = req.params;
  const userIp = getClientIp(req);

  try {
    const file = await File.findOne({ where: { uniqueName } });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.senderIp !== userIp && file.receiverIp !== userIp) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.download(file.filePath, file.originalName);

  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete Files
exports.deleteFiles = async (req, res) => {
  const { fileIds } = req.body;

  try {
    // Fetch files from database
    const filesToDelete = await File.findAll({
      where: {
        id: fileIds,
      },
    });

    // Delete files from file system and database
    filesToDelete.forEach(async (file) => {
      // Delete file from file system
      fs.unlinkSync(file.filePath);

      // Delete file from database
      await file.destroy();
    });

    // Emit file delete event to WebSocket clients
    emitFileDelete(fileIds);

    res.json({ message: 'Files deleted successfully' });

  } catch (error) {
    console.error('Error deleting files:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};