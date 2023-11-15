
// File: utils/statsdClient.js
const StatsD = require('hot-shots');
const statsd = new StatsD({
  host: 'localhost',
  port: 8125,
  prefix: 'webapp.',
  globalTags: { env: process.env.NODE_ENV },
  errorHandler: (error) => {
    console.error('StatsD error:', error);
  }
});

module.exports = statsd;

 