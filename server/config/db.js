// server/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // disable logging; default: console.log
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    // Sync all models
    await sequelize.sync({ force: false }); // use { force: true } to drop tables and recreate them
    console.log('All models were synchronized successfully.');

  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

module.exports = { sequelize, connectDB };
