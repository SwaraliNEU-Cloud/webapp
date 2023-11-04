const  Assignment  = require('../Models/Assignment');
const User = require('../Models/Users');  // Using the model file you've shared

exports.getAllAssignments = async (req, res) => {
    try {
        if (req.body && Object.keys(req.body).length > 0) {
            return res.status(400).json({ message: 'Request body is not allowed in GET request' });
        }
        const userId = req.user.id;
        const assignment = await Assignment.findAll({            
        });
        if (!assignment || assignment.length === 0) {
            return res.status(404).json({ message: 'No assignments found' });
        }
        console.log(assignment)
        res.status(200).json({
            status: 'success',
            message: 'Assignments fetched successfully',
            data: assignment
        });
    } catch (error) {
    // return res.status(500).json({ message: "Server error", error: error.message });
    console.error("An error occurred while fetching assignments:", error); // Log detailed error server-side

    if (error.message && error.message.includes("ECONNREFUSED")) {
        // Database connection error
        return res.status(503).json({ message: 'Service unavailable. Please try again later.' });
    }

    // Other types of errors
    return res.status(500).json({ message: 'An error occurred while fetching assignments.' });
    }
};