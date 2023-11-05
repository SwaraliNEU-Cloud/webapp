// Logging
const winston = require('winston');

// Define the logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'var/log/application.log' }),
  ],
});

module.exports = logger
