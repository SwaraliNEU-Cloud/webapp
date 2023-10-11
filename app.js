
const express = require('express');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// // const csv = require('csv-parser');
// // const { Sequelize, DataTypes } = require('sequelize');
// // Import required modules
// const mysql = require('mysql2/promise');
// const fs = require('fs');
const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('swaradb', 'root', 'Sp@17111997',{
//   dialect: 'mysql',
//   host:'localhost'
// });
// const Sequelize = require('../Models/db');
// require('dotenv').config();
const Assignment = require('./Models/Assignment'); // Import your Assignment model
const  User  = require('./Models/Users');
const { createAssignment } = require('./Controllers/Assignment');
const { getAssignmentById } = require('./Controllers/getAssignmentById');
const { getAllAssignments } = require('./Controllers/getAllAssignments');
const { deleteAssignmentById } = require('./Controllers/deleteAssignmentById');
const { updateAssignmentById } = require('./Controllers/updateAssignmentById');
const { checkHealth, healthz } = require('./Controllers/healthcheck');
// server.js

// const { loadCSVDataAndUpdateOrCreate } = require('./util/dataloader.js');
// Define the function to load data

// const PORT = process.env.PORT || 8080;
const basicAuth = require('./middleware/bauth.js'); // Import the basicauth middleware
const assignmentRouter = require('./routes/assignment.js'); // Import the assignments router

const app = express();
const PORT = 8080;

app.use('/assignment', assignmentRouter); // Use the assignments router for /assignments routes

// Sync the Sequelize model with the database and start the server
  app.use(bodyParser.json()); 

  app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
  });
  
  // app.get('/api/assignment',basicAuth,getAssignmentById)
  
  // Below API create the assignment
  app.post('/assignment', basicAuth, createAssignment);
  
  app.get('/assignment', basicAuth, (req, res, next) => {
    if (req.query.id) {
        console.log('by Id')
        return getAssignmentById(req, res, next);
    }
    console.log('All Assignment')
    return getAllAssignments(req, res, next);
  });
  
  //Below API delete all the assignment
  app.delete('/assignment', basicAuth, deleteAssignmentById);
  
  //Below API update the assignment
  app.put('/assignment', basicAuth, updateAssignmentById);
  
 
app.get('/healthz', async (req, res) => {

  try {

    console.log('healthz')

    await sequelize.authenticate(); // Check the database connectivity

   

    res.status(200).set({

      'Cache-Control': 'no-cache, no-store, must-revalidate',

      'Pragma': 'no-cache',

      'X-Content-Type-Options': 'nosniff'

    }).json({ status: 'ok' });

 

  } catch (error) {

    console.error('Unable to connect to the database:', error);

 

    res.status(503).set({

      'Cache-Control': 'no-cache, no-store, must-revalidate',

      'Pragma': 'no-cache',

      'X-Content-Type-Options': 'nosniff'

    }).json({ status: 'error', message: 'Unable to connect to the database' });

  }

});

 
  
  module.exports = app;


//   const basicAuth = async (req, res, next) => {

//     try {

//         console.log('The auth ')
//         if (req.headers.authorization && req.headers.authorization.startsWith('Basic')) {
//             const base64Credentials = req.headers.authorization.split(' ')[1];
//             const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//             const [email, password] = credentials.split(':');
//             const user = await sequelize.models.User.findOne({ where: { email } });
//             if (!user) {
//                 return res.status(401).json({ message: 'Authentication failed' });
//             }
//             const hashedPassword = await bcrypt.hash(password, 10)
//             const isValidPassword = await bcrypt.compare(password, user.password);
//             if (!isValidPassword) {
//                 console.log('Please give correct Credentials')
//                 return res.status(401).json({ message: 'Authentication failed' });
//             }
//             req.user = user;
//             next();
//         } else {
//             res.status(401).json({ message: 'Authentication header missing' });
//         }
//     } catch (error) {

//         res.status(500).json({ message: 'Authentication error', error: error.message });

//     }

// };
// // Create a connection to your MySQL database
// const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: 'Sp@17111997',
//     database: 'swaradb',
//   };


// // Define a function to check the database health
// function checkDatabaseHealth(callback) {
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error getting a database connection:', err);
//       callback(false);
//     } else {
//       connection.query('SELECT 1', (queryErr) => {
//         connection.release(); // Release the connection back to the pool
//         if (queryErr) {
//           console.error('Database query error:', queryErr);
//           callback(false);
//         } else {
//           console.log('Database query successful.');
//           callback(true);
//         }
//       });
//     }
//   });
// }

// app.get('/healthz', (req, res) => {
//   // Check the database health
//   checkDatabaseHealth((isHealthy) => {
//     if (isHealthy) {
//       res.status(200).set({
//         'Cache-Control': 'no-cache, no-store, must-revalidate;',
//         'Pragma': 'no-cache',
//         'X-Content-Type-Options': 'nosniff'
//       }).send();
//     } else {
//       res.status(503).set({
//         'Cache-Control': 'no-cache, no-store, must-revalidate;',
//         'Pragma': 'no-cache',
//         'X-Content-Type-Options': 'nosniff'
//       }).send();
//     }
//   });
// });

// app.all('/healthz', (req, res, next) => {
//   if (req.method !== 'GET') {
//     res.status(405).set({
//       'Cache-Control': 'no-cache, no-store, must-revalidate;',
//       'Pragma': 'no-cache',
//       'X-Content-Type-Options': 'nosniff'
//     }).send();
//     return;
//   }
//   next();
// });

// // Add a shutdown handler to gracefully close the connection pool
// process.on('SIGINT', () => {
//   pool.end((err) => {
//     if (err) {
//       console.error('Error closing the database connection pool:', err);
//     } else {
//       console.log('MySQL connection pool closed.');
//     }
//     process.exit();
//   });
// });


// // Define your User model here
// const User = sequelize.define('User', {
//   // Define user model fields here
//   // For example, name, email, etc.
//   first_name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   last_name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true, // Ensure the email follows the email format
//     },
//   },
// //   password: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //   },

// password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     set(value) {
//       const hashedPassword = bcrypt.hashSync(value, 10); // hashing the password
//       console.log(hashedPassword)
//       this.setDataValue('password', hashedPassword);
//     }
//       },
//   account_created:{
//     type: DataTypes.DATE,
//     allowNull:false,
//     defaultValue: DataTypes.NOW
//   },
//   account_updated:{
//     type: DataTypes.DATE
//   }
//   // Add other fields as needed
// });

// // // Hook to hash the user's password before saving it
// // User.beforeCreate(async (user) => {
// //     const saltRounds = 10; // Adjust the number of salt rounds as needed
// //     const hashedPassword = await bcrypt.hash(user.password, saltRounds);
// //     user.password = hashedPassword;
// //     console.log(hashedPassword);
// //   });
// // Middleware for JSON request parsing
// app.use(bodyParser.json());

// // Update user data by ID
// app.put('/users/:id', async (req, res) => {
//   const userId = req.params.id;
//   const { name, email, first_name } = req.body;

//   try {
//     // Find the user by ID
//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Update user data
//     user.name = name;
//     user.email = email;

//     // Save the updated user
//     await user.save();

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });



// //   async function loadData() {
// //     // Create a connection to your MySQL database
// //     const connection = await mysql.createConnection({
// //       host: 'localhost',         // Your MySQL host
// //       user: 'root',     // Your MySQL username
// //       password: 'Sp@17111997', // Your MySQL password
// //       database: 'swaradb', // Your MySQL database
// //     });
  
// //     try {
// //       // Read the CSV file
// //       const data = fs.readFileSync('../opt/user.csv');
  
// //       // Define the SQL query to load data into your table
// //       const query = `
// //         LOAD DATA LOCAL INFILE 'user.csv'
// //         INTO TABLE Users
// //         FIELDS TERMINATED BY ','
// //         LINES TERMINATED BY '\\n'
// //         IGNORE 1 ROWS; -- Skip the header row
// //       `;
  
// //       // Execute the SQL query to load the data
// //       await connection.query(query);
// //       console.log('Data loaded successfully.');
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //     } finally {
// //       // Close the database connection
// //       connection.close();
// //     }
// //   }
  
// //   // Call the loadData function to start the data loading process
// //   loadData();

//   // server.js



// // Import dataLoader and dataProcessor functions
// // const { loadDataFromFile } = require('./util/dataloader');
// // const { processData } = require('./util/dataprocessor');

// // Load and process data
// // const csvFilePath = 'user.csv'; // Replace with your CSV file path
// // const csvData = loadDataFromFile(csvFilePath);
// // const processedData = processData(csvData);

// // Use processed data in your server logic
// // app.get('/data', (req, res) => {
// //   // Return processed data as JSON
// //   res.json(processedData);
// // });



// // Example route to return processed data as JSON
// app.get('/data', (req, res) => {
//   // You can use the processed data or perform additional queries here
//   // For now, we'll return an empty JSON object
//   res.json({});
// });

// const Assignment = sequelize.define('Assignment', {
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//     },
//     points: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         min: 1,
//         max: 10,
//       },
//     },
//   });

// // Create Assignment
// app.post('/assignment', requireAuth ,async (req, res) => {
//     try {
//       const { title, description, points } = req.body;
//       const assignment = await Assignment.create({ title, description, points });
  
//       res.status(201).json(assignment);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });
  
//   // Update Assignment
//   app.put('/assignment/', async (req, res) => {
//     // const assignmentId = req.params.id;
//     try {
//     const { id } = req.query;
//     console.log(id);
//         // Validating the request body
//         const { title, points, description } = req.body;
//         // console.log(deadline)
//         if (!title && !points && !description) {

//             return res.status(400).json({ message: 'No fields to update were provided' });
//         }
//         // Finding the assignment to update

//         const assignment = await Assignment.findOne({ where: { id } });
//         if (!assignment) {
//             return res.status(404).json({ message: 'Assignment not found' });
//         }
//         if (title) assignment.title = title;
//         if (description) assignment.description = description;
//         if (points) assignment.points = points;
//         // if (deadline) assignment.deadline = deadline;
//          await assignment.save();
//         // Sending the updated assignment in the response
//         res.status(200).json({
//             message: 'Assignment updated successfully',
//             data: assignment
//         });

//     } catch (error) {
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   });
  
//   // Delete Assignment
//   app.delete('/assignment/', async (req, res) => {
//     // const assignmentId = req.params.id;
//     try {
//         // Retrieve ID from the request parameters
//         const { id } = req.query;
//         // Attempt to delete the assignment with the given ID
//         const deletedRowCount = await Assignment.destroy({
//             where: { id: id }
//         });
//         // Check if any rows were deleted
//         if (deletedRowCount === 0) {
//             return res.status(404).json({ message: 'Assignment not found' });
//         }
//         res.status(200).json({ message: 'Assignment deleted successfully' });
//     } catch (error) {
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   });

//   app.get('/assignment',requireAuth,async(req, res) => {

//     if (req.query.id) {
//         console.log('by Id')
//         try {
//             console.log(req.query.id);
//             const id  = req.query.id;
        
//             // const userId = req.user.id;
//             console.log(id)
//             // const attributes = Assignment.rawAttributes;
//             // const fields = Object.keys(attributes);
//             // console.log(fields);
//             console.log('Hello')
//             const assg = await Assignment.findOne({where: { id } })
//             // const assg = await Assignment1.findOne({where: { id: id,userId: userId},
//             // include: [{
//             //         model: User,
//             //         as: 'user', // This should match the alias in your associations
//             //         attributes: ['id', 'first_name', 'last_name', 'email'] // Choose the user attributes you want to fetch
//             //     }]
//             // })
//              // console.log('hello')
//             console.log(assg)
//            // Check if assignment exists
    
//             if (!assg) {
    
//                 return res.status(404).json({ message: 'Assignment not found' });
    
//             }
//             // Structure the response with assignment and user details
//             const responseDetails = {
//                 status: 'success',
//                 message: 'Assignment fetched successfully',
//                 data: {
//                     id: assg.id,
//                     title: assg.title,
//                     points: assg.points,
//                     description: assg.description,
//                     // deadline: assg.deadline,
//                     // assignmentCreated: assg.assignment_created,
//                     // assignmentUpdated: assg.assignment_updated,
//                     // userId: assg.userId,
//                     // useremail: assg.user.email,
//                     // userFName: assg.user.first_name,
//                     // userLName: assg.user.last_name // This will have the associated user details
//                 }
//             };
//             console.log(responseDetails)
//             // Return the structured response
//             res.status(200).json(responseDetails);
//         } catch (error) {
//             return res.status(500).json({ message: "Server error", error: error.message });
//         }
//         // return getAssignmentById(req, res, next);
//     }
//     console.log('All Assignment')
  
//     // return getAllAssignments(req, res, next);
//   });



//   sequelize.sync() // Sync the Sequelize model with the database
//   .then(async () => {
//     await loadCSVDataAndUpdateOrCreate(User, '../opt/user.csv'); // Load and update/create data
//     console.log('Database synchronized and data loaded.');
    
//     // Further processing of data or other server logic can be added here
//   })
//   .catch((error) => {
//     console.error('Error synchronizing database:', error);
//   });
// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// // });

