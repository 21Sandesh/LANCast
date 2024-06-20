// server/models/file.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uniqueName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderIp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiverIp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = File;
