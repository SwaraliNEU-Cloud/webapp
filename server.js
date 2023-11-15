#!/usr/bin/node
// app.js
const app = require('./app');
const express = require('express');
const { Sequelize } = require('sequelize');
// const app = express();
const authenticateToken = require('./middleware/bauth'); // Import your authentication middleware
const assignmentRoutes = require('./routes/assignment'); // Import your assignment routes
// const User = require('../Models/Users');
// const User = require('../Models/Users');
const Assignment = require('./Models/Assignment');
const Users = require('./Models/Users');
const sequelize = require('./Models/db');
const loadUsersFromCSV = require('./util/dataloader');
const processUsers = require('./util/dataprocessor');
const logger = require('./Models/logHelper');
const PORT = 8080;

logger.info("Web App is started..")
Users.hasMany(Assignment, { foreignKey: 'userId', as: 'assignments' });

Assignment.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

sequelize.sync()
    .then(() => loadUsersFromCSV('../opt/user.csv'))
    .then(users => processUsers(users))
    .then(() => {
        console.log("Finished processing users.");
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error:", err);
    });