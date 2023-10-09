
// app.js
const app = require('./app');
const express = require('express');
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
const PORT = 8080;

loadUsersFromCSV('../opt/user.csv')
    .then(users => {
        return processUsers(users);
    })
    .then(() => {
        console.log("Finished processing users.");
        
        // Setup model relationships
        Users.hasMany(Assignment, { foreignKey: 'userId', as: 'assignments' });
        Assignment.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

        // Sync models with database and start the server
        sequelize.sync().then(() => {
            app.listen(PORT, () => {
                console.log(`Server started on http://localhost:${PORT}`);
            });
        });
    })
    .catch(err => {
        console.error("Error:", err);
    });
