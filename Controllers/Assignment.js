// assignmentController.js
const Assignment = require('../Models/Assignment'); // Import your Assignment model
const Sequelize = require('../Models/db');
const logger = require('../Models/logHelper');
const statsd = require('../util/Statsclient');
// Create an assignment
exports.createAssignment = async (req, res) => {
    // statsd.increment('endpoint.hits.v1.assignment.create');  
  try {
    const {
        name, points, num_of_attempts, deadline
    } = req.body;
    const userId = req.user.id;    
    if (!name || !points || !num_of_attempts || !deadline) {
        logger.info('Bad Request');
        statsd.increment('endpoint.hits.v1.assignment.create');
        return res.status(400).json({ message: 'Invalid input: All fields are required' });
    }
    if (!Number.isInteger(points) || points < 0) {
        logger.info('Bad Request: Points must be a non-negative integer');
        statsd.increment('endpoint.hits.v1.assignment.create');
        return res.status(400).json({ message: 'Invalid input: Points must be a non-negative integer' });
    }
        if (!req.user || !req.user.id) {
            logger.info('Unathorized');
            statsd.increment('endpoint.hits.v1.assignment.create');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const newAssignment = await Sequelize.models.Assignment.create({
        name,
        points,
        num_of_attempts,
        deadline,
        userId
    });
    logger.info('Assignment created successfully');
    statsd.increment('endpoint.hits.v1.assignment.create');
    res.status(201).json({ message: 'Assignment created successfully', data: newAssignment });
} catch (error) {
    logger.info('Server error');
    return res.status(500).json({ message: "Server error", error: error.message });
}
};
  

