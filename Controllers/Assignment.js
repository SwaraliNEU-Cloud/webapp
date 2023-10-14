// assignmentController.js
// const { Sequelize, DataTypes, Model } = require('sequelize');
const Assignment = require('../Models/Assignment'); // Import your Assignment model
const Sequelize = require('../Models/db');

// Create an assignment
exports.createAssignment = async (req, res) => {
  try {
    const {
        name, points, num_of_attempts, deadline
    } = req.body;
    const userId = req.user.id;
    // console.log(req.body)
    // 400 Bad Request for invalid input
    if (!name || !points || !num_of_attempts || !deadline) {
        return res.status(400).json({ message: 'Invalid input: All fields are required' });
    }
    // 401 Unauthorized if user id is not present
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const newAssignment = await Sequelize.models.Assignment.create({
        name,
        points,
        num_of_attempts,
        deadline,
        userId
    });

    res.status(201).json({ message: 'Assignment created successfully', data: newAssignment });
} catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
}
};
  

// Get all assignments
// exports.getAllAssignments = async (req, res) => {
//   try {
//     const assignment = await Assignment.findAll();
//     res.status(200).json(assignment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Update an assignment by ID
// exports.updateAssignment = async (req, res) => {
//   const assignmentId = req.params.id;
//   try {
//     const assignment = await Assignment.findByPk(assignmentId);

//     if (!assignment) {
//       return res.status(404).json({ error: 'Assignment not found' });
//     }

//     // Update assignment properties (excluding assignment_created and assignment_updated)
//     assignment.title = req.body.title;
//     assignment.description = req.body.description;
//     assignment.points = req.body.points;

//     await assignment.save();

//     res.status(200).json(assignment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
