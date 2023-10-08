// routes/assignments.js

const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/basicauth'); // Import Basic Authentication middleware
const Assignment = require('../models/Assignment'); // Import your Assignment model



// Create Assignment
router.post('/assignment',requireAuth, async (req, res) => {
  try {
    const { title, description, points } = req.body;

    // Create the assignment
    const assignment = await Assignment.create({
      title,
      description,
      points,
      UserId: req.user.id, // Assuming you have an authenticated user with an 'id' field
    });

    return res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update Assignment
router.put('/assignment/:id',requireAuth, async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const { title, description, points } = req.body;

    // Find the assignment by ID
    const assignment = await Assignment.findByPk(assignmentId);

    // Check if the assignment exists
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if the authenticated user is the assignment creator
    if (assignment.UserId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this assignment' });
    }

    // Update assignment fields
    assignment.title = title;
    assignment.description = description;
    assignment.points = points;

    // Save the updated assignment
    await assignment.save();

    return res.status(200).json(assignment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete Assignment
router.delete('/assignment/:id',requireAuth, async (req, res) => {
  try {
    const assignmentId = req.params.id;

    // Find the assignment by ID
    const assignment = await Assignment.findByPk(assignmentId);

    // Check if the assignment exists
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if the authenticated user is the assignment creator
    if (assignment.UserId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this assignment' });
    }

    // Delete the assignment
    await assignment.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
