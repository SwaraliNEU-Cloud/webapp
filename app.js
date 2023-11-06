
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
const logger = require('./Models/logHelper');


const app = express();
const PORT = 8080;

// Sync the Sequelize model with the database and start the server
  app.use(bodyParser.json()); 

  app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
  });
  
  
  // Below API create the assignment
  app.post('/v1/assignment', basicAuth, createAssignment);
  
  // app.get('/v1/assignment', basicAuth, (req, res, next) => {
  //   if (req.query.id) {
  //     // Handle the case where an ID is provided in the query parameters
  //     return getAssignmentById(req, res, next);
  //   } else if (req.body) {
  //     // Return a response indicating that a request body is not allowed for GET requests
  //     res.status(400).json({ error: 'No Assignments Found' });
  //   } else {
  //     // Handle the case where no ID or body is provided
  //     console.log('All Assignment');
  //     return getAllAssignments(req, res, next);
  //   }
  // });

  const logAPICalls = (req, res, next) => {
    const start = Date.now;
  
    logger.info(`API Request: ${req.method} ${req.url}`);
    logger.info('Request Headers:', req.headers);
    
    let responseBody = ''; // Initialize an empty string to capture the response body
    
    // Capture the response body when data is received
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
  
    res.on('end', () => {
      const duration = Date.now() - start;
      logger.info(`API Response: ${res.statusCode} (${duration}ms)`);
      logger.info('Response Headers:', res.getHeaders());
      logger.info('Response Body:', responseBody);
  
      next();
    });
  
    next();
  };
  
  app.use(logAPICalls);
  

  app.get('/v1/assignment', basicAuth, (req, res, next) => {
    if (req.query.id) {
        logger.info('by Id')
        return getAssignmentById(req, res, next);
    }
    logger.info('Fetching all assignments');
    logger.info('All Assignment')
    // statsd.increment('endpoint.hits.v1.assignment.all');  
    return getAllAssignments(req, res, next);
  });
  
  //Below API delete all the assignment
  app.delete('/v1/assignment', basicAuth, deleteAssignmentById);
  
  //Below API update the assignment
  app.put('/v1/assignment', basicAuth, updateAssignmentById);


  app.patch('/v1/assignment', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed: Use PUT for full updates or specify fields to update with PATCH.' });
  });
 app.get('/healthz', async (req, res) => {
  logger.info('in healthz')

  try {

    logger.info('healthz')

    await sequelize.authenticate(); // Check the database connectivity

   

    res.status(200).set({

      'Cache-Control': 'no-cache, no-store, must-revalidate',

      'Pragma': 'no-cache',

      'X-Content-Type-Options': 'nosniff'

    }).json({ status: 'ok' });

 

  } catch (error) {

    logger.error('Unable to connect to the database:', error);

 

    res.status(503).set({

      'Cache-Control': 'no-cache, no-store, must-revalidate',

      'Pragma': 'no-cache',

      'X-Content-Type-Options': 'nosniff'

    }).json({ status: 'error', message: 'Unable to connect to the database' });

  }

});

 
  
  module.exports = app;
