// app.js

const express = require('express');
const app = express();
const authenticateToken = require('./middleware/basicauth'); // Import your authentication middleware
const assignmentRoutes = require('./routes/assignment'); // Import your assignment routes

app.use(express.json());

// Assignments API endpoints
app.use('/api', authenticateToken); // Use authentication middleware for all routes under /api
app.use('/api', assignmentRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
