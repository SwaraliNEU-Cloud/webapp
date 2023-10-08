// assignmentController.js

const Assignment = require('../models/Assignment'); // Import your Assignment model
const Sequelize = require('./models/db');

// Create an assignment
exports.createAssignment = async (req, res) => {
    try {
      const { title, description, points } = req.body;
      const assignment = await Assignment.create({
        title,
        description,
        points,
        creatorUserId: req.user.userId, // Assign the authenticated user's ID as the creator
      });
  
      res.status(201).json(assignment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignment = await Assignment.findAll();
    res.status(200).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an assignment by ID
exports.updateAssignment = async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Update assignment properties (excluding assignment_created and assignment_updated)
    assignment.title = req.body.title;
    assignment.description = req.body.description;
    assignment.points = req.body.points;

    await assignment.save();

    res.status(200).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete an assignment by ID
exports.deleteAssignment = async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await assignment.destroy();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
