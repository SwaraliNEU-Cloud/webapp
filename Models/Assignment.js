// models/Assignment.js
const { Sequelize, DataTypes } = require('sequelize');
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/config');
const sequelize = new Sequelize('swaradb', 'root', 'Sp@17111997', {
    host: 'localhost', // Change to your database host if needed
    dialect: 'mysql', // Use the appropriate dialect (e.g., 'postgres' for PostgreSQL)
  });

const Assignment = sequelize.define('Assignment', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
    },
  },
});

module.exports = Assignment;
