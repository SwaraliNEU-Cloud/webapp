
const express = require('express');
const bodyParser = require('body-parser');
const  sequelize = require('./Models/db')
const Assignment = require('./Models/Assignment'); // Import your Assignment model
const  User  = require('./Models/Users');
const { createAssignment } = require('./Controllers/Assignment');
const { getAssignmentById } = require('./Controllers/getAssignmentById');
const { getAllAssignments } = require('./Controllers/getAllAssignments');
const { deleteAssignmentById } = require('./Controllers/deleteAssignmentById');
const { updateAssignmentById } = require('./Controllers/updateAssignmentById');
const { checkHealth, healthz } = require('./Controllers/healthcheck');
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
  app.post('/v1/assignment', basicAuth, createAssignment);
  
  app.get('/v1/assignment', basicAuth, (req, res, next) => {
    if (req.query.id) {
      // Handle the case where an ID is provided in the query parameters
      return getAssignmentById(req, res, next);
    } else if (req.body) {
      // Return a response indicating that a request body is not allowed for GET requests
      res.status(400).json({ error: 'Request body is not allowed for GET requests' });
    } else {
      // Handle the case where no ID or body is provided
      console.log('All Assignment');
      return getAllAssignments(req, res, next);
    }
  });
  
  //Below API delete all the assignment
  app.delete('/v1/assignment', basicAuth, deleteAssignmentById);
  
  //Below API update the assignment
  app.put('/v1/assignment', basicAuth, updateAssignmentById);


  app.patch('/v1/assignment', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed: Use PUT for full updates or specify fields to update with PATCH.' });
  });
  
 
app.get('/healthz', async (req, res) => {
  console.log('in healthz')

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
