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
// const StatsD = require('node-statsd');
const statsd = require('./util/Statsclient');
// const AWS = require('aws-sdk');
const app = express();
const PORT = 8080;
const AWS = require("aws-sdk");
// const StatsD = require('hot-shots');
const cloudwatch = new AWS.CloudWatch({ region: "us-east-1" });
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
const namespace = 'MY_CUSTOM_SPACE';
const metricName = 'custome_api_metric';
const metricValue = 1;

//const AWS = require("aws-sdk");
// const statsd = require('./util/Statsclient');
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

  
  // Below API create the assignment
  app.post('/v1/assignment', basicAuth, createAssignment);

  app.get('/v1/assignment', basicAuth, (req, res, next) => {
    if (req.query.id) {
        console.log('by Id')
        logger.info(`Fetching assignment by ID: ${req.query.id}`);
        statsd.increment('endpoint.hits.v1.assignment.byId');
        return getAssignmentById(req, res, next);
    }
    logger.info('Fetching all assignments');
    statsd.increment('getapi');
    statsd.increment('endpoint.hits.v1.assignment.all');  
    return getAllAssignments(req, res, next);
  });
  
  //Below API delete all the assignment
  app.delete('/v1/assignment', basicAuth, deleteAssignmentById, (req, res, next) => {
    if (req.query.id) {
        logger.info('Assignment deleted ${req.query.id}');
        statsd.increment('deleteapi');
        statsd.increment('endpoint.hits.v1.assignment.all');
    } 
  });
   
  //Below API update the assignment
  app.put('/v1/assignment', basicAuth, updateAssignmentById, (req, res, next) => {
    if (req.query.id) {
      logger.info('Assignment updated ${req.query.id}');
      statsd.increment('putapi');
      statsd.increment('endpoint.hits.v1.assignment.all');
  }
  });
  app.patch('/v1/assignment', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed: Use PUT for full updates or specify fields to update with PATCH.' });
    logger.info('PATCH method is not allowed');
  });
  app.get('/healthz', async (req, res) => {
    try {
      //console.log('healthz')
      logger.info('healthz check initiated');
      await sequelize.authenticate(); // Check the database connectivity
      logger.info('Database connection has been established successfully.');
   
      res.status(200).set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      }).json({ status: 'ok' });
   
    } catch (error) {
      //console.error('Unable to connect to the database:', error);
      logger.error(`Unable to connect to the database: ${error}`);
      res.status(503).set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      }).json({ status: 'error', message: 'Unable to connect to the database' });
    }
  });
  module.exports = app;
