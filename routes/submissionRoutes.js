// routes/submissionRoutes.js
const express = require('express');
const submissionController = require('../Controllers/submissionController');

const router = express.Router();

router.post('/v1/assignment/:assignmentId/submission', submissionController.submitAssignment);

module.exports = router;
