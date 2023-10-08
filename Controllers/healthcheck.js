const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 8080;

// Database configuration
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust as needed
  host: 'localhost',
  user: 'root',
  password: 'Sp@17111997',
  database: 'swaradb'
});

// Define a function to check the database health
function checkDatabaseHealth(callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting a database connection:', err);
      callback(false);
    } else {
      connection.query('SELECT 1', (queryErr) => {
        connection.release(); // Release the connection back to the pool
        if (queryErr) {
          console.error('Database query error:', queryErr);
          callback(false);
        } else {
          console.log('Database query successful.');
          callback(true);
        }
      });
    }
  });
}

app.get('/healthz', (req, res) => {
  // Check the database health
  checkDatabaseHealth((isHealthy) => {
    if (isHealthy) {
      res.status(200).set({
        'Cache-Control': 'no-cache, no-store, must-revalidate;',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      }).send();
    } else {
      res.status(503).set({
        'Cache-Control': 'no-cache, no-store, must-revalidate;',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      }).send();
    }
  });
});

app.all('/healthz', (req, res, next) => {
  if (req.method !== 'GET') {
    res.status(405).set({
      'Cache-Control': 'no-cache, no-store, must-revalidate;',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }).send();
    return;
  }
  next();
});

// Add a shutdown handler to gracefully close the connection pool
process.on('SIGINT', () => {
  pool.end((err) => {
    if (err) {
      console.error('Error closing the database connection pool:', err);
    } else {
      console.log('MySQL connection pool closed.');
    }
    process.exit();
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
