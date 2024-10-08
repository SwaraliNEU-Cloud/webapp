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
const statsd = require('./util/Statsclient');
const app = express();
const PORT = 8080;
const AWS = require("aws-sdk");
const { createSubmission } = require('./Controllers/submissionController')
// const StatsD = require('hot-shots');
const cloudwatch = new AWS.CloudWatch({ region: "us-east-1" });
const namespace = 'MY_CUSTOM_SPACE';
const metricName = 'custome_api_metric';
const metricValue = 1;

// Sync the Sequelize model with the database and start the server
  app.use(bodyParser.json()); 
  app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
  });

  
  // Below API create the assignment
  app.post('/v2/assignment', basicAuth, createAssignment);

  app.get('/v2/assignment', basicAuth, (req, res, next) => {
   
        console.log('by Id')
        logger.info(`Fetching assignment`);
        statsd.increment('endpoint.hits.v1.assignment.byId');
        
        return getAllAssignments(req, res, next);
    })
    app.get('/v2/assignment/:id', basicAuth, (req, res, next) => {
    logger.info('Fetching all assignments');
    statsd.increment('getapi');
    statsd.increment('endpoint.hits.v1.assignment.all'); 
    return getAssignmentById(req, res, next);
  });
  
  //Below API delete all the assignment
  app.delete('/v2/assignment/:id', basicAuth, deleteAssignmentById, (req, res, next) => {
    if (req.params.id) {
        logger.info('Assignment deleted ${req.query.id}');
        statsd.increment('deleteapi');
        statsd.increment('endpoint.hits.v1.assignment.all');
    } 
  });
   
  //Below API update the assignment
  app.put('/v2/assignment/:id', basicAuth, updateAssignmentById, (req, res, next) => {
    if (req.params.id) {
      logger.info('Assignment updated ${req.query.id}');
      statsd.increment('putapi');
      statsd.increment('endpoint.hits.v1.assignment.put');
  }
  });
  app.patch('/v2/assignment', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed: Use PUT for full updates or specify fields to update with PATCH.' });
    logger.info('PATCH method is not allowed');
  });

  // app.use('/v2/assignment/:id', submissionRoutes);
  app.get('/healthz', async (req, res) => {
    try {
      //console.log('healthz')
      logger.info('healthz check initiated');
      // statsd.gauge('database.connection_success', 1);
      statsd.increment('endpoint.hits.v1.heathz.DB');
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
      // statsd.gauge('database.connection_success', 1);
      // statsd.increment('endpoint.hits.v1.heathz.DB');
      res.status(503).set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      }).json({ status: 'error', message: 'Unable to connect to the database' });
    }
  });


  // New POST route for submissions
app.post('/v2/assignment/:id/submission', basicAuth, createSubmission);
  module.exports = app;
