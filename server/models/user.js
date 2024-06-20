
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const File = require('../models/file'); // Import File model

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true, // Allow username to be null
  },
  wifi_ip: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  isLoggedIn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = User;
