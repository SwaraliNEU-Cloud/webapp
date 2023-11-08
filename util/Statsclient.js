const StatsD = require('node-statsd');

const statsdConfig = {
    graphitePort: 2003,
    graphiteHost: "localhost",
    port: 8125,
    debug: true,
    backends: ["./backends/console", "./backends/graphite"],
    graphite: {
      legacyNamespace: false,
      globalPrefix: "stats",
      prefixCounter: "",
      prefixTimer: "",
      prefixGauge: "",
      prefixSet: ""
    },
    flushInterval: 60000
  };
  
  




// // File: utils/statsdClient.js
// const StatsD = require('hot-shots');
// const statsd = new StatsD({
//   host: 'localhost',
//   port: 8125,
//   prefix: 'your_app_prefix.',
//   globalTags: { env: process.env.NODE_ENV },
//   errorHandler: (error) => {
//     console.error('StatsD error:', error);
//   }
// });
 
// module.exports = statsd;

 