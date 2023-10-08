const basicAuth = require('basic-auth');

// Define a function to enforce Basic Authentication
function requireAuth(req, res, next) {
  const credentials = basicAuth(req);

  if (!credentials || !isValidCredentials(credentials)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"');
    return res.status(401).send('Unauthorized');
  }

  // Attach user information to the request for later use
  req.user = { username: credentials.name };

  // Continue to the next middleware or route handler
  next();
}

// Verify the provided username and password (replace with your logic)
function isValidCredentials(credentials) {
  const validUsers = [
    { username: 'swarali.patil@gmail.com', password: 'swara123' },
    { username: 'user2', password: 'password2' },
  ];

  const user = validUsers.find((validUser) => {
    return (
      validUser.username === credentials.name &&
      validUser.password === credentials.pass
    );
  });

  return !!user;
}

module.exports = requireAuth;




// // middleware/auth.js

// const jwt = require('jsonwebtoken');
// const { SECRET_KEY } = require('../config'); // Load your secret key from a configuration file

// function authenticateToken(req, res, next) {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   jwt.verify(token, SECRET_KEY, (error, user) => {
//     if (error) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     req.user = user;
//     next();
//   });
// }

// module.exports = authenticateToken;

// const{User} = require('./Models/User');
// const bcrypt = require('bcryptjs');
// const sequelize = require('./')


