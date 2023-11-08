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
// const StatsD = require('node-statsd');
// const statsd = new StatsD();
// const AWS = require('aws-sdk');
const app = express();
const PORT = 8080;
const AWS = require("aws-sdk");
const statsd = require('./util/Statsclient');
// const statsd = new StatsD(statsdConfig);
// const cloudwatch = new AWS.CloudWatch({ region: "us-east-1" });

// Define the metric namespace, metric name, and dimensions
// const params = {
//   MetricData: [
//     {
//       MetricName: "APICalls",
//       Dimensions: [
//         {
//           Name: "APIName",
//           Value: "GET",
//         },
//       ],
//       Unit: "Count",
//       Value: 1, // Increase this value for each API call
//     },
//   ],
//   Namespace: "CustomMetrics", // Namespace for your custom metrics
// };

// // Publish the custom metric
// cloudwatch.putMetricData(params, (err, data) => {
//   if (err) {
//     console.error("Error publishing metric: ", err);
//   } else {
//     console.log("Custom metric published successfully.");
//   }
// });

// Sync the Sequelize model with the database and start the server
  app.use(bodyParser.json()); 
  app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
  });

  // const logAPICalls = (req, res, next) => {
  //   // Log the request method and URL
  //   logger.info(`API Request: ${req.method} ${req.url}`);
  
  //   // Log request headers
  //   logger.info('Request Headers:', req.headers);

  //   logger.info('Request Body:', req.body);
  
  //   // Initialize an empty string to capture the response body
  //   let responseBody = '';
  
  //   // Capture the response body when data is received
  //   res.on('data', (chunk) => {
  //     responseBody += chunk;
  //   });
  
  //   res.on('end', () => {
  //     const duration = Date.now() - req._startTime; // Calculate API call duration
  //     logger.info(`API Response: ${res.statusCode} (${duration}ms)`);
  //     logger.info('Response Headers:', res.getHeaders());
  //     logger.info('Response Body:', responseBody);
  
  //     next(); // Continue processing the request
  //   });
  // };
  // // Add the logAPICalls middleware before your route handlers
  // app.use(logAPICalls);
  
  // Below API create the assignment
  app.post('/v1/assignment', basicAuth, createAssignment);

  app.get('/v1/assignment', basicAuth, (req, res, next) => {
    if (req.query.id) {
        logger.info('get assignment by Id ${req.query.id}')
        return getAssignmentById(req, res, next);
    }
    logger.info('Fetching all assignments');
    statsd.increment('endpoint.hits.v1.assignment.all');
    statsd.increment('event_name');  
    return getAllAssignments(req, res, next);
  });
  
  //Below API delete all the assignment
  app.delete('/v1/assignment', basicAuth, deleteAssignmentById, (req, res, next) => {
    if (req.query.id) {
        logger.info('Assignment deleted ${req.query.id}');
        statsd.increment('endpoint.hits.v1.assignment.all');
    } 
  });
   
  //Below API update the assignment
  app.put('/v1/assignment', basicAuth, updateAssignmentById, (req, res, next) => {
    if (req.query.id) {
      logger.info('Assignment updated ${req.query.id}');
      statsd.increment('endpoint.hits.v1.assignment.all');
  }
  });
 
  app.patch('/v1/assignment', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed: Use PUT for full updates or specify fields to update with PATCH.' });
    logger.info('PATCH method is not allowed');
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
