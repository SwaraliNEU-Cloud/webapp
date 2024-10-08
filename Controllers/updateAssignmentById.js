const Assignment = require('../Models/Assignment');
const logger = require('../Models/logHelper');
const statsd = require('../util/Statsclient');

exports.updateAssignmentById = async (req, res) => {
    // statsd.increment('endpoint.hits.v1.assignment.update'); 
    try {
        // Extracting the ID from the request parameters
        const id = req.params.id;
        const userId = req.user.id;
        // Validating the request body
        const { name, points, num_of_attempts, deadline } = req.body;
        console.log(deadline)
        if (!name && !points && !num_of_attempts && !deadline) {
            return res.status(400).json({ message: 'No fields to update were provided' });
        }
        console.log(id)
        // Finding the assignment to update
        const assignment = await Assignment.findOne({ where: { id } });
        if (!assignment) {
            logger.info('Assignment not found');
            return res.status(404).json({ message: 'Assignment not found' });
        }
        if (assignment.userId !== userId) {
            logger.info('Permission denied');
            return res.status(403).json({ message: 'Forbidden: You do not have permission to update this assignment' });
        }
        // Updating the assignment
        if (name) assignment.name = name;
        if (points) assignment.points = points;
        if (num_of_attempts) assignment.num_of_attempts = num_of_attempts;
        if (deadline) assignment.deadline = deadline;
        await assignment.save();
        logger.info('Assignment updated successfully');
        statsd.increment('endpoint.hits.v1.assignment.update');
        res.status(204).send();   
    } catch (error) {
        logger.info('Server error');
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
