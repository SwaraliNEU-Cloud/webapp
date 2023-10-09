// const express = require('express');
// const mysql = require('mysql2');

// const app = express();
// const PORT = 8080;

// // Database configuration
// const pool = mysql.createPool({
//   connectionLimit: 10, // Adjust as needed
//   host: 'localhost',
//   user: 'root',
//   password: 'Sp@17111997',
//   database: 'swaradb'
// });

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

// app.get('/healthz', async (req, res) => {
//   try {
//     console.log('healthz')
//     await sequelize.authenticate(); // Check the database connectivity
//     res.status(200).set({
//       'Cache-Control': 'no-cache, no-store, must-revalidate',
//       'Pragma': 'no-cache',
//       'X-Content-Type-Options': 'nosniff'
//     }).json({ status: 'ok' });
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     res.status(503).set({
//       'Cache-Control': 'no-cache, no-store, must-revalidate',
//       'Pragma': 'no-cache',
//       'X-Content-Type-Options': 'nosniff'
//     }).json({ status: 'error', message: 'Unable to connect to the database' });
//   }
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

// module.exports = {
//   checkHealth,
//   healthz
// };
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../Models/db');

function checkHealth(req, res, next) {
    if (req.method !== 'GET') {
      res.status(405).set({
        'Cache-Control': 'no-cache, no-store, must-revalidate;',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      }).json();
      return;
    }
    next();
  }
  
  function healthz(req, res) {
  //   if (Object.keys(req.query).length > 0) {
      // if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
      console.log(req.body)
      if (Object.keys(req.query).length > 0 || ( req.body && Object.keys(req.body).length > 0))  {
      res.status(400).json();
      return;
    }
  
    pool.query('SELECT 1', (err) => {
      if (err) {
        res.status(503).set({
          'Cache-Control': 'no-cache, no-store, must-revalidate;',
          'Pragma': 'no-cache',
          'X-Content-Type-Options': 'nosniff'
        }).json();
      } else {
        res.status(200).set({
          'Cache-Control': 'no-cache, no-store, must-revalidate;',
          'Pragma': 'no-cache',
          'X-Content-Type-Options': 'nosniff'
        }).json();
      }
    });
  }
  
  module.exports = {
    checkHealth,
    healthz
  };
  