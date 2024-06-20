// server/routes/files.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const filesController = require('../controllers/filesController');

const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

router.post('/upload', upload.single('file'), filesController.uploadFile);
router.get('/history/:receiverIp', filesController.getFileHistory);
router.get('/download/:uniqueName', filesController.downloadFile);
router.delete('/delete', filesController.deleteFiles);

module.exports = router;