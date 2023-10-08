// models/Assignment.js

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./db');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    }
  },
  num_of_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  assignment_created: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  assignment_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }

}, {
    // Other model options go here
  });

  
  Assignment.associate = (models) => {
    Assignment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };


  console.log(Assignment === sequelize.models.Assignment);

  module.exports = Assignment



// const { Sequelize, DataTypes } = require('sequelize');
// // const { DataTypes } = require('sequelize');
// // const sequelize = require('../config/config');
// const sequelize = new Sequelize('swaradb', 'root', 'Sp@17111997', {
//     host: 'localhost', // Change to your database host if needed
//     dialect: 'mysql', // Use the appropriate dialect (e.g., 'postgres' for PostgreSQL)
//   });

// const Assignment = sequelize.define('Assignment', {
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.TEXT,
//   },
//   points: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     validate: {
//       min: 1,
//       max: 10,
//     },
//   },
// });

// module.exports = Assignment;
