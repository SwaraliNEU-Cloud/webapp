// Controller/submissionController.js

const Submission = require('../Models/submission.js');
const Assignment = require('../Models/Assignment');
const awsSnsPublisher = require('../Services/awsSnsPublisher');
const logger = require('../Models/logHelper');
require('dotenv').config();

exports.createSubmission = async (req, res, next) => {
  const { id } = req.params; // Assignment ID from URL
  const userId = req.user.email;
  const { submission_url } = req.body; // URL and user email from the request body

  if (!isJson(req)) {
    logger.info('Invalid content type');
    return res.status(400).json({ message: 'Invalid content type. Request body must be JSON.' });
  }

  // Check if submission_url is present and is a valid URL
  if (!submission_url || !isValidURL(submission_url)) {
    logger.info('Invalid submission_url');
    return res.status(400).json({ message: 'Invalid submission_url' });
  }

  if (!submission_url || !isValidZip(submission_url)) {
    logger.info('Submission_url is not a valid zip');
    return res.status(400).json({ message: 'Submission_url is not a valid zip' });
  }

  // Check if there are no additional parameters in the request body
  const validKeys = ['submission_url'];
  const additionalKeys = Object.keys(req.body).filter(key => !validKeys.includes(key));

  if (additionalKeys.length > 0) {
    logger.info('Invalid parameters in request body');
    return res.status(400).json({ message: 'Invalid parameters in request body. Only submission_url is allowed.' });
  }

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
      user_email: userId, // Save the user email in the submission record
    });

    // Log information for debugging
    logger.info(`Type of id: ${typeof id}`); // Should be 'string'
    logger.info(`Type of submission_url: ${typeof submission_url}`); // Should be 'string'
    logger.info(`Type of user_email: ${typeof user_email}`); // Should be 'string'
    logger.info(`Constructed message: ${`New submission for assignment-${id}#${submission_url} by ${userId}`}`);

    const TopicArn = process.env.SNS_ARN;

    const snsBody = {
      a_id: id,
      a_submission_url: submission_url,
      user_email: userId, // Include user email in the SNS message
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

function isValidURL(url) {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return urlRegex.test(url);
  }
   
  // Function to check if the content type is JSON
  function isJson(req) {
    return req.headers['content-type'] === 'application/json';
  }

function isValidZip(url) {
    return url.toLowerCase().endsWith('.zip');
}  
