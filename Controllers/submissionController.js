// Controller/submissionController.js

const Submission = require('../Models/submission.js');
const Assignment = require('../Models/Assignment');
const awsSnsPublisher = require('../Services/awsSnsPublisher');
const logger = require('../Models/logHelper');
require('dotenv').config();

exports.createSubmission = async (req, res, next) => {
  const { id } = req.params; // Assignment ID from URL
  const { submission_url, user_email } = req.body; // URL and user email from the request body

  try {
    console.log(id);
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (new Date(assignment.deadline) < new Date()) {
      return res.status(400).json({ error: 'Assignment deadline has passed' });
    }

    const submissionsCount = await Submission.count({ where: { assignment_id: id } });
    if (submissionsCount >= assignment.num_of_attempts) {
      return res.status(400).json({ error: 'Number of attempts exceeded' });
    }

    const newSubmission = await Submission.create({
      assignment_id: id,
      submission_url: submission_url,
      user_email: user_email, // Save the user email in the submission record
    });

    // Log information for debugging
    logger.info(`Type of id: ${typeof id}`); // Should be 'string'
    logger.info(`Type of submission_url: ${typeof submission_url}`); // Should be 'string'
    logger.info(`Type of user_email: ${typeof user_email}`); // Should be 'string'
    logger.info(`Constructed message: ${`New submission for assignment-${id}#${submission_url} by ${user_email}`}`);

    const TopicArn = process.env.SNS_ARN;

    const snsBody = {
      a_id: id,
      a_submission_url: submission_url,
      user_email: user_email, // Include user email in the SNS message
    };

    // Correctly pass individual parameters, not an object
    await awsSnsPublisher.publish(
      JSON.stringify(snsBody, null, 2),
      'New Assignment Submission',
      TopicArn // Make sure TopicArn is defined
    );

    return res.status(201).json(newSubmission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
