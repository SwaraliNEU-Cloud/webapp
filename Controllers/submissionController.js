// Controller/submissionController.js

const Submission  = require('../Models/submission.js'); // assuming Submission model is also exported from the models directory
const Assignment = require('../Models/Assignment'); 
const awsSnsPublisher = require('../Services/awsSnsPublisher'); // This should be the module that handles SNS publishing
require('dotenv').config();

exports.createSubmission = async (req, res, next) => {
  const { id } = req.params; // Assignment ID from URL
  const { submission_url } = req.body; // URL from the request body

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
    });

    // Inside your controller function, change the publish call to this:

    console.log(`Type of id: ${typeof id}`); // Should be 'string'
    console.log(`Type of submission_url: ${typeof submission_url}`); // Should be 'string'
    console.log(`Constructed message: ${`New submission for assignment ${id}: ${submission_url}`}`); 

    // const TopicArn = 'arn:aws:sns:us-east-1:143282580221:mySnsTopic-0fb69e4'
    const TopicArn = process.env.SNS_ARN

    // Correctly pass individual parameters, not an object
    await awsSnsPublisher.publish(
    `New submission for assignment ${id}: ${submission_url}`,
    'New Assignment Submission',
    TopicArn // Make sure TopicArn is defined
    );


    return res.status(201).json(newSubmission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
